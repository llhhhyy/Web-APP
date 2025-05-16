package com.bookstore.bookstore_backend.repository;


import com.bookstore.bookstore_backend.model.cart.CartItem;
import com.bookstore.bookstore_backend.model.order.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByUserId(Long userId);
}
