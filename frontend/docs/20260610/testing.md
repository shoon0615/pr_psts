# Testing & Tooling

프로젝트 품질 관리 및 개발 도구 설정입니다.

## Unit & Integration Testing
- **Vitest**: 고성능 유닛 테스트 러너로 사용됩니다. (`vitest.config.ts` 참조)
- **Testing Library**: 사용자의 관점에서 컴포넌트 동작을 검증합니다.
- **MSW (Mock Service Worker)**: 네트워크 레벨에서 API를 모킹하여 테스트의 고립성을 보장합니다.

## E2E Testing
- **Playwright**: 브라우저 기반의 엔드 투 엔드 테스트를 수행합니다.
- **Cypress**: E2E 테스트 및 실시간 개발 피드백을 위해 사용합니다.

## Development Tools
- **JSON Server**: `mock/snack.json` 데이터를 기반으로 가상의 REST API를 제공합니다. (`npm run dev:json`)
- **Concurrently**: Next.js 개발 서버와 JSON Server를 동시에 실행합니다. (`npm run dev`)
- **ESLint/Prettier**: 일관된 코드 스타일과 잠재적 버그 방지를 위해 사용합니다.
