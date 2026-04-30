# Swagger(OpenAPI) 구성 정리 (Swagger + CRUD)

이 문서는 `src/main/java/com/side/temp/` 하위에서 **Swagger(OpenAPI)가 어떻게 구성되고**,  
그 위에서 **Swagger API가 어떤 방식으로 문서화되는지**를 빠르게 파악하기 위한 요약입니다.

- `src-test-analysis.md`처럼 **구성/의도/체크포인트 중심**으로 정리하고
- `form-rhf-demo.md`처럼 **한 번에 훑을 수 있는 간단 스니펫(어노테이션/요약 코드)** 을 섞었습니다.

---

## 로드맵(3단 구성): config → api → domain(+docs)

1. **(config) OpenAPI 전역 설정 + 그룹(탭) 분리**

- `SwaggerConfig`에서 Info/Servers/SecuritySchemes + GroupedOpenApi를 만든다.

2. **(api) Controller는 동작, ControllerDocs는 문서**

- Controller는 매핑/응답 구현
- ControllerDocs는 `@Operation`, `@ApiResponse(s)`, `@RequestBody`(schema) 등을 붙여 문서 스펙을 책임

3. **(domain) 실DTO(Request/Response) + 문서DTO(RequestDocs/ResponseDocs)**

- 실DTO에는 `@Valid`/validation 중심
- DocsDTO에는 `@Schema(description/example/...)` 중심

---

## 한번에 보기: 폴더 트리(주석 포함)

```text
src/main/java/com/side/temp
├─ config/
│  └─ swagger/
│     └─ SwaggerConfig.java                     # OpenAPI 전역 설정(Info/Servers/SecuritySchemes)
│                                                 + 그룹 분리(GroupedOpenApi)
│
├─ api/
│  ├─ controller/
│  │  ├─ RestSwaggerController.java             # Swagger 예제 API 구현체 (/api/v1/swagger)
│  │  └─ RestCrudController.java                # CRUD 예제 API 구현체 (/api/v1/crud)
│  │
│  └─ schema/
│     ├─ RestSwaggerControllerDocs.java         # Swagger 예제 API 문서(요약/설명/응답/예시)
│     ├─ RestCrudControllerDocs.java            # CRUD 예제 API 문서(요약/응답/요청 스키마)
│     └─ dto/
│        ├─ request/
│        │  ├─ SwaggerRequest.java              # Swagger 예제 요청 DTO
│        │  └─ schema/SwaggerRequestDocs.java   # Swagger 예제 요청 스키마
│        ├─ response/
│        │  ├─ SwaggerResponse.java             # Swagger 예제 응답 DTO
│        │  └─ schema/SwaggerResponseDocs.java  # Swagger 예제 응답 스키마
│        ├─ request/
│        │  └─ CrudRequestDocs.java             # CRUD 예제 요청 스키마
│        ├─ response/
│        └─ └─ CrudResponseDocs.java            # CRUD 예제 응답 스키마
│
├─ domain/
│  └─ dto/
│     ├─ request/
│     │  └─ CrudRequest.java                    # CRUD 예제 요청 DTO + validation(@NotBlank/@Size)
│     ├─ response/
│     └─ └─ CrudResponse.java                   # CRUD 예제 응답 DTO
│
└─ common/enumeration/
   └─ SwaggerDictionary.java                    # 문서 문구/응답코드 상수(조회/입력/수정/삭제 등)
```

---

## 스니펫(“안내가 가능한 정도”로만)

### config

전역 OpenAPI + 그룹 분리

```java
@Configuration
class SwaggerConfig {
  @Bean OpenAPI openAPI(...) { ... }          // Info + Servers + SecuritySchemes
  @Bean GroupedOpenApi v1Api() { ... }        // /api/v1/**
  @Bean GroupedOpenApi userApi() { ... }      // /api/user/**
  @Bean GroupedOpenApi adminApi() { ... }     // /api/admin/**
}
```

### api

동작(Controller) + 문서(ControllerDocs)

```java
@RestController
@RequestMapping("/api/v1/swagger")
class RestSwaggerController implements RestSwaggerControllerDocs {
  @GetMapping("/{id}") ResponseEntity<?> findBySample(@PathVariable long id) { ... }
  @PostMapping ResponseEntity<?> createSample(@RequestBody SwaggerRequest request) { ... }
}

@Tag(name = "Sample")
interface RestSwaggerControllerDocs {
  @Operation(summary = "...", description = "...")
  @ApiResponses({ @ApiResponse(responseCode="200"), @ApiResponse(responseCode="400") })
  ResponseEntity<?> findBySample(long id);
}
```

### domain

동작 DTO + 문서 DTO Docs

```java
// 실DTO: validation 중심(@Valid가 Controller에서 동작)
public record CrudRequest(
  @NotBlank @Size(max=100) String title,
  @Size(max=2000) String contents
) {}

// DocsDTO: 문서 품질 중심(@Schema description/example)
@Schema(name="CrudRequest")
public record CrudRequestDocs(
  @Schema(example="제목입니다.") String title,
  @Schema(example="내용입니다.") String contents
) {}
```

---

## 상세 설명

## 1. SwaggerConfig

### 1.1 타입 치환(SpringDocUtils)

- **무엇을 하나요?**
  - `LocalDate`, `LocalTime`, `LocalDateTime`, `OffsetDateTime`, `ZonedDateTime`, `YearMonth` 등을 문서 스키마에서 **String으로 치환**합니다.
- **왜 하나요?**
  - 날짜/시간 타입이 문서에서 과하게 복잡하게 보이는 문제를 줄이고, 소비자 관점에서 명확하게 만들기 위함입니다.

### 1.2 OpenAPI(Info / Components / Servers)

