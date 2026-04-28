package com.side.java17.after.biz.service._20260421.ai.set1;

import org.junit.jupiter.api.Test;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class UtilSet1Test {

    String normalizeKeyword(String keyword) {
        throw new UnsupportedOperationException("TODO");
    }

    @Test
    void mission1_null_empty_blank_becomes_default() {
        assertThat(normalizeKeyword(null)).isEqualTo("DEFAULT");
        assertThat(normalizeKeyword("")).isEqualTo("DEFAULT");
        assertThat(normalizeKeyword("   ")).isEqualTo("DEFAULT");
    }

    @Test
    void mission1_text_is_trimmed() {
        assertThat(normalizeKeyword("  java  ")).isEqualTo("java");
        assertThat(StringUtils.hasText("  java  ")).isTrue();
    }

    Map<String, List<String>> groupByFirstLetter(List<String> names) {
        throw new UnsupportedOperationException("TODO");
    }

    @Test
    void mission2_group_names() {
        Map<String, List<String>> r = groupByFirstLetter(List.of("alice", "anna", "bob"));
        assertThat(r.get("A")).containsExactly("alice", "anna");
        assertThat(r.get("B")).containsExactly("bob");
    }

    Map<String, Integer> countWords(List<String> words) {
        Map<String, Integer> counts = new HashMap<>();
        throw new UnsupportedOperationException("TODO");
    }

    @Test
    void mission3_counts_words() {
        assertThat(countWords(List.of("a", "b", "a")))
            .containsEntry("a", 2)
            .containsEntry("b", 1);
    }
}

