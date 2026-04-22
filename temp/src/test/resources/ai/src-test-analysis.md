# `src/test/` 분석 정리

이 문서는 `src/test/` 폴더의 구성과 각 테스트 파일의 의도/범위를 빠르게 파악하기 위한 요약입니다.

## 폴더/파일 구성

- **`src/test/java/`**
  - **`com.side.temp.TempApplicationTests`**
    - `@SpringBootTest` 기반의 기본 컨텍스트 로딩 테스트(스프링 부트 템플릿 성격).
  - **`com.side.java17.after.biz.service.SampleServiceTest`**
    - 현재 내용이 비어 있는 스켈레톤(확장 예정).
  - **`com.side.java17.after.biz.service.practice.*`**
    - 컨트롤러/서비스/리포지토리/통합 테스트의 “형태”를 연습하기 위한 예제 모음.
  - **`com.side.java17.after.biz.service._20260421.*`**
    - Java 날짜/record/유틸/스트림(함수형) 관련 “과제 풀이” 형태의 테스트 모음(일부 답안 TODO).

- **`src/test/resources/`**
  - **`README.md`**
    - TDD의 의의(동일 입력 → 동일 결과)와 “입력값을 부여해 결과 예측이 성공하면 통과”라는 진행 규칙을 안내.
  - **`logback-test.xml`**
    - 테스트 실행 시 콘솔 로그 패턴 설정(루트 레벨 `DEBUG`).
  - **`quest/20260421.md`**
    - `LocalDate`, `Record`, `Util`, `Stream/Optional/Supplier` 등 학습 주제와 문제(요구사항) 목록.

## 공통적으로 사용하는 기술 스택/패턴

- **테스트 프레임워크**: JUnit 5(`@Test`, `@BeforeEach`, `@DisplayName`, `@ParameterizedTest`)
- **Assertion**: AssertJ(`assertThat(...).usingRecursiveComparison() ...`)
- **Mocking**: Mockito JUnit5 확장(`@ExtendWith(MockitoExtension.class)`, `@Mock`, `@InjectMocks`)
- **Spring 테스트 슬라이스/통합**
  - `@WebMvcTest` + `MockMvc`로 컨트롤러 단위 테스트 형태 예시
  - `@SpringBootTest` 기반(템플릿/통합 테스트 의도) — 다만 일부 클래스는 애노테이션이 주석 처리되어 있음
- **프로파일**: 여러 테스트에 `@ActiveProfiles("local")` 사용
- **로깅**: `@Slf4j` + `log.debug(...)`

## 패키지별 상세 분석

### `com.side.temp.TempApplicationTests`

- **목적**: 스프링 컨텍스트가 깨지지 않고 로딩되는지 확인하는 기본 테스트.
- **특징**: 실제 검증 로직은 없고 `contextLoads()`만 존재.

### `com.side.java17.after.biz.service.practice`

#### `PracticeTest`

- **목적**: JUnit5 기본/파라미터 테스트/레코드 활용/재귀 비교(Assertion) 예시 제공.
- **주요 포인트**
  - 내부 `record TestRequest(LocalDateTime date) {}`로 “불변 DTO” 느낌을 보여줌.
  - `@ParameterizedTest` + `@ValueSource`로 멀티 케이스 테스트 샘플 제공.
  - `usingRecursiveComparison()`으로 객체 비교 예시.
  - `SampleRecord`는 builder로 생성되지만 필드 세팅은 비어 있어 비교 결과가 의도대로 나오는지 주의 필요(예제 성격).

#### `ControllerTest`

- **목적**: `@WebMvcTest` 기반 컨트롤러 단위 테스트 형태 예시.
- **구성**
  - `MockMvc`로 `GET "/url"` 호출 후 `status().isOk()`, `jsonPath("$.data", notNullValue())` 검증.
  - 컨트롤러 의존 서비스는 `@MockitoBean`으로 대체(`SampleService`).
- **주의**
  - `ObjectMapper` import가 `tools.jackson.databind.ObjectMapper`로 되어 있어, 일반적인 `com.fasterxml.jackson.databind.ObjectMapper`와 다를 수 있음(프로젝트 의존성/패키지 확인 필요).
  - 실제로 `/url` 매핑이 `RestTemp2Controller`에 존재하고, 응답에 `data` 필드가 있어야 테스트가 통과.

#### `ServiceTest`

- **목적**: Mockito 기반 서비스 단위 테스트 형태 예시(`Repository` mock 주입).
- **구성**
  - `@Mock SampleRepository`, `@InjectMocks SampleService`
  - `when(sampleRepository.save(any(SampleRecord.class))).thenReturn(response);`
  - `usingRecursiveComparison().ignoringFields("")` 형태(현재는 빈 문자열이라 무의미/오타 가능성).
- **주의**
  - 실제 서비스 메소드 호출 없이 `response`와 `request`를 비교하고 있어 “테스트 형태” 예시로 보는 게 자연스러움(실제 검증 로직 확장 필요).

#### `RepositoryTest`

- **목적**: Repository 테스트 형태 예시(`save` 후 `findById` 검증).
- **구성**
  - `@DataJpaTest`가 주석 처리되어 있지만, `@Autowired SampleRepository`를 사용 중.
  - `save(request)` 후 `findById(id)` 비교 시 `id/createdDate/createdAt` 무시.
- **주의**
  - 현재 상태로는 스프링 테스트 컨텍스트 설정이 없으면 `@Autowired`가 동작하지 않음.
  - `SampleRepository`의 제네릭 타입이 엔티티가 아닌 `SampleRecord`로 보이는 호출이 있어, 실제 구현과 불일치 가능성(예제/작성 중 상태일 수 있음).

#### `IntegrationTest`

- **목적**: 스프링 부트 통합 테스트 형태 예시.
- **주의**
  - `@SpringBootTest`가 주석 처리되어 있으므로, `@Autowired` 필드가 있는 현재 상태에서는 테스트 실행 시 실패 가능성이 큼.
  - 본문 테스트는 `assertThat(true).isTrue();`로 스모크 테스트 성격.

#### `PracticeRequest`

- **목적**: 검증 애노테이션(`jakarta.validation`)이 붙은 요청 DTO 예시.
- **특징**
  - `@NotBlank` 등 기본 검증 사용.
  - 확장 예시(재고/가격/패턴/이메일/약관 동의 등)는 주석 처리되어 있음.

### `com.side.java17.after.biz.service._20260421`

이 패키지는 `src/test/resources/quest/20260421.md`의 문제를 코드로 풀기 위한 “학습/과제 테스트” 성격입니다.

#### `LocalDateTest`

- **목적**: `LocalDate` 생성/계산/범위 관련 과제(답안 메소드 `getAnswer1~3`는 비어 있음).
- **현재 상태**: 기본 예제 테스트 2개만 구현.

#### `RecordTest`

- **목적**
  - 클래스 기반 DTO(`SampleRequest`)와 record/record 기반 DTO(`SampleRecord`) 비교 예시
  - `jakarta.validation` Validator로 유효성 검증 예시
  - record 작성/필수값 검증 로직 추가 과제(`getAnswer1~2` 비어 있음)
- **특징**
  - `validator.validate(sampleRequest)` 결과가 empty인지 검증.
  - `TestOneRequest`에 `saleDate`를 `BASIC_ISO_DATE`로 파싱해 주입하는 예시 포함.

#### `UtilTest`

- **목적**: `StringUtils.hasText`, `CollectionUtils.isEmpty` 등을 사용한 null/empty 체크 패턴 학습.
- **현재 상태**
  - “기존 방식(getBefore)”과 “유틸 사용(getAfter)” 예제는 구현됨.
  - `str/map/list`에 대한 추측 과제(`getAnswer1~3`)는 비어 있음.
- **데이터 세팅**
  - `str`: `null`, `""`, `" "`, `"글자"`
  - `map`: key별로 `null`, 빈 map, 값 map
  - `list`: `null`, 빈 list, 값 list

#### `StreamTest`

- **목적**: Stream/Optional/Supplier의 개념과 “지연 실행(Supplier)” 차이를 과제로 체득.
- **현재 상태**
  - 기본 크기 검증(`list.size() == 6`)만 구현.
  - 합계/필터/정렬/에러 처리 과제(`getAnswer1~5`)는 주석 또는 비어 있음.
- **주의**
  - `getMethod()`는 `getError(true)`에서 즉시 예외가 발생하므로, `MethodSource` 공급 단계에서 테스트가 터질 수 있음.
  - `getSupplier()`는 Supplier로 감싸 “실행 시점”을 늦출 수 있는 형태(과제 의도).

## 실행/유지보수 관점에서의 체크포인트

- **테스트가 “예제/과제”인지 “CI 통과 대상”인지 구분 필요**
  - 빈 메소드/주석 처리된 설정이 많아, 그대로 CI에 포함되면 실패하거나 의미 없는 테스트가 될 수 있음.
- **Spring 애노테이션 주석 상태 확인**
  - `IntegrationTest`, `RepositoryTest`처럼 `@Autowired`를 쓰면서 컨텍스트 부트스트랩 애노테이션이 주석인 케이스는 실행 실패 가능성이 높음.
- **ControllerTest의 ObjectMapper 패키지**
  - `tools.jackson...` 사용이 의도된 것인지 확인 필요(일반 Jackson과 다르면 직렬화 동작이 달라질 수 있음).

