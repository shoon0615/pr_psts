/**
 * packageName  : com.side.temp.biz.service
 * fileName     : CrudService
 * author       : SangHoon
 * date         : 2026-04-23
 * description  :
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-23          SangHoon             최초 생성
 */
package com.side.temp.biz.service;

import com.side.temp.biz.useCase.CrudUseCase;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
//@Transactional(readOnly = true)
public class CrudService implements CrudUseCase {

    @Override
    public void Sample() {

    }

}
