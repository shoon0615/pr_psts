/**
 * packageName  : com.side.java17.after.biz.useCase
 * fileName     : SampleUseCase
 * author       : SangHoon
 * date         : 2026-04-21
 * description  :
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-21          SangHoon             최초 생성
 */
package com.side.java17.after.biz.useCase;

import com.side.java17.after.domain.dto.request.SampleRecord;

import java.util.List;
import java.util.Map;

public interface SampleUseCase {

    /** 조회(단일) */
    Map<String, Object> findBy(Long id);

    /** 조회(전체) */
    List<Map<String, Object>> findAll();

    /** 입력 */
    void insert(SampleRecord request);

}
