# Microsoft To Do 데스크톱 스타일 (todo-app) 구현 리포트

`todo-web.png`의 디자인을 바탕으로, 배경 이미지가 포함된 데스크톱 앱 스타일의 To Do 인터페이스를 구현했습니다.

## 1. 폴더 구조 (Folder Tree)

```text
frontend/
├── app/
│   └── (default-layout)/
│      └── (web)/
│          └── layout.tsx           # To Do 레이아웃 페이지
│          └── page.tsx             # To Do 메인 페이지
│   └── api/
│      └── route.ts                 # API Route Handler
│   └── layout.tsx                  # 공통 레이아웃 페이지
│   └── provider.tsx                # 공통 Provider 페이지
├── components/
│   └── layout/
│       └── header.tsx              # To Do 헤더 페이지
│   └── ui/                         # shadcn/ui 공통 컴포넌트
├── features/
│   └── todo/
│       └── actions/
│           ├── todo.actions.ts     #
│       └── components/           # To Do 기능 관련 컴포넌트
│           ├── web-sidebar.tsx     # 왼쪽 사이드바 (프로필, 검색, 메뉴)
│           ├── main-content.tsx    # 중앙 영역 (배경, 작업 리스트, 플로팅 입력창)
│           ├── task-detail.tsx     # 오른쪽 상세 사이드바 (단계, 메모, 파일)
│       └── context/
│           └── todo-context.tsx    #
│       └── hooks/
│           └── todo.hooks.ts       #
│       └── prefetch/
│           └── todo.prefetch.ts    #
│       └── queries/
│           └── todo.query.ts       #
│       └── repositories/
│           └── todo.repository.ts  #
│       └── services/
│           └── todo.service.ts     #
└── mock/
│   └── 20260528
│      └── requirement.md           # 본 구현 리포트
├── shared/
│   └── components/
│   └── lib/
│       └── axios/                  # Axios 설정
│       └── react-query.ts          # React-Query 설정
│       └── utils.ts                # 공통 유틸 설정
│   └── styles/
│       └── globals.css             # 공통 CSS 설정
│   └── types/
│       └── env.d.ts                # 공통 환경변수 설정
```

## 2. 주요 구현 내용 (Key Implementation)

### 2.1 시각적 요소

- **사이드바 디자인**: 프로필 영역과 검색창, 카테고리 리스트를 `todo-web.png`와 최대한 유사하게 배치했습니다.

### 2.2 컴포넌트 상세 (Table)

| 컴포넌트명    | 역할           | 주요 특징                                                               |
| :------------ | :------------- | :---------------------------------------------------------------------- |
| `WebSidebar`  | 네비게이션     | 프로필 정보, 검색창, 스마트 리스트(오늘 할 일 등), 사용자 목록 관리     |
| `MainContent` | 메인 작업 영역 | 배경 이미지, 리스트 헤더, 작업 카드 목록, 플로팅 작업 추가 바           |
| `TaskDetail`  | 작업 상세 정보 | 단계 추가(Next Steps), 알림/기한 설정, 파일 첨부(이미지 미리보기), 메모 |

## 3. 코드 스니핏 (Code Snippet)

### MainContent의 배경 및 플로팅 바 구조

```tsx
// features/todo/components/main-content.tsx
<main className="relative flex flex-1 flex-col overflow-hidden">
  {/* 배경 이미지 레이어 */}
  <div />
</main>
```

### WebSidebar

```tsx
// features/todo/components/web-sidebar.tsx
```

### TaskDetail

```tsx
// features/todo/components/task-detail.tsx
```

## 4. 오늘의 목표

- [ ] 컴포넌트 분리 → `MainContent` `TaskDetail` 의 디테일 처리
- [ ] `DropdownMenu` 의 데이터 처리 → 현재 컴포넌트 tsx 형식이 아닌 ts 를 통한 options 로 처리(common | 하드코딩으로 데이터 호출)
      ex: 왼쪽 사이드바(오늘 할 일/중요/계획된 일정 등...) → 옵션(완료된 작업 표시/목록 인쇄)
- [ ] 작업 추가/목록 최적화

TODO: 그 외 추가 작성

## 5. 보완 필요

- [ ] **반응형 최적화**: 화면 크기에 따라 사이드바가 접히거나 작업 리스트의 레이아웃이 유연하게 변하도록 개선.
- [ ] **작업 추가 최적화**: 작업 추가 클릭 시, 활성화되는 기한/미리 알림/반복 mousedown 시에도 작업 추가 시처럼 부드럽게 활성화되도록 개선.
- [ ] **작업 목록 최적화**: 작업 목록의 체크박스/Star 클릭 시 toggle 되도록 설정.
- [ ] **파일 업로드**: `TaskDetail`의 파일 추가 버튼 클릭 시 실제 파일 업로드 로직 구현.
- [ ] **우측 사이드바**: 컴포넌트로 분리 및 RHF 나 다른 방법을 통한 최적화

## 6. 향후 계획

- [ ] **상태 관리**: `TaskDetail` 컴포넌트의 `TodoProvider` → `Zustand` 로 변경
- [ ] **메인 기능**
  - [ ] `조회` 검색/필터/페이징/정렬
  - [ ] `변경` 생성/수정/삭제
- [ ] **백엔드(DB)**
  - [ ] `BO` axios 를 통한 DB 연결
  - [ ] react-query 를 통한 캐싱 최적화
