# Deployment

> Next.js App Router 기반 프로젝트의 배포, 환경변수, Docker, CI/CD 구성 기준을 정리한 문서입니다.  
> 이 문서는 배포 플랫폼별 세부 옵션보다 **프로젝트가 배포 가능한 상태가 되기 위해 필요한 구조와 체크리스트**에 초점을 둡니다.

---

# 목차

- [1. 한눈에 보기](#1-한눈에-보기)
- [2. 언제 필요한가?](#2-언제-필요한가)
- [3. 왜 배포 구조가 필요한가?](#3-왜-배포-구조가-필요한가)
- [4. 실무 기준](#4-실무-기준)
- [5. 환경변수](#5-환경변수)
- [6. Build](#6-build)
- [7. Vercel 배포](#7-vercel-배포)
- [8. Docker 배포](#8-docker-배포)
- [9. GitHub Actions](#9-github-actions)
- [10. Database 배포](#10-database-배포)
- [11. Auth 배포 체크](#11-auth-배포-체크)
- [12. 테스트와 배포 연결](#12-테스트와-배포-연결)
- [13. 배포 전 체크리스트](#13-배포-전-체크리스트)
- [14. 코드 스니핏](#14-코드-스니핏)
- [15. Caution](#15-caution)
- [16. Best Practice](#16-best-practice)
- [17. 요약](#17-요약)

---

# 1. 한눈에 보기

배포는 단순히 `npm run build`를 성공시키는 것이 아니라, 다음 흐름이 모두 정상 동작하는 상태를 의미합니다.

```txt
Local
  ↓
Build
  ↓
Test
  ↓
Environment Variables
  ↓
Database
  ↓
Deploy
  ↓
Runtime Check
```

---

## 배포 구성 요소

| 영역 | 역할 |
|---|---|
| Build | TypeScript/Next.js 빌드 검증 |
| Env | 환경변수 분리 |
| Database | 운영 DB 연결 |
| Auth | secret, URL, callback 설정 |
| Test | 배포 전 자동 검증 |
| CI/CD | GitHub Actions 자동화 |
| Platform | Vercel 또는 Docker 기반 배포 |

---

## 핵심 기준

```txt
개발 환경
→ .env.local

배포 환경
→ 플랫폼 환경변수

빌드 검증
→ npm run build

테스트 검증
→ npm run test

배포 자동화
→ GitHub Actions

런타임 설정
→ 서버 환경변수
```

---

# 2. 언제 필요한가?

배포 구조는 다음 시점부터 필요합니다.

- 프로젝트를 외부에 공개한다.
- 포트폴리오로 제출한다.
- DB를 실제 서비스용으로 연결한다.
- Auth.js를 운영 환경에서 사용한다.
- CI/CD를 통해 자동 배포하고 싶다.
- 팀 프로젝트로 관리한다.
- 테스트 자동화를 적용한다.

---

## 초기 학습 단계

초기에는 다음만으로 충분합니다.

```bash
npm run lint
npm run build
```

---

## 실무/포트폴리오 단계

다음 항목이 필요합니다.

```txt
환경변수 분리
DB 연결
Auth Secret
Build 검증
Test 자동화
Deploy 자동화
```

---

# 3. 왜 배포 구조가 필요한가?

로컬에서 정상 동작해도 배포 후 깨지는 경우가 많습니다.

대표 원인:

- 환경변수 누락
- DB URL 불일치
- Auth Secret 누락
- callback URL 불일치
- 빌드 시 타입 에러
- 서버 전용 코드가 Client에 import됨
- Prisma generate 누락
- E2E 테스트 미실행
- Node 버전 불일치

---

## 배포 전 확인해야 하는 것

```txt
Local build 성공
  ↓
TypeScript 에러 없음
  ↓
환경변수 설정
  ↓
DB migration 적용
  ↓
Auth callback 확인
  ↓
배포
```

---

# 4. 실무 기준

## 권장 배포 전략

| 상황 | 권장 |
|---|---|
| Next.js 단독 앱 | Vercel |
| Docker 학습/서버 배포 | Docker |
| DB 포함 로컬 운영 | Docker Compose |
| 포트폴리오 | Vercel + 외부 DB |
| 팀 프로젝트 | GitHub Actions + 배포 플랫폼 |
| 백엔드/프론트 분리 | Docker 또는 별도 플랫폼 |

---

## 현재 프로젝트 기준

현재 Next.js App Router + Auth.js + Prisma 구조라면 다음 전략이 자연스럽습니다.

```txt
Frontend
→ Vercel

Database
→ PostgreSQL managed DB

CI
→ GitHub Actions

Local Dev
→ Devcontainer / Docker Compose
```

또는 Docker 배포 연습이 목적이라면:

```txt
Next.js
→ Docker Image

DB
→ Docker Compose PostgreSQL

CI/CD
→ GitHub Actions
```

---

# 5. 환경변수

환경변수는 배포에서 가장 자주 문제를 일으키는 영역입니다.

---

## 환경변수 파일

```txt
.env.local
.env.development
.env.production
.env.example
```

---

## 기본 기준

| 파일 | 역할 |
|---|---|
| .env.local | 로컬 개인 환경 |
| .env.example | 필요한 변수 목록 공유 |
| .env.production | 운영 환경 기준 예시 |
| 플랫폼 환경변수 | 실제 운영 값 |

---

## public / private 구분

Next.js에서 브라우저에 노출되어도 되는 값만 `NEXT_PUBLIC_` prefix를 사용합니다.

```txt
NEXT_PUBLIC_API_BASE_URL
→ Client 노출 가능

DATABASE_URL
AUTH_SECRET
AUTH_URL
→ Server 전용
```

---

## 예시

```env
# .env.example

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/app

# Auth
AUTH_SECRET=your-secret
AUTH_URL=http://localhost:3000
```

---

## 주의

다음 값은 Client에 노출하면 안 됩니다.

```txt
DATABASE_URL
AUTH_SECRET
PRIVATE_API_KEY
PASSWORD_SALT
OAUTH_CLIENT_SECRET
```

---

# 6. Build

## package.json scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:e2e": "playwright test"
  }
}
```

---

## build 전 확인

```bash
npm run lint
npm run test
npm run build
```

---

## Prisma 사용 시

빌드 전에 Prisma Client가 생성되어 있어야 합니다.

```bash
npx prisma generate
```

보통 build script에 포함할 수 있습니다.

```json
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

---

# 7. Vercel 배포

Vercel은 Next.js 배포에 가장 자연스러운 플랫폼입니다.

---

## 배포 흐름

```txt
GitHub Push
  ↓
Vercel Import
  ↓
Environment Variables 설정
  ↓
Build
  ↓
Deploy
```

---

## Vercel에서 확인할 것

- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: 기본값
- Install Command: `npm install` 또는 package manager에 맞춤
- Environment Variables
- Node Version

---

## Auth.js 사용 시 확인

운영 URL 기준으로 Auth URL과 callback을 맞춰야 합니다.

```env
AUTH_URL=https://your-domain.com
AUTH_SECRET=...
```

OAuth Provider를 사용하는 경우 Provider console에도 운영 callback URL을 등록해야 합니다.

---

## Prisma 사용 시 확인

Vercel에서 Prisma를 사용할 경우:

- DATABASE_URL 설정
- prisma generate 실행
- migration 적용 방식 결정
- 서버리스 환경과 DB connection 관리 고려

---

# 8. Docker 배포

Docker는 로컬/서버 환경 차이를 줄이기 위해 사용합니다.

---

## 언제 사용하는가?

- Devcontainer 기반 개발
- 서버 직접 배포
- Docker Compose로 DB와 함께 실행
- 백엔드/프론트 통합 환경
- CI에서 동일 환경 검증

---

## Dockerfile 예시

```dockerfile
# Dockerfile
FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "run", "start"]
```

---

## docker-compose 예시

```yaml
# docker-compose.yml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    depends_on:
      - db

  db:
    image: postgres:16
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: password
      POSTGRES_DB: app
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

# 9. GitHub Actions

CI/CD는 push 또는 pull request 시 자동으로 테스트와 빌드를 실행합니다.

---

## 기본 흐름

```txt
push / pull_request
  ↓
checkout
  ↓
setup node
  ↓
install
  ↓
lint
  ↓
test
  ↓
build
```

---

## 예시

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main, dev]
  push:
    branches: [main, dev]

jobs:
  build:
    runs-on: ubuntu-latest

    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
      AUTH_SECRET: ${{ secrets.AUTH_SECRET }}
      AUTH_URL: http://localhost:3000

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install
        run: npm ci

      - name: Prisma Generate
        run: npx prisma generate

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm run test

      - name: Build
        run: npm run build
```

---

## Secret 관리

GitHub Actions에서는 민감한 값은 repository secrets에 등록합니다.

예:

```txt
DATABASE_URL
AUTH_SECRET
OAUTH_CLIENT_ID
OAUTH_CLIENT_SECRET
```

---

# 10. Database 배포

Prisma + DB를 배포할 때는 migration 전략이 중요합니다.

---

## 개발 환경

```bash
npx prisma migrate dev
```

---

## 운영 환경

운영에서는 일반적으로 다음 명령을 사용합니다.

```bash
npx prisma migrate deploy
```

---

## 흐름

```txt
schema.prisma 수정
  ↓
migration 생성
  ↓
Git commit
  ↓
배포 환경에서 migrate deploy
  ↓
app start
```

---

## 주의할 변경

- 컬럼 삭제
- enum 변경
- required 필드 추가
- unique 제약 추가
- 대량 데이터가 있는 테이블 변경

---

# 11. Auth 배포 체크

Auth.js는 배포 환경에서 설정 누락이 자주 발생합니다.

---

## 필수 확인

```txt
AUTH_SECRET
AUTH_URL
OAuth callback URL
Cookie secure 설정
도메인 일치
```

---

## Credentials 로그인

Credentials 방식에서는 다음을 확인합니다.

- DB 연결
- passwordHash 존재
- bcrypt compare 정상
- session callback 정상
- redirect URL 정상

---

## OAuth 로그인

OAuth 방식에서는 Provider 콘솔에서 callback URL을 설정해야 합니다.

예:

```txt
https://your-domain.com/api/auth/callback/google
```

---

# 12. 테스트와 배포 연결

배포 전에 다음 테스트를 자동화하는 것이 좋습니다.

```txt
lint
unit test
build
```

E2E는 시간이 오래 걸릴 수 있으므로 다음처럼 분리할 수 있습니다.

```txt
PR
→ lint + unit + build

main merge
→ e2e + deploy
```

---

# 13. 배포 전 체크리스트

## Build

- [ ] `npm run build` 성공
- [ ] TypeScript error 없음
- [ ] ESLint error 없음
- [ ] Prisma generate 성공
- [ ] Client에서 server-only 코드 import 없음

---

## Environment

- [ ] `.env.example` 최신화
- [ ] `DATABASE_URL` 설정
- [ ] `AUTH_SECRET` 설정
- [ ] `AUTH_URL` 설정
- [ ] `NEXT_PUBLIC_*` 노출 범위 확인
- [ ] OAuth Client Secret 비공개 확인

---

## Database

- [ ] Migration 적용
- [ ] Seed 필요 여부 확인
- [ ] 운영 DB 연결 확인
- [ ] Prisma Studio 또는 DB Client로 확인
- [ ] connection limit 확인

---

## Auth

- [ ] 로그인 성공
- [ ] 로그아웃 성공
- [ ] 보호 페이지 redirect 확인
- [ ] OAuth callback 확인
- [ ] session callback 확인

---

## App

- [ ] 목록 조회
- [ ] 상세 조회
- [ ] 생성
- [ ] 수정
- [ ] 삭제
- [ ] 검색
- [ ] 페이징
- [ ] Empty/Error/Loading 상태

---

# 14. 코드 스니핏

## .env.example

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

DATABASE_URL=postgresql://app:password@localhost:5432/app

AUTH_SECRET=replace-me
AUTH_URL=http://localhost:3000
```

---

## package.json scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:deploy": "prisma migrate deploy",
    "prisma:studio": "prisma studio"
  }
}
```

---

## Dockerfile

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["npm", "run", "start"]
```

---

## GitHub Actions CI

```yaml
name: CI

on:
  pull_request:
    branches: [main, dev]
  push:
    branches: [main, dev]

jobs:
  build:
    runs-on: ubuntu-latest

    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
      AUTH_SECRET: ${{ secrets.AUTH_SECRET }}
      AUTH_URL: http://localhost:3000

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci
      - run: npx prisma generate
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

---

## Docker Compose

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    depends_on:
      - db

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: password
      POSTGRES_DB: app
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

# 15. Caution

## 1. .env.local을 commit하지 않기

민감 정보가 포함될 수 있으므로 `.gitignore`에 포함합니다.

```gitignore
.env*.local
.env.production
```

`.env.example`만 commit합니다.

---

## 2. NEXT_PUBLIC_ 남용 금지

`NEXT_PUBLIC_`은 브라우저에 노출됩니다.

다음 값에는 사용하지 않습니다.

```txt
DATABASE_URL
AUTH_SECRET
OAUTH_CLIENT_SECRET
PRIVATE_API_KEY
```

---

## 3. build와 runtime 환경변수 구분

일부 환경변수는 build 시점에 필요하고, 일부는 runtime에 필요합니다.

Prisma, Auth, API URL 관련 변수를 확인해야 합니다.

---

## 4. Prisma migration을 build와 혼동하지 않기

```txt
prisma generate
→ Client 생성

prisma migrate deploy
→ DB schema 적용
```

둘은 다릅니다.

---

## 5. Auth callback URL 확인

로컬 URL과 운영 URL이 다르면 OAuth 로그인에서 실패할 수 있습니다.

---

## 6. Docker에서 Node 버전 맞추기

로컬, Devcontainer, CI, Docker의 Node 버전이 다르면 빌드 결과가 달라질 수 있습니다.

---

# 16. Best Practice

## 권장

- `.env.example` 유지
- 민감 정보는 플랫폼 secret 사용
- build 전에 lint/test 실행
- Prisma generate를 build 과정에 포함
- 운영 DB에는 migrate deploy 사용
- Auth URL/Secret을 배포 환경에 명시
- CI에서 npm ci 사용
- Node 버전을 통일
- Dockerfile은 multi-stage 사용
- Vercel 배포 시 환경변수 직접 확인
- 배포 후 로그인/CRUD smoke test 수행

---

## 비권장

- `.env.local` commit
- DATABASE_URL을 NEXT_PUBLIC으로 노출
- 로컬 DB URL을 운영에 그대로 사용
- migration 없이 schema만 변경
- build 실패를 무시하고 배포
- Auth Secret 임시값 사용
- OAuth callback을 로컬 주소로 방치
- Docker image에 불필요한 파일 포함
- 테스트 없이 main에 merge
- 운영 DB에서 destructive migration을 무계획 적용

---

# 17. 요약

## 배포 흐름

```txt
Code
  ↓
Lint
  ↓
Test
  ↓
Build
  ↓
Env 확인
  ↓
DB migration
  ↓
Deploy
  ↓
Smoke Test
```

---

## 핵심 기준

```txt
환경변수는 분리한다.

민감 정보는 노출하지 않는다.

빌드 전에 테스트한다.

Prisma generate와 migrate를 구분한다.

Auth URL과 Secret을 반드시 확인한다.

배포 후 핵심 흐름을 확인한다.
```

---

## 현재 프로젝트 추천

```txt
개발
→ Devcontainer / Docker Compose

배포
→ Vercel 또는 Docker

DB
→ PostgreSQL + Prisma

CI
→ GitHub Actions

검증
→ lint + test + build
```
