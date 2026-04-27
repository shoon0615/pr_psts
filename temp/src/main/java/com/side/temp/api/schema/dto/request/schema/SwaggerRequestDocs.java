/**
 * packageName  : com.side.temp.api.schema.dto.request.schema
 * fileName     : SwaggerRequestDocs
 * author       : SangHoon
 * date         : 2026-04-27
 * description  : Swagger 예제 InDto 문서
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-27          SangHoon             최초 생성
 */
package com.side.temp.api.schema.dto.request.schema;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * record 버전 Docs 작성법
 * <pre>
 * name 생략 시, 객체명이 자동으로 name 처리
 * example, examples 가 있지만 사실상 미구현 영역이므로 ControllerDocs 에서 추가해야함
 * implements(interface) 가 없어도 문제없지만 Request/RequestDocs 가 불일치해도 확인 불가
 * 맨 마지막에 문서화 시에만 AI 로 작업하고, 틈틈이 체크하면 없어도 될지도??(직접/AI Rules)
 * <pre/>
 */
@Schema(
    name = "SwaggerRequest",
    description = "Swagger 예제 요청 DTO"
//    , example = "{\"name\": \"홍길동\", \"email\": \"hong@test.com\"}"
)
public record SwaggerRequestDocs(
    @Schema(
        description = SwaggerRequestSpec.title,
        example = SwaggerRequestSpec.title + " 입니다.",
        maxLength = 100,
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    String title,

    @Schema(
        description = SwaggerRequestSpec.contents,
        example = SwaggerRequestSpec.contents,
        maxLength = 2000
    )
    String contents
) implements SwaggerRequestSpec {
}