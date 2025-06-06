package com.bookstore.bookstore_backend.dao.impl;

import com.bookstore.bookstore_backend.dao.OrderItemDao;
import com.bookstore.bookstore_backend.model.order.OrderItem;
import com.bookstore.bookstore_backend.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class OrderItemDaoImpl implements OrderItemDao {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Override
    public List<OrderItem> findByUserId(Long userId) {
        return orderItemRepository.findByUserId(userId);
    }

    @Override
    public OrderItem save(OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }

    @Override
    public void deleteById(Long id) {
        orderItemRepository.deleteById(id);
    }

    @Override
    public Optional<OrderItem> findById(Long id) {
        return orderItemRepository.findById(id);
    }
}