/**
 * packageName  : com.side.java17.common.domain
 * fileName     : BaseRequest
 * author       : SangHoon
 * date         : 2026-04-21
 * description  :
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-21          SangHoon             최초 생성
 */
package com.side.java17.common.domain;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public abstract class BaseRequest {

    /** 생성일자 */
    protected LocalDateTime createdDate = LocalDateTime.now();

    /** 생성자 */
    protected Long createdBy = 9999L;

    /** 삭제여부 */
    protected String deleteYn = "N";

    // 필수 메소드
//    abstract void required();

    /** TODO: 임시 */
    @Override
    public String toString() {
        return """
        (
            createdDate='%s',
            createdBy='%s',
            deleteYn='%s'
        )""".formatted(createdDate, createdBy, deleteYn);
    }

}
