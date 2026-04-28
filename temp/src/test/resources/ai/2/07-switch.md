# 07. Switch (arrow/yield/pattern) (학습/과제 테스트 예제) — **임의 문제 (세트2)**

> 주제는 같고 문제는 다르게 출제했습니다. `_20260421` 스타일처럼 `@DisplayName`으로 문제를 적습니다.

```java
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

@Slf4j
class SwitchSet2MissionTest {

  enum Level { DEBUG, INFO, WARN, ERROR }

  @DisplayName("1. 임의 과제: 로그 레벨을 숫자 우선순위로 매핑하라(switch expression)")
  @Test
  void mission_1_priority() {
    assertThat(priority(Level.DEBUG)).isEqualTo(1);
    assertThat(priority(Level.ERROR)).isEqualTo(4);
  }

  int priority(Level level) {
    // TODO: switch expression으로 구현
    return -1;
  }

  @DisplayName("2. 임의 과제: 입력 문자열을 표준 레벨로 변환하라(null/공백은 INFO)")
  @Test
  void mission_2_parse_level() {
    assertThat(parseLevel(null)).isEqualTo(Level.INFO);
    assertThat(parseLevel("  ")).isEqualTo(Level.INFO);
    assertThat(parseLevel("warn")).isEqualTo(Level.WARN);
  }

  Level parseLevel(String raw) {
    // TODO: trim+lower 후 switch
    return null;
  }
}
```

