# Swagger/CRUD Swagger 구조 분석 및 개선 검토

> 분석 기준: 업로드된 `README.md`에 정리된 폴더 트리와 Swagger 구성 설명 기준입니다. 실제 Java 소스 전체를 직접 분석한 결과는 아니므로, 세부 구현 검증은 마지막의 검증 작업 체크리스트를 기준으로 추가 확인이 필요합니다.

---

## 1. 현재 Swagger/CRUD 구성 요약

현재 구성은 크게 `config → api → domain(+docs)` 흐름으로 정리됩니다.

```text
src/main/java/com/side/temp
├─ config/
│  └─ swagger/
│     └─ SwaggerConfig.java
│
├─ api/
│  ├─ controller/
│  │  ├─ RestSwaggerController.java
│  │  └─ RestCrudController.java
│  │
│  └─ schema/
│     ├─ RestSwaggerControllerDocs.java
│     ├─ RestCrudControllerDocs.java
│     └─ dto/
│        ├─ request/
│        │  ├─ SwaggerRequest.java
│        │  └─ schema/SwaggerRequestDocs.java
│        ├─ response/
│        │  ├─ SwaggerResponse.java
│        │  └─ schema/SwaggerResponseDocs.java
│        ├─ request/
│        │  └─ CrudRequestDocs.java
│        └─ response/
│           └─ CrudResponseDocs.java
│
├─ domain/
│  └─ dto/
│     ├─ request/
│     │  └─ CrudRequest.java
│     └─ response/
│        └─ CrudResponse.java
│
└─ common/enumeration/
   └─ SwaggerDictionary.java
```

### 현재 구조의 핵심 의도

| 영역 | 역할 | 현재 방식 |
|---|---|---|
| `SwaggerConfig` | OpenAPI 전역 설정 | Info, Servers, SecuritySchemes, GroupedOpenApi 설정 |
| `Controller` | 실제 API 동작 | `@RestController`, `@GetMapping`, `@PostMapping` 등 실제 엔드포인트 구현 |
| `ControllerDocs` | Swagger 문서 분리 | `@Operation`, `@ApiResponse`, Swagger용 `@RequestBody`, `@Parameter` 작성 |
| 실제 DTO | 런타임 요청/응답 | validation, 실제 request/response 타입 담당 |
| Docs DTO | Swagger 스키마 문서 | `@Schema`, example, description, requiredMode 담당 |
| `SwaggerDictionary` | 문구 상수화 | summary, description, responseCode 등 문구 통일 |

---

## 2. 현재 구조 판단

### 전체 판단

현재 구조는 **Swagger 문서와 실제 Controller 동작을 분리하려는 의도는 좋습니다.**

다만 현재 README 기준으로 보면 아래 부분은 개선 여지가 큽니다.

1. `RestCrudController`가 `RestCrudControllerDocs`를 실제로 `implements`하지 않는 상태
2. 실제 DTO와 Docs DTO가 과하게 분리되어 유지보수 비용이 커질 가능성
3. `accessToken`, `refreshToken`을 각각 커스텀 헤더로 등록한 SecurityScheme이 일반적인 Bearer 방식과 다름
4. `@Value("v1")`처럼 고정값 주입 형태가 설정값 분리 측면에서 애매함
5. `api/schema/dto/request` 구조 안에 `SwaggerRequest.java`와 `schema/SwaggerRequestDocs.java`가 섞여 있어 패키지 역할이 다소 혼재됨
6. `ResponseEntity<?>` 사용이 문서와 타입 안정성 측면에서 불리함

---

## 3. 항목별 검토

## 3.1 리팩토링

### 필요한 리팩토링 1: ControllerDocs 적용 일관화

현재 README에 따르면 `RestSwaggerController`는 Docs 인터페이스를 구현하지만, `RestCrudController`는 `implements RestCrudControllerDocs`가 주석 처리된 상태입니다.

```java
@RestController
@RequestMapping("/api/v1/crud")
class RestCrudController implements RestCrudControllerDocs {
    // CRUD API 구현
}
```

#### 판단

문서 분리 패턴을 선택했다면 모든 Controller에 동일하게 적용하는 것이 좋습니다.

#### 개선 방향

- `RestCrudController implements RestCrudControllerDocs` 복구
- Controller 메서드 시그니처와 Docs 인터페이스 메서드 시그니처 일치
- Swagger 문서 어노테이션은 Docs 인터페이스에 집중
- Spring MVC 동작 어노테이션은 Controller 구현체에 집중

