package com.bookstore.bookstore_backend.controller;

import com.bookstore.bookstore_backend.model.ResponseMessage;
import com.bookstore.bookstore_backend.model.User.User;
import com.bookstore.bookstore_backend.model.order.OrderItem;
import com.bookstore.bookstore_backend.model.order.OrderItemDTO;
import com.bookstore.bookstore_backend.model.order.OrderStatisticsDTO;
import com.bookstore.bookstore_backend.repository.UserRepository;
import com.bookstore.bookstore_backend.services.order.IOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/order")
public class OrderController {
    @Autowired
    private IOrderService orderService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/get")
    public ResponseMessage<List<OrderItem>> getUserOrder() {
        // 从安全上下文获取当前用户名
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // 根据用户名查询用户ID
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("用户不存在"));

        return ResponseMessage.success(orderService.getUserOrder(user.getId()));
    }

    @PostMapping("/add")
    public ResponseMessage<OrderItem> addBookToOrder(@RequestBody OrderItemDTO orderItemDTO) {
        try {
            // 从安全上下文获取当前用户名
            String username = SecurityContextHolder.getContext().getAuthentication().getName();

            // 根据用户名查询用户ID
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new IllegalArgumentException("用户不存在"));

            // 覆盖DTO中的用户ID
            orderItemDTO.setUserId(user.getId());

            OrderItem orderItem = orderService.addBookToOrder(user.getId(), orderItemDTO);
            return ResponseMessage.success(orderItem);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseMessage<List<OrderItem>> searchUserOrders(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        // 从安全上下文获取当前用户名
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // 根据用户名查询用户ID
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("用户不存在"));

        return ResponseMessage.success(orderService.searchUserOrders(user.getId(), keyword, startTime, endTime));
    }

    @GetMapping("/admin/search")
    public ResponseMessage<List<OrderItem>> searchAllOrders(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {

        return ResponseMessage.success(orderService.searchAllOrders(keyword, startTime, endTime));
    }

    @GetMapping("/statistics")
    public ResponseMessage<OrderStatisticsDTO> getUserOrderStatistics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("用户不存在"));
        OrderStatisticsDTO stats = orderService.getUserOrderStatistics(user.getId(), startTime, endTime);
        return ResponseMessage.success(stats);
    }

}