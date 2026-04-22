# 01. LocalDate (학습/과제 테스트 예제) — **임의 문제 (세트2)**

> `ai/1`과 주제는 같지만, 문제는 다르게 출제했습니다.  
> 출제 형식은 `_20260421/LocalDateTest.java` 스타일( `@DisplayName`, 파라미터 테스트 )을 참고했습니다.

```java
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import static org.assertj.core.api.Assertions.assertThat;

@Slf4j
class LocalDateSet2MissionTest {

  LocalDate parseBasic(String yyyymmdd) {
    // TODO
    return null;
  }

  @DisplayName("0. 워밍업: BASIC_ISO_DATE 파싱/포맷 왕복")
  @ParameterizedTest
  @ValueSource(strings = {"20260131", "20260201", "20261231"})
  void warmup_roundtrip(String yyyymmdd) {
    LocalDate d = parseBasic(yyyymmdd);
    assertThat(d.format(DateTimeFormatter.BASIC_ISO_DATE)).isEqualTo(yyyymmdd);
  }

  LocalDate nearestFriday(LocalDate any) {
    // TODO: any가 금요일이면 그대로, 아니면 “가장 가까운 이전 금요일” 반환
    return null;
  }

  @DisplayName("1. 임의 과제: 가장 가까운 '이전 금요일' 찾기")
  @Test
  void mission_1_nearest_previous_friday() {
    assertThat(nearestFriday(LocalDate.of(2026, 4, 22))) // 수요일
      .isEqualTo(LocalDate.of(2026, 4, 17));            // 금요일
  }

  String quarter(LocalDate any) {
    // TODO: 1~3월 Q1, 4~6월 Q2, 7~9월 Q3, 10~12월 Q4
    return null;
  }

  @DisplayName("2. 임의 과제: 분기(Quarter) 계산")
  @ParameterizedTest
  @ValueSource(strings = {"20260101", "20260401", "20260731", "20261010"})
  void mission_2_quarter(String yyyymmdd) {
    LocalDate d = LocalDate.parse(yyyymmdd, DateTimeFormatter.BASIC_ISO_DATE);
    String q = quarter(d);
    assertThat(q).isIn("Q1", "Q2", "Q3", "Q4");
  }

  long daysUntilNextBirthday(LocalDate today, String birthdayMMdd) {
    // TODO: 오늘 기준 다음 생일까지 남은 일수(0 이상)
    // - birthdayMMdd 예: "0422"
    // - 오늘이 생일이면 0
    // - 올해 생일이 지났으면 내년 생일까지 계산
    return -1;
  }

  @DisplayName("3. 임의 과제: 다음 생일까지 남은 일수 계산")
  @Test
  void mission_3_days_until_next_birthday() {
    assertThat(daysUntilNextBirthday(LocalDate.of(2026, 4, 22), "0422")).isEqualTo(0);
    assertThat(daysUntilNextBirthday(LocalDate.of(2026, 4, 23), "0422")).isGreaterThan(0);
  }
}
```

