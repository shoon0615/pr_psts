/**
 * packageName  : com.side.temp.api.schema.dto.response
 * fileName     : SwaggerResponse
 * author       : SangHoon
 * date         : 2026-04-27
 * description  : Swagger 예제 OutDto
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-27          SangHoon             최초 생성
 */
package com.side.temp.api.schema.dto.response;

import lombok.*;

@Getter
@ToString(callSuper = true)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class SwaggerResponse {

    /** 제목 */
    private String title;

    /** 내용 */
    private String contents;

}
