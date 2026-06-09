package com.side.tempcrud.service;

public class ItemNotFoundException extends RuntimeException {
    public ItemNotFoundException(long id) {
        super("Item not found. id=" + id);
    }
}

