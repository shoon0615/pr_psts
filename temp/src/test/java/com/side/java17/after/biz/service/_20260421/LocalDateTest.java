package com.side.java17.after.biz.service._20260421;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * packageName  : com.side.java17.after.biz.service._20260421
 * fileName     : LocalDateTest
 * author       : SangHoon
 * date         : 2026-04-21
 * description  :
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-21          SangHoon             최초 생성
 */
@Slf4j
class LocalDateTest {

    @DisplayName("0. 답변 예제(기본)")
    @Test
    void getDate() {
        LocalDate date = LocalDate.now();
        log.debug("date = {}", date);
        assertThat(date).isNotNull();
        log.debug("성공!!");  // 생략 가능
    }

    @DisplayName("0. 답변 예제(멀티)")
    @ParameterizedTest
    @ValueSource(strings = {"20260420", "20260421"})
    void getDate(String date) {
        log.debug("date = {}", date);
        assertThat(date).isNotNull();
    }


    @DisplayName("1. 20250101 과 LocalDate 를 통해 만든 날짜가 동일하게 입력하세요.")
    @Test
    void getAnswer1() {

    }

    @DisplayName("2. 20250101 의 60일 후의 날짜를 입력하세요.")
    @Test
    void getAnswer2() {

    }

    @DisplayName("3. 20250101 ~ 20251231 에 해당하는 날짜를 입력하세요.")
    @Test
    void getAnswer3() {

    }

}