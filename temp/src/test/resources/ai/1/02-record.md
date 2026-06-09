# 02. Record (학습/과제 테스트 예제) — **임의 문제**

> `quest/20260421.md`의 “Record”라는 **주제만** 참고했고, 문제는 새로 출제했습니다.

## 목표

- record로 **불변 DTO**를 만들고, “입력 정규화/검증”을 **compact constructor**로 구현해본다.
- “필수값”의 범위를 스스로 정하고, 테스트로 요구사항을 고정한다.

## 문법 키워드

- record 선언: `record Name(type a, type b) {}`
- compact constructor: `public Name { ... }`
- 값 정규화(예시): `trim()`, `toLowerCase()`

## 학습 예제(짧게)

```java
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class RecordWarmupTest {
  record Email(String value) {
    public Email {
      if (value == null) throw new IllegalArgumentException("email required");
      value = value.trim().toLowerCase();
      if (!value.contains("@")) throw new IllegalArgumentException("email invalid");
    }
  }

  @Test
  void normalize_in_constructor() {
    assertThat(new Email(" Test@Example.com ").value()).isEqualTo("test@example.com");
  }
}
```

## 과제(임의 출제)

### 미션 1) 주문 DTO(record) 만들기

아래 요구사항을 만족하는 record `OrderRequest`를 작성하세요.

- 필드
  - `String orderId` (필수, `"ORD-"`로 시작해야 함)
  - `String buyerEmail` (필수, `@` 포함 + 소문자/trim 정규화)
  - `int quantity` (필수, 1~999)
  - `String memo` (선택, null 허용)
- 구현 방식
  - compact constructor에서 정규화/검증 수행

```java
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class RecordMission1Test {

  // TODO: OrderRequest record를 여기에 작성

  @Test
  void ok_case_normalizes_email() {
    OrderRequest r = new OrderRequest("ORD-0001", "  TEST@EXAMPLE.COM ", 3, null);
    assertThat(r.buyerEmail()).isEqualTo("test@example.com");
  }

  @Test
  void invalid_orderId_rejected() {
    assertThatThrownBy(() -> new OrderRequest("0001", "a@b.com", 1, null))
      .isInstanceOf(IllegalArgumentException.class);
  }

  @Test
  void invalid_quantity_rejected() {
    assertThatThrownBy(() -> new OrderRequest("ORD-0002", "a@b.com", 0, null))
      .isInstanceOf(IllegalArgumentException.class);
  }
}
```

### 미션 2) “동등성/출력” 기대를 테스트로 고정하기

- record는 `equals/hashCode/toString`이 자동 생성됩니다.
- 아래 테스트가 통과하도록 `OrderRequest`를 완성(또는 수정)해보세요.

```java
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class RecordMission2Test {
  @Test
  void equality_depends_on_components() {
    OrderRequest a = new OrderRequest("ORD-1000", "a@b.com", 2, "x");
    OrderRequest b = new OrderRequest("ORD-1000", "a@b.com", 2, "x");

    assertThat(a).isEqualTo(b);
    assertThat(a.toString()).contains("ORD-1000");
  }
}
```

## 체크리스트

- [ ] compact constructor에서 “정규화 → 검증” 순서로 처리할 수 있다.
- [ ] record의 자동 `equals/hashCode/toString` 특성을 테스트로 활용할 수 있다.

