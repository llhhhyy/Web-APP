package com.bookstore.bookstore_backend.listener;

import com.bookstore.bookstore_backend.websocket.OrderWebSocket;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrderResultListener {
    private static final Logger logger = LoggerFactory.getLogger(OrderResultListener.class);

    @KafkaListener(topics = "order_topic_result", groupId = "order-result-group", containerFactory = "stringKafkaListenerContainerFactory")
    public void handleOrderResult(String result) {
        logger.info("收到订单处理结果: " + result);
        // 通过WebSocket推送给所有连接的客户端
        OrderWebSocket.sendMessage(result);
    }
}