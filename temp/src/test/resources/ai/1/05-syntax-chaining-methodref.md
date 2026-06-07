# 05. 문법(메소드 체이닝/메소드 참조) (학습/과제 테스트 예제) — **임의 문제**

> `quest/20260421.md`의 “문법” 주제(체이닝/메소드 참조)만 참고했고, 문제는 새로 출제했습니다.

## 목표

- “반복문 → stream 체이닝”으로 변환하는 감각을 익힌다.
- 람다를 **메소드 참조**로 바꿀 수 있는지 판단한다.

## 과제(임의 출제)

### 미션 1) for-loop를 stream 체이닝으로 바꾸기

아래 `findNicknameLoop`를 `findNicknameStream`으로 동일 동작하게 구현하세요.

```java
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class ChainingMission1Test {
  record Member(long id, String nickname) {}

  String findNicknameLoop(List<Member> members, long id) {
    for (Member m : members) {
      if (m.id() == id) {
        return m.nickname();
      }
    }
    return null;
  }

  String findNicknameStream(List<Member> members, long id) {
    // TODO: stream 체이닝(filter/map/findFirst/orElse)
    return null;
  }

  @Test
  void same_result() {
    var members = List.of(new Member(1, "a"), new Member(2, "b"));
    assertThat(findNicknameStream(members, 2)).isEqualTo(findNicknameLoop(members, 2));
    assertThat(findNicknameStream(members, 999)).isNull();
  }
}
```

### 미션 2) 메소드 참조로 바꿀 수 있는지 구분하기

- 아래 코드에서 “메소드 참조로 바꾸기 좋은” 부분과 “굳이 바꾸면 가독성이 떨어지는” 부분을 구분해보세요.

```java
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class MethodRefMission2Test {
  @Test
  void method_reference_practice() {
    List<String> raw = List.of("  A  ", "  b", "C  ");

    List<String> normalized = raw.stream()
      .map(s -> s.trim())          // TODO: 메소드 참조로 바꿀까?
      .map(s -> s.toLowerCase())   // TODO: 메소드 참조로 바꿀까?
      .toList();

    assertThat(normalized).containsExactly("a", "b", "c");
  }
}
```

## 체크리스트

- [ ] “필터 → 매핑 → 최초값” 패턴을 stream으로 작성할 수 있다.
- [ ] 메소드 참조가 “항상 좋은 것”은 아니라는 기준을 가진다.

