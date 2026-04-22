package com.side.java17.after.biz.service._20260421.ai.set1;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SwitchSet1Test {

    String message(String status) {
        throw new UnsupportedOperationException("TODO");
    }

    @Test
    void mission1_maps_status() {
        assertThat(message("NEW")).isEqualTo("접수");
        assertThat(message("PAID")).isEqualTo("결제완료");
        assertThat(message("X")).isEqualTo("UNKNOWN");
    }

    enum Group { KID, TEEN, ADULT, SENIOR }

    Group group(int age) {
        throw new UnsupportedOperationException("TODO");
    }

    @Test
    void mission2_groups_age() {
        assertThat(group(9)).isEqualTo(Group.KID);
        assertThat(group(17)).isEqualTo(Group.TEEN);
        assertThat(group(30)).isEqualTo(Group.ADULT);
        assertThat(group(80)).isEqualTo(Group.SENIOR);
    }
}

