package com.side.tempcrud.domain;

import java.time.Instant;

public record Item(
        long id,
        String title,
        String content,
        Instant createdAt,
        Instant updatedAt
) {
}

