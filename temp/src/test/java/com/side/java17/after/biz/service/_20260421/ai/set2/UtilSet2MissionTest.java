package com.side.java17.after.biz.service._20260421.ai.set2;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@Slf4j
class UtilSet2MissionTest {

    @DisplayName("1. 임의 과제: StringUtils로 '표시용 이름' 만들기(null/blank면 'GUEST')")
    @Test
    void mission_1_displayName() {
        assertThat(displayName(null)).isEqualTo("GUEST");
        assertThat(displayName("   ")).isEqualTo("GUEST");
        assertThat(displayName("  Alice ")).isEqualTo("Alice");
        assertThat(StringUtils.hasText("  Alice ")).isTrue();
    }

    String displayName(String name) {
        throw new UnsupportedOperationException("TODO");
    }

    @DisplayName("2. 임의 과제: CollectionUtils로 '마지막 태그' 가져오기(없으면 null)")
    @Test
    void mission_2_lastTag() {
        assertThat(lastTag(null)).isNull();
        assertThat(lastTag(List.of())).isNull();
        assertThat(lastTag(List.of("a", "b"))).isEqualTo("b");
    }

    String lastTag(List<String> tags) {
        throw new UnsupportedOperationException("TODO");
    }

    @DisplayName("3. 임의 과제: putIfAbsent로 '기본 설정' 주입하기")
    @Test
    void mission_3_putIfAbsent_defaults() {
        Map<String, String> config = new HashMap<>();
        config.put("mode", "prod");

        applyDefaults(config);

        assertThat(config.get("mode")).isEqualTo("prod");
        assertThat(config.get("timezone")).isEqualTo("Asia/Seoul");
    }

    void applyDefaults(Map<String, String> config) {
        if (CollectionUtils.isEmpty(config)) {
            throw new IllegalArgumentException("config required");
        }
        throw new UnsupportedOperationException("TODO");
    }
}

