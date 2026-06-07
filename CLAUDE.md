# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 협업 규칙

- **모든 답변은 한국어로 작성한다.**
- **코드 수정 완료 후에는 반드시 관련 테스트를 실행하여 문제가 없는지 확인한다.**
  - 백엔드 수정 시: `./gradlew :모듈명:test` (수정된 모듈 대상)
  - 프론트엔드 수정 시: `npm run lint` 및 `npm run build`
  - 테스트 실패 시 원인을 분석하고 수정한 뒤 재실행한다.

## Project Overview

Full-stack monorepo: Java/Spring Boot backend (multi-module Gradle) + Next.js frontend.

- **Backend port:** 8091
- **Frontend port:** 3000 (Next.js dev), 3173 (JSON mock API)
- **Database:** H2 (local dev), MySQL (production)
- **Search:** Elasticsearch (via devcontainer)

---

## Commands

### Backend (run from `/backend`)

```bash
./gradlew build                          # Build all modules
./gradlew :api:bootRun                   # Start API server (port 8091)
./gradlew test                           # Run all tests
./gradlew :infra:test                    # Test a specific module
./gradlew :infra:test --tests "*Elastic*"  # Filter tests by pattern
./gradlew :infra:test --rerun-tasks      # Force re-run (bypass cache)
./gradlew clean :api:bootJar             # Build executable JAR
```

Test reports: `backend/<module>/build/reports/tests/test/index.html`

### Frontend (run from `/frontend`)

```bash
npm run dev        # Next.js + JSON mock server concurrently
npm run dev:next   # Next.js only
npm run dev:json   # JSON mock server only (port 3173)
npm run build      # Production build
npm run lint       # ESLint
```

---

## Backend Architecture

Five Gradle modules with strict layering — each module may only depend on modules below it:

```
api      ← REST controllers, Spring Security (JWT), Swagger, bootJar target
biz      ← UseCases (interfaces) + Services (implementations)
domain   ← JPA entities, Spring Data repositories, QueryDSL Q-classes
infra    ← Elasticsearch config, JPA query extensions
common   ← DTOs, exceptions (BusinessException), utilities, i18n messages
```

**Configuration loading:** The `api` module explicitly imports `infra-elasticsearch.yml` via `spring.config.import`. Properties from `infra` module are not auto-loaded — they must be imported in `api/src/main/resources/application.yml`. This resolved a multi-module config loading bug (see `infra/docs/2026-04-23/`).

**QueryDSL:** Q-classes are generated at compile time from JPA entities. Run `./gradlew compileJava` if Q-classes are missing.

**Profiles:** `local` (default, H2), `dev`, `prod` (MySQL). Switch via `spring.profiles.active`.

**Key entities:** `MemberEntity` (auth/roles), `BoardEntity` (posts with tags, likes, reviews), `CrudEntity` (basic CRUD example). Board data is dual-stored in both JPA and Elasticsearch for full-text search.

---

## Frontend Architecture

Next.js App Router with two layout groups:

- `(empty-layout)/` — root/landing pages with no sidebar
- `(default-layout)/` — pages with sidebar (SidebarProvider wraps the layout)

UI components live in `components/ui/` and are shadcn-based (Radix UI + Base UI). Add new shadcn components with the shadcn CLI rather than manually.

`lib/utils.ts` exports the `cn()` helper (clsx + tailwind-merge) — use it for all conditional class names.

---

## Dev Container

The devcontainer runs two Docker Compose files: `docker-compose.dev.yml` (workspace) and `docker-compose.elasticsearch.yml` (Elasticsearch). Elasticsearch must be running for `infra` module tests to pass.

VSCode is configured to launch the Java debugger automatically on build failure (`.vscode/settings.json`).
