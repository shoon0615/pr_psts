package com.side.java17.after.biz.service._20260421.ai.set1;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;

class FunctionalSet1Test {

    record Item(String category, int price, boolean soldOut) {}

    Map<String, Double> avgPriceByCategory(List<Item> items) {
        throw new UnsupportedOperationException("TODO");
    }

    @Test
    void mission1_avg_by_category_only_available() {
        var items = List.of(
            new Item("A", 100, false),
            new Item("A", 300, false),
            new Item("A", 999, true),
            new Item("B", 200, false)
        );

        assertThat(avgPriceByCategory(items))
            .containsEntry("A", 200.0)
            .containsEntry("B", 200.0);
    }

    String firstValidEmailOrNull(List<String> rawEmails) {
        throw new UnsupportedOperationException("TODO");
    }

    @Test
    void mission2_finds_first_valid() {
        assertThat(firstValidEmailOrNull(List.of(" ", "NOPE", " A@B.COM ", "c@d.com")))
            .isEqualTo("a@b.com");
    }

    @Test
    void mission2_returns_null_when_none() {
        assertThat(firstValidEmailOrNull(List.of(" ", "x", ""))).isNull();
    }

    String expensiveDefault(AtomicInteger counter) {
        counter.incrementAndGet();
        return "DEFAULT";
    }

    @Test
    void mission3_orElseGet_is_lazy() {
        AtomicInteger calls = new AtomicInteger(0);

        String v1 = Optional.of("OK").orElse(expensiveDefault(calls));
        String v2 = Optional.of("OK").orElseGet(() -> expensiveDefault(calls));

        assertThat(v1).isEqualTo("OK");
        assertThat(v2).isEqualTo("OK");

        // TODO: orElse/orElseGet 차이를 이해하고 기대값을 맞춰라.
        assertThat(calls.get()).isEqualTo(-1);
    }
}

