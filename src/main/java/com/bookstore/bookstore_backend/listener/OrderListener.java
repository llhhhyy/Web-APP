package com.bookstore.bookstore_backend.listener;

import com.bookstore.bookstore_backend.model.order.OrderItem;
import com.bookstore.bookstore_backend.model.order.OrderMessage;
import com.bookstore.bookstore_backend.services.IOrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class OrderListener {
    private static final Logger logger = LoggerFactory.getLogger(OrderListener.class);

    @Autowired
    private IOrderService orderService;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;  // 用于发送结果，简单用String

    @KafkaListener(topics = "order_topic", groupId = "order-group")
    public void handleOrderMessage(OrderMessage orderMessage) {
        try {
            System.out.println("收到下单消息: " + orderMessage + ", 开始处理订单...");

            // 调用现有的OrderService处理订单（复用同步逻辑）
            OrderItem orderItem = orderService.addBookToOrder(orderMessage.getUserId(), orderMessage.getOrderItemDTO());

            // 处理成功，发送结果到另一个Topic（例如，发送订单ID作为结果）
            String result = "订单处理成功，订单ID: " + orderItem.getId();
            kafkaTemplate.send("order_topic_result", result);

            System.out.println(result);
        } catch (Exception e) {
            System.out.println("订单处理失败: " + e.getMessage());
            // 可以发送失败结果到另一个Topic，或重试逻辑（可选）
            kafkaTemplate.send("order_topic_result", "订单处理失败: " + e.getMessage());
        }
    }
}