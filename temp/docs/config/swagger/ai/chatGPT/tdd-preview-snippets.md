# Swagger/CRUD 구조 기준 TDD 요청 프리뷰 스니펫

> 기준 파일  
> - `README.md`: Swagger(OpenAPI) + CRUD 구조 요약  
> - `swagger-crud-review.md`: 리팩토링/실무 적합성/효율성/개선사항/검증 작업 분석  
>
> 목적: 현재 Swagger/CRUD 구조에서 **TDD를 요청하면 어떤 산출물을 생성하게 만들지** 미리 볼 수 있는 프롬프트/스니펫 모음입니다.

---

## 1. TDD 요청 시 생성 방향

현재 구조는 대략 아래 흐름입니다.

```text
Controller
  └─ ControllerDocs
      └─ Swagger 문서 어노테이션

Controller
  └─ Request DTO / Response DTO
      └─ validation / 응답 타입

SwaggerConfig
  └─ OpenAPI / GroupedOpenApi / SecurityScheme / Servers
```

TDD 요청 시에는 바로 구현 코드를 만들기보다, 아래 순서로 테스트를 생성시키는 것이 좋습니다.

```text
1. API 동작 테스트
   - GET / POST / PUT / DELETE 정상 응답
   - validation 실패 응답
   - path variable 처리

2. Swagger 문서 구조 테스트
   - OpenAPI JSON에 path가 노출되는지
   - requestBody schema가 Docs DTO 기준인지
   - response schema가 Docs DTO 기준인지
   - tags / summary / description / responseCode가 존재하는지

3. SwaggerConfig 테스트
   - GroupedOpenApi 그룹 경로 확인
   - SecurityScheme 등록 확인
   - Servers 등록 확인

4. 리팩토링 검증 테스트
   - RestCrudController가 RestCrudControllerDocs를 implements하는지
   - ResponseEntity<?> 제거 여부
   - 실제 DTO와 Docs DTO 필드 동기화 여부
```

---

## 2. 전체 TDD 생성 요청 프롬프트

```md
현재 프로젝트의 Swagger/CRUD 구조를 기준으로 TDD 테스트 코드를 생성해줘.

기준 구조:
- SwaggerConfig에서 OpenAPI 전역 설정, SecurityScheme, Servers, GroupedOpenApi를 관리한다.
- RestSwaggerController는 RestSwaggerControllerDocs를 implements해서 Swagger 문서를 분리한다.
- RestCrudController도 RestCrudControllerDocs를 implements하는 구조로 리팩토링할 예정이다.
- 실제 DTO는 validation과 런타임 타입을 담당한다.
- Docs DTO는 @Schema, example, description, requiredMode 등 Swagger 문서 품질을 담당한다.

생성 기준:
1. 먼저 실패하는 테스트를 작성한다.
2. Controller 동작 테스트는 MockMvc 기반으로 작성한다.
3. Swagger 문서 테스트는 /v3/api-docs 또는 group별 /v3/api-docs/{group} 응답 JSON을 검증한다.
4. validation 실패 테스트를 포함한다.
5. ResponseEntity<?> 대신 명확한 응답 타입을 기대하는 테스트를 포함한다.
6. RestCrudController가 RestCrudControllerDocs를 implements하지 않으면 실패하는 구조 검증 테스트를 포함한다.
7. 테스트명은 given/when/then 또는 should 형식으로 작성한다.
8. Spring Boot 4 / Java 21 기준으로 작성한다.

결과물:
- 테스트 파일 트리
- 각 테스트 클래스 코드
- 테스트별 목적 설명
- 이후 구현해야 할 최소 프로덕션 코드 변경사항
```

---

## 3. 테스트 파일 트리 프리뷰

```text
src/test/java/com/side/temp
├─ api/
│  └─ controller/
│     ├─ RestCrudControllerTest.java
│     └─ RestSwaggerControllerTest.java
│
├─ api/
│  └─ docs/
│     ├─ RestCrudOpenApiDocsTest.java
│     └─ RestSwaggerOpenApiDocsTest.java
│
├─ config/
│  └─ swagger/
│     └─ SwaggerConfigTest.java
│
└─ architecture/
   ├─ ControllerDocsContractTest.java
   └─ DtoDocsSyncTest.java
```

