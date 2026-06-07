/**
 * packageName  : com.side.java17.after.biz.service
 * fileName     : SampleService
 * author       : SangHoon
 * date         : 2026-04-21
 * description  :
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-21          SangHoon             최초 생성
 */
package com.side.java17.after.biz.service;

import com.side.java17.after.biz.useCase.SampleUseCase;
import com.side.java17.after.domain.dto.request.SampleRecord;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
//@Transactional(readOnly = true)
public class SampleService implements SampleUseCase {

//    private final SampleRepository sampleRepository;

    @Override
    public Map<String, Object> findBy(final Long id) {
        return Map.of("key", "value");
    }

    @Override
    public List<Map<String, Object>> findAll() {
        return List.of(Map.of());
    }

    @Override
//    @Transactional
    public void insert(SampleRecord request) {

    }

}
