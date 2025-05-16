package com.bookstore.bookstore_backend.controller;

import com.bookstore.bookstore_backend.model.ResponseMessage;
import com.bookstore.bookstore_backend.model.order.OrderItem;
import com.bookstore.bookstore_backend.model.order.OrderItemDTO;
import com.bookstore.bookstore_backend.services.order.IOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order")
public class OrderController {
    @Autowired
    private IOrderService orderService;

    @GetMapping("/get/{userId}")
    public ResponseMessage<List<OrderItem>> getUserOrder(@PathVariable Long userId) {
        return ResponseMessage.success(orderService.getUserOrder(userId));
    }

    @PostMapping("/add/{userId}")
    public ResponseMessage<OrderItem> addBookToOrder(@PathVariable Long userId,
                                                     @RequestBody OrderItemDTO orderItemDTO) {
        OrderItem orderItem = orderService.addBookToOrder(userId,orderItemDTO);
        return ResponseMessage.success(orderItem);
    }
}
