## 로드맵

### [목록]

1. page.tsx  
   클라이언트 접속
2. list.tsx  
   메인 기능 수행 및 use-client 적용
3. `hooks` useSnack.ts  
   `React Query` 캐싱
4. `api(route.ts) || actions || services`  
   API Route || actions 를 통한 service || 직접 service 호출  
   `api(route.ts) || actions` service 연결 통로 기능만을 수행
   TODO: fetch 를 굳이 한번 더 사용해서 api(route.ts) || actions 적용이 필요한지??(+이유도) → service 를 직접 호출한다면??  
   TODO: `dehydrate || ReactQueryStreamedHydration` 적용을 통한 캐싱
5. `services`  
   TODO: 정합성 / try~catch 등 메인에서 수행 및 체크돼야할 작업 내역 추가??
6. `repositories`  
   DB(prisma) 직접 연결 || BO API(axios) 연결을 통한 DB 연결 통로 기능만을 수행

### [상세]

> - TODO: 미작업 → 목록 페이지와 비슷할듯??

### [입력]

1. page.tsx  
   클라이언트 접속, defaultValues / onSubmit / onError 작업 처리
2. form.tsx
   정합성 검증 → 통과/에러에 대한 이벤트 처리  
   `react-hook-form` 기능을 통한 컴포넌트의 hook 처리  
   `@hookform` zodResolver 를 통한 정합성 검증 처리
3. `schema`  
   Form 에 대한 정합성 검증 데이터(type 과 비슷)
4. `actions`  
   ❌ `react-hook-form` submit 방식이라 <form action /> 과 병합 불가  
   ✅ `react-hook-form` 의 onSubmit 을 통해 action 을 직접 호출
5. `services`
6. `repositories`

> - TODO: 과정 중간에 `hooks` React Query 의 useMutation 기능 추가 필요
> - TODO: `page.tsx` 이벤트 처리만 남기고, <Form> 과 하위 컴포넌트 <FormInput> 부분은 list.tsx 처럼 따로 분리?? → 이후 해당 컴포넌트를 <Loader> 로??
> - TODO: 모든 React Query 를 사용하는 메인 기능 페이지에 <Loader> 로 적용 필요한지??

### [수정]

> - TODO: 미작업 → 입력 페이지와 비슷할듯??

---

## 한번에 보기: 폴더 트리(주석 포함)

```text
📦frontend
 ┣ 📂app
 ┃ ┣ 📂(default-layout)
 ┃ ┃ ┣ 📂(main)
 ┃ ┃ ┃ ┗ 📂snack
 ┃ ┃ ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┃ ┃ ┃ ┣ 📂edit
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx         # 수정 페이지
 ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx         # 상세 페이지
 ┃ ┃ ┃ ┃ ┣ 📂_components      # (목록) 컴포넌트
 ┃ ┃ ┃ ┃ ┃ ┣ 📜list.tsx       # (목록) 메인 기능
 ┃ ┃ ┃ ┃ ┃ ┗ 📜loader.tsx     # (목록) React Query 용 로딩
 ┃ ┃ ┃ ┃ ┣ 📂new
 ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx         # 입력 페이지
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx         # 목록 페이지
 ┃ ┃ ┣ 📂(public)
 ┃ ┃ ┃ ┣ 📂login
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┗ 📂signup
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📜layout.tsx         # 레이아웃 페이지
 ┃ ┃ ┣ 📜loading.tsx        # 로딩 페이지
 ┃ ┃ ┗ 📜provider.tsx       # use-client 설정 페이지
 ┃ ┣ 📂(empty-layout)       # 빈 레이아웃 페이지
 ┃ ┗ 📂api                  # Next.js API Route
 ┣ 📂features
 ┃ ┗ 📂snack
 ┃ ┃ ┣ 📂actions            # Server Actions
 ┃ ┃ ┃ ┗ 📜snack.action.ts
 ┃ ┃ ┣ 📂hooks              # React Query
 ┃ ┃ ┃ ┗ 📜useSnack.ts
 ┃ ┃ ┣ 📂repositories       # DB || BO API 연결
 ┃ ┃ ┃ ┗ 📜snack.repository.ts
 ┃ ┃ ┣ 📂schema             # zod
 ┃ ┃ ┃ ┗ 📜snack.schema.ts
 ┃ ┃ ┣ 📂services           # 메인 기능
 ┃ ┃ ┃ ┗ 📜snack.service.ts
 ┃ ┃ ┗ 📂types              # InDTO, OutDTO
 ┃ ┃ ┃ ┗ 📜snack.type.ts
 ┣ 📂mock
 ┃ ┣ 📂docs                 # markdown 파일(가이드 및 로드맵)
 ┃ ┗ 📜snack.json           # json-server 데이터
 ┣ 📂public
 ┣ 📂shared                 # 공통
 ┃ ┣ 📂components             # shadcn UI 샘플
 ┃ ┃ ┣ 📂ui                   # shadcn UI 컴포넌트
 ┃ ┃ ┃ ┣ 📂custom             # shadcn UI 컴포넌트의 개인화
 ┃ ┣ 📂hooks                # shadcn 공통 hook
 ┃ ┃ ┣ 📜use-mobile.ts
 ┃ ┃ ┗ 📜use-toast.ts
 ┃ ┣ 📂lib                  # 공통 설정
 ┃ ┃ ┣ 📜axios.ts             # axios 설정
 ┃ ┃ ┣ 📜prisma.ts            # prisma 설정
 ┃ ┃ ┣ 📜react-query.ts       # React Query 설정
 ┃ ┃ ┗ 📜utils.ts             # 유틸함수 설정
 ┃ ┣ 📂styles               # 공통 css
 ┃ ┃ ┗ 📜globals.css
 ┃ ┗ 📂types
 ┃ ┃ ┣ 📜common.ts          # 공통코드(Common)
 ┃ ┃ ┗ 📜env.d.ts           # 환경변수 자동완성용
```

---

## 추후 희망사항

1. 페이지 추가
   - `상세`
     상품 이미지/설명 클릭 시, 상세 페이지 이동 → 이후 결제 페이지 등의 추가 처리 가능(통합)  
     구매 버튼 클릭 시, 하단에 modal 이 올라오며 페이지 이동 없이 구매 가능(단일)
   - `장바구니` 페이지가 따로 존재하며, `목록 || 상세` 페이지에서 페이지 이동 없이 버튼을 통해 장바구니 추가 기능 구현 예정
   - `결제` `장바구니 || 상세의 구매 버튼` 을 통해 연결 이후 결제 API 를 통해 결제 진행
   - `회원`
     로그인 / 회원가입 / 마이페이지 → Next.js 의 auth || cache 이용??
   - `게시판` 현재의 로드맵 구조로 CRUD 형식의 게시판 추가
2. 디테일 추가
   - `Swagger` 문서화 및 API 가이드 라인 생성
   - `TDD` 테스트 코드 추가
   - `Zustand` 전역 router 적용 → 어떤 작업에 주로 쓰이는지??
