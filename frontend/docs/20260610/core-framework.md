# Core Framework & Language

이 프로젝트의 핵심 프레임워크 및 언어 설정입니다.

## Next.js (15.1.6)
- **App Router**: 최신 Next.js의 파일 시스템 기반 라우팅을 사용합니다.
- **Server Components**: 기본적으로 서버 컴포넌트를 활용하여 성능을 최적화합니다.
- **Server Actions**: 서버측 로직 처리를 위해 Server Actions를 활용합니다. (`shared/actions/` 폴더 참조)

## React (19.2.3)
- **React 19**: 최신 React 기능을 활용합니다. (React Compiler 등 지원 가능성)
- **Hooks**: 고유의 비즈니스 로직을 위해 `features/*/hooks/` 에 커스텀 훅을 관리합니다.

## TypeScript (^5)
- 엄격한 타입 체크를 통해 코드의 안정성을 확보합니다.
- `tsconfig.json` 및 `shared/types/` 에서 전역 타입을 관리합니다.
