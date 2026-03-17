/**
 * packageName  : com.side.temp2.service
 * fileName     : Temp2Service
 * author       : 이상훈
 * date         : 2026-03-16
 * description  :
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-03-16          이상훈             최초 생성
 */
package com.side.temp2.service;

import com.side.temp2.domain.Temp2Info;
import com.side.temp2.repository.Temp2Repository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class Temp2Service {

    private final Temp2Repository temp2Repository;

    public Temp2Info getInfo() {
        return temp2Repository.findInfo();
    }
}