---

### 필요한 리팩토링 2: Docs DTO 분리 기준 재검토

현재 구조는 실제 DTO와 Swagger Docs DTO를 분리합니다.

```text
CrudRequest.java        # 실제 요청 DTO
CrudRequestDocs.java    # Swagger 문서용 요청 DTO
CrudResponse.java       # 실제 응답 DTO
CrudResponseDocs.java   # Swagger 문서용 응답 DTO
```

#### 장점

- 실제 비즈니스 DTO가 Swagger 어노테이션으로 오염되지 않음
- 문서 예시와 실제 validation 정책을 독립적으로 관리 가능
- 외부 공개 문서용 DTO와 내부 DTO를 다르게 표현 가능

#### 단점

- 필드가 늘어날수록 실제 DTO와 Docs DTO의 동기화 비용 증가
- 실제 DTO에는 필드가 있는데 Docs DTO에는 누락되는 문제가 생길 수 있음
- 작은 CRUD에서는 구조가 과할 수 있음

#### 판단

실무에서도 Docs DTO 분리는 사용될 수 있지만, 모든 DTO에 기계적으로 분리하는 방식은 과할 수 있습니다.

#### 권장 기준

| 상황 | 추천 |
|---|---|
| 단순 CRUD, 내부 관리자 API | 실제 DTO에 `@Schema` 직접 작성 |
| 외부 공개 API, 문서 품질이 중요한 API | Docs DTO 분리 가능 |
| 실제 응답과 문서 응답이 다르게 보여야 하는 경우 | Docs DTO 분리 적합 |
| 필드 수가 적고 변경이 잦은 초기 개발 | 실제 DTO에 문서 어노테이션 작성 권장 |

---

### 필요한 리팩토링 3: 패키지 구조 정리

현재 README의 트리에서는 `api/schema/dto/request` 아래에 Swagger용 DTO와 일부 실제 DTO가 함께 보이는 형태입니다.

#### 개선안 A: 현재 구조 유지 + 명확화

```text
api/
├─ controller/
│  ├─ RestCrudController.java
│  └─ RestSwaggerController.java
│
└─ docs/
   ├─ RestCrudControllerDocs.java
   ├─ RestSwaggerControllerDocs.java
   └─ dto/
      ├─ request/
      │  ├─ CrudRequestDocs.java
      │  └─ SwaggerRequestDocs.java
      └─ response/
         ├─ CrudResponseDocs.java
         └─ SwaggerResponseDocs.java

domain/
└─ dto/
   ├─ request/
   │  ├─ CrudRequest.java
   │  └─ SwaggerRequest.java
   └─ response/
      ├─ CrudResponse.java
      └─ SwaggerResponse.java
```

#### 개선안 B: 기능 기준 패키지

```text
crud/
├─ controller/
│  └─ RestCrudController.java
├─ docs/
│  ├─ RestCrudControllerDocs.java
│  └─ dto/
│     ├─ CrudRequestDocs.java
│     └─ CrudResponseDocs.java
└─ dto/
   ├─ CrudRequest.java
   └─ CrudResponse.java

swagger/
├─ controller/
├─ docs/
└─ dto/
```

#### 추천

현재 프로젝트가 예제성 CRUD 중심이면 **개선안 A**가 단순합니다.

기능이 계속 늘어날 예정이면 **개선안 B**처럼 feature 기준으로 나누는 것이 유지보수에 유리합니다.

---

### 필요한 리팩토링 4: `ResponseEntity<?>` 제거

현재 예제에는 `ResponseEntity<?>`가 사용됩니다.

```java
ResponseEntity<?> findByCrud(...)
```

#### 문제점

- Swagger 응답 타입 추론이 어려움
- IDE와 컴파일 단계에서 응답 타입 검증이 약함
- API 변경 시 영향 범위 파악이 어려움

#### 개선 예시

```java
ResponseEntity<CrudResponse> findByCrud(@PathVariable long id)
```

목록 응답이면 다음처럼 명확히 표현합니다.

```java
ResponseEntity<List<CrudResponse>> findAllCrud()
```

공통 응답 래퍼를 쓴다면 아래처럼 고정합니다.

```java
ResponseEntity<ApiResponse<CrudResponse>> findByCrud(@PathVariable long id)
```

---

## 3.2 실무에 일반적으로 사용되는지 혹은 적합한지

### Controller와 Docs 인터페이스 분리

#### 실무 적합도: 보통 이상

