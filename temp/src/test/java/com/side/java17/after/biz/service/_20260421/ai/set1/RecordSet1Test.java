package com.side.java17.after.biz.service._20260421.ai.set1;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class RecordSet1Test {

    // TODO: compact constructor에서 정규화/검증을 직접 구현하세요.
    record OrderRequest(String orderId, String buyerEmail, int quantity, String memo) {
        public OrderRequest {
            throw new UnsupportedOperationException("TODO");
        }
    }

    @Test
    void mission1_ok_case_normalizes_email() {
        OrderRequest r = new OrderRequest("ORD-0001", "  TEST@EXAMPLE.COM ", 3, null);
        assertThat(r.buyerEmail()).isEqualTo("test@example.com");
    }

    @Test
    void mission1_invalid_orderId_rejected() {
        assertThatThrownBy(() -> new OrderRequest("0001", "a@b.com", 1, null))
            .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void mission1_invalid_quantity_rejected() {
        assertThatThrownBy(() -> new OrderRequest("ORD-0002", "a@b.com", 0, null))
            .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void mission2_equality_depends_on_components() {
        OrderRequest a = new OrderRequest("ORD-1000", "a@b.com", 2, "x");
        OrderRequest b = new OrderRequest("ORD-1000", "a@b.com", 2, "x");

        assertThat(a).isEqualTo(b);
        assertThat(a.toString()).contains("ORD-1000");
    }
}

