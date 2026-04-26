package com.side.tempcrud.service;

import com.side.tempcrud.domain.Item;
import com.side.tempcrud.domain.ItemRequest;
import com.side.tempcrud.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;

    public Item create(ItemRequest.Create request) {
        Instant now = Instant.now();
        Item item = new Item(0, request.title(), request.content(), now, now);
        return itemRepository.save(item);
    }

    public Item get(long id) {
        return itemRepository.findById(id).orElseThrow(() -> new ItemNotFoundException(id));
    }

    public List<Item> list() {
        return itemRepository.findAll();
    }

    public Item update(long id, ItemRequest.Update request) {
        Item current = get(id);
        Instant now = Instant.now();
        Item updated = new Item(current.id(), request.title(), request.content(), current.createdAt(), now);
        return itemRepository.save(updated);
    }

    public void delete(long id) {
        if (itemRepository.findById(id).isEmpty()) {
            throw new ItemNotFoundException(id);
        }
        itemRepository.deleteById(id);
    }
}