---

## 4. Controller TDD 스니펫

### 4.1 CRUD 단건 조회 테스트 요청

```md
RestCrudController의 단건 조회 API를 TDD 방식으로 작성해줘.

대상:
- GET /api/v1/crud/{id}

검증:
- status 200
- 응답 JSON에 title, contents가 존재해야 한다.
- 응답 타입은 CrudResponse 기준이어야 한다.
- ResponseEntity<?> 사용을 피하고 ResponseEntity<CrudResponse> 형태를 기대한다.

테스트 도구:
- JUnit 5
- MockMvc
- AssertJ

먼저 실패하는 테스트를 작성하고, 그 테스트를 통과시키기 위한 최소 Controller 코드도 같이 보여줘.
```

### 예상 테스트 코드 프리뷰

```java
@WebMvcTest(RestCrudController.class)
class RestCrudControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldFindCrudById() throws Exception {
        mockMvc.perform(get("/api/v1/crud/{id}", 1L))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").exists())
            .andExpect(jsonPath("$.contents").exists());
    }
}
```

---

## 5. Validation TDD 스니펫

### 5.1 생성 요청 validation 실패 테스트 요청

```md
CrudRequest의 validation 규칙을 기준으로 POST /api/v1/crud 테스트를 TDD 방식으로 작성해줘.

대상:
- POST /api/v1/crud

검증:
- title이 빈 문자열이면 400 Bad Request
- title이 100자를 초과하면 400 Bad Request
- contents가 2000자를 초과하면 400 Bad Request
- 정상 요청이면 200 또는 201 응답

조건:
- Controller 메서드에는 @Valid @RequestBody CrudRequest가 있어야 한다.
- 실패 응답은 ProblemDetail 또는 공통 ErrorResponse 중 하나로 정리할 수 있게 작성한다.
```

### 예상 테스트 코드 프리뷰

```java
@WebMvcTest(RestCrudController.class)
class RestCrudControllerValidationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldReturnBadRequestWhenTitleIsBlank() throws Exception {
        var request = Map.of(
            "title", "",
            "contents", "내용입니다."
        );

        mockMvc.perform(post("/api/v1/crud")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }
}
```

---

## 6. Swagger 문서 TDD 스니펫

### 6.1 OpenAPI path 노출 테스트 요청

```md
Swagger 문서가 실제 API와 일치하는지 검증하는 TDD 테스트를 작성해줘.

대상:
- /v3/api-docs
- /api/v1/crud
- /api/v1/crud/{id}

검증:
- OpenAPI JSON의 paths에 /api/v1/crud가 존재해야 한다.
- GET, POST, PUT, DELETE operation이 존재해야 한다.
- 각 operation에 summary, responses가 있어야 한다.
- POST/PUT에는 requestBody가 있어야 한다.
- 단건 GET 응답 schema는 CrudResponseDocs를 기준으로 노출되어야 한다.
```

### 예상 테스트 코드 프리뷰

```java
@SpringBootTest
@AutoConfigureMockMvc
class RestCrudOpenApiDocsTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldExposeCrudPathsInOpenApiDocs() throws Exception {
        mockMvc.perform(get("/v3/api-docs"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.paths['/api/v1/crud']").exists())
            .andExpect(jsonPath("$.paths['/api/v1/crud/{id}']").exists())
            .andExpect(jsonPath("$.paths['/api/v1/crud'].post.requestBody").exists())
            .andExpect(jsonPath("$.paths['/api/v1/crud/{id}'].get.responses['200']").exists());
    }
}
```

---

## 7. ControllerDocs 계약 테스트 스니펫

### 7.1 Controller가 Docs 인터페이스를 구현하는지 검증 요청

