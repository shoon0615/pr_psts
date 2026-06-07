# AI 예제 세트 (2번)

`src/test/resources/ai/1`과 **주제는 동일**하지만, **문제는 전부 다르게** 출제한 세트입니다.

## 출제 방식(형식)

`src/test/java/com/side/java17/after/biz/service/_20260421/`의 테스트 스타일을 참고해 아래 요소를 적극 사용합니다.

- `@DisplayName(...)`로 문제 서술을 테스트 이름에 포함
- `@ParameterizedTest` + `@ValueSource` 또는 `@MethodSource`로 멀티 케이스 출제
- (필요 시) `@BeforeEach`로 공통 데이터 셋업

## 파일 목록

- `01-localdate.md`
- `02-record.md`
- `03-util.md`
- `04-functional.md`
- `05-syntax-chaining-methodref.md`
- `06-interface.md`
- `07-switch.md`

