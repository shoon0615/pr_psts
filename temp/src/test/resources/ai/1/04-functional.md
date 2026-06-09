# 04. 함수형(Stream/Optional/Supplier) (학습/과제 테스트 예제) — **임의 문제**

> `quest/20260421.md`의 “함수형 프로그래밍” **주제만** 참고했고, 문제는 새로 출제했습니다.

## 목표

- Stream 파이프라인(선언 → 중간 연산 → 최종 연산)을 손에 익힌다.
- Optional의 “없음 처리”를 `orElse/orElseGet/orElseThrow` 관점으로 이해한다.
- Supplier로 “지연 실행”의 효과를 테스트 형태로 체감한다.

## 준비 데이터(예시)

```java
record Item(String category, int price, boolean soldOut) {}
```

## 과제(임의 출제)

### 미션 1) 카테고리별 “판매중” 평균 가격 구하기

- 입력: `List<Item>`
- 규칙: `soldOut == false`만 대상으로
- 출력: `Map<String, Double>` (category -> average price)

```java
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class FunctionalMission1Test {
  record Item(String category, int price, boolean soldOut) {}

  Map<String, Double> avgPriceByCategory(List<Item> items) {
    // TODO: stream + groupingBy + averagingInt
    return null;
  }

  @Test
  void avg_by_category_only_available() {
    var items = List.of(
      new Item("A", 100, false),
      new Item("A", 300, false),
      new Item("A", 999, true),
      new Item("B", 200, false)
    );

    assertThat(avgPriceByCategory(items))
      .containsEntry("A", 200.0)
      .containsEntry("B", 200.0);
  }
}
```

### 미션 2) Optional로 “첫 번째 정상 값” 찾기

- 입력: `List<String> rawEmails`
- 규칙: `trim()` 후 빈 문자열이면 제외, `@`가 없으면 제외
- 출력: 첫 번째 정상 이메일(소문자), 없으면 `null`

```java
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class FunctionalMission2Test {
  String firstValidEmailOrNull(List<String> rawEmails) {
    // TODO: stream + map(trim/lower) + filter + findFirst + orElse(null)
    return null;
  }

  @Test
  void finds_first_valid() {
    assertThat(firstValidEmailOrNull(List.of(" ", "NOPE", " A@B.COM ", "c@d.com")))
      .isEqualTo("a@b.com");
  }

  @Test
  void returns_null_when_none() {
    assertThat(firstValidEmailOrNull(List.of(" ", "x", ""))).isNull();
  }
}
```

### 미션 3) Supplier로 “에러 메시지 만들기” 지연하기

- 요구: 아래 테스트의 의도를 만족하도록 구현
  - `orElse`는 기본값 생성이 **항상 실행**될 수 있다(값이 있어도).
  - `orElseGet`은 Supplier가 **필요할 때만** 실행된다.

```java
import org.junit.jupiter.api.Test;

import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;

class FunctionalMission3Test {
  String expensiveDefault(AtomicInteger counter) {
    counter.incrementAndGet();
    return "DEFAULT";
  }

  @Test
  void orElseGet_is_lazy() {
    AtomicInteger calls = new AtomicInteger(0);

    String v1 = Optional.of("OK").orElse(expensiveDefault(calls));
    String v2 = Optional.of("OK").orElseGet(() -> expensiveDefault(calls));

    assertThat(v1).isEqualTo("OK");
    assertThat(v2).isEqualTo("OK");
    // TODO: orElse/orElseGet 차이를 이해하고 기대값을 맞춰라.
    assertThat(calls.get()).isEqualTo(-1);
  }
}
```

## 체크리스트

- [ ] groupingBy/averagingInt를 써서 집계를 만들 수 있다.
- [ ] Optional의 “없으면 null” 패턴을 `orElse(null)`로 통일할 수 있다.
- [ ] `orElse` vs `orElseGet` 차이를 설명할 수 있다.

