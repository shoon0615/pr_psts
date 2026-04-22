# 02. Record (학습/과제 테스트 예제) — **임의 문제 (세트2)**

> `ai/1`과 주제는 같지만 문제는 다르게 출제했습니다.  
> 출제 형식은 `_20260421/RecordTest.java`처럼 `@BeforeEach`, `@DisplayName`을 활용합니다.

```java
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@Slf4j
class RecordSet2MissionTest {

  record Coupon(String code, LocalDate expiresAt, int percent) {
    public Coupon {
      // TODO: 신규 문제 요구사항대로 정규화/검증 구현
      // 요구사항(임의):
      // - code: trim + 대문자 변환, "CPN-"로 시작, 길이 8~20
      // - expiresAt: null 금지, 오늘 이전이면 금지(정책 임의)
      // - percent: 1~90
    }
  }

  private Coupon base;

  @BeforeEach
  void setUp() {
    base = new Coupon(" cpn-abc12345 ", LocalDate.now().plusDays(30), 10);
  }

  @DisplayName("0. 워밍업: record는 equals/toString이 자동 생성된다")
  @Test
  void warmup_equals_and_toString() {
    Coupon a = new Coupon("CPN-ABC12345", base.expiresAt(), 10);
    Coupon b = new Coupon("CPN-ABC12345", base.expiresAt(), 10);

    assertThat(a).isEqualTo(b);
    assertThat(a.toString()).contains("CPN-ABC12345");
  }

  @DisplayName("1. 임의 과제: code는 trim + 대문자 정규화 된다")
  @Test
  void mission_1_code_normalize() {
    assertThat(base.code()).isEqualTo("CPN-ABC12345");
  }

  @DisplayName("2. 임의 과제: percent 범위를 벗어나면 예외")
  @Test
  void mission_2_percent_range() {
    assertThatThrownBy(() -> new Coupon("CPN-AAA11111", LocalDate.now().plusDays(1), 0))
      .isInstanceOf(IllegalArgumentException.class);
  }
}
```

