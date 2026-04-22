# 07. Switch (arrow/yield/pattern) (학습/과제 테스트 예제) — **임의 문제**

> `quest/20260421.md`의 “Switch” 주제만 참고했고, 문제는 새로 출제했습니다.

## 목표

- switch **표현식**(arrow + `yield`) 스타일을 익힌다.
- `null` 처리 / `when`(패턴 가드) 같은 최신 문법을 “설계 관점”으로 이해한다.

## 과제(임의 출제)

### 미션 1) 상태값을 메시지로 매핑하기 (switch expression)

- 입력: `String status`
- 규칙
  - `"NEW"` → `"접수"`
  - `"PAID"` → `"결제완료"`
  - `"CANCELLED"` → `"취소"`
  - 그 외 → `"UNKNOWN"`

```java
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SwitchMission1Test {
  String message(String status) {
    // TODO: switch expression으로 구현
    return null;
  }

  @Test
  void maps_status() {
    assertThat(message("NEW")).isEqualTo("접수");
    assertThat(message("PAID")).isEqualTo("결제완료");
    assertThat(message("X")).isEqualTo("UNKNOWN");
  }
}
```

### 미션 2) 구간(범위) 분류하기 (yield 블록 사용)

- 입력: `int age`
- 규칙
  - 0~12: `KID`
  - 13~19: `TEEN`
  - 20~64: `ADULT`
  - 65+: `SENIOR`

```java
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SwitchMission2Test {
  enum Group { KID, TEEN, ADULT, SENIOR }

  Group group(int age) {
    // TODO: switch에서 블록 + yield를 사용해 구현(원하면 if로 전처리해도 됨)
    return null;
  }

  @Test
  void groups_age() {
    assertThat(group(9)).isEqualTo(Group.KID);
    assertThat(group(17)).isEqualTo(Group.TEEN);
    assertThat(group(30)).isEqualTo(Group.ADULT);
    assertThat(group(80)).isEqualTo(Group.SENIOR);
  }
}
```

### (선택) 미션 3) pattern matching switch로 타입별 처리하기

- Java 버전에 따라 문법/옵션이 달라질 수 있습니다.
- 요구사항(개념):
  - `null`이면 `"NULL"`
  - `String`이면 길이에 따라 `"SHORT"`/`"LONG"`
  - `Integer`면 `"INT"`

## 체크리스트

- [ ] switch를 “문(statement)”이 아니라 “식(expression)”으로 사용할 수 있다.
- [ ] `yield`가 필요한 상황(블록에서 값 반환)을 설명할 수 있다.

