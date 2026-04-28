package com.side.java17.after.biz.service._20260421.ai.set2;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@Slf4j
class RecordSet2MissionTest {

    record Coupon(String code, LocalDate expiresAt, int percent) {
        public Coupon {
            throw new UnsupportedOperationException("TODO");
        }
    }

    private Coupon base;

    @BeforeEach
    void setUp() {
        base = new Coupon(" cpn-abc12345 ", LocalDate.now().plusDays(30), 10);
    }

    @DisplayName("0. 워밍업: record는 equals/toString이 자동 생성된다")
    @Test
    void warmup_equals_and_toString() {
        Coupon a = new Coupon("CPN-ABC12345", base.expiresAt(), 10);
        Coupon b = new Coupon("CPN-ABC12345", base.expiresAt(), 10);

        assertThat(a).isEqualTo(b);
        assertThat(a.toString()).contains("CPN-ABC12345");
    }

    @DisplayName("1. 임의 과제: code는 trim + 대문자 정규화 된다")
    @Test
    void mission_1_code_normalize() {
        assertThat(base.code()).isEqualTo("CPN-ABC12345");
    }

    @DisplayName("2. 임의 과제: percent 범위를 벗어나면 예외")
    @Test
    void mission_2_percent_range() {
        assertThatThrownBy(() -> new Coupon("CPN-AAA11111", LocalDate.now().plusDays(1), 0))
            .isInstanceOf(IllegalArgumentException.class);
    }
}

