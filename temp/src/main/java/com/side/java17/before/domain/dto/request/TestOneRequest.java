/**
 * packageName  : com.side.java17.before.domain
 * fileName     : TestOneRequest
 * author       : SangHoon
 * date         : 2026-04-21
 * description  :
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-21          SangHoon             최초 생성
 */
package com.side.java17.before.domain.dto.request;

import lombok.*;

import java.time.LocalDate;

//@Data
@Getter
//@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@ToString
@Builder
public class TestOneRequest {

    private String title;
    private String contents;
    private LocalDate saleDate;
    private String email;

}
