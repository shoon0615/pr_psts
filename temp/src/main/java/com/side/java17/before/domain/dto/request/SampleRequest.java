/**
 * packageName  : com.side.java17.before.domain
 * fileName     : SampleRecord
 * author       : SangHoon
 * date         : 2026-04-21
 * description  :
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-21          SangHoon             최초 생성
 */
package com.side.java17.before.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SampleRequest {

    /** 제목 */
    @NotBlank(message = "제목을 입력하세요.")
    private String title;

    /** 내용 */
    private String contents;

}