```md
현재 Swagger 문서 분리 정책을 강제하는 테스트를 작성해줘.

정책:
- RestSwaggerController는 RestSwaggerControllerDocs를 implements해야 한다.
- RestCrudController는 RestCrudControllerDocs를 implements해야 한다.
- Controller 구현체에는 Swagger 문서 어노테이션을 최대한 두지 않는다.
- Swagger 문서 어노테이션은 ControllerDocs 인터페이스에 위치한다.

테스트 방식:
- reflection 기반으로 implements 여부를 검증한다.
- @Operation, @ApiResponse, @ApiResponses는 Docs 인터페이스에 존재하는지 검증한다.
```

### 예상 테스트 코드 프리뷰

```java
class ControllerDocsContractTest {

    @Test
    void restCrudControllerShouldImplementDocsInterface() {
        assertThat(RestCrudControllerDocs.class)
            .isAssignableFrom(RestCrudController.class);
    }

    @Test
    void restSwaggerControllerShouldImplementDocsInterface() {
        assertThat(RestSwaggerControllerDocs.class)
            .isAssignableFrom(RestSwaggerController.class);
    }
}
```

---

## 8. DTO Docs 동기화 테스트 스니펫

### 8.1 실제 DTO와 Docs DTO 필드 누락 검증 요청

```md
실제 DTO와 Swagger Docs DTO의 필드 동기화 테스트를 작성해줘.

대상:
- CrudRequest ↔ CrudRequestDocs
- CrudResponse ↔ CrudResponseDocs
- SwaggerRequest ↔ SwaggerRequestDocs
- SwaggerResponse ↔ SwaggerResponseDocs

검증:
- 실제 DTO에 존재하는 필드는 Docs DTO에도 존재해야 한다.
- Docs DTO에만 존재하는 필드는 허용하지 않는다.
- 필드명 불일치 시 테스트가 실패해야 한다.

목적:
- Docs DTO 분리 구조에서 문서 누락을 방지한다.
```

### 예상 테스트 코드 프리뷰

```java
class DtoDocsSyncTest {

    @Test
    void crudRequestAndDocsShouldHaveSameFields() {
        assertSameFieldNames(CrudRequest.class, CrudRequestDocs.class);
    }

    private void assertSameFieldNames(Class<?> actualDto, Class<?> docsDto) {
        var actualFields = Arrays.stream(actualDto.getDeclaredFields())
            .map(Field::getName)
            .collect(Collectors.toSet());

        var docsFields = Arrays.stream(docsDto.getDeclaredFields())
            .map(Field::getName)
            .collect(Collectors.toSet());

        assertThat(docsFields).containsExactlyInAnyOrderElementsOf(actualFields);
    }
}
```

---

## 9. SwaggerConfig TDD 스니펫

### 9.1 SecurityScheme 검증 요청

```md
SwaggerConfig의 SecurityScheme 구성을 테스트해줘.

현재 구조:
- accessToken
- refreshToken
- type: APIKEY
- in: HEADER

검증:
- OpenAPI components.securitySchemes에 accessToken이 존재해야 한다.
- OpenAPI components.securitySchemes에 refreshToken이 존재해야 한다.
- 각 scheme의 in 값은 header여야 한다.
- name 값은 각각 accessToken, refreshToken이어야 한다.

추가로 개선 테스트:
- Authorization Bearer 방식으로 변경할 경우 기대 테스트도 같이 작성해줘.
```

### 예상 테스트 코드 프리뷰

```java
@SpringBootTest
class SwaggerConfigTest {

    @Autowired
    private OpenAPI openAPI;

    @Test
    void shouldRegisterAccessTokenAndRefreshTokenSecuritySchemes() {
        var schemes = openAPI.getComponents().getSecuritySchemes();

        assertThat(schemes).containsKeys("accessToken", "refreshToken");
        assertThat(schemes.get("accessToken").getIn()).isEqualTo(SecurityScheme.In.HEADER);
        assertThat(schemes.get("refreshToken").getIn()).isEqualTo(SecurityScheme.In.HEADER);
    }
}
```

---

## 10. 리팩토링 요청형 TDD 스니펫

```md
아래 리팩토링 목표를 기준으로 TDD 테스트를 먼저 작성하고, 이후 최소 수정 코드를 제안해줘.

리팩토링 목표:
1. RestCrudController가 RestCrudControllerDocs를 implements하도록 변경한다.
2. ResponseEntity<?>를 명확한 타입으로 변경한다.
   - 단건 조회: ResponseEntity<CrudResponse>
   - 전체 조회: ResponseEntity<List<CrudResponse>>
   - 생성/수정: ResponseEntity<CrudResponse>
   - 삭제: ResponseEntity<Void>
3. Swagger 문서 어노테이션은 ControllerDocs에 위치시킨다.
4. Controller에는 Spring MVC 동작 어노테이션만 남긴다.
5. Docs DTO와 실제 DTO 필드가 불일치하면 테스트가 실패해야 한다.

출력:
- 실패 테스트
- 리팩토링 후 통과 테스트
- 변경 전/변경 후 코드 비교
- 실무적으로 유지할 규칙
```

---

## 11. 실무형 TDD 요청 스니펫

```md
현재 Swagger/CRUD 예제 구조를 실무형으로 개선한다고 가정하고 TDD 계획과 테스트 코드를 작성해줘.

실무 기준:
- Controller는 얇게 유지한다.
- Service 계층을 추가한다.
- Controller 테스트는 Service를 MockBean 처리한다.
- Service 테스트는 순수 단위 테스트로 작성한다.
- Swagger 문서 테스트는 OpenAPI JSON 검증으로 작성한다.
- validation 실패는 공통 예외 응답으로 검증한다.
- Swagger 문서와 실제 API 동작이 어긋나면 테스트가 실패해야 한다.

생성할 테스트:
1. RestCrudControllerTest
2. CrudServiceTest
3. RestCrudOpenApiDocsTest
4. ControllerDocsContractTest
5. DtoDocsSyncTest

각 테스트마다:
- given
- when
- then
- 기대 실패 원인
- 통과시키기 위한 최소 구현
을 같이 작성해줘.
```

---

## 12. 가장 먼저 요청하면 좋은 TDD 프롬프트

아래 프롬프트를 가장 먼저 사용하는 것을 추천합니다.

```md
업로드한 Swagger/CRUD README와 리뷰 MD를 기준으로, RestCrudController부터 TDD 방식으로 개선해줘.

우선순위:
1. RestCrudController가 RestCrudControllerDocs를 implements하도록 강제하는 테스트
2. GET /api/v1/crud/{id} 정상 응답 테스트
3. POST /api/v1/crud validation 실패 테스트
4. /v3/api-docs에 CRUD path와 requestBody/response schema가 노출되는지 테스트
5. ResponseEntity<?>를 명확한 타입으로 바꾸도록 유도하는 테스트

먼저 테스트 코드만 작성해줘.
그 다음 테스트를 통과시키는 최소 프로덕션 코드를 작성해줘.
마지막으로 현재 구조에서 유지해야 할 Swagger 작성 규칙을 정리해줘.
```

---

## 13. TDD 결과물 예시 목차

```text
1. 현재 구조에서 테스트가 필요한 이유
2. 실패 테스트 작성
3. 실패 원인 설명
4. 최소 구현 코드 작성
5. 테스트 통과 확인
6. 리팩토링
7. Swagger 문서 검증
8. 실무 적용 여부 판단
9. 남은 개선사항
```

---

## 14. 주의할 점

```md
주의:
- Swagger 문서 테스트는 너무 세부적인 JSON 경로까지 과하게 고정하면 리팩토링에 취약해질 수 있다.
- 하지만 path, method, requestBody, response schema, securityScheme 정도는 테스트로 고정할 가치가 있다.
- Docs DTO를 분리한다면 필드 동기화 테스트는 거의 필수다.
- ControllerDocs 인터페이스 분리 패턴을 선택했다면 implements 여부를 테스트로 강제하는 것이 좋다.
- 단순 예제 CRUD라면 Docs DTO 분리보다 실제 DTO에 @Schema를 직접 붙이는 방식이 더 효율적일 수 있다.
```
