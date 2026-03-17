/**
 * packageName  : com.side.temp2.repository
 * fileName     : Temp2Repository
 * author       : 이상훈
 * date         : 2026-03-16
 * description  :
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-03-16          이상훈             최초 생성
 */
package com.side.temp2.repository;

import com.side.temp2.domain.Temp2Info;
import org.springframework.stereotype.Repository;

import java.time.Instant;

@Repository
public class Temp2Repository {
    public Temp2Info findInfo() {
        return new Temp2Info("temp2 repository", Instant.now());
    }
}

