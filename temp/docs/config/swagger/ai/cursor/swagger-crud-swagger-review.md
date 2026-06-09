## 질문 내용

@docs/config/swagger/README.md 파일과 @\\wsl$\Ubuntu\home\shoon0615\workSpace\side_project\temp\ 해당 폴더를 분석하여 현재 구성된 Swagger/CRUD 의 Swagger 구조를 확인해보고 하기 내용에 대해 필요한 부분이 없는지 확인해서 @docs/config 해당 폴더에 md 파일로 정리해줘.
1. 리팩토링
2. 실무에 일반적으로 사용되는지 혹은 적합한지
3. 효율적인지
4. 개선사항
5. 검증 작업

---

## 응답 내용

목표는 현재 프로젝트의 Swagger(OpenAPI) 구성과 CRUD 문서화 구조를 빠르게 파악한 뒤,  
실무 적합성/효율/리팩토링/개선/검증 관점에서 빠진 부분을 체크해서 docs/config/ 아래에 정리 문서를 만들어두는 겁니다.  
우선 docs/config/swagger/README.md와 실제 Swagger 설정/스펙 파일들을 찾아 구조를 확인하겠습니다.  
  
구성 파일/컨트롤러/스키마 DTO까지 Swagger 관련 코드가 꽤 체계적으로 분리돼 있네요.  
다음으로 docs/config/swagger/README.md와 핵심 설정 파일(SwaggerConfig, 컨트롤러/Docs, Request/Response 스키마)을  
읽어서 “현재 Swagger 구조”를 먼저 정확히 요약한 뒤, 요청하신 5가지 관점으로 체크리스트/개선안을 문서로 만들겠습니다.  
  
지금까지 확인한 바로는 SwaggerConfig(전역 설정+그룹) + Controller 구현과 ControllerDocs 인터페이스를 분리하고,  
실제 DTO와 문서용 DTO를 분리하는 패턴으로 구성돼 있습니다.  
이제 CRUD 쪽(RestCrudController*, Crud*Docs, SwaggerDictionary)과 더미 설정까지 읽어서,  
“실무 적합성/효율/리팩토링/개선/검증” 체크리스트를 빠짐없이 뽑아 문서로 정리하겠습니다. 

---

## 정리 문서 생성 완료
docs/config/swagger-crud-swagger-review.md에 현재 Swagger/CRUD Swagger 구조 요약과 함께,  
요청하신 항목별로 빠진 부분/개선/검증 체크리스트를 정리해두었습니다.  
  
- 파일: docs/config/swagger-crud-swagger-review.md  
- 포함 내용  
  - 현재 구조: SwaggerConfig(OpenAPI+GroupedOpenApi) / Controller vs ControllerDocs / 실DTO vs DocsDTO  
  1) 리팩토링: CRUD 쪽 ControllerDocs 적용 불일치, DocsDTO/Spec 역할 분리, 응답 타입 정리, SwaggerResponseDocs 누락 필드 등
  2) 실무 적합성: 그룹 분리/Docs 분리/DocsDTO 분리의 실무 사용성 및 유지비 트레이드오프, 토큰 헤더 방식의 비표준성
  3) 효율성: 초기 속도 vs 장기 유지비, 경량화/규칙강화 2가지 운영 방향
  4) 개선사항: 버전/서버/보안 요구조건(SecurityRequirement), 표준 에러 스키마, validation 에러 문서화, schema name 충돌 방지 규칙
  5) 검증 작업: Swagger UI//v3/api-docs 산출물 확인, 스펙 스냅샷 diff, DTO 불일치/에러응답/보안 동작 검증 체크리스트

---
---
---

## Swagger/CRUD Swagger 구조 점검 (현 구성 분석 + 개선/검증)

대상: `docs/config/swagger/README.md` 및 `src/main/java/com/side/temp/**` 내 Swagger 관련 구성

---

## 0. 현재 구성된 Swagger(OpenAPI) 구조 요약

- **전역 설정**: `com.side.temp.config.swagger.SwaggerConfig`
  - `SpringDocUtils`로 날짜/시간 타입을 `string`으로 치환
  - `OpenAPI`에 `Info`, `Components(SecuritySchemes)`, `Servers` 설정
  - `GroupedOpenApi`로 경로 기반 그룹 3개 분리
    - `v1`: `/api/v1/**`
    - `v1-user`: `/api/user/**` (customizer로 info/components/servers 재주입)
    - `v1-admin`: `/api/admin/**` (customizer에서 `openAPI("v1")` 재사용)

- **문서 작성 패턴**: “동작(Controller)”과 “문서(ControllerDocs interface)” 분리
  - Swagger 예제는 `RestSwaggerController implements RestSwaggerControllerDocs` 형태로 실제 적용 중
  - CRUD 예제는 `RestCrudControllerDocs`는 존재하지만, `RestCrudController`에서 `implements`가 주석 처리되어 **현재는 분리 패턴이 강제되지 않음**

