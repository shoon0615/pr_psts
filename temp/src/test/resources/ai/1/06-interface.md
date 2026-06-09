# 06. interface (default/private/static/sealed) (학습/과제 테스트 예제) — **임의 문제**

> `quest/20260421.md`의 “interface” 주제만 참고했고, 문제는 새로 출제했습니다.

## 목표

- `default` 메소드로 “기본 동작”을 제공하는 패턴을 익힌다.
- `private` 인터페이스 메소드로 “공통 로직 숨기기”를 익힌다.
- `static` 메소드로 “유틸 제공”을 익힌다.
- (선택) `sealed`로 “구현 제한” 개념을 이해한다.

## 과제(임의 출제)

### 미션 1) default + private 메소드로 점수 계산기 만들기

- 요구사항
  - `ScorePolicy` 인터페이스를 만든다.
  - `default int score(int base)`는 `base`에 **가산점**을 더해 반환한다.
  - 가산점 계산은 `private int bonus(int base)`에 숨긴다.
  - 구현체는 `VipPolicy`, `NormalPolicy` 두 개를 만든다.

```java
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class InterfaceMission1Test {

  // TODO: ScorePolicy / VipPolicy / NormalPolicy 작성

  @Test
  void vip_gets_more_bonus() {
    ScorePolicy vip = new VipPolicy();
    ScorePolicy normal = new NormalPolicy();

    assertThat(vip.score(100)).isGreaterThan(normal.score(100));
  }
}
```

### 미션 2) static 메소드로 “정책 선택” 제공하기

- 요구사항
  - `ScorePolicy.of(String grade)` 같은 static 팩토리를 만들고,
  - `"VIP"`면 `VipPolicy`, 그 외는 `NormalPolicy`를 반환한다.

```java
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class InterfaceMission2Test {
  @Test
  void factory_selects_policy() {
    assertThat(ScorePolicy.of("VIP")).isInstanceOf(VipPolicy.class);
    assertThat(ScorePolicy.of("X")).isInstanceOf(NormalPolicy.class);
  }
}
```

### (선택) 미션 3) sealed로 구현체 제한하기

- Java 버전/컴파일 옵션이 맞는 경우에만 시도하세요.
- 요구사항: `sealed interface Payment permits CardPayment, BankTransfer { ... }`

## 체크리스트

- [ ] default 메소드가 “구현체 공통 기능”에 쓰일 수 있다.
- [ ] private 메소드로 인터페이스 내부 중복을 숨길 수 있다.
- [ ] static 팩토리로 생성 분기를 한 곳에 모을 수 있다.

