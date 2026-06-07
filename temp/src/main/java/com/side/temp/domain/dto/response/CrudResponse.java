/**
 * packageName  : com.side.temp.domain.dto.response
 * fileName     : CrudResponse
 * author       : SangHoon
 * date         : 2026-04-28
 * description  : CRUD 예제 OutDto
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-28          SangHoon             최초 생성
 */
package com.side.temp.domain.dto.response;

/**
 * @param title 제목
 * @param contents 내용
 */
public record CrudResponse(
    String title,
    String contents
) {
}