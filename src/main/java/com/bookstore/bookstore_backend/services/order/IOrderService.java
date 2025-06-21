package com.bookstore.bookstore_backend.services.order;

import com.bookstore.bookstore_backend.model.order.OrderItem;
import com.bookstore.bookstore_backend.model.order.OrderItemDTO;
import com.bookstore.bookstore_backend.model.order.OrderStatisticsDTO;

import java.time.LocalDateTime;
import java.util.List;

public interface IOrderService {
    List<OrderItem> getUserOrder(Long userId);
    OrderItem addBookToOrder(Long userId, OrderItemDTO orderItemDTO);
    List<OrderItem> searchUserOrders(Long userId, String keyword, LocalDateTime startTime, LocalDateTime endTime);
    List<OrderItem> searchAllOrders(String keyword, LocalDateTime startTime, LocalDateTime endTime);
    OrderStatisticsDTO getUserOrderStatistics(Long userId, LocalDateTime startTime, LocalDateTime endTime);
}