Controller 구현부가 Swagger 어노테이션으로 길어지는 것을 막기 위해 Docs 인터페이스를 분리하는 방식은 실무에서도 사용됩니다.

다만 모든 팀에서 표준은 아닙니다. 아래와 같은 상황에서 적합합니다.

- Swagger 어노테이션이 많은 프로젝트
- API 문서 품질을 중요하게 관리하는 프로젝트
- Controller를 최대한 얇게 유지하고 싶은 프로젝트
- 요청/응답 예시가 많은 프로젝트

반대로 아래 상황에서는 과할 수 있습니다.

- 단순 내부 API
- API 수가 적은 프로젝트
- Swagger 문서보다 빠른 개발이 우선인 초기 프로젝트

---

### 실제 DTO와 Docs DTO 분리

#### 실무 적합도: 선택적 적합

Docs DTO 분리는 실무에서 가능하지만, 일반적인 기본값으로 보기에는 다소 무겁습니다.

#### 적합한 경우

- 실제 DTO와 외부 문서 노출 스펙이 다름
- 내부 필드를 문서에서 숨겨야 함
- example, description, format, nullable 등을 매우 자세히 관리해야 함
- 외부 고객사 또는 프론트엔드 팀과 계약 기반 API 문서를 관리함

#### 부적합하거나 과한 경우

- 단순 CRUD
- 필드 변경이 잦음
- DTO가 작고 문서 요구 수준이 높지 않음
- 문서 DTO와 실제 DTO 동기화 자동 검증이 없음

---

### `SwaggerDictionary` 상수화

#### 실무 적합도: 일부 적합

문구와 응답 코드를 상수화하는 방식은 중복을 줄이는 데 도움이 됩니다.

다만 너무 많은 문구를 하나의 Dictionary에 몰아넣으면 오히려 유지보수가 어려워질 수 있습니다.

#### 개선 방향

```text
common/swagger/
├─ SwaggerResponseCode.java
├─ SwaggerDescription.java
└─ SwaggerTag.java
```

또는 기능별로 나눌 수 있습니다.

```text
crud/docs/CrudSwaggerDocs.java
swagger/docs/SwaggerSampleDocs.java
```

---

### SecurityScheme 구성

#### 실무 적합도: 현재 방식은 정책 확인 필요

현재 구성은 `accessToken`, `refreshToken`을 각각 `APIKEY`, `HEADER` 방식으로 등록합니다.

```text
accessToken: header
refreshToken: header
```

일반적인 JWT 인증 API에서는 다음 방식이 더 흔합니다.

```http
Authorization: Bearer <access-token>
```

#### 권장

Access Token은 HTTP Bearer 방식으로 문서화하는 것을 우선 검토하는 것이 좋습니다.

```java
new SecurityScheme()
    .type(SecurityScheme.Type.HTTP)
    .scheme("bearer")
    .bearerFormat("JWT")
```

Refresh Token은 프로젝트 정책에 따라 다릅니다.

| Refresh Token 전달 방식 | Swagger 문서화 |
|---|---|
| Cookie | cookie 기반 문서화 또는 설명으로 처리 |
| Header | 별도 ApiKey header 가능 |
| Body | refresh API request body에 명시 |

---

## 3.3 효율적인지

### 효율적인 부분

| 항목 | 판단 |
|---|---|
| Controller와 Swagger 문서 분리 | Controller 가독성 측면에서 효율적 |
| GroupedOpenApi 분리 | API 그룹이 많아질 경우 효율적 |
| 문구 상수화 | 반복 문구 관리에 효율적 |
| 날짜 타입 String 치환 | 문서 소비자 관점에서 효율적 |
| 요청/응답 예시 분리 | API 문서 품질 관리에 효율적 |

### 비효율적인 부분

| 항목 | 문제 |
|---|---|
| Docs DTO 과다 분리 | 실제 DTO와 문서 DTO 동기화 비용 증가 |
| `ResponseEntity<?>` | 타입 추론과 문서 정확도 저하 |
| `@Value("v1")` | 설정값 분리 효과가 낮음 |
| ControllerDocs 미적용 상태 | 문서 분리 패턴의 일관성 저하 |
| `api/schema` 네이밍 | 실제 schema인지 docs인지 역할이 모호할 수 있음 |
| `accessToken`, `refreshToken` 커스텀 헤더 | 일반적인 JWT Bearer 흐름과 다를 수 있음 |

---

## 3.4 개선사항

