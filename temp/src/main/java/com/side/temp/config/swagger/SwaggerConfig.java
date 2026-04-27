/**
 * packageName  : com.side.temp.config.swagger
 * fileName     : SwaggerConfig
 * author       : SangHoon
 * date         : 2026-04-23
 * description  : Swagger 환경설정 구성
 *                  부가적인 기능은 application.yml 참조
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-23          SangHoon             최초 생성
 */
package com.side.temp.config.swagger;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.models.GroupedOpenApi;
import org.springdoc.core.utils.SpringDocUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;

@Configuration
public class SwaggerConfig {

    /** 비표준 타입 포맷 설정 */
    static {
        SpringDocUtils.getConfig()
            .replaceWithClass(LocalDate.class, String.class)
            .replaceWithClass(LocalTime.class, String.class)
            .replaceWithClass(java.time.LocalDateTime.class, String.class)
            .replaceWithClass(java.time.OffsetDateTime.class, String.class)
            .replaceWithClass(java.time.ZonedDateTime.class, String.class)
            .replaceWithClass(YearMonth.class, String.class);

            // JPA 사용 시 추가
//            .replaceWithClass(Pageable.class, Object.class)
//            .replaceWithClass(Sort.class, Object.class);

            // 보안 상 불필요 타입 제거
//            .addAnnotationsToIgnore(AuthenticationPrincipal.class, CookieValue.class, RequestHeader.class);
    }

    @Bean
    public OpenAPI openAPI(@Value("v1") String apiVersion) {
        return new OpenAPI()
            .info(this.apiInfo(apiVersion))
            .components(this.apiComponents())
            .servers(this.apiServers());
    }

    @Bean
    public GroupedOpenApi v1Api() {
        return GroupedOpenApi.builder()
                .group("v1")
//                .packagesToScan("com.side.temp.api")
                .pathsToMatch("/api/v1/**")
                .build();
    }

    @Bean
    public GroupedOpenApi userApi() {
        return GroupedOpenApi.builder()
            .group("v1-user")  // Swagger UI 탭 이름
            .pathsToMatch("/api/user/**")
            .addOpenApiCustomizer(openApi ->
                openApi.info(this.apiInfo("v1"))
                    .components(this.apiComponents())
                    .servers(this.apiServers())
            )
            .build();
    }

    @Bean
    public GroupedOpenApi adminApi() {
        return GroupedOpenApi.builder()
            .group("v1-admin")
            .pathsToMatch("/api/admin/**")
            .addOpenApiCustomizer(openApi -> this.openAPI("v1"))
            .build();
    }

    private Info apiInfo(String apiVersion) {
        return new Info()
            .title("[제목] Spring Boot REST API")
            .description("[내용] CRUD 테스트 Swagger")
            .termsOfService("http://swagger.io/terms/")
            .contact(this.apiContact())
            .license(this.apiLicense())
            .version(apiVersion);
    }

    private Components apiComponents() {
        return new Components()
            .addSecuritySchemes("accessToken", this.apiSecuritySchemes("accessToken"))
            .addSecuritySchemes("refreshToken", this.apiSecuritySchemes("refreshToken"));
    }

    private SecurityScheme apiSecuritySchemes(String key) {
        return new SecurityScheme()
            .name(key)
            .type(SecurityScheme.Type.APIKEY)
            .in(SecurityScheme.In.HEADER)
            .scheme("bearer")
            .bearerFormat("JWT");
    }

    private SecurityScheme apiSecuritySchemes2() {
        return new SecurityScheme()
            .type(SecurityScheme.Type.HTTP)
            .scheme("bearer")
            .bearerFormat("JWT")
            .in(SecurityScheme.In.HEADER)
            .name("Authorization");
    }

    private Contact apiContact() {
        return new Contact()
            .name("[연락처] 김땡땡")
            .url("https://github.com/shoon0615/pr_psts")
            .email("shoon0615@gmail.com");
    }

    private License apiLicense() {
        return new License()
            .name("Apache License Version 2.0")
            .url("http://www.apache.org/licenses/LICENSE-2.0");
    }

    // 추후 Enum 이나 @Value 로 변경
    // openAPI.servers() 생략 시, 자동으로 현재 주소 접속
    private List<Server> apiServers() {
        return List.of(
            new Server()
                .url("/")
                .description("[1. 현재 url]"),
            new Server()
                .url("https://jsonplaceholder.typicode.com")
                .description("[2. 서버1]"),
            new Server()
                .url("https://jsonplaceholder.typicode.com/users")
                .description("[3. 서버2]")
        );
    }

}
