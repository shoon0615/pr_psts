# UI & Styling

사용자 인터페이스 및 스타일링 관련 기술 스택입니다.

## Styling
- **Tailwind CSS (v4)**: `tailwindcss` 및 `@tailwindcss/postcss`를 사용하여 스타일을 정의합니다.
- **Utility Classes**: `shared/lib/utils.ts` 의 `cn` 유틸리티를 사용하여 클래스를 조합합니다 (`clsx`, `tailwind-merge` 활용).

## Components
- **Shadcn UI**: `shared/components/shadcn/ui/` 에 위치한 컴포넌트들을 기반으로 UI를 구성합니다.
- **Radix UI**: 접근성이 보장된 하위 레벨 UI 프리미티브를 사용합니다.
- **Lucide React**: 아이콘 시스템으로 사용합니다.

## Feedback & Interaction
- **Sonner**: 메시지 알림 및 토스트 처리를 담당합니다.
- **Vaul**: 모바일 환경 및 대화창을 위한 Drawer 시스템입니다.
- **tw-animate-css**: 애니메이션 효과를 위해 사용됩니다.
