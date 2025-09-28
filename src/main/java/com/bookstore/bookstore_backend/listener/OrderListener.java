package com.bookstore.bookstore_backend.listener;

import com.bookstore.bookstore_backend.model.order.Order;
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
    private KafkaTemplate<String, String> kafkaTemplate;

    @KafkaListener(topics = "order_topic", groupId = "order-group")
    public void handleOrderMessage(OrderMessage orderMessage) {
        try {
            System.out.println("收到下单消息: " + orderMessage + ", 开始处理订单...");

            Order order = orderService.createOrder(orderMessage.getUserId(), orderMessage.getOrderDTO());

            String result = "订单处理成功，订单ID: " + order.getId();
            kafkaTemplate.send("order_topic_result", result);

            System.out.println(result);
        } catch (Exception e) {
            System.out.println("订单处理失败: " + e.getMessage());
            kafkaTemplate.send("order_topic_result", "订单处理失败: " + e.getMessage());
        }
    }
}