## 우선순위 높은 개선사항

### 1순위: CRUD Controller와 Docs 인터페이스 연결

```java
public class RestCrudController implements RestCrudControllerDocs {
}
```

문서 분리 패턴을 적용한다면 반드시 일관되게 적용하는 것이 좋습니다.

---

### 2순위: 응답 타입 명확화

기존:

```java
ResponseEntity<?> findByCrud(...)
```

개선:

```java
ResponseEntity<CrudResponse> findByCrud(...)
ResponseEntity<List<CrudResponse>> findAllCrud(...)
ResponseEntity<Void> deleteCrud(...)
```

또는 공통 응답 포맷을 도입합니다.

```java
public record ApiResponse<T>(
    String code,
    String message,
    T data
) {}
```

```java
ResponseEntity<ApiResponse<CrudResponse>> findByCrud(...)
```

---

### 3순위: SecurityScheme 표준화

Access Token은 Bearer 방식으로 전환 검토가 필요합니다.

```java
.addSecuritySchemes("bearerAuth", new SecurityScheme()
    .type(SecurityScheme.Type.HTTP)
    .scheme("bearer")
    .bearerFormat("JWT"))
```

그리고 Operation 또는 전역 설정에 security requirement를 연결합니다.

```java
.addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
```

---

### 4순위: `@Value("v1")` 제거

기존:

```java
@Value("v1")
private String version;
```

개선:

```yaml
springdoc:
  api-docs:
    version: openapi_3_1

api:
  docs:
    version: v1
    title: Side Project API
```

```java
@ConfigurationProperties(prefix = "api.docs")
public record ApiDocsProperties(
    String version,
    String title,
    String description
) {}
```

---

### 5순위: Docs 패키지명 정리

`schema`라는 이름보다 `docs` 또는 `openapi`가 의도를 더 명확하게 드러냅니다.

권장:

```text
api/docs/
api/docs/dto/
```

또는:

```text
openapi/
openapi/dto/
```

---

### 6순위: Docs DTO 사용 기준 문서화

팀 규칙으로 아래 기준을 정해두는 것이 좋습니다.

```md
## Swagger Docs DTO 작성 기준

- 단순 CRUD는 실제 DTO에 `@Schema`를 작성한다.
- 외부 공개 API, 예시가 복잡한 API, 실제 DTO와 문서 DTO가 다른 경우에만 `*Docs` DTO를 만든다.
- Docs DTO를 만들 경우 실제 DTO와 필드명이 동일해야 한다.
- Docs DTO 누락 여부는 테스트로 검증한다.
```

---

## 3.5 검증 작업

## 필수 검증 체크리스트

### 1. Swagger UI 노출 검증

- [ ] `/swagger-ui/index.html` 접속 가능 여부
- [ ] `/v3/api-docs` 접속 가능 여부
- [ ] `v1`, `v1-user`, `v1-admin` 그룹이 의도대로 노출되는지
- [ ] `/api/v1/crud/**`가 CRUD 그룹 또는 v1 그룹에 포함되는지
- [ ] `/api/v1/swagger/**`가 v1 그룹에 포함되는지

---

### 2. ControllerDocs 적용 검증

- [ ] `RestSwaggerController implements RestSwaggerControllerDocs` 적용 여부
- [ ] `RestCrudController implements RestCrudControllerDocs` 적용 여부
- [ ] Controller 메서드 시그니처와 Docs 인터페이스 메서드 시그니처 일치 여부
- [ ] Docs 인터페이스에 작성한 `@Operation`이 Swagger UI에 실제 반영되는지
- [ ] `@ApiResponse`가 실제 Swagger UI 응답 목록에 반영되는지

---

### 3. RequestBody 검증

- [ ] Controller의 `@RequestBody`는 `org.springframework.web.bind.annotation.RequestBody`인지
- [ ] Swagger 문서의 `@RequestBody`는 `io.swagger.v3.oas.annotations.parameters.RequestBody`인지
- [ ] 생성 API의 request schema가 `CrudRequestDocs` 또는 실제 `CrudRequest`로 정확히 보이는지
- [ ] 수정 API의 request schema가 생성 API와 의도대로 같거나 다른지
- [ ] `@Valid`가 실제 Controller request parameter에 적용되어 있는지

---

### 4. Response 검증

- [ ] 단건 조회 response schema가 `CrudResponseDocs` 또는 `CrudResponse`로 정확히 보이는지
- [ ] 전체 조회 response schema가 array 형태로 보이는지
- [ ] 삭제 API response가 `Void`, `204 No Content`, 또는 공통 응답 중 무엇인지 명확한지
- [ ] `ResponseEntity<?>`로 인해 Swagger schema가 깨지는 부분은 없는지

---

### 5. DTO 동기화 검증

Docs DTO를 계속 사용할 경우 아래 검증이 필요합니다.

- [ ] `CrudRequest`와 `CrudRequestDocs` 필드명이 일치하는지
- [ ] `CrudResponse`와 `CrudResponseDocs` 필드명이 일치하는지
- [ ] 실제 DTO에는 있는데 Docs DTO에는 없는 필드가 없는지
- [ ] Docs DTO에는 있는데 실제 DTO에는 없는 필드가 없는지
- [ ] validation 조건과 `@Schema(requiredMode, maxLength, minLength)`가 어긋나지 않는지

가능하면 테스트로 검증합니다.

```java
@Test
void crudRequestDocs_fields_should_match_crudRequest_fields() {
    // reflection으로 실제 DTO와 Docs DTO의 record component 이름 비교
}
```

---

### 6. SecurityScheme 검증

- [ ] Swagger UI Authorize 버튼에 accessToken, refreshToken이 의도대로 보이는지
- [ ] 실제 API 인증 방식이 `Authorization: Bearer`인지, 커스텀 header인지 확인
- [ ] 실제 인증 방식과 Swagger SecurityScheme이 일치하는지
- [ ] refreshToken을 Swagger에서 입력받게 하는 것이 보안/운영 정책에 맞는지

---

### 7. OpenAPI JSON 검증

Swagger UI만 보지 말고 `/v3/api-docs` JSON도 확인해야 합니다.

- [ ] `components.schemas`에 불필요한 중복 schema가 생기지 않는지
- [ ] `CrudRequest`, `CrudRequestDocs` 이름 충돌이 없는지
- [ ] `SwaggerRequest`, `SwaggerRequestDocs` 이름 충돌이 없는지
- [ ] `paths`에 의도하지 않은 endpoint가 노출되지 않는지
- [ ] response code와 schema가 API별로 일관적인지

---

## 4. 최종 권장 구조

현재 구조를 크게 바꾸지 않는다면 아래 정도가 가장 현실적입니다.

```text
src/main/java/com/side/temp
├─ config/
│  └─ swagger/
│     ├─ SwaggerConfig.java
│     └─ ApiDocsProperties.java
│
├─ api/
│  ├─ controller/
│  │  ├─ RestSwaggerController.java
│  │  └─ RestCrudController.java
│  │
│  └─ docs/
│     ├─ RestSwaggerControllerDocs.java
│     ├─ RestCrudControllerDocs.java
│     └─ dto/
│        ├─ request/
│        │  ├─ SwaggerRequestDocs.java
│        │  └─ CrudRequestDocs.java
│        └─ response/
│           ├─ SwaggerResponseDocs.java
│           └─ CrudResponseDocs.java
│
├─ domain/
│  └─ dto/
│     ├─ request/
│     │  ├─ SwaggerRequest.java
│     │  └─ CrudRequest.java
│     └─ response/
│        ├─ SwaggerResponse.java
│        └─ CrudResponse.java
│
└─ common/
   └─ swagger/
      ├─ SwaggerDictionary.java
      ├─ SwaggerResponseCode.java
      └─ SwaggerTag.java
```

---

## 5. 결론

현재 Swagger/CRUD 구조는 **학습용 또는 문서 분리 패턴 검증용으로는 좋은 구성**입니다.

실무 기준으로는 다음 조정이 필요합니다.

1. `RestCrudControllerDocs` 적용을 일관화한다.
2. `ResponseEntity<?>`를 제거하고 명확한 응답 타입을 사용한다.
3. Docs DTO는 모든 DTO에 무조건 만들지 말고 필요한 경우에만 만든다.
4. JWT 인증 문서화는 가능하면 `Authorization: Bearer` 방식으로 표준화한다.
5. `api/schema`보다는 `api/docs` 또는 `openapi`처럼 역할이 명확한 패키지명을 사용한다.
6. Swagger UI 확인뿐 아니라 `/v3/api-docs` JSON과 DTO 동기화 테스트까지 검증한다.

가장 중요한 개선 포인트는 **문서 구조를 예쁘게 분리하는 것보다 실제 API 타입, validation, Swagger schema가 서로 어긋나지 않게 만드는 것**입니다.
