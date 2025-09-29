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
import org.springframework.transaction.annotation.Transactional;

@Component
public class OrderListener {
    private static final Logger logger = LoggerFactory.getLogger(OrderListener.class);

    @Autowired
    private IOrderService orderService;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @KafkaListener(topics = "order_topic", groupId = "order-group")
    @Transactional(rollbackFor = Exception.class)
    public void handleOrderMessage(OrderMessage orderMessage) {
        try {
            logger.info("收到下单消息: {}, 开始处理订单...", orderMessage);
            Order order = orderService.createOrder(orderMessage.getUserId(), orderMessage.getOrderDTO());
            String result = "订单处理成功，订单ID: " + order.getId();
            kafkaTemplate.send("order_topic_result", result);
            logger.info(result);
        } catch (Exception e) {
            logger.error("订单处理失败: {}", e.getMessage());
            throw e; // 抛出异常触发事务回滚，Kafka 消息会被重新处理
        }
    }
}