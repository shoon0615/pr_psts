# Swagger Reflection-based TDD Process Simulation

본 문서는 "실제 DTO와 DocsDTO 간의 필드 불일치를 Reflection으로 자동 탐지한다"는 구체적인 요구사항을 TDD(Test Driven Development) 방식으로 어떻게 풀어나가는지 보여주는 프리뷰입니다.

---

## 1. 단계: [RED] 실패하는 테스트 작성
먼저 구현체 없이, 두 클래스의 필드 구성이 다를 경우 실패하는 테스트를 작성합니다.

```java
@Test
@DisplayName("CrudRequest와 CrudRequestDocs의 필드 구성은 반드시 일치해야 한다")
void verifyFieldSyncByReflection() {
    // Given
    Class<?> realDto = CrudRequest.class;
    Class<?> docsDto = CrudRequestDocs.class;

    // When & Then
    // 아직 SwaggerFieldValidator.checkSync() 가 구현되지 않았으므로 컴파일 에러 또는 실패 발생
    SwaggerFieldValidator.checkSync(realDto, docsDto);
}
```

## 2. 단계: [GREEN] 최소 기능 구현
테스트를 통과시키기 위해 Reflection을 활용한 유틸리티를 구현합니다.

```java
public class SwaggerFieldValidator {
    public static void checkSync(Class<?> origin, Class<?> target) {
        Set<String> originFields = getFieldNames(origin);
        Set<String> targetFields = getFieldNames(target);

        if (!originFields.equals(targetFields)) {
            String mismatch = originFields.size() > targetFields.size() 
                ? "DocsDTO에 필드 누락" : "DocsDTO에 알 수 없는 필드 존재";
            
            throw new AssertionError(String.format(
                "[%s <-> %s] 필드 불일치 발생: %s\n실제 필드: %s\n문서 필드: %s",
                origin.getSimpleName(), target.getSimpleName(), mismatch, originFields, targetFields
            ));
        }
    }

    private static Set<String> getFieldNames(Class<?> clazz) {
        // Record와 일반 Class 모두 대응
        if (clazz.isRecord()) {
            return Arrays.stream(clazz.getRecordComponents())
                         .map(RecordComponent::getName)
                         .collect(Collectors.toSet());
        }
        return Arrays.stream(clazz.getDeclaredFields())
                     .map(Field::getName)
                     .collect(Collectors.toSet());
    }
}
```

## 3. 단계: [REFACTOR] 고도화 (타입 체크 추가)
단순 이름 비교를 넘어 타입(Type)까지 일치하는지 검증을 강화합니다.

```java
// Refactored logic in Validator
public static void checkTypeSync(Class<?> origin, Class<?> target) {
    Map<String, Class<?>> originMap = getFieldMap(origin);
    Map<String, Class<?>> targetMap = getFieldMap(target);

    originMap.forEach((name, type) -> {
        if (!targetMap.containsKey(name)) {
            throw new AssertionError("필드 누락: " + name);
        }
        if (!type.equals(targetMap.get(name))) {
            throw new AssertionError(String.format(
                "필드 [%s] 타입 불일치: 실제(%s) vs 문서(%s)",
                name, type.getSimpleName(), targetMap.get(name).getSimpleName()
            ));
        }
    });
}
```

---

## 4. 실제 동작 예시 (Failure Case)
만약 개발자가 `CrudRequest`에 `String author` 필드를 추가하고 `CrudRequestDocs` 수정을 잊었다면?

**테스트 결과:**
```text
java.lang.AssertionError: [CrudRequest <-> CrudRequestDocs] 필드 불일치 발생: DocsDTO에 필드 누락
실제 필드: [title, contents, author]
문서 필드: [title, contents]
```

## 5. 결론 및 기대효과
- **자동화된 일원화**: 사람이 눈으로 체크하던 영역을 기계가 검증합니다.
- **CI/CD 통합**: 빌드 단계에서 테스트가 수행되므로, 잘못된 문서가 배포되는 것을 원천 차단합니다.
- **안전한 리팩토링**: 필드명을 변경하면 즉시 테스트가 깨지므로 문서도 함께 수정하게 유도합니다.
