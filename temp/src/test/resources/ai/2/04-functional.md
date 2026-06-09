# 04. 함수형(Stream/Optional/Supplier) (학습/과제 테스트 예제) — **임의 문제 (세트2)**

> `ai/1`과 주제는 같지만 문제는 다르게 출제했습니다.  
> `_20260421/StreamTest.java`처럼 `@TestInstance`, `@BeforeEach`, `@MethodSource` 스타일을 흉내냅니다.

```java
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Supplier;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;

@Slf4j
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class FunctionalSet2MissionTest {

  private List<Map<String, Object>> rows;

  @BeforeEach
  void setUp() {
    rows = List.of(
      Map.of("type", "A", "score", 10),
      Map.of("type", "A", "score", 20),
      Map.of("type", "B", "score", 7),
      Map.of("type", "B", "score", 3)
    );
  }

  @DisplayName("1. 임의 과제: type='A'의 score 합계를 구하라")
  @Test
  void mission_1_sum_scores() {
    int sum = sumScoreByType("A");
    assertThat(sum).isEqualTo(30);
  }

  int sumScoreByType(String type) {
    // TODO: stream + filter + mapToInt + sum
    return -1;
  }

  @DisplayName("2. 임의 과제: score 최댓값 row의 type을 구하라(없으면 null)")
  @Test
  void mission_2_type_of_max_score() {
    assertThat(typeOfMaxScore()).isEqualTo("A");
  }

  String typeOfMaxScore() {
    // TODO: max(Comparator) + map + orElse(null)
    return null;
  }

  Optional<Integer> parseInt(String s) {
    // TODO: 숫자면 Optional.of, 아니면 Optional.empty
    return null;
  }

  @DisplayName("3. 임의 과제: 문자열 목록에서 첫 번째로 파싱 가능한 정수를 찾아라(없으면 -1)")
  @Test
  void mission_3_first_parsable_int() {
    int v = firstParsableIntOrMinus1(List.of("x", "  ", "42", "7"));
    assertThat(v).isEqualTo(42);
  }

  int firstParsableIntOrMinus1(List<String> list) {
    // TODO: stream + flatMap(Optional::stream) + findFirst + orElse(-1)
    return -2;
  }

  Supplier<String> boom() {
    return () -> { throw new RuntimeException("boom"); };
  }

  Stream<Supplier<String>> suppliers() {
    return Stream.of(
      () -> "OK",
      boom()
    );
  }

  @DisplayName("4. 임의 과제: Supplier 실행 결과를 출력하라(예외면 'ERR')")
  @ParameterizedTest
  @MethodSource("suppliers")
  void mission_4_supplier_safe_run(Supplier<String> s) {
    String out = safeGet(s);
    assertThat(out).isIn("OK", "ERR");
  }

  String safeGet(Supplier<String> s) {
    // TODO: try/catch로 예외를 잡고 "ERR" 반환
    return null;
  }
}
```

