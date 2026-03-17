/**
 * packageName  : com.side.temp2.controller
 * fileName     : RestTemp2Controller
 * author       : 이상훈
 * date         : 2026-03-16
 * description  :
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-03-16          이상훈             최초 생성
 */
package com.side.temp2.controller;

import com.side.temp2.domain.Temp2Info;
import com.side.temp2.service.Temp2Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/temp2")
public class RestTemp2Controller {

    private final Temp2Service temp2Service;

    @GetMapping
    public ResponseEntity<Temp2Info> findTemp2() {
        return ResponseEntity.ok(temp2Service.getInfo());
    }
}

