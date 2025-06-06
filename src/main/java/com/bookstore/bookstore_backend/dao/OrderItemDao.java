package com.bookstore.bookstore_backend.dao;

import com.bookstore.bookstore_backend.model.order.OrderItem;
import java.util.List;
import java.util.Optional;

public interface OrderItemDao {
    List<OrderItem> findByUserId(Long userId);
    OrderItem save(OrderItem orderItem);
    void deleteById(Long id);
    Optional<OrderItem> findById(Long id);
}