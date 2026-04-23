# HandlerExceptionResolver 빈 주입 실패 에러

## 발생 에러

```
APPLICATION FAILED TO START

Description:
Parameter 2 of constructor in com.crud.api.config.security.SpringSecurityConfig
required a single bean, but 2 were found:
  - errorAttributes: defined by method 'errorAttributes' in class path resource
      [org/springframework/boot/autoconfigure/web/servlet/error/ErrorMvcAutoConfiguration.class]
  - handlerExceptionResolver: defined by method 'handlerExceptionResolver' in class path resource
      [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$EnableWebMvcConfiguration.class]

Action:
... Ensure that your compiler is configured to use the '-parameters' flag.
```

---

## 한 줄 요약

> Spring Boot가 `HandlerExceptionResolver` 타입 빈을 **2개** 등록하는데,
> 컴파일 시 **`-parameters`** 플래그가 빠져서 파라미터 이름으로 구분하지 못해 주입 실패.

---

## 왜 빈이 2개인가

| 빈 이름 | 실제 타입 | 등록 위치 |
|---------|-----------|-----------|
| `handlerExceptionResolver` | `HandlerExceptionResolver` | `WebMvcAutoConfiguration` |
| `errorAttributes` | `DefaultErrorAttributes` | `ErrorMvcAutoConfiguration` |

`DefaultErrorAttributes`가 **`HandlerExceptionResolver`를 구현**하고 있어서,
타입만으로는 어느 것을 주입할지 판단 불가.

---

## 왜 파라미터 이름이 없었나

`SpringSecurityConfig`는 Lombok `@RequiredArgsConstructor`로 생성자가 자동 생성됨:

```java
@RequiredArgsConstructor
public class SpringSecurityConfig {
    private final AuthenticationConfiguration authenticationConfiguration;
    private final JwtUtil jwtUtil;
    private final HandlerExceptionResolver handlerExceptionResolver;  // 파라미터 2
}
```

Spring은 보통 **파라미터 이름**(`handlerExceptionResolver`)과
빈 이름(`handlerExceptionResolver`)이 일치하면 자동으로 매칭한다.

하지만 Java 바이트코드는 기본적으로 **파라미터 이름을 저장하지 않는다**.
`javac -parameters` 플래그로 컴파일해야만 `MethodParameters` 속성이 기록됨.

---

## 해결 방법 (적용 완료)

`backend/build.gradle`의 `subprojects { ... }` 블록에 추가:

```groovy
tasks.withType(JavaCompile).configureEach {
    options.compilerArgs << '-parameters'
}
```

### 효과

- 모든 서브모듈(`api`, `biz`, `common`, `domain`, `infra`) 자동 적용
- 비즈니스 코드 수정 불필요
- Lombok 생성 생성자의 파라미터 이름이 바이트코드에 보존됨
- 유사 이슈(동일 타입 빈 중복) 사전 예방

### 검증

```bash
javap -p -v api/build/classes/java/main/com/crud/api/config/security/SpringSecurityConfig.class \
  | grep -A5 MethodParameters

# 결과
# MethodParameters:
#   Name                           Flags
#   authenticationConfiguration    final
#   jwtUtil                        final
#   handlerExceptionResolver       final
```

---

## 적용 후 해야 할 일

### 1) Gradle 캐시/빌드 산출물 정리

```bash
cd backend
bash gradlew --stop
bash gradlew clean
```

### 2) IDE 캐시 정리 (Cursor / VS Code)

`Command Palette` -> **Java: Clean Java Language Server Workspace** -> Restart and delete

이전에 `-parameters` 없이 컴파일된 `.class`가 `bin/` 디렉터리에 남아 있을 수 있음.

### 3) 재실행

```bash
bash gradlew :api:bootRun
```

---

## 대안 해결책 (참고)

필요 시 선택 가능한 다른 방법들:

| 방법 | 특징 |
|------|------|
| `@Qualifier("handlerExceptionResolver")` 필드에 명시 | 국소 해결. Lombok 사용 시 `lombok.config`에 `lombok.copyableAnnotations += org.springframework.beans.factory.annotation.Qualifier` 필요 |
| 생성자 직접 작성 + 파라미터에 `@Qualifier` | Lombok 제거 필요 |
| `@Primary` 지정 | Spring Boot 기본 빈을 건드려 부수효과 가능. 비권장 |

본 프로젝트는 **`-parameters` 플래그 추가**로 근본 해결.

---

## 참고 링크

- Spring Framework 6.x Upgrade: <https://github.com/spring-projects/spring-framework/wiki/Upgrading-to-Spring-Framework-6.x#parameter-name-retention>
- `javac -parameters` 옵션: <https://docs.oracle.com/en/java/javase/21/docs/specs/man/javac.html>
