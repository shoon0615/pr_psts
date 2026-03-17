/**
 * packageName  : com.side.temp2.domain
 * fileName     : Temp2Info
 * author       : 이상훈
 * date         : 2026-03-16
 * description  :
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-03-16          이상훈             최초 생성
 */
package com.side.temp2.domain;

import java.time.Instant;

public record Temp2Info(
        String message,
        Instant createdAt
) {
}

