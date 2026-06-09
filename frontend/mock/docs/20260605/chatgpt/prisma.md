# Prisma

> Next.js App Router 기반 프로젝트에서 Prisma를 사용해 DB 모델링, 조회/변경, Repository 패턴을 구성하는 기준을 정리한 문서입니다.  
> 이 문서는 Prisma 문법 자체보다 **CRUD 서비스에서 Prisma를 어디에 배치하고 어떻게 연결할지**에 초점을 둡니다.

---

# 목차

- [1. 한눈에 보기](#1-한눈에-보기)
- [2. 언제 사용하는가?](#2-언제-사용하는가)
- [3. 왜 사용하는가?](#3-왜-사용하는가)
- [4. 실무 기준](#4-실무-기준)
- [5. json-server → Prisma](#5-json-server--prisma)
- [6. Prisma 기본 구성](#6-prisma-기본-구성)
- [7. schema.prisma](#7-schemaprisma)
- [8. Model 설계](#8-model-설계)
- [9. Migration](#9-migration)
- [10. Prisma Client](#10-prisma-client)
- [11. Repository Pattern](#11-repository-pattern)
- [12. Relation](#12-relation)
- [13. select / include](#13-select--include)
- [14. Pagination / Sort / Filter](#14-pagination--sort--filter)
- [15. Transaction](#15-transaction)
- [16. CRUD 적용 예제](#16-crud-적용-예제)
- [17. 코드 스니핏](#17-코드-스니핏)
- [18. Caution](#18-caution)
- [19. Best Practice](#19-best-practice)
- [20. 요약](#20-요약)

---

# 1. 한눈에 보기

Prisma는 TypeScript 기반 ORM입니다.

```txt
TypeScript
  ↓
Prisma Client
  ↓
Database
```

---

## 프로젝트 내 위치

```txt
Server Action / Route Handler
  ↓
Service
  ↓
Repository
  ↓
Prisma
  ↓
DB
```

---

## 핵심 기준

| 역할 | 담당 |
|---|---|
| DB 모델 정의 | schema.prisma |
| DB 변경 이력 | migration |
| DB 접근 | repository |
| 비즈니스 규칙 | service |
| API/화면 진입점 | Server Action / Route Handler |
| Client 직접 사용 | 금지 |

---

# 2. 언제 사용하는가?

Prisma는 실제 DB를 연결해야 할 때 사용합니다.

예:

- 회원가입 사용자 저장
- 게시글 저장
- 간식 데이터 저장
- 댓글 저장
- 관계형 데이터 조회
- transaction 처리
- pagination 처리
- include/select 기반 조합 조회

---

## json-server를 쓰는 단계

초기 학습 단계에서는 json-server로 빠르게 API 형태를 만들 수 있습니다.

```txt
mock/db.json
  ↓
json-server
  ↓
axios
```

적합:

- 빠른 CRUD 프로토타입
- React Query 흐름 학습
- Form submit 흐름 학습
- 검색/정렬/페이징 연습

---

## Prisma를 쓰는 단계

프로젝트가 실무 구조로 넘어가면 Prisma로 전환합니다.

```txt
PostgreSQL / MySQL / SQLite
  ↓
Prisma
  ↓
Repository
  ↓
Service
```

적합:

- 실제 회원 시스템
- 관계형 데이터
- 권한 처리
- transaction
- 배포 가능한 DB 구조

---

# 3. 왜 사용하는가?

직접 SQL을 작성해도 DB 접근은 가능합니다.

하지만 TypeScript 프로젝트에서 Prisma를 사용하면 다음 장점이 있습니다.

| 장점 | 설명 |
|---|---|
| 타입 안정성 | schema 기반으로 타입 생성 |
| 자동 완성 | Prisma Client에서 model/field 자동 완성 |
| Migration | DB 변경 이력 관리 |
| Relation | 관계 조회를 TypeScript로 표현 |
| Repository 구성 | DB 접근 계층 분리 쉬움 |
| Transaction | 여러 작업을 하나의 단위로 처리 |

---

## 직접 SQL 방식의 어려움

```txt
SQL 문자열
  ↓
타입 직접 작성
  ↓
응답 타입 직접 관리
  ↓
스키마 변경 시 수동 수정
```

---

## Prisma 방식

```txt
schema.prisma
  ↓
generate
  ↓
Prisma Client
  ↓
타입 기반 DB 접근
```

---

# 4. 실무 기준

## 권장 구조

```txt
shared/lib/prisma
features/{domain}/repositories
features/{domain}/services
```

---

## Prisma 사용 위치

| 위치 | Prisma 사용 |
|---|---|
| Server Component | 가능하지만 직접 사용은 제한적으로 |
| Server Action | 가능하지만 repository 경유 권장 |
| Route Handler | 가능하지만 repository 경유 권장 |
| Service | 직접 사용보다 repository 경유 권장 |
| Repository | Prisma 사용 위치 |
| Client Component | 사용 금지 |

---

## 권장 흐름

```txt
Action / Route
  ↓
Service
  ↓
Repository
  ↓
Prisma
```

---

# 5. json-server → Prisma

초기 단계:

```txt
features/snack/repositories/snack.api.repository.ts
  ↓
axios
  ↓
json-server
```

실무 단계:

```txt
features/snack/repositories/snack.prisma.repository.ts
  ↓
prisma
  ↓
DB
```

---

## 전환 기준

| 단계 | Repository |
|---|---|
| Mock API | axios repository |
| 실제 DB | prisma repository |

---

## 좋은 점

Service/Action/Hook은 유지하고 Repository만 교체할 수 있습니다.

```txt
useSnack
  ↓
action
  ↓
service
  ↓
repository 교체
```

---

# 6. Prisma 기본 구성

## 설치

```bash
npm install prisma @prisma/client
```

초기화:

```bash
npx prisma init
```

---

## 기본 파일

```txt
prisma/
├─ schema.prisma
└─ migrations/
```

---

## 주요 명령어

| 명령어 | 역할 |
|---|---|
| npx prisma init | Prisma 초기화 |
| npx prisma migrate dev | migration 생성/적용 |
| npx prisma generate | Prisma Client 생성 |
| npx prisma studio | DB GUI 확인 |
| npx prisma db seed | seed 실행 |

---

# 7. schema.prisma

Prisma schema는 DB 모델의 기준입니다.

---

## 기본 구조

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## model 예시

```prisma
model Snack {
  id        String   @id @default(cuid())
  title     String
  brand     String
  category  String
  contents  String?
  price     Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

# 8. Model 설계

## 공통 필드

대부분의 도메인은 다음 필드를 가집니다.

```prisma
id        String   @id @default(cuid())
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

---

## User

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  name         String?
  image        String?
  passwordHash String?
  role         Role     @default(USER)
  boards       Board[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

enum Role {
  USER
  ADMIN
}
```

---

## Snack

```prisma
model Snack {
  id        String   @id @default(cuid())
  title     String
  brand     String
  category  String
  contents  String?
  price     Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## Board

```prisma
model Board {
  id        String   @id @default(cuid())
  title     String
  contents  String
  hits      Int      @default(0)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([authorId])
}
```

---

# 9. Migration

Migration은 DB 구조 변경 이력입니다.

---

## 생성

```bash
npx prisma migrate dev --name init
```

---

## 흐름

```txt
schema.prisma 수정
  ↓
migrate dev
  ↓
migration SQL 생성
  ↓
DB 반영
  ↓
Prisma Client 재생성
```

---

## 주의

개발 중에는 migration을 자주 만들 수 있지만, 운영 DB에서는 신중해야 합니다.

특히 다음 변경은 주의합니다.

- 컬럼 삭제
- nullable → required 변경
- enum 변경
- relation 변경
- unique 제약 추가

---

# 10. Prisma Client

Prisma Client는 DB 접근 객체입니다.

---

## shared/lib/prisma

Next.js 개발 환경에서는 hot reload로 Prisma Client가 여러 번 생성될 수 있으므로 singleton 형태를 사용합니다.

```ts
// shared/lib/prisma/index.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn']
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

---

## 사용 위치

```txt
repository
  ↓
prisma.model.method
```

---

# 11. Repository Pattern

Repository는 DB 접근을 담당합니다.

---

## 왜 필요한가?

Prisma를 컴포넌트나 action에서 직접 사용하면 구조가 섞입니다.

나쁜 예:

```ts
'use server'

import { prisma } from '@/shared/lib/prisma'

export async function createSnackAction(input) {
  return prisma.snack.create({ data: input })
}
```

문제:

- Server Action이 DB 접근까지 담당
- 테스트 어려움
- json-server → Prisma 전환 어려움
- 비즈니스 로직과 DB 로직 분리 어려움

---

## 좋은 예

```txt
Action
  ↓
Service
  ↓
Repository
  ↓
Prisma
```

---

## Repository 예시

```ts
// features/snack/repositories/snack.repository.ts
import { prisma } from '@/shared/lib/prisma'
import type { CreateSnackInput, SnackSearchParams, UpdateSnackInput } from '../types/snack.type'

export const snackRepository = {
  list(params: SnackSearchParams) {
    return prisma.snack.findMany({
      where: {
        title: params.keyword
          ? {
              contains: params.keyword,
              mode: 'insensitive'
            }
          : undefined,
        brand: params.brand || undefined,
        category: params.category || undefined
      },
      orderBy: {
        [params.sort ?? 'createdAt']: params.order ?? 'desc'
      },
      skip: (params.page - 1) * 10,
      take: 10
    })
  },

  detail(id: string) {
    return prisma.snack.findUnique({
      where: { id }
    })
  },

  create(input: CreateSnackInput) {
    return prisma.snack.create({
      data: input
    })
  },

  update(id: string, input: UpdateSnackInput) {
    return prisma.snack.update({
      where: { id },
      data: input
    })
  },

  remove(id: string) {
    return prisma.snack.delete({
      where: { id }
    })
  }
}
```

---

# 12. Relation

Relation은 모델 간 관계입니다.

---

## User - Board

```txt
User 1
  ↓
Board N
```

---

## Prisma schema

```prisma
model User {
  id     String  @id @default(cuid())
  email  String  @unique
  boards Board[]
}

model Board {
  id       String @id @default(cuid())
  title    String
  authorId String
  author   User   @relation(fields: [authorId], references: [id])
}
```

---

## 조회

```ts
prisma.board.findMany({
  include: {
    author: {
      select: {
        id: true,
        name: true,
        email: true
      }
    }
  }
})
```

---

# 13. select / include

## select

필요한 필드만 선택합니다.

```ts
prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    email: true,
    name: true
  }
})
```

---

## include

관계 데이터를 포함합니다.

```ts
prisma.board.findMany({
  include: {
    author: true
  }
})
```

---

## 실무 기준

| 상황 | 권장 |
|---|---|
| 필드 제한 | select |
| 관계 포함 | include |
| 민감 정보 제외 | select |
| 목록 최적화 | select |
| 상세 관계 조회 | include + select |

---

## 주의

사용자 조회 시 passwordHash를 그대로 반환하지 않습니다.

```ts
select: {
  id: true,
  email: true,
  name: true,
  role: true
}
```

---

# 14. Pagination / Sort / Filter

## Pagination

```ts
const pageSize = 10

skip: (params.page - 1) * pageSize,
take: pageSize
```

---

## Count

```ts
const totalCount = await prisma.snack.count({
  where
})
```

---

## 목록 + 개수

```ts
const [items, totalCount] = await prisma.$transaction([
  prisma.snack.findMany({
    where,
    skip,
    take,
    orderBy
  }),
  prisma.snack.count({ where })
])
```

---

## Sort

```ts
orderBy: {
  [params.sort]: params.order
}
```

주의:

`params.sort`는 Zod enum으로 검증된 값만 사용해야 합니다.

---

## Filter

```ts
where: {
  title: params.keyword
    ? {
        contains: params.keyword,
        mode: 'insensitive'
      }
    : undefined,
  brand: params.brand || undefined,
  category: params.category || undefined
}
```

---

# 15. Transaction

Transaction은 여러 DB 작업을 하나의 단위로 묶습니다.

---

## 언제 사용하는가?

- 게시글 생성 + 첨부파일 생성
- 주문 생성 + 주문 상품 생성
- 사용자 생성 + 프로필 생성
- 목록 조회 + count 동시 처리
- 여러 테이블을 함께 변경

---

## 예시

```ts
const result = await prisma.$transaction(async tx => {
  const board = await tx.board.create({
    data: {
      title: input.title,
      contents: input.contents,
      authorId: input.authorId
    }
  })

  await tx.boardHistory.create({
    data: {
      boardId: board.id,
      action: 'CREATE'
    }
  })

  return board
})
```

---

# 16. CRUD 적용 예제

## Snack 목록

```txt
Page
  ↓
prefetch
  ↓
snackRepository.list
  ↓
prisma.snack.findMany
```

---

## Board 작성

```txt
BoardForm
  ↓
createBoardAction
  ↓
auth()
  ↓
boardService.create
  ↓
boardRepository.create
  ↓
prisma.board.create
```

---

## Board 수정

```txt
updateBoardAction
  ↓
auth()
  ↓
boardService.update
  ↓
boardRepository.detail
  ↓
작성자/관리자 확인
  ↓
boardRepository.update
```

---

## 회원가입

```txt
SignupForm
  ↓
signUpAction
  ↓
authService.signup
  ↓
userRepository.findByEmail
  ↓
bcrypt.hash
  ↓
userRepository.create
```

---

# 17. 코드 스니핏

## Prisma Client

```ts
// shared/lib/prisma/index.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn']
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

---

## Snack Repository

```ts
// features/snack/repositories/snack.repository.ts
import { prisma } from '@/shared/lib/prisma'
import type { CreateSnackInput, SnackSearchParams, UpdateSnackInput } from '../types/snack.type'

const PAGE_SIZE = 10

export const snackRepository = {
  async list(params: SnackSearchParams) {
    const where = {
      title: params.keyword
        ? {
            contains: params.keyword,
            mode: 'insensitive' as const
          }
        : undefined,
      brand: params.brand || undefined,
      category: params.category || undefined
    }

    const orderBy = {
      [params.sort ?? 'createdAt']: params.order ?? 'desc'
    }

    const [items, totalCount] = await prisma.$transaction([
      prisma.snack.findMany({
        where,
        orderBy,
        skip: (params.page - 1) * PAGE_SIZE,
        take: PAGE_SIZE
      }),
      prisma.snack.count({ where })
    ])

    return {
      items,
      totalCount,
      page: params.page,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil(totalCount / PAGE_SIZE)
    }
  },

  detail(id: string) {
    return prisma.snack.findUnique({
      where: { id }
    })
  },

  create(input: CreateSnackInput) {
    return prisma.snack.create({
      data: input
    })
  },

  update(id: string, input: UpdateSnackInput) {
    return prisma.snack.update({
      where: { id },
      data: input
    })
  },

  remove(id: string) {
    return prisma.snack.delete({
      where: { id }
    })
  }
}
```

---

## Board Repository

```ts
// features/board/repositories/board.repository.ts
import { prisma } from '@/shared/lib/prisma'
import type { CreateBoardInput, UpdateBoardInput } from '../types/board.type'

export const boardRepository = {
  list() {
    return prisma.board.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
  },

  detail(id: string) {
    return prisma.board.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
  },

  create(input: CreateBoardInput & { authorId: string }) {
    return prisma.board.create({
      data: input
    })
  },

  update(id: string, input: UpdateBoardInput) {
    return prisma.board.update({
      where: { id },
      data: input
    })
  },

  remove(id: string) {
    return prisma.board.delete({
      where: { id }
    })
  }
}
```

---

## User Repository

```ts
// features/auth/repositories/user.repository.ts
import { prisma } from '@/shared/lib/prisma'

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    })
  },

  findPublicById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true
      }
    })
  },

  create(input: {
    email: string
    name: string
    passwordHash: string
  }) {
    return prisma.user.create({
      data: input,
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })
  }
}
```

---

## Board Service 권한 처리

```ts
// features/board/services/board.service.ts
import { boardRepository } from '../repositories/board.repository'
import type { UpdateBoardInput } from '../types/board.type'

type Actor = {
  userId: string
  role?: string
}

export const boardService = {
  async update(id: string, input: UpdateBoardInput, actor: Actor) {
    const board = await boardRepository.detail(id)

    if (!board) {
      throw new Error('게시글을 찾을 수 없습니다.')
    }

    if (board.authorId !== actor.userId && actor.role !== 'admin') {
      throw new Error('수정 권한이 없습니다.')
    }

    return boardRepository.update(id, input)
  }
}
```

---

# 18. Caution

## 1. Client Component에서 Prisma 사용 금지

Prisma는 서버 전용입니다.

나쁜 예:

```tsx
'use client'

import { prisma } from '@/shared/lib/prisma'
```

---

## 2. passwordHash 반환 주의

사용자 데이터를 반환할 때 passwordHash를 포함하지 않도록 select를 사용합니다.

---

## 3. 동적 orderBy는 검증 후 사용

나쁜 예:

```ts
orderBy: {
  [searchParams.sort]: searchParams.order
}
```

URL 값은 사용자가 조작할 수 있습니다.

권장:

```txt
Zod enum 검증 후 사용
```

---

## 4. findUnique 결과 null 처리

```ts
const board = await prisma.board.findUnique(...)
```

결과가 없을 수 있습니다.

Service에서 null 처리를 해야 합니다.

---

## 5. Repository에 비즈니스 로직 과다 작성 금지

Repository는 DB 접근 계층입니다.

권한, 정책, 조합 규칙은 Service에서 처리합니다.

---

## 6. include 남용 주의

목록에서 모든 관계를 include하면 데이터가 커질 수 있습니다.

목록은 필요한 필드만 select하는 것이 좋습니다.

---

# 19. Best Practice

## 권장

- Prisma Client는 shared/lib/prisma에 singleton으로 구성
- Prisma 접근은 repository에 격리
- Service에서 비즈니스 규칙 처리
- Client Component에서 Prisma import 금지
- 사용자 정보 반환 시 select 사용
- 검색/정렬 파라미터는 Zod로 검증
- 목록 조회는 findMany + count 조합
- relation 조회는 include + select로 제한
- 여러 DB 작업은 transaction 사용
- json-server 단계와 Prisma 단계의 repository 인터페이스를 비슷하게 유지

---

## 비권장

- page.tsx에서 직접 prisma 호출
- Server Action에 Prisma 로직 몰아넣기
- Client Component에서 Prisma 사용
- passwordHash를 session/API 응답에 포함
- 검증되지 않은 URL 값을 orderBy에 사용
- include로 모든 관계 무조건 조회
- Repository에 권한 검증 로직 작성
- Migration을 운영 DB에 무계획 적용

---

# 20. 요약

## Prisma 위치

```txt
Repository
  ↓
Prisma
  ↓
DB
```

---

## 전체 흐름

```txt
Action / Route Handler
  ↓
Service
  ↓
Repository
  ↓
Prisma
```

---

## 핵심 기준

```txt
DB 모델은 schema.prisma

DB 접근은 repository

비즈니스 규칙은 service

권한 검증은 service

Client에서는 Prisma 사용 금지

민감 정보는 select로 제외
```

---

## json-server에서 Prisma로 전환

```txt
axios repository
↓
prisma repository
```

Service와 Action 구조는 최대한 유지하고 Repository 구현만 교체하는 것을 목표로 합니다.
