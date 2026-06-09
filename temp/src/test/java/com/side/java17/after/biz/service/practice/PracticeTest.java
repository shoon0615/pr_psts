package com.side.java17.after.biz.service.practice;

import com.side.java17.after.domain.dto.request.SampleRecord;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * packageName  : com.side.java17.after.biz.service.practice
 * fileName     : PracticeTest
 * author       : SangHoon
 * date         : 2026-04-21
 * description  :
 *                  TODO: https://jforj.tistory.com/359
 *                  String date = request.date().format(DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm:ss"));
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-21          SangHoon             최초 생성
 */
@Slf4j
@ExtendWith(MockitoExtension.class)
//@MockitoSettings(strictness = Strictness.LENIENT)
@ActiveProfiles("local")
class PracticeTest {

    record TestRequest(
        LocalDateTime date
    ) {}
    TestRequest request;
    SampleRecord record;

    @BeforeEach
    void setUp() {
        request = new TestRequest(
            LocalDateTime.now()
        );

        record = SampleRecord.builder()
            .build();
    }

    @DisplayName("0. 답변 예제(기본)")
    @Test
    void getDate() {
        log.debug("date = {}", request.date());
        assertThat(request.date()).isNotNull();
        log.debug("성공!!");  // 생략 가능
    }

    @DisplayName("0. 답변 예제(멀티)")
    @ParameterizedTest
    @ValueSource(strings = {"20260420", "20260421"})
    void getDate(String date) {
        log.debug("date = {}", date);
        assertThat(date).isNotNull();
    }

    @DisplayName("0. 답변 예제(Entity)")
    @Test
    void getEntity() {
        log.debug("request = {}, record = {}", request, record);
        assertThat(request)
            .usingRecursiveComparison()
            .isEqualTo(record);
    }

}