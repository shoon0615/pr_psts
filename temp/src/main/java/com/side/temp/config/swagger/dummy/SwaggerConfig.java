/**
 * packageName  : com.side.temp.config.swagger.dummy
 * fileName     : SwaggerConfig
 * author       : SangHoon
 * date         : 2026-04-27
 * description  : (부적합) Swagger 환경설정 구성
 *                  사용은 가능하지만, 개발 환경(개발/운영) 분리 및
 *                  Spring 설정이나 @Value 값 주입 등이 안되어
 *                  유연성/재사용성의 부족으로 단순 적용시에만 적합
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-27          SangHoon             최초 생성
 */
package com.side.temp.config.swagger.dummy;

/*import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
    info = @Info(
        title = "[제목] Spring Boot REST API",
        version = "v1",
        description = "[내용] CRUD 테스트 Swagger",
        termsOfService = "http://swagger.io/terms/",
        contact = @Contact(
            name = "Backend Team",
            url = "https://github.com",
            email = "backend@company.com"
        ),
        license = @License(
            name = "Apache License Version 2.0",
            url = "http://www.apache.org/licenses/LICENSE-2.0"
        )
    ),
    servers = @Server(
        url = "https://api.company.com",
        description = "[서버] API"
    )
)*/
@Deprecated
public class SwaggerConfig {
}
