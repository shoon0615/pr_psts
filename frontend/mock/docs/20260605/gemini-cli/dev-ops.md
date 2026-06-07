# 테스트 및 배포 가이드 (DevOps)

이 프로젝트는 안정적인 배포와 높은 코드 품질을 위해 자동화된 테스트 및 CI/CD 파이프라인을 구축하고 있습니다.

## 🧪 1. 테스트 전략 (Testing Strategy)

| 분류 | 도구 | 범위 | 실행 명렁어 |
| :--- | :--- | :--- | :--- |
| **Unit / Integration** | Vitest | 훅, 서비스 로직, 유틸리티 | `npm run test` |
| **Component** | Testing Library | 개별 컴포넌트 렌더링 및 인터랙션 | `npm run test:ui` |
| **E2E** | Playwright | 실제 사용자 시나리오 (로그인, 검색, 등록) | `npx playwright test` |
| **API Mocking** | MSW | 테스트 및 개발 중 API 응답 모킹 | - |

---

## 🚀 2. 배포 파이프라인 (CI/CD)

### GitHub Actions Workflow
프로젝트의 모든 변경 사항은 GitHub Actions를 통해 검증됩니다.

*   **Lint & Build Check**: 모든 PR 시 ESLint 검사 및 빌드 성공 여부 확인
*   **Auto Test**: PR 및 Main 브랜치 푸시 시 Vitest 및 Playwright 테스트 실행
*   **Vercel Integration**: Main 브랜치 머지 시 Vercel을 통해 자동 배포 (Preview 기능 포함)

---

## 📦 3. 배포 체크리스트 (Deployment Checklist)

배포 전 다음 항목을 반드시 확인하세요.

1.  **환경 변수**: Vercel Dashboard 또는 `.env.production`에 필요한 모든 API URL 및 Auth Secret 설정 여부
2.  **데이터베이스 마이그레이션**: `npx prisma migrate deploy` 실행을 통한 스키마 동기화
3.  **빌드 에러**: `npm run build`를 통한 타입 에러 및 RSC 제약 조건 위반 여부 확인
4.  **권한 설정**: 상용 환경에서의 OAuth Redirect URI 및 CORS 설정 확인

---

## 💻 4. 개발 환경 유틸리티

*   **Docker**: 로컬 DB(PostgreSQL) 및 Redis 환경을 동일하게 유지하기 위해 `docker-compose.yml` 제공
*   **Prettier & ESLint**: 프로젝트 코드 스타일 통일을 위해 커밋 전 `lint-staged`를 통한 자동 교정 수행
