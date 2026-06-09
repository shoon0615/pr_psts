package com.side.tempcrud.controller;

import com.side.tempcrud.domain.ItemResponse;
import com.side.tempcrud.domain.ItemRequest;
import com.side.tempcrud.service.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/items")
public class RestItemController {

    private final ItemService itemService;

    @PostMapping
    public ResponseEntity<ItemResponse.Detail> create(@Valid @RequestBody ItemRequest.Create request) {
        var created = itemService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ItemResponse.Detail.from(created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemResponse.Detail> get(@PathVariable long id) {
        return ResponseEntity.ok(ItemResponse.Detail.from(itemService.get(id)));
    }

    @GetMapping
    public ResponseEntity<List<ItemResponse.Detail>> list() {
        var items = itemService.list().stream().map(ItemResponse.Detail::from).toList();
        return ResponseEntity.ok(items);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemResponse.Detail> update(
            @PathVariable long id,
            @Valid @RequestBody ItemRequest.Update request
    ) {
        var updated = itemService.update(id, request);
        return ResponseEntity.ok(ItemResponse.Detail.from(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        itemService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

