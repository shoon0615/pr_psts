/**
 * packageName  : com.side.temp.api.schema.dto.response.schema
 * fileName     : SwaggerResponseDocs
 * author       : SangHoon
 * date         : 2026-04-27
 * description  : Swagger 예제 OutDto 문서
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-27          SangHoon             최초 생성
 */
package com.side.temp.api.schema.dto.response.schema;

import com.side.temp.api.schema.dto.response.SwaggerResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/** class 버전 Docs 작성법 */
//@Getter
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@Schema(name = "SwaggerResponse", description = "Swagger 예제 응답 DTO")
//public final class SwaggerResponseDocs implements SwaggerResponseSpec {
public final class SwaggerResponseDocs extends SwaggerResponse {

    @Override
    @Schema(description = "제목", example = "제목입니다.")
    public String getTitle() {
        return super.getTitle();
    }

    /*@Override
    @Schema(description = "내용", example = "내용입니다.")
    public String getContents() {
        return super.getContents();
    }*/

}