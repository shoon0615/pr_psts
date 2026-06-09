/**
 * packageName  : com.side.java17.after.biz.service._20260421
 * fileName     : RecordTest
 * author       : SangHoon
 * date         : 2026-04-21
 * description  :
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-21          SangHoon             최초 생성
 */
package com.side.java17.after.biz.service._20260421;

import com.side.java17.after.domain.dto.request.SampleRecord;
import com.side.java17.before.domain.dto.request.SampleRequest;
import com.side.java17.before.domain.dto.request.TestOneRequest;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import static org.assertj.core.api.Assertions.assertThat;

@Slf4j
public class RecordTest {

    private Validator validator;

    private SampleRequest sampleRequest;
    private SampleRecord sampleRecord;
    private TestOneRequest request;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();

        sampleRequest = SampleRequest.builder()
                .title("제목")
                .contents("내용")
                .build();
        sampleRecord = SampleRecord.builder()
                .title("제목")
                .contents("내용")
                .build();
        request = TestOneRequest.builder()
                .title("제목")
                .contents("내용")
                .saleDate(LocalDate.parse("20260101", DateTimeFormatter.BASIC_ISO_DATE))
                .contents("내용")
                .build();
    }

    @DisplayName("0. 답변 예제(기본)")
    @Test
    void getRequest() {
        log.debug("request = {}, record = {}", sampleRequest, sampleRecord);
        assertThat(sampleRequest.getTitle()).isNotNull().isEqualTo("제목");
        assertThat(sampleRequest.getContents()).isEqualTo("내용");
        assertThat(sampleRequest).usingRecursiveComparison().isEqualTo(sampleRecord);
    }

    @DisplayName("0. 답변 예제(검증)")
    @Test
    void getValid() {
        log.debug("request = {}", sampleRequest);
//        Set<ConstraintViolation<SampleRequest>> valid = validator.validate(sampleRequest);
        var valid = validator.validate(sampleRequest);
        log.debug("valid = {}", valid);
        assertThat(valid).isEmpty();
    }

    @DisplayName("""
        1. 예제와 같은 형태의 record 를 완성하세요.
            *은 필수 입력값입니다.
            입력값은 request 와 같습니다.
    """)
    @Test
    void getAnswer1() {

    }

    @DisplayName("2. 1번의 예제에서 필수값마다 임의의 유효성 검증 로직을 추가하세요.")
    @Test
    void getAnswer2() {

    }

}
