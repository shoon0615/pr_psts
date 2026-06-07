# `static` — JVM 레벨의 정적 영역

## ✔️ 무엇을 보관하나

`static`은 클래스 로딩 시점에 메모리에 올라가는 **공용(shared) 자원**이다.

대표적으로:

- 상수 (`public static final`)
- 유틸리티 메서드
- 싱글톤 인스턴스
- 캐시 (주의 필요)
- 공통 설정 값

---

## ✔️ 예제

```java
public class ApiConstants {
    public static final String SUCCESS_CODE = "200";
    public static final String ERROR_CODE = "500";
}

public class StringUtils {
    public static String toUpper(String input) {
        return input.toUpperCase();
    }
}
```