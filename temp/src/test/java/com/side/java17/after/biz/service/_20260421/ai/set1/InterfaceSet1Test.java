package com.side.java17.after.biz.service._20260421.ai.set1;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class InterfaceSet1Test {

    interface ScorePolicy {
        default int score(int base) {
            return base + bonus(base);
        }

        private int bonus(int base) {
            return bonusRate() * base / 100;
        }

        int bonusRate();

        static ScorePolicy of(String grade) {
            throw new UnsupportedOperationException("TODO");
        }
    }

    static class VipPolicy implements ScorePolicy {
        @Override
        public int bonusRate() {
            throw new UnsupportedOperationException("TODO");
        }
    }

    static class NormalPolicy implements ScorePolicy {
        @Override
        public int bonusRate() {
            throw new UnsupportedOperationException("TODO");
        }
    }

    @Test
    void mission1_vip_gets_more_bonus() {
        ScorePolicy vip = new VipPolicy();
        ScorePolicy normal = new NormalPolicy();

        assertThat(vip.score(100)).isGreaterThan(normal.score(100));
    }

    @Test
    void mission2_factory_selects_policy() {
        assertThat(ScorePolicy.of("VIP")).isInstanceOf(VipPolicy.class);
        assertThat(ScorePolicy.of("X")).isInstanceOf(NormalPolicy.class);
    }
}

