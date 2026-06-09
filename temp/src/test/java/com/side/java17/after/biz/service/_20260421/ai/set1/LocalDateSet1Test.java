package com.side.java17.after.biz.service._20260421.ai.set1;

import org.junit.jupiter.api.Test;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import static org.assertj.core.api.Assertions.assertThat;

class LocalDateSet1Test {

    LocalDate settleDate(String yyyymmdd) {
        throw new UnsupportedOperationException("TODO");
    }

    @Test
    void mission1_weekend_moves_to_monday() {
        assertThat(settleDate("20260425"))
            .isEqualTo(LocalDate.parse("20260427", DateTimeFormatter.BASIC_ISO_DATE))
            .extracting(LocalDate::getDayOfWeek)
            .isEqualTo(DayOfWeek.MONDAY);

        assertThat(settleDate("20260426"))
            .isEqualTo(LocalDate.parse("20260427", DateTimeFormatter.BASIC_ISO_DATE));

        assertThat(settleDate("20260427"))
            .isEqualTo(LocalDate.parse("20260427", DateTimeFormatter.BASIC_ISO_DATE));
    }

    LocalDate nextMonthLastDay(LocalDate any) {
        throw new UnsupportedOperationException("TODO");
    }

    @Test
    void mission2_next_month_last_day_handles_leap_year() {
        assertThat(nextMonthLastDay(LocalDate.of(2026, 1, 10)))
            .isEqualTo(LocalDate.of(2026, 2, 28));

        assertThat(nextMonthLastDay(LocalDate.of(2024, 1, 10)))
            .isEqualTo(LocalDate.of(2024, 2, 29));
    }

    long businessDays(LocalDate startInclusive, LocalDate endInclusive) {
        throw new UnsupportedOperationException("TODO");
    }

    @Test
    void mission3_business_days_count() {
        assertThat(businessDays(LocalDate.of(2026, 4, 20), LocalDate.of(2026, 4, 26)))
            .isEqualTo(5);
    }
}

