/**
 * packageName  : com.side.java17.after.domain
 * fileName     : SampleRecord
 * author       : SangHoon
 * date         : 2026-04-21
 * description  :
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-21          SangHoon             최초 생성
 */
package com.side.java17.after.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

/**
 * @param title 제목
 * @param contents 내용
 */
@Builder
public record SampleRecord(
        @NotBlank(message = "제목을 입력하세요.")
        String title,
        String contents
) {
}
