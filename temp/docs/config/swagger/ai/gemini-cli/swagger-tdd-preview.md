# Swagger/CRUD TDD Preview 스니핏

본 문서는 현재의 Swagger/CRUD 구조에서 TDD(Test Driven Development)를 요청할 경우, 어떤 방식으로 테스트 코드를 생성하고 검증을 진행하는지에 대한 프리뷰입니다.

---

## 1. 개요
현재 구조(ControllerDocs 분리 + DocsDTO 분리)에서는 **"구현체와 문서의 일치성"**을 검증하는 것이 TDD의 핵심입니다.

## 2. 주요 테스트 스니핏

### 2.1 계약(Contract) 일치성 테스트
컨트롤러가 문서 인터페이스를 올바르게 구현하고 있는지, 모든 메서드가 매핑되어 있는지 검증합니다.

```java
@SpringBootTest
class SwaggerContractTest {

    @Autowired
    private ApplicationContext context;

    @Test
    @DisplayName("RestCrudController는 RestCrudControllerDocs를 구현해야 한다")
    void controllerShouldImplementDocsInterface() {
        Object controller = context.getBean(RestCrudController.class);
        assertThat(controller).isInstanceOf(RestCrudControllerDocs.class);
    }
}
```

### 2.2 DTO Symmetry(대칭성) 테스트 (Reflection 활용)
실제 비즈니스 DTO와 문서용 DocsDTO 간에 필드가 누락되거나 이름이 다른지 자동으로 탐지합니다.

```java
class DtoSymmetryTest {

    @Test
    @DisplayName("CrudRequest와 CrudRequestDocs의 필드는 일치해야 한다")
    void verifyCrudRequestSymmetry() {
        Set<String> realFields = Arrays.stream(CrudRequest.class.getDeclaredFields())
                                       .map(Field::getName).collect(Collectors.toSet());
        Set<String> docsFields = Arrays.stream(CrudRequestDocs.class.getDeclaredFields())
                                       .map(Field::getName).collect(Collectors.toSet());

        assertThat(realFields)
            .as("DocsDTO에 실제 DTO의 모든 필드가 포함되어야 함")
            .isEqualTo(docsFields);
    }
}
```

### 2.3 API 응답 스키마 검증 (MockMvc)
실제 API 호출 시 반환되는 데이터 구조가 Swagger에 정의된 DocsDTO 스키마와 구조적으로 일치하는지 확인합니다.

```java
@WebMvcTest(RestCrudController.class)
class CrudApiSchemaTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("조회 API는 CrudResponseDocs 구조에 맞는 필드를 반환해야 한다")
    void findByCrudSchemaCheck() throws Exception {
        mockMvc.perform(get("/api/v1/crud/1"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.title").exists())
               .andExpect(jsonPath("$.contents").exists());
    }
}
```

## 3. TDD 워크플로우 (Gemini CLI 기준)
1. **요구사항 정의**: 신규 API 및 Docs 인터페이스 정의
2. **실패하는 테스트 작성**: 위의 Symmetry 테스트나 Contract 테스트를 먼저 생성
3. **구현**: Controller 및 DTO 작성 (이때 `implements` 누락 시 테스트 실패)
4. **문서화**: DocsDTO 완성
5. **성공 확인**: 모든 필드 및 계약 일치 확인 후 완료

---

## 4. 기대 효과
- **문서 신뢰도 향상**: 코드 변경 시 문서 업데이트 누락을 원천 차단합니다.
- **개발 생산성**: AI가 Specs 인터페이스를 기반으로 DTO와 DocsDTO를 자동으로 생성하여 불일치를 방지합니다.
- **자동 검증**: CI 단계에서 Swagger/OpenAPI JSON을 추출하여 실제 배포 전 스펙을 자동 검증합니다.
