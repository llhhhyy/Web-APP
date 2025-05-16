package com.bookstore.bookstore_backend.services.order;

import com.bookstore.bookstore_backend.model.cart.CartItem;
import com.bookstore.bookstore_backend.model.order.OrderItem;
import com.bookstore.bookstore_backend.model.order.OrderItemDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface IOrderService {
    List<OrderItem> getUserOrder(Long userId);
    OrderItem addBookToOrder(Long userId,OrderItemDTO orderItemDTO);
}
