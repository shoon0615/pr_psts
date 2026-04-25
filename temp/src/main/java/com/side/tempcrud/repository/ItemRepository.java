package com.side.tempcrud.repository;

import com.side.tempcrud.domain.Item;

import java.util.List;
import java.util.Optional;

public interface ItemRepository {
    Item save(Item item);

    Optional<Item> findById(long id);

    List<Item> findAll();

    void deleteById(long id);

    void deleteAll();
}

