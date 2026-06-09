# Swagger/CRUD 구조 분석 보고서

본 문서는 `src/main/java/com/side/temp/` 하위의 Swagger 및 CRUD 관련 소스 코드와 `docs/README.md`를 바탕으로 분석한 결과 보고서입니다.

---

## 0. 현 구조 요약
- **전역 설정**: `SwaggerConfig`를 통해 OpenAPI 메타데이터, 보안 스킴(accessToken, refreshToken), 서버 목록 및 그룹(v1, v1-user, v1-admin)을 관리합니다.
- **문서 분리 패턴**: `Controller`와 Swagger 어노테이션을 담은 `ControllerDocs` 인터페이스를 분리하여 구현체의 가독성을 높였습니다.
- **DTO 분리 패턴**: 실제 비즈니스 로직에 사용되는 `DTO`와 문서용 `DocsDTO`를 분리하고, `Spec` 인터페이스를 통해 필드 일관성을 유지합니다.
- **공통 상수**: `SwaggerDictionary`를 활용하여 문서 내 문구를 표준화하였습니다.

---

## 1. 리팩토링 (Refactoring)
- **일관성 확보**: `RestCrudController`에서 `RestCrudControllerDocs` 구현(implements)이 주석 처리되어 있습니다. 모든 컨트롤러에 동일한 문서 분리 패턴을 적용하여 일관성을 유지해야 합니다.
- **패키지 구조 재정립**: 
    - `SwaggerRequest`는 `api.schema.dto`에, `CrudRequest`는 `domain.dto`에 위치하여 일관성이 부족합니다. 
    - Swagger 전용 Docs DTO와 실제 비즈니스 DTO의 위치 기준을 명확히 할 필요가 있습니다.
- **반환 타입 명시**: `ResponseEntity<?>` 대신 `ResponseEntity<T>` 형태를 지향하거나, `ControllerDocs`에서 `@ApiResponse`의 `content` 속성을 통해 실제 반환 스키마를 100% 누락 없이 명시해야 합니다.
- **Spec 인터페이스 확장**: `SwaggerRequestSpec`과 같은 필드 일원화 패턴을 `CrudRequest` 등 다른 주요 DTO에도 확장 적용하여 필드명 불일치 위험을 줄일 수 있습니다.

## 2. 실무 적합성 (Practicality)
- **대규모 프로젝트 적합**: 코드와 문서를 분리하는 방식은 컨트롤러 소스 코드가 비대해지는 것을 방지하므로 실무 대규모 프로젝트에서 선호되는 방식입니다.
- **보안 스킴**: 현재 `accessToken`, `refreshToken`을 각각 Header(APIKEY)로 받는 방식은 특수 케이스입니다. 일반적인 실무 표준인 `Authorization: Bearer <JWT>` 방식(HTTP Bearer)으로의 단일화 또는 병행 지원을 검토할 수 있습니다.
- **DocsDTO의 유지보수성**: 실무에서는 문서 품질을 극도로 챙겨야 하는 경우가 아니면 DTO가 2배로 늘어나는 부담 때문에 실DTO에 `@Schema`를 직접 붙이는 방식을 섞어 쓰기도 합니다. 현재 방식은 "문서 품질"에 아주 최적화되어 있습니다.

## 3. 효율성 (Efficiency)
- **작성 효율**: 초기 작성 시에는 인터페이스, Specs, DocsDTO 등 생성할 파일이 많아 속도가 더딜 수 있습니다.
- **변경 효율**: 필드 하나가 추가될 때 `Spec`, `DTO`, `DocsDTO` 세 곳을 수정해야 하므로 변경 시 실수가 발생할 확률이 높습니다.
- **재사용성**: `SwaggerDictionary`를 통한 문구 관리와 `Spec` 인터페이스를 통한 필드 공유는 중복을 줄이고 일관성을 높이는 매우 효율적인 접근입니다.

## 4. 개선사항 (Improvements)
- **에러 응답 스키마 상세화**: 현재 400, 404, 500 응답에 대한 `description`은 있으나, 실제 에러 바디(`ErrorResponse`)의 `implementation`이 누락된 경우가 많습니다.
- **Validation-Schema 연동**: `CrudRequest`의 `@Size(max=100)` 같은 제약 조건이 `CrudRequestDocs`의 `@Schema(maxLength=100)`와 수동으로 일치시켜야 하는 구조입니다. 이를 자동화하거나 검증하는 로직이 필요합니다.
- **스키마 네이밍 충돌 방지**: `@Schema(name = "CrudRequest")`와 같이 실제 클래스명과 동일한 이름을 부여할 경우, OpenAPI context 내에서 충돌이 발생할 수 있으므로 `CrudRequestDoc`과 같은 명명 규칙을 권장합니다.

## 5. 검증 작업 (Validation)
- **필드 불일치 테스트**: Reflection을 활용하여 `Request`와 `RequestDocs`의 필드명 및 타입을 비교하는 단위 테스트를 작성하여 drift를 방지해야 합니다.
- **Swagger 스펙 스냅샷 테스트**: 배포 시마다 `/v3/api-docs` 결과물을 JSON으로 저장하고, 이전 버전과 비교(Diff)하여 의도치 않은 변경이 없는지 검증하는 CI 파이프라인 구축을 권장합니다.
- **보안 동작 검증**: Swagger UI의 `Authorize` 기능을 통해 토큰이 실제 헤더에 올바르게 주입되는지, 인증이 필요한 API에서 정상 동작하는지 검증이 필요합니다.
