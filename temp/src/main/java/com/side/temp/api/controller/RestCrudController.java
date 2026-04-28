/**
 * packageName  : com.side.temp.api.controller
 * fileName     : RestCrudController
 * author       : SangHoon
 * date         : 2026-04-23
 * description  :
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-23          SangHoon             최초 생성
 */
package com.side.temp.api.controller;

import com.side.temp.biz.service.CrudService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/crud")
public class RestCrudController {

    private final CrudService crudService;

    /**
     * 조회(단건)
     * @method       : findByCrud
     * @author       : SangHoon
     * @date         : 2026-04-23 오전 10:38
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> findByCrud(@PathVariable final long id) {
        return ResponseEntity.ok(Map.of("data", "success"));
    }

    /**
     * 조회(전체)
     * @method       : findAllCrud
     * @author       : SangHoon
     * @date         : 2026-04-23 오전 10:38
     */
    @GetMapping
    public ResponseEntity<?> findAllCrud() {
        return ResponseEntity.ok(List.of(Map.of("data", "success")));
    }

    /**
     * 입력
     * @method       : createCrud
     * @author       : SangHoon
     * @date         : 2026-04-23 오전 10:38
     */
    @PostMapping
//    public ResponseEntity<?> createCrud(@Valid @RequestBody final CrudRequest request) {
    public ResponseEntity<?> createCrud(final Map<String, Object> request) {
        return ResponseEntity.ok(HttpStatus.OK);
    }

    /**
     * 수정
     * @method       : modifyCrud
     * @author       : SangHoon
     * @date         : 2026-04-23 오전 10:38
     */
    @PutMapping
    public ResponseEntity<?> modifyCrud(@PathVariable final long id, final Map<String, Object> request) {
        return ResponseEntity.ok(HttpStatus.OK);
    }

    /**
     * 삭제
     * @method       : deleteCrud
     * @author       : SangHoon
     * @date         : 2026-04-23 오전 10:38
     */
    @DeleteMapping
    public ResponseEntity<?> deleteCrud(@PathVariable final long id) {
        return ResponseEntity.ok(HttpStatus.OK);
    }

}