- **DTO 패턴**: “실DTO(Validation 중심)”과 “문서DTO(@Schema 중심)” 분리
  - 실DTO: `domain.dto.*` 또는 `api.schema.dto.*` 내 request/response
  - 문서DTO: `api.schema.dto.*Docs` 또는 `.../schema/*Docs`
  - `SwaggerRequest`/`SwaggerRequestDocs`는 `SwaggerRequestSpec`을 통해 필드 정의(문구) 일원화 시도

---

## 1. 리팩토링(구조/중복/오류 가능성 낮추기)

- **(권장) ControllerDocs 적용 방식 통일**
  - 현재 Swagger 예제는 `implements RestSwaggerControllerDocs`로 적용되지만, CRUD는 주석 처리되어 있어 일관성이 깨집니다.
  - 선택지
    - **A안(현 패턴 유지)**: CRUD도 `implements RestCrudControllerDocs`로 통일
    - **B안(실무 선호)**: `@Operation/@ApiResponse`를 “Controller 메서드”에 직접 붙이고, `Docs interface`는 제거(또는 공통 메타만 남김)
  - 실무에서는 A/B 둘 다 존재하지만, 팀 규모/문서 규칙이 없으면 A안은 유지 비용이 빠르게 올라갑니다.

- **(권장) 실DTO vs DocsDTO 분리 기준 명확화**
  - 장점: 문서 품질을 컨트롤 가능(예시/설명/필수 여부 등)
  - 단점: DTO가 2배로 늘어 **유지 비용 증가**, 불일치 위험 증가
  - 최소 규칙 권장
    - DocsDTO는 “예시/설명/표시용 메타”만 담고, 실DTO와 1:1 매핑 규칙을 문서화
    - “DocsDTO name 충돌”을 피하기 위한 네이밍 규칙 고정(아래 4번 개선사항 참고)

- **(권장) `SwaggerRequestSpec` 역할 분리**
  - 현재 `SwaggerRequestSpec`는 “상수(문구)” + “필드 시그니처(title(), contents())”를 함께 가집니다.
  - 문구는 별도 상수 클래스로(예: `SwaggerFieldDictionary`), 시그니처는 타입 계약으로 분리하면 단일 책임이 명확해집니다.

- **(개선) 응답 타입 정리**
  - `RestSwaggerController.create/modify/delete`, `RestCrudController.*`가 `ResponseEntity.ok(HttpStatus.OK)` 형태인데, body에 `HttpStatus`가 들어가 문서/실동작 모두에서 혼동을 유발합니다.
  - 실무에선 보통 아래 중 하나로 통일합니다.
    - 200 + 비즈니스 응답 바디(`{ "result": "...", "data": ... }`)
    - 201/204 등 HTTP 의미에 맞춘 status + 바디(또는 no-content)

- **(개선) `SwaggerResponseDocs`가 일부 필드만 문서화**
  - `getContents()`가 주석 처리되어 있어 응답 스키마가 실제 응답과 다르게 보일 수 있습니다.

---

## 2. 실무에서 일반적으로 사용되는지 / 적합한지

- **GroupedOpenApi(그룹 분리)**: 실무에서 흔합니다.
  - 다만 보통은 “도메인/서비스 경계” 또는 “인증 레벨(외부/내부/관리자)” 기준으로 그룹을 나누고,
  - 그룹별 `Info/Servers/Security`가 정말 달라야 할 때만 customizer로 재정의합니다.

- **ControllerDocs 인터페이스 분리**: 실무에서도 쓰이지만 팀 규칙/자동화가 없으면 과해질 수 있습니다.
  - 장점: 구현 코드가 깔끔해지고 문서 스펙을 한 곳에서 관리 가능
  - 단점: 메서드 시그니처/어노테이션 동기화가 필요(리팩토링 때 누락 위험)

- **DocsDTO 분리**: “문서 품질을 매우 중요하게 보는 조직”에서 사용되지만, 일반적으로는 과한 편일 수 있습니다.
  - 실무 다수는 실DTO에 `@Schema`를 같이 붙이거나, `@Schema`를 최소화하고 예시/설명은 꼭 필요한 엔드포인트만 강화합니다.

- **SecurityScheme를 `accessToken`/`refreshToken` 헤더(APIKEY)로 2개 등록**: 실무 표준과는 거리가 있습니다.
  - 일반적으로는 `Authorization: Bearer <token>` 1개로 통일하고,
  - refresh token은 “별도 쿠키/별도 엔드포인트 바디/보안 저장소”로 처리하는 경우가 많습니다.

---

## 3. 효율적인지(작성/유지/확장 관점)

- **초기 작성 속도**: 현재 방식은 “샘플/학습”에는 효율적입니다(패턴이 명확).
- **중장기 유지 비용**: ControllerDocs + DocsDTO 분리가 함께 적용되면 유지 비용이 높아집니다.
  - 엔드포인트가 늘어날수록 “문서 변경/DTO 변경/검증”이 2~3군데로 분산됩니다.

효율을 높이려면 아래 중 하나를 권장합니다.

- **경량화 방향**: 실DTO에 `@Schema`만 최소 부착 + 일부 핵심 API만 `@ApiResponses/@ExampleObject` 강화
- **강한 규칙 방향**: Docs interface/DocsDTO 유지하되, 규칙을 문서화하고 검증(테스트/CI)을 반드시 붙여 불일치를 자동 탐지

---

## 4. 개선사항(빠진 부분/권장 표준/안전장치)

### 4.1 OpenAPI 메타/버전/서버/보안 구성

- **버전 주입 방식 개선**
  - `openAPI(@Value("v1") String apiVersion)`은 상수 주입이라 환경/버전 변경에 취약합니다.
  - `application.yml`(또는 build info) 기반으로 `api.version`, `api.title` 등을 분리하는 것이 일반적입니다.

- **Servers 설정 정리**
  - `/` + 외부 예제 서버(`jsonplaceholder`)는 학습용으론 좋지만, 실무에서는 혼선을 줍니다.
  - 권장: 프로파일(dev/stage/prod)별로 서버 목록을 분리하고, 기본은 현재 호스트 자동(servers 미지정) 또는 1개만 유지.

- **SecuritySchemes 표준화 + SecurityRequirement 추가**
  - 현재 `components`에는 scheme만 있고, “어떤 API가 어떤 scheme을 요구하는지”가 전역/엔드포인트에 명시되지 않은 상태일 가능성이 큽니다.
  - 권장: `HTTP bearer` + `Authorization`로 통일하고, 전역 `SecurityRequirement` 또는 그룹/엔드포인트 단위로 요구 조건을 명시.

### 4.2 응답/에러 스키마 문서화(실무 필수 영역)

- **표준 에러 응답 스키마 부재**
  - `400/404/500` 등 응답코드는 선언돼 있지만, 에러 바디의 schema가 명확히 정의되지 않았습니다.
  - 권장: 공통 에러 응답(`ErrorResponse`) 스키마를 만들고, `@ApiResponse(content=@Content(schema=...))`로 연결.

- **Validation 결과 문서화**
  - `@Valid` 사용 시 실제로는 400 + 필드 에러가 내려가는데, 그 형태가 문서에 없으면 소비자(프론트/외부)가 구현을 추측해야 합니다.

### 4.3 네이밍/스키마 충돌 방지 규칙

- **DocsDTO name 충돌 위험**
  - `@Schema(name="CrudRequest")`처럼 실DTO와 동일 name을 사용하면 springdoc가 스키마를 재사용/대체할 수 있습니다.
  - 권장 규칙 예시
    - DocsDTO: `CrudRequestDoc` / `CrudRequestDocs`처럼 **별도 name** 부여
    - 또는 `@Schema(name="CrudRequestDoc")`로 고정
    - 프로젝트 전반에 “실DTO와 DocsDTO schema name은 절대 동일 금지” 같은 규칙을 두는 편이 안전합니다.

### 4.4 Controller/Docs 분리 패턴의 안전장치

- CRUD처럼 `implements`가 빠지면 문서 스펙이 분리돼 있어도 적용이 누락될 수 있습니다.
- 권장: 패턴을 유지한다면 아래 중 하나로 “누락 방지”를 걸어두는 편이 좋습니다.
  - 컴파일 레벨에서 강제(implements 고정)
  - 또는 문서 작성은 Controller에 직접(분리 제거)

---

## 5. 검증 작업(“정확한 Swagger”를 보장하는 체크리스트)

### 5.1 실행/산출물 검증

- **Swagger UI 확인**
  - 그룹 탭(v1/user/admin)이 의도대로 분리되는지
  - 각 엔드포인트의 request/response schema가 실제 DTO와 일치하는지

- **OpenAPI JSON 스냅샷**
  - `/v3/api-docs` 및 그룹별(`.../v3/api-docs/{group}`) 산출물이 안정적으로 생성되는지 확인
  - PR/배포마다 스펙이 의도치 않게 바뀌지 않도록 스냅샷 비교(“diff”)를 권장

### 5.2 계약(Contract) 관점 검증

- **DTO 불일치 탐지**
  - DocsDTO를 유지한다면 “실DTO ↔ DocsDTO” 불일치를 잡는 자동 검증이 필요합니다.
  - 예: 필수 필드(required) / maxLength / 필드명 변경 / nullable 여부 변경

- **에러 응답 검증**
  - `@Valid` 실패(400), 존재하지 않는 리소스(404), 예외(500)에서 실제 응답 바디가 문서와 일치하는지

### 5.3 보안 검증

- **인증 헤더 정책 확인**
  - access/refresh를 헤더 2개로 받는 정책이 실제 서비스 정책과 일치하는지(대부분은 Authorization bearer 1개)
  - Swagger에서 “Authorize” 동작이 실제 요청에 올바른 헤더를 추가하는지

---

## 결론(요약)

- 현재 구조는 “학습/샘플”로는 잘 정리되어 있고, 그룹 분리/문서 분리/DocsDTO 분리는 패턴이 명확합니다.
- 다만 실무 관점에서는 **(1) 보안 스킴 표준화, (2) 에러/Validation 응답 스키마 문서화, (3) DocsDTO/ControllerDocs 유지 비용을 낮추는 규칙/검증 자동화**가 없으면 유지가 어려워질 가능성이 큽니다.

