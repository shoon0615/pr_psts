/**
 * packageName  : com.side.temp.domain.dto.request
 * fileName     : CrudRequest
 * author       : SangHoon
 * date         : 2026-04-28
 * description  : CRUD 예제 InDto
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-28          SangHoon             최초 생성
 */
package com.side.temp.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;

/**
 * @param title 제목
 * @param contents 내용
 */
@Builder
public record CrudRequest(
    @NotBlank(message = "제목을 입력하세요.")
    @Size(max = 100, message = "제목은 최대 100글자까지만 입력 가능합니다.")
    String title,

    @Size(max = 2000, message = "제목은 최대 2000글자까지만 입력 가능합니다.")
    String contents
) {
}