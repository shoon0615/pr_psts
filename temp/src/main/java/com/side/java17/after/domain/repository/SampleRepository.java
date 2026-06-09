/**
 * packageName  : com.side.java17.after.domain.repository
 * fileName     : SampleRepository
 * author       : SangHoon
 * date         : 2026-04-22
 * description  :
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-22          SangHoon             최초 생성
 */
package com.side.java17.after.domain.repository;

import com.side.java17.after.domain.dto.request.SampleRecord;

import java.util.Optional;

public interface SampleRepository {

    /** TODO: 임의 */
    Optional<SampleRecord> findById(Long id);

    /** TODO: 임의 */
    SampleRecord save(SampleRecord request);

}
