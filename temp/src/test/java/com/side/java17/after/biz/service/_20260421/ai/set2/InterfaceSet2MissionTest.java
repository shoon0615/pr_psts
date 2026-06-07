package com.side.java17.after.biz.service._20260421.ai.set2;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

@Slf4j
class InterfaceSet2MissionTest {

    interface Masking {
        default String mask(String raw) {
            if (raw == null) return null;
            String t = raw.trim();
            if (t.length() <= 2) return t;
            return head(t) + "*".repeat(t.length() - 2) + tail(t);
        }

        private String head(String t) { return t.substring(0, 1); }

        private String tail(String t) { return t.substring(t.length() - 1); }

        static Masking simple() {
            return new Masking() {};
        }
    }

    @DisplayName("1. 임의 과제: default+private로 마스킹 규칙 구현")
    @Test
    void mission_1_masking() {
        Masking m = Masking.simple();
        assertThat(m.mask("  hello  ")).isEqualTo("h***o");
        assertThat(m.mask("ab")).isEqualTo("ab");
    }
}

