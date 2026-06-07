/**
 * packageName  : com.side.temp.api.controller
 * fileName     : RestTestController
 * author       : SangHoon
 * date         : 2026-04-15
 * description  :
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-15          SangHoon             최초 생성
 */
package com.side.temp.api.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/test")
@RequiredArgsConstructor
public class RestTestController {

    @GetMapping
    public List<String> getTestList() {
        return List.of("Item 1", "Item 2", "Item 3");
    }

}
