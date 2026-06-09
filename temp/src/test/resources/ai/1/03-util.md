# 03. Util (학습/과제 테스트 예제) — **임의 문제**

> `quest/20260421.md`의 “Util(StringUtils/CollectionUtils/Map)” **주제만** 참고했고, 문제는 새로 출제했습니다.

## 목표

- “null/empty/blank”를 다루는 **표준 유틸 패턴**을 익힌다.
- `Map`의 대표 메소드(`getOrDefault`, `computeIfAbsent`, `putIfAbsent`)를 테스트 형태로 연습한다.

## 문법 키워드

- `StringUtils.hasText(...)`, `StringUtils.hasLength(...)`
- `CollectionUtils.isEmpty(...)`
- `Map.getOrDefault(k, default)`
- `Map.computeIfAbsent(k, key -> new ArrayList<>())`
- `Map.putIfAbsent(k, v)`

## 과제(임의 출제)

### 미션 1) “검색어 유효성” 판정 함수 만들기

- 입력: `String keyword`
- 규칙: `hasText(keyword)`이면 유효, 아니면 무효
- 요구: 무효면 `"DEFAULT"`를 반환, 유효면 `trim()`한 값을 반환

```java
import org.junit.jupiter.api.Test;
import org.springframework.util.StringUtils;

import static org.assertj.core.api.Assertions.assertThat;

class UtilMission1Test {
  String normalizeKeyword(String keyword) {
    // TODO
    return null;
  }

  @Test
  void null_empty_blank_becomes_default() {
    assertThat(normalizeKeyword(null)).isEqualTo("DEFAULT");
    assertThat(normalizeKeyword("")).isEqualTo("DEFAULT");
    assertThat(normalizeKeyword("   ")).isEqualTo("DEFAULT");
  }

  @Test
  void text_is_trimmed() {
    assertThat(normalizeKeyword("  java  ")).isEqualTo("java");
  }
}
```

### 미션 2) `computeIfAbsent`로 “그룹핑 버킷” 만들기

- 입력: `List<String> names`
- 규칙: 첫 글자(대문자)로 그룹핑해서 `Map<String, List<String>>` 생성
- 요구: 버킷 생성은 `computeIfAbsent` 사용

```java
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;

class UtilMission2Test {
  Map<String, List<String>> groupByFirstLetter(List<String> names) {
    Map<String, List<String>> buckets = new HashMap<>();
    // TODO: computeIfAbsent 활용해서 넣기
    return buckets;
  }

  @Test
  void group_names() {
    Map<String, List<String>> r = groupByFirstLetter(List.of("alice", "anna", "bob"));
    assertThat(r.get("A")).containsExactly("alice", "anna");
    assertThat(r.get("B")).containsExactly("bob");
  }
}
```

### 미션 3) `getOrDefault`로 카운팅하기

- 입력: 임의의 문자열 리스트
- 출력: 각 단어의 등장 횟수 `Map<String, Integer>`
- 요구: `getOrDefault`로 카운팅

```java
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class UtilMission3Test {
  Map<String, Integer> countWords(List<String> words) {
    Map<String, Integer> counts = new HashMap<>();
    // TODO: counts.put(word, counts.getOrDefault(word, 0) + 1)
    return counts;
  }

  @Test
  void counts_words() {
    assertThat(countWords(List.of("a", "b", "a"))).containsEntry("a", 2).containsEntry("b", 1);
  }
}
```

## 체크리스트

- [ ] `hasText`와 `hasLength` 차이를 설명할 수 있다.
- [ ] `computeIfAbsent`가 “버킷 생성”에 적합한 이유를 이해했다.
- [ ] `getOrDefault`로 카운팅을 구현할 수 있다.

