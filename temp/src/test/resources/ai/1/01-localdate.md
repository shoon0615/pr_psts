# 01. LocalDate (학습/과제 테스트 예제) — **임의 문제**

> `quest/20260421.md`의 “LocalDate”라는 **주제만** 참고했고, 문제는 새로 출제했습니다.

## 목표

- `LocalDate`를 **파싱/포맷팅**, **기간 계산**, **주말/말일 같은 규칙 처리** 관점으로 익힌다.

## 문법 키워드

- `LocalDate.parse(..., DateTimeFormatter...)`
- `DateTimeFormatter.BASIC_ISO_DATE`, `DateTimeFormatter.ISO_LOCAL_DATE`
- `plusDays`, `plusMonths`, `withDayOfMonth`
- `getDayOfWeek`, `lengthOfMonth`, `isLeapYear`

## 학습 예제(짧게)

```java
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.DayOfWeek;
import java.time.format.DateTimeFormatter;

import static org.assertj.core.api.Assertions.assertThat;

class LocalDateWarmupTest {
  @Test
  void format_and_parse_roundtrip() {
    LocalDate base = LocalDate.of(2026, 4, 22);
    String yyyymmdd = base.format(DateTimeFormatter.BASIC_ISO_DATE); // 20260422

    LocalDate parsed = LocalDate.parse(yyyymmdd, DateTimeFormatter.BASIC_ISO_DATE);
    assertThat(parsed).isEqualTo(base);
    assertThat(parsed.getDayOfWeek()).isInstanceOf(DayOfWeek.class);
  }
}
```

## 과제(임의 출제)

### 미션 1) “정산일” 만들기

- 입력: `yyyymmdd` 문자열
- 규칙: 입력 날짜가 **주말(토/일)**이면 다음 월요일로 미룬 날짜를 반환
- 예시
  - `20260425`(토) → `20260427`(월)
  - `20260426`(일) → `20260427`(월)
  - `20260427`(월) → `20260427`(월)

```java
import org.junit.jupiter.api.Test;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import static org.assertj.core.api.Assertions.assertThat;

class LocalDateMission1Test {
  LocalDate settleDate(String yyyymmdd) {
    // TODO: 규칙 구현
    return null;
  }

  @Test
  void saturday_moves_to_monday() {
    assertThat(settleDate("20260425"))
      .isEqualTo(LocalDate.parse("20260427", DateTimeFormatter.BASIC_ISO_DATE))
      .extracting(LocalDate::getDayOfWeek)
      .isEqualTo(DayOfWeek.MONDAY);
  }

  @Test
  void sunday_moves_to_monday() {
    assertThat(settleDate("20260426"))
      .isEqualTo(LocalDate.parse("20260427", DateTimeFormatter.BASIC_ISO_DATE));
  }

  @Test
  void weekday_stays() {
    assertThat(settleDate("20260427"))
      .isEqualTo(LocalDate.parse("20260427", DateTimeFormatter.BASIC_ISO_DATE));
  }
}
```

### 미션 2) “다음 달 말일” 구하기

- 입력: `LocalDate any`
- 출력: **다음 달의 말일(LocalDate)**  
  - 예: 2026-01-10 → 2026-02-28
  - 예: 2024-01-10 → 2024-02-29 (윤년)

```java
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

class LocalDateMission2Test {
  LocalDate nextMonthLastDay(LocalDate any) {
    // TODO: 구현
    return null;
  }

  @Test
  void feb_last_day_nonLeapYear() {
    assertThat(nextMonthLastDay(LocalDate.of(2026, 1, 10)))
      .isEqualTo(LocalDate.of(2026, 2, 28));
  }

  @Test
  void feb_last_day_leapYear() {
    assertThat(nextMonthLastDay(LocalDate.of(2024, 1, 10)))
      .isEqualTo(LocalDate.of(2024, 2, 29));
  }
}
```

### 미션 3) 기간 내 “영업일” 개수 세기

- 입력: `start`, `end` (둘 다 포함)
- 규칙: 월~금만 영업일로 계산
- 요구: 영업일 개수를 `long`으로 반환

```java
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

class LocalDateMission3Test {
  long businessDays(LocalDate startInclusive, LocalDate endInclusive) {
    // TODO: 구현(반복문 또는 stream)
    return -1;
  }

  @Test
  void businessDays_in_one_week() {
    // 2026-04-20(월) ~ 2026-04-26(일) => 5일
    assertThat(businessDays(LocalDate.of(2026, 4, 20), LocalDate.of(2026, 4, 26)))
      .isEqualTo(5);
  }
}
```

## 체크리스트

- [ ] 주말 보정(토/일 → 월) 규칙을 `DayOfWeek`로 처리할 수 있다.
- [ ] “말일”을 `lengthOfMonth()`/`withDayOfMonth()`로 계산할 수 있다.
- [ ] 날짜 범위를 순회하며 조건 카운팅을 할 수 있다.

