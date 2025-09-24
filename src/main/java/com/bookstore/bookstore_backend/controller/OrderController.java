package com.bookstore.bookstore_backend.controller;

import com.bookstore.bookstore_backend.model.ResponseMessage;
import com.bookstore.bookstore_backend.model.User.User;
import com.bookstore.bookstore_backend.model.order.OrderItem;
import com.bookstore.bookstore_backend.model.order.OrderItemDTO;
import com.bookstore.bookstore_backend.model.order.OrderMessage;
import com.bookstore.bookstore_backend.model.order.OrderStatisticsDTO;
import com.bookstore.bookstore_backend.repository.UserRepository;
import com.bookstore.bookstore_backend.services.IOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.kafka.core.KafkaTemplate;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/order")
public class OrderController {
    @Autowired
    private IOrderService orderService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private KafkaTemplate<String, OrderMessage> kafkaTemplate;

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
    public ResponseMessage<String> addBookToOrder(@RequestBody OrderItemDTO orderItemDTO) {
        try {
            // 从安全上下文获取当前用户名
            String username = SecurityContextHolder.getContext().getAuthentication().getName();

            // 根据用户名查询用户ID
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new IllegalArgumentException("用户不存在"));

            System.out.println("Received order request from user: " + user.getId() + " for book: " + orderItemDTO.getBookId() + " with quantity: " + orderItemDTO.getNumber());
            // 组装消息
            OrderMessage orderMessage = new OrderMessage(user.getId(), orderItemDTO);

            // 发送到Kafka
            kafkaTemplate.send("order_topic", orderMessage);  // 发送到order_topic

            System.out.println("Order message sent to Kafka: " + orderMessage);

            return ResponseMessage.success("订单已提交，正在异步处理");  // 返回给前端，告知异步处理
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