package com.side.tempcrud.domain;

import java.time.Instant;

public final class ItemResponse {

    private ItemResponse() {
    }

    public record Detail(
            long id,
            String title,
            String content,
            Instant createdAt,
            Instant updatedAt
    ) {
        public static Detail from(Item item) {
            return new Detail(
                    item.id(),
                    item.title(),
                    item.content(),
                    item.createdAt(),
                    item.updatedAt()
            );
        }
    }
}

