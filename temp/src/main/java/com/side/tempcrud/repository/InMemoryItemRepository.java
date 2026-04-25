package com.side.tempcrud.repository;

import com.side.tempcrud.domain.Item;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class InMemoryItemRepository implements ItemRepository {

    private final AtomicLong seq = new AtomicLong(0);
    private final ConcurrentMap<Long, Item> store = new ConcurrentHashMap<>();

    @Override
    public Item save(Item item) {
        long id = item.id();
        if (id <= 0) {
            id = seq.incrementAndGet();
        }
        Item saved = new Item(
                id,
                item.title(),
                item.content(),
                item.createdAt(),
                item.updatedAt()
        );
        store.put(id, saved);
        return saved;
    }

    @Override
    public Optional<Item> findById(long id) {
        return Optional.ofNullable(store.get(id));
    }

    @Override
    public List<Item> findAll() {
        ArrayList<Item> list = new ArrayList<>(store.values());
        list.sort(Comparator.comparingLong(Item::id));
        return list;
    }

    @Override
    public void deleteById(long id) {
        store.remove(id);
    }

    @Override
    public void deleteAll() {
        store.clear();
    }
}

