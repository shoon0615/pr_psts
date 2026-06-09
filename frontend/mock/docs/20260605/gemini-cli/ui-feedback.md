# UI/UX 및 공통 컴포넌트 가이드

이 프로젝트는 사용자와의 상호작용 피드백을 위해 `sonner`와 `AlertDialog`를 표준으로 하며, 반복되는 UI 패턴을 공통 컴포넌트로 관리합니다.

## 🔔 1. 사용자 피드백 (Feedback)

| 상황 | 권장 도구 | 특징 |
| :--- | :--- | :--- |
| **단순 결과 알림** | `sonner` (Toast) | Non-blocking, 자동 사라짐 (성공/실패 메시지) |
| **중요한 결정/확인** | `AlertDialog` | Blocking, 사용자 명시적 클릭 필요 (삭제/탈퇴 등) |
| **입력 오류** | `FormMessage` | 입력 필드 바로 아래에 표시하여 즉각 인지 유도 |

### Toast 사용 표준
```tsx
import { toast } from 'sonner';

// 성공
toast.success('등록 완료', { description: '성공적으로 저장되었습니다.' });

// 비동기 처리 연결
await toast.promise(mutateAsync(data), {
  loading: '저장 중...',
  success: '저장 완료',
  error: '저장 실패',
});
```

---

## 📦 2. 공통 컴포넌트 (Common Components)

재사용성을 높이고 도메인 로직과 분리된 순수 UI 컴포넌트들을 `shared/components/common/`에 위치시킵니다.

### 핵심 공통 컴포넌트 리스트
1.  **EmptyState**: 조회 결과가 없을 때 노출하는 디자인된 영역
2.  **ErrorState**: 데이터 로딩 실패 시 "다시 시도" 버튼과 함께 노출
3.  **CommonTable**: `columns` 정의를 통해 선언적으로 렌더링하는 데이터 테이블
4.  **ConfirmDialogButton**: 클릭 시 확인 다이얼로그를 띄우는 버튼 래퍼
5.  **Pagination**: URL Query String 기반의 페이지 네비게이션

---

## 🔄 3. SSR & Hydration 최적화

### Radix UI Select 이슈 대응
Radix Select는 서버 HTML에 options를 포함하지 않으므로 초기 렌더링 시 깜빡임이 발생할 수 있습니다.
*   **해결책**: `dynamic`을 사용하여 hydration 이후에만 렌더링하거나, 스켈레톤 UI를 `loading` 프롭으로 제공합니다.

```tsx
const SnackSearch = dynamic(() => import('./snack-search'), {
  ssr: false,
  loading: () => <div className="h-10 w-full animate-pulse bg-muted rounded-md" />
});
```

---

## 🎨 4. 디자인 시스템 원칙

*   **Color**: Tailwind CSS의 시맨틱 컬러 (`primary`, `secondary`, `destructive`, `muted`) 사용
*   **Spacing**: 4px 단위 (Tailwind 간격 수치) 준수
*   **Accessibility**: 모든 상호작용 요소에 `aria-label` 및 적절한 `role` 부여 (Radix UI 기본 기능 활용)
