/**
 * packageName  : com.side.temp.api.schema.dto.request.schema
 * fileName     : SwaggerRequestSpec
 * author       : SangHoon
 * date         : 2026-04-27
 * description  : Swagger 예제 InDto 기반
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-27          SangHoon             최초 생성
 */
package com.side.temp.api.schema.dto.request.schema;

/** Swagger 용 Request/RequestDocs 일원화(에러 방지 + interface 는 다중 구현 가능) */
public interface SwaggerRequestSpec {

    /**
     * @Deprecated interface 역할 혼재(단일 책임 원칙 위반)
     * <p>하기의 내용처럼 상수 데이터 정의 클래스를 따로 구현하여 분리</p>
     * @sample
     * {@snippet : // @UtilityClass 와 동일
     * @NoArgsConstructor(access = AccessLevel.PRIVATE)
     * public final class { public static final String }
     *}
     */
    String title = "제목";
    String contents = "내용";

    // record 기반
    /** 제목 */
    String title();
    /** 내용 */
    String contents();

    // class 기반
    /*String getTitle();
    String getContents();*/
}
