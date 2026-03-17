/**
 * packageName  : com.side.temptemp.controller
 * fileName     : RestTempController
 * author       : 이상훈
 * date         : 2026-03-16
 * description  :
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-03-16          이상훈             최초 생성
 */
package com.side.temptemp.controller;

import com.side.temptemp.service.TempService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class RestTempController {

    private final TempService boardService;

    @GetMapping
    public ResponseEntity<?> findByTemp() {
        return ResponseEntity.ok("test");
    }

}