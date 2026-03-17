/**
 * packageName  : com.side.temp2.controller
 * fileName     : RestTestController
 * author       : 이상훈
 * date         : 2026-03-16
 * description  :
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-03-16          이상훈             최초 생성
 */
package com.side.temp2.controller;

import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/test")
@RequiredArgsConstructor
public class RestTestController {

    /**
     * 리스트 조회
     * @return List
     */
    @GetMapping
    public List<String> getTestList() {
        return List.of("Item 1", "Item 2", "Item 3");
    }

    /**
     * 단건 조회
     * @param id
     * @return Map
     */
    @GetMapping("/{id}")
    public Map<String, Object> getTestDetail(@PathVariable Long id) {
        return Map.of("id", id, "status", "success");
    }

    /**
     * 데이터 등록
     * @param params
     * @return Map
     */
    @PostMapping
    public Map<String, Object> createTest(@RequestBody Map<String, Object> params) {
        return Map.of("result", "created", "data", params);
    }

    /**
     * 데이터 수정
     * @param id
     * @param params
     * @return Map
     */
    @PutMapping("/{id}")
    public Map<String, Object> updateTest(@PathVariable Long id, @RequestBody Map<String, Object> params) {
        return Map.of("id", id, "result", "updated");
    }

    /**
     * 데이터 삭제
     * @param id
     * @return Map
     */
    @DeleteMapping("/{id}")
    public Map<String, Object> deleteTest(@PathVariable Long id) {
        return Map.of("id", id, "result", "deleted");
    }
}
