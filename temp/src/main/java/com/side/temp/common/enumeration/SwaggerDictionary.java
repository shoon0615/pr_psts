/**
 * packageName  : com.side.temp.common.enumeration
 * fileName     : SwaggerDictionary
 * author       : SangHoon
 * date         : 2026-04-27
 * description  : Swagger 기본값 정의(상수: Constant)
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-27          SangHoon             최초 생성
 */
package com.side.temp.common.enumeration;

import lombok.experimental.UtilityClass;

@UtilityClass
public class SwaggerDictionary {

    public final String ID = "PK(ID)";

    public final String SUCCESS_CODE = "200";
    public final String SUCCESS = "성공";
    public final String ERROR = "실패";

    /*public final String CREATED_CODE = "201";
    public final String CREATED = "Created";*/

    public final String BAD_REQUEST_CODE = "400";
    public final String BAD_REQUEST = "Bad Request";
    public final String UNAUTHORIZED_CODE = "401";
    public final String UNAUTHORIZED = "Unauthorized";
    public final String FORBIDDEN_CODE = "403";
    public final String FORBIDDEN = "Forbidden";
    public final String NOT_FOUND_CODE = "404";
    public final String NOT_FOUND = "Not Found";
    public final String INTERNAL_SERVER_ERROR_CODE = "500";
    public final String INTERNAL_SERVER_ERROR = "Internal Server Error";
    public final String BAD_GATEWAY_CODE = "502";
    public final String BAD_GATEWAY = "Bad Gateway";

    public final String FIND_BY = "조회(단건)";
    public final String FIND_ALL = "조회(전체)";
    public final String FIND_PAGE = "조회(페이징)";
    public final String INSERT = "입력";
    public final String UPDATE = "수정";
    public final String DELETE = "삭제";

    public final String FIND_BY_DESC = FIND_BY + " API";
    public final String FIND_ALL_DESC = FIND_ALL + " API";
    public final String FIND_PAGE_DESC = FIND_PAGE + " API";
    public final String INSERT_DESC = INSERT + " API";
    public final String UPDATE_DESC = UPDATE + " API";
    public final String DELETE_DESC = DELETE + " API";

    /** @Deprecated Constant 에는 Text Block 적용 불가 */
    @Deprecated
    public final String FIND_BY_DESC_X = """
        %s API
        """
        .formatted(FIND_BY);

    public final String LOGIN = "로그인";
    public final String SIGNUP = "회원가입";

}
