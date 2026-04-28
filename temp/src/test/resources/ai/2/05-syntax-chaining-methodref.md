# 05. 문법(메소드 체이닝/메소드 참조) (학습/과제 테스트 예제) — **임의 문제 (세트2)**

> 주제는 같고 문제는 다르게 출제했습니다. `@DisplayName` 중심으로 출제합니다.

```java
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@Slf4j
class SyntaxSet2MissionTest {

  record Product(long id, String name, int price) {}

  @DisplayName("1. 임의 과제: 가장 비싼 상품의 이름을 구하라(없으면 null) — stream 체이닝으로만")
  @Test
  void mission_1_most_expensive_name() {
    var list = List.of(
      new Product(1, "a", 100),
      new Product(2, "b", 300),
      new Product(3, "c", 200)
    );

    assertThat(mostExpensiveName(list)).isEqualTo("b");
  }

  String mostExpensiveName(List<Product> list) {
    // TODO: stream + max + map + orElse(null)
    return null;
  }

  @DisplayName("2. 임의 과제: 람다를 메소드 참조로 바꿔도 가독성이 유지되는지 판단해보자")
  @Test
  void mission_2_method_reference_judgement() {
    var raw = List.of("  A  ", " b ", "C");

    var r = raw.stream()
      .map(String::trim)          // (예시) 메소드 참조
      .map(String::toLowerCase)   // (예시) 메소드 참조
      .toList();

    assertThat(r).containsExactly("a", "b", "c");
  }
}
```

