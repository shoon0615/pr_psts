package com.side.java17.after.biz.service._20260421.ai.set2;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

@Slf4j
class SwitchSet2MissionTest {

    enum Level { DEBUG, INFO, WARN, ERROR }

    @DisplayName("1. 임의 과제: 로그 레벨을 숫자 우선순위로 매핑하라(switch expression)")
    @Test
    void mission_1_priority() {
        assertThat(priority(Level.DEBUG)).isEqualTo(1);
        assertThat(priority(Level.ERROR)).isEqualTo(4);
    }

    int priority(Level level) {
        throw new UnsupportedOperationException("TODO");
    }

    @DisplayName("2. 임의 과제: 입력 문자열을 표준 레벨로 변환하라(null/공백은 INFO)")
    @Test
    void mission_2_parse_level() {
        assertThat(parseLevel(null)).isEqualTo(Level.INFO);
        assertThat(parseLevel("  ")).isEqualTo(Level.INFO);
        assertThat(parseLevel("warn")).isEqualTo(Level.WARN);
    }

    Level parseLevel(String raw) {
        throw new UnsupportedOperationException("TODO");
    }
}

