/**
 * packageName  : com.side.temp.api.schema.dto.request
 * fileName     : CrudRequestDocs
 * author       : SangHoon
 * date         : 2026-04-28
 * description  : CRUD 예제 InDto 문서
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-28          SangHoon             최초 생성
 */
package com.side.temp.api.schema.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "CrudRequest", description = "CRUD 예제 요청 DTO")
public record CrudRequestDocs(
    @Schema(description = "제목", example = "제목입니다.", maxLength = 100, requiredMode = Schema.RequiredMode.REQUIRED)
    String title,

    @Schema(description = "내용", example = "내용입니다.", maxLength = 2000)
    String contents
) {
}