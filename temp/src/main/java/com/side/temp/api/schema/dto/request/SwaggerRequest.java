/**
 * packageName  : com.side.temp.api.schema.dto.request
 * fileName     : SwaggerRequest
 * author       : SangHoon
 * date         : 2026-04-27
 * description  : Swagger 예제 InDto
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-27          SangHoon             최초 생성
 */
package com.side.temp.api.schema.dto.request;

import com.side.temp.api.schema.dto.request.schema.SwaggerRequestSpec;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;

/**
 * @param title 제목
 * @param contents 내용
 */
@Builder
public record SwaggerRequest (
    @NotBlank @Size(max = 100) String title,
    String contents
) implements SwaggerRequestSpec {
}