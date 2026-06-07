## Getting Started

Notice -> Snack -> Board | Product

### Notice

최초 테스트

### Snack

FM 진행

> **`조회`**  
> Client Component -> useQuery -> Route Handler -> Service -> Repository  
> UI -> react-query -> api(HTTP) -> validation(zod) -> db(json-server/prisma)

> **`변경`**  
> Client Component -> useMutation -> Server Actions -> Service -> Repository  
> UI -> react-query -> Server Actions -> validation(zod) -> db(json-server/prisma)

### Board

약식 진행

> **`조회`** & **`변경`**  
> use client -> react-query -> server actions -> repository

Route Handler 는 외부에 API 제공 시에만 이용
