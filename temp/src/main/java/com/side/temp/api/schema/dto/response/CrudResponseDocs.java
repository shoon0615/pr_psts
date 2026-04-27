/**
 * packageName  : com.side.temp.api.schema.dto.response
 * fileName     : CrudResponseDocs
 * author       : SangHoon
 * date         : 2026-04-28
 * description  : CRUD 예제 OutDto 문서
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-28          SangHoon             최초 생성
 */
package com.side.temp.api.schema.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "CrudResponse", description = "CRUD 예제 응답 DTO")
public record CrudResponseDocs(
    @Schema(description = "제목", example = "제목입니다.")
    String title,

    @Schema(description = "내용", example = "내용입니다.")
    String contents
) {
}