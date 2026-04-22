package com.side.java17.after.biz.service._20260421.ai.set1;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class SyntaxSet1Test {

    record Member(long id, String nickname) {}

    String findNicknameLoop(List<Member> members, long id) {
        for (Member m : members) {
            if (m.id() == id) {
                return m.nickname();
            }
        }
        return null;
    }

    String findNicknameStream(List<Member> members, long id) {
        throw new UnsupportedOperationException("TODO");
    }

    @Test
    void mission1_same_result() {
        var members = List.of(new Member(1, "a"), new Member(2, "b"));
        assertThat(findNicknameStream(members, 2)).isEqualTo(findNicknameLoop(members, 2));
        assertThat(findNicknameStream(members, 999)).isNull();
    }

    @Test
    void mission2_method_reference_practice() {
        List<String> raw = List.of("  A  ", "  b", "C  ");

        List<String> normalized = raw.stream()
            .map(s -> s.trim())
            .map(s -> s.toLowerCase())
            .toList();

        assertThat(normalized).containsExactly("a", "b", "c");
    }
}

