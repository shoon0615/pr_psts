/**
 * packageName  : com.side.temp.api.schema
 * fileName     : RestSwaggerControllerDocs
 * author       : SangHoon
 * date         : 2026-04-27
 * description  : Swagger 예제 RestController 문서
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-27          SangHoon             최초 생성
 */
package com.side.temp.api.schema;

import com.side.temp.api.schema.dto.request.SwaggerRequest;
import com.side.temp.api.schema.dto.request.schema.SwaggerRequestDocs;
import com.side.temp.api.schema.dto.response.SwaggerResponse;
import com.side.temp.api.schema.dto.response.schema.SwaggerResponseDocs;
import com.side.temp.common.enumeration.SwaggerDictionary;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

import java.util.List;

/*@Tag(name = "01. 조회")
@Tag(name = "02. 생성")*/
@Tag(name = "Sample", description = "Swagger 예제 API")
public interface RestSwaggerControllerDocs {

    /**
     * `mediaType 이 여러개 | example 덮어쓰기 | example 양식이 여러개`
     * 해당 경우가 아닌 이상, 대체로 Request/Response 의 Docs 의 example 을 사용하고,
     * 그 외의 설정들 또한 springdoc 에서 자동으로 지원하기에 약식 사용 지향
     */
    @Operation(
        summary = SwaggerDictionary.FIND_BY,
        description = SwaggerDictionary.FIND_BY_DESC,
        parameters = @Parameter(
            name = SwaggerDictionary.ID,
            description = SwaggerDictionary.FIND_BY + " " + SwaggerDictionary.ID,
            required = true,
            in = ParameterIn.PATH
        )
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = SwaggerDictionary.SUCCESS_CODE,
            description = SwaggerDictionary.SUCCESS,
            content = {
                @Content(mediaType = "application/json", schema = @Schema(implementation = SwaggerResponseDocs.class)),
                @Content(
                    mediaType = "multipart/form-data",
                    schema = @Schema(implementation = SwaggerResponseDocs.class),
                    examples = {
                        @ExampleObject(
                            summary = "[Examples] 제목",
                            name = "[Example Description] 내용",
                            value = """
                                {
                                    "test1": "[Example Value]",
                                    "test2": "테스트"
                                }
                            """
                        ),
                        @ExampleObject(
                            summary = "[Examples] 제목2",
                            name = "[Example Description] 내용2",
                            value = """
                                {
                                    "test1": "[Example Value]",
                                    "test2": "테스트2"
                                }
                            """
                        )
                    }
                )
            }
        ),
        @ApiResponse(responseCode = SwaggerDictionary.BAD_REQUEST_CODE, description = SwaggerDictionary.BAD_REQUEST),
        @ApiResponse(responseCode = SwaggerDictionary.NOT_FOUND_CODE, description = SwaggerDictionary.NOT_FOUND)
    })
    ResponseEntity<?> findBySample(long id);

    /**
     * ResponseEntity 에 와일드카드(?) 대신 Response.class 주입 시, springdoc 자동 처리
     * 단순하게는 해당 내용만으로 진행해도 되지만,
     * `200(OK) 외에 다른 Error 가 발생 | ApiResponse 주입 | Request/Response 설명 부족`
     * 해당 경우들로 인해 와일드카드(?) + Request/Response 의 Docs 로 분리하여 진행
     */
    @Operation(summary = SwaggerDictionary.FIND_ALL, description = SwaggerDictionary.FIND_ALL_DESC)
    @ApiResponse(responseCode = SwaggerDictionary.SUCCESS_CODE, description = SwaggerDictionary.SUCCESS)
    ResponseEntity<List<SwaggerResponse>> findAllSample();

    /**
     * Swagger 와 @Valid 의 @RequestBody 는 다르다는 것을 반드시 유의!!
     * class 에서 @PathVariable, @RequestBody, @Valid 는 springdoc 에서 자동으로 처리
     * 따라서 설명이 필요하지 않다면 @PathVariable, @Parameter 자체나 @RequestBody(required = true) 는 생략 가능
     */
    @Operation(
        summary = SwaggerDictionary.INSERT,
        description = SwaggerDictionary.INSERT_DESC,
        requestBody = @RequestBody(
            description = "Swagger 예제 요청 Request",
            required = true,
            content = @Content(schema = @Schema(implementation = SwaggerRequestDocs.class))
        )
    )
    @ApiResponses({
        @ApiResponse(responseCode = SwaggerDictionary.SUCCESS_CODE, description = SwaggerDictionary.SUCCESS),
        @ApiResponse(responseCode = SwaggerDictionary.BAD_REQUEST_CODE, description = SwaggerDictionary.BAD_REQUEST),
        @ApiResponse(responseCode = SwaggerDictionary.NOT_FOUND_CODE, description = SwaggerDictionary.NOT_FOUND)
    })
    ResponseEntity<?> createSample(SwaggerRequest request);

    /**
     * 기본적으로 RequestDocs 는 앞선 이유로 인해 반드시 개별 매칭이 필요!!
     * <p>
     * `@Operation` 에 requestBody 가 생략되면 원래는 springdoc 에서 자동으로 @Valid @RequestBody 로 등록
     * 하지만 @Schema 에 하나라도 등록된 @Content 와 @RequestBody 의 name 이 같을 경우, 이 역시 자동으로 처리
     * 예를 들어 create 에서만 RequestDocs, update 는 Request 였더라도 name 이 같으면 update 도 RequestDocs 로 등록
     * 따라서 다른 RequestDocs 로 조회가 필요하다면 반드시 name 을 Request 와 다르게 할 것!!
     * <p/>
     * 현재는 RequestDocs 지만 `Request 와 동일하다는 의미 + 실수로 잊었더라도 등록`되도록 같은 name 으로 처리
     */
    @Operation(
        summary = SwaggerDictionary.UPDATE,
        description = SwaggerDictionary.UPDATE_DESC,
        parameters = @Parameter(name = SwaggerDictionary.ID),
        requestBody = @RequestBody(content = @Content(schema = @Schema(implementation = SwaggerRequestDocs.class)))
    )
    ResponseEntity<?> modifySample(long id, SwaggerRequest request);

    /** --- */
    @Operation(summary = SwaggerDictionary.DELETE, description = SwaggerDictionary.DELETE_DESC)
    @ApiResponse(responseCode = SwaggerDictionary.SUCCESS_CODE, description = SwaggerDictionary.SUCCESS)
    ResponseEntity<?> deleteSample(long id);

    /**
     * 약식
     * <p/>
     * 약식에 작성된 내용 정도 외에는 springdoc 및 Request/Response 의 Docs 를 통해 자동 등록되므로
     * 그 외의 기능들은 추가가 필요 없음(추후 `실무 | 필요한 경우`에만 추가)
     */
    /*@Operation(
        summary = SwaggerDictionary.FIND_ALL,
        description = SwaggerDictionary.FIND_ALL_DESC,
        requestBody = @RequestBody(content = @Content(schema = @Schema(implementation = SwaggerRequestDocs.class)))
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = SwaggerDictionary.SUCCESS_CODE,
            description = SwaggerDictionary.SUCCESS,
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = SwaggerResponseDocs.class)))
        ),
        @ApiResponse(responseCode = SwaggerDictionary.BAD_REQUEST_CODE, description = SwaggerDictionary.BAD_REQUEST),
        @ApiResponse(responseCode = SwaggerDictionary.NOT_FOUND_CODE, description = SwaggerDictionary.NOT_FOUND)
    })
    ResponseEntity<?> findAllSample(long id, SwaggerRequest request);*/

    /**
     * @Deprecated 작업 이후 추가 진행 시에 사용되는 기능
     * HATEOAS 설계에서나 사용 의미가 있고, REST API 에선 사용하지 않음
     * @sample 생성 -> 조회
     */
    /*import io.swagger.v3.oas.annotations.links.Link;
    import io.swagger.v3.oas.annotations.links.LinkParameter;

    @Operation(summary = SwaggerDictionary.INSERT)
    @ApiResponse(
        responseCode = SwaggerDictionary.CREATED_CODE,
        description = SwaggerDictionary.CREATED,
        links = @Link(
            name = "findBySampleById",
            operationId = "findBySample",   // 조회 메소드명과 일치해야함
            parameters = {
                @LinkParameter(
                    name = "id",
                    expression = "$response.body#/id"
                )
            }
        )
    )
    ResponseEntity<?> createSample(SwaggerRequest request);

    @Operation(summary = SwaggerDictionary.FIND_BY, operationId = "getSample")
    ResponseEntity<?> findBySample(long id);*/
}