- **Info**
  - title/description/version + Contact/License 포함
  - 현재 버전 값은 `@Value("v1")`로 “고정 주입” 형태입니다.
- **Components(SecuritySchemes)**
  - `accessToken`, `refreshToken` 2개를 등록
  - 타입은 `APIKEY`, 위치는 `HEADER`, name은 각각 토큰 키(`accessToken`, `refreshToken`)
  - `HTTP bearer(Authorization)` 대안 메소드가 있으나 현재 미사용
- **Servers**
  - `/`(현재 url 의미) + `jsonplaceholder` 2개가 등록되어 Swagger UI에서 선택 가능합니다.

### 1.3 GroupedOpenApi(그룹/탭) 분리

현재는 경로 기준으로 3개 그룹이 존재합니다.

- `**v1`**: `/api/v1/**`
- `**v1-user**`: `/api/user/**` (+ 그룹 커스터마이징으로 Info/Components/Servers 재주입)
- `**v1-admin**`: `/api/admin/**` (+ `openAPI("v1")` 재사용 커스터마이징)

---

## 2. (Swagger 예제) API + 문서화 구성/로직

### 2.1 엔드포인트(Controller 기준)

`RestSwaggerController`는 `/api/v1/swagger`를 베이스로 아래 동작을 가집니다.

- **GET** `/api/v1/swagger/{id}`: 단건 조회
- **GET** `/api/v1/swagger`: 전체 조회
- **POST** `/api/v1/swagger`: 생성
- **PUT** `/api/v1/swagger/{id}`: 수정
- **DELETE** `/api/v1/swagger/{id}`: 삭제

### 2.2 ControllerDocs가 추가하는 “문서 로직”

`RestSwaggerControllerDocs`에서 확인되는 핵심 패턴:

- **요약/설명 상수화**
  - summary/description에 `SwaggerDictionary` 상수를 사용(조회/입력/수정/삭제 등 문구 통일)
- **파라미터 문서화**
  - 단건 조회에서 `@Parameter(in = PATH, required = true)`로 path variable을 명시
- **응답 문서화(ApiResponses)**
  - `200/400/404` 등을 명시
  - `content`에 `@Schema(implementation = SwaggerResponseDocs.class)`로 응답 스키마를 강제
- **특수 케이스에서 Examples 제공**
  - `mediaType`을 복수로 선언하거나(example 덮어쓰기, examples 여러 개 등) 필요한 케이스에 `ExampleObject`를 직접 넣는 구조

### 2.3 domain(dto) vs docs(dto) 역할 분리

- **실DTO**
  - `SwaggerRequest`: validation(`@NotBlank`, `@Size`) + request 타입 역할
  - `SwaggerResponse`: 실제 응답 객체(builder 기반)
- **DocsDTO**
  - `SwaggerRequestDocs`: record 기반 `@Schema`로 description/example/maxLength/requiredMode 제공
  - `SwaggerResponseDocs`: 응답 DTO 상속 + getter override에 `@Schema`를 붙여 문서 메타데이터 제공

---

## 3. (CRUD 예제) API + 문서화 구성/로직

### 3.1 엔드포인트(Controller 기준)

`RestCrudController`는 `/api/v1/crud`를 베이스로 아래 동작을 가집니다.

- **GET** `/api/v1/crud/{id}`: 단건 조회
- **GET** `/api/v1/crud`: 전체 조회
- **POST** `/api/v1/crud`: 입력 (`@Valid @RequestBody CrudRequest`)
- **PUT** `/api/v1/crud/{id}`: 수정
- **DELETE** `/api/v1/crud/{id}`: 삭제

> 참고: 현재 `RestCrudController`는 `implements RestCrudControllerDocs`가 주석 처리되어 있어, “문서 분리 패턴”을 실제로 강제하고 있진 않습니다(코드 기준).

### 3.2 ControllerDocs가 추가하는 “문서 로직”

`RestCrudControllerDocs`에서 확인되는 핵심 패턴:

- **조회(단건)**
  - `@ApiResponses`에서 `CrudResponseDocs`를 response schema로 지정
- **조회(전체)**
  - `@Content(array = @ArraySchema(schema = @Schema(implementation = CrudResponseDocs.class)))`로 “배열 응답” 문서화
- **입력/수정**
  - `@RequestBody(content = @Content(schema = @Schema(implementation = CrudRequestDocs.class)))`로 요청 스키마를 명시

### 3.3 domain(dto) vs docs(dto) 역할 분리

- **실DTO**
  - `CrudRequest`: `@NotBlank/@Size` 등 validation 규칙이 포함되어 있고, Controller에서 `@Valid`로 동작
  - `CrudResponse`: 응답 타입(간단 record)
- **DocsDTO**
  - `CrudRequestDocs` / `CrudResponseDocs`: `@Schema`로 description/example 중심의 문서 품질 담당

---

## 4. 공통 체크포인트(운영/유지보수 관점)

- **버전/환경 분리**
  - 현재 `@Value("v1")` 고정 주입이라, 프로파일/환경별 버전/메타 분리가 필요하면 개선 포인트입니다.
- **SecurityScheme 표준화**
  - 현재는 `accessToken`, `refreshToken`을 각각 별도 헤더로 받는 방식(APIKEY/HEADER)입니다.
  - `Authorization: Bearer ...`(HTTP bearer)로 통일할지 정책이 필요합니다.
- **DocsDTO name 충돌**
  - `@Schema(name=...)` 또는 `@RequestBody/@Content`의 name 충돌 시 의도치 않은 Docs 재사용이 생길 수 있어 규칙화가 유리합니다.

---

## 5. 실제 예제

[다운로드](https://github.com/shoon0615/pr_psts/blob/main/temp/docs/config/swagger/sample.mhtml)  
![alt text](screencapture.png)
