# Gradle 테스트 명령 이해와 단위별 실행 방법

## 질문한 명령이 실제로 한 일

실행 명령:

```bash
bash gradlew :infra:test --tests "*Elasticsearch*"
```

의미:

- `bash gradlew`: Gradle Wrapper를 bash로 실행
- `:infra:test`: `infra` 모듈의 테스트 태스크만 실행
- `--tests "*Elasticsearch*"`: 테스트 클래스/메서드 이름 중 `Elasticsearch` 패턴에 맞는 테스트만 필터 실행

주의:

- 패턴에 맞는 테스트가 없어도 빌드는 성공(`BUILD SUCCESSFUL`)할 수 있다.
- 그래서 "빌드 성공"과 "원하는 테스트 실제 실행"은 별도로 확인해야 한다.

---

## 테스트를 더 작게 실행하는 방법

### 1) 모듈 단위 테스트

```bash
bash gradlew :infra:test
```

- `infra` 모듈 내 전체 테스트 실행

### 2) 특정 클래스만 테스트

```bash
bash gradlew :infra:test --tests "com.crud.infra.*Elasticsearch*Test"
```

- 클래스 이름 기준으로 좁혀서 실행

### 3) 특정 메서드만 테스트

```bash
bash gradlew :infra:test --tests "com.crud.infra.ElasticsearchRepositoryTest.save_and_find"
```

- 메서드 1개만 실행 가능

### 4) 더 좁은 반복 실행(개발 중)

```bash
bash gradlew :infra:test --tests "*Elasticsearch*" --rerun-tasks
```

- up-to-date 캐시를 무시하고 다시 실행
- 테스트 코드 빠른 수정/검증에 유용

---

## 실행됐는지 확인하는 기준

아래 중 하나로 확인:

- 콘솔에 `> Task :infra:test`가 실제 실행(`executed`)됐는지
- 테스트 리포트 생성 여부
  - `backend/infra/build/reports/tests/test/index.html`
- 테스트 결과 XML 생성 여부
  - `backend/infra/build/test-results/test/`

---

## 권장 실행 순서 (Elasticsearch 기능 검증용)

1. Elasticsearch 컨테이너 실행
2. `infra` 모듈 테스트 작성/수정
3. `:infra:test --tests ...`로 좁혀 실행
4. 마지막에 `:infra:test` 전체 실행으로 회귀 확인

이 방식이면 Spring Security 설정을 바꾸지 않고도, 인프라 기능을 안정적으로 검증할 수 있다.
