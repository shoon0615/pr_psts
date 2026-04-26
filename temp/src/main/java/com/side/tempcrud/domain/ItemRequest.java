package com.side.tempcrud.domain;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class ItemRequest {

    private ItemRequest() {
    }

    public record Create(
            @NotBlank @Size(max = 100) String title,
            @NotBlank @Size(max = 2000) String content
    ) {
    }

    public record Update(
            @NotBlank @Size(max = 100) String title,
            @NotBlank @Size(max = 2000) String content
    ) {
    }
}

