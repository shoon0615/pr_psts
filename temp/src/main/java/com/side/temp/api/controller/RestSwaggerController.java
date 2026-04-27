/**
 * packageName  : com.side.temp.api.controller
 * fileName     : RestSwaggerController
 * author       : SangHoon
 * date         : 2026-04-27
 * description  : Swagger 예제 RestController
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-27          SangHoon             최초 생성
 */
package com.side.temp.api.controller;

import com.side.temp.api.schema.RestSwaggerControllerDocs;
import com.side.temp.api.schema.dto.request.SwaggerRequest;
import com.side.temp.api.schema.dto.response.SwaggerResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/swagger")
public class RestSwaggerController implements RestSwaggerControllerDocs {

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<SwaggerResponse> findBySample(@PathVariable final long id) {
        SwaggerResponse result = SwaggerResponse.builder()
            .title("제목")
            .contents("내용")
            .build();
//        return ResponseEntity.ok(new SwaggerResponse("제목", "내용"));
        return ResponseEntity.ok(result);
    }

    @Override
    @GetMapping
    public ResponseEntity<List<SwaggerResponse>> findAllSample() {
        SwaggerResponse result = SwaggerResponse.builder()
            .title("제목")
            .contents("내용")
            .build();
        return ResponseEntity.ok(List.of(result));
    }

    @Override
    @PostMapping
    public ResponseEntity<?> createSample(@RequestBody final SwaggerRequest request) {
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<?> modifySample(@PathVariable final long id,
                                          @RequestBody final SwaggerRequest request) {
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSample(@PathVariable final long id) {
        return ResponseEntity.ok(HttpStatus.OK);
    }
}
