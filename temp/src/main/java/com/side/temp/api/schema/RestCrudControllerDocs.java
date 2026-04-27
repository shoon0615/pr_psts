/**
 * packageName  : com.side.temp.api.schema
 * fileName     : RestCrudControllerDocs
 * author       : SangHoon
 * date         : 2026-04-28
 * description  : CRUD 예제 RestController 문서
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-28          SangHoon             최초 생성
 */
package com.side.temp.api.schema;

import com.side.temp.api.schema.dto.request.CrudRequestDocs;
import com.side.temp.api.schema.dto.response.CrudResponseDocs;
import com.side.temp.domain.dto.request.CrudRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

@Tag(name = "CRUD", description = "CRUD 예제 API")
public interface RestCrudControllerDocs {

    @Operation(summary = "조회(단건)")
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "OK",
            content = @Content(schema = @Schema(implementation = CrudResponseDocs.class))
        ),
        @ApiResponse(responseCode = "400", description = "Bad Request"),
        @ApiResponse(responseCode = "404", description = "Not Found")
    })
    ResponseEntity<?> findByCrud(long id);

    @Operation(summary = "조회(전체)")
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = CrudResponseDocs.class)))
        ),
        @ApiResponse(responseCode = "400"),
        @ApiResponse(responseCode = "404")
    })
    ResponseEntity<?> findAllCrud();

    @Operation(
        summary = "입력",
        requestBody = @RequestBody(content = @Content(schema = @Schema(implementation = CrudRequestDocs.class)))
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200"),
        @ApiResponse(responseCode = "400"),
        @ApiResponse(responseCode = "404")
    })
    ResponseEntity<?> createCrud(CrudRequest request);

    @Operation(
        summary = "수정",
        requestBody = @RequestBody(content = @Content(schema = @Schema(implementation = CrudRequestDocs.class)))
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200"),
        @ApiResponse(responseCode = "400"),
        @ApiResponse(responseCode = "404")
    })
    ResponseEntity<?> modifyCrud(long id, CrudRequest request);

    @Operation(summary = "삭제")
    @ApiResponses({
        @ApiResponse(responseCode = "200"),
        @ApiResponse(responseCode = "400"),
        @ApiResponse(responseCode = "404")
    })
    ResponseEntity<?> deleteCrud(long id);

}
