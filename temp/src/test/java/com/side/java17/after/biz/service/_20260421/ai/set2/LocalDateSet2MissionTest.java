package com.side.java17.after.biz.service._20260421.ai.set2;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import static org.assertj.core.api.Assertions.assertThat;

@Slf4j
class LocalDateSet2MissionTest {

    LocalDate parseBasic(String yyyymmdd) {
        throw new UnsupportedOperationException("TODO");
    }

    @DisplayName("0. 워밍업: BASIC_ISO_DATE 파싱/포맷 왕복")
    @ParameterizedTest
    @ValueSource(strings = {"20260131", "20260201", "20261231"})
    void warmup_roundtrip(String yyyymmdd) {
        LocalDate d = parseBasic(yyyymmdd);
        assertThat(d.format(DateTimeFormatter.BASIC_ISO_DATE)).isEqualTo(yyyymmdd);
    }

    LocalDate nearestFriday(LocalDate any) {
        throw new UnsupportedOperationException("TODO");
    }

    @DisplayName("1. 임의 과제: 가장 가까운 '이전 금요일' 찾기")
    @Test
    void mission_1_nearest_previous_friday() {
        assertThat(nearestFriday(LocalDate.of(2026, 4, 22)))
            .isEqualTo(LocalDate.of(2026, 4, 17));
    }

    String quarter(LocalDate any) {
        throw new UnsupportedOperationException("TODO");
    }

    @DisplayName("2. 임의 과제: 분기(Quarter) 계산")
    @ParameterizedTest
    @ValueSource(strings = {"20260101", "20260401", "20260731", "20261010"})
    void mission_2_quarter(String yyyymmdd) {
        LocalDate d = LocalDate.parse(yyyymmdd, DateTimeFormatter.BASIC_ISO_DATE);
        String q = quarter(d);
        assertThat(q).isIn("Q1", "Q2", "Q3", "Q4");
    }

    long daysUntilNextBirthday(LocalDate today, String birthdayMMdd) {
        throw new UnsupportedOperationException("TODO");
    }

    @DisplayName("3. 임의 과제: 다음 생일까지 남은 일수 계산")
    @Test
    void mission_3_days_until_next_birthday() {
        assertThat(daysUntilNextBirthday(LocalDate.of(2026, 4, 22), "0422")).isEqualTo(0);
        assertThat(daysUntilNextBirthday(LocalDate.of(2026, 4, 23), "0422")).isGreaterThan(0);
    }
}

