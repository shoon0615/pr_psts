/**
 * packageName  : com.side.java17.after.biz.service.practice
 * fileName     : PracticeRequest
 * author       : SangHoon
 * date         : 2026-04-22
 * description  :
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-22          SangHoon             최초 생성
 */
package com.side.java17.after.biz.service.practice;

import com.side.java17.common.domain.BaseRequest;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
//@SuperBuilder
public class PracticeRequest extends BaseRequest {

    /** 고유 ID(PK) */
//    private Long id;

    /** 제목 */
    @NotBlank(message = "제목을 입력하세요.")
    private String title;

    /** 내용 */
    private String contents;

    /*// 재고
    @NotNull(message = "재고를 입력하세요.")
    @PositiveOrZero(message = "재고 형식이 올바르지 않습니다.")
    private Integer qty;

    // 가격
    @NotNull(message = "가격을 입력하세요.")
    @DecimalMin(value = "0.0",
                inclusive = false,  // 0.0 포함/미포함 여부
                message = "가격은 0보다 커야 합니다.")
    @Digits(integer = 7,
            fraction = 2,
            message = "가격 형식이 올바르지 않습니다.")   // 정수 7자리, 소수점 2자리
    private BigDecimal price;

    // 비밀번호
    @NotBlank(message = "비밀번호를 입력하세요.")
    @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@$%^&*])[a-zA-Z0-9!@$%^&*]{8,20}",
            message = "영문, 숫자, 특수문자를 포함한 8~20 자리로 입력하세요.")
    private String password;

    // 날짜
    @NotBlank(message = "날짜를 입력하세요.")
    @PastOrPresent(message = "현재까지의 날짜만 가능합니다.")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
    private LocalDate date;

    // 이메일
    @NotBlank(message = "이메일을 입력하세요.")
    @Email(message = "이메일 형식을 확인하세요.")
    private String email;

    // 이용약관
    @AssertTrue(message = "이용약관에 동의해주세요.")
    private Boolean agree;*/

}

