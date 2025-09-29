package com.bookstore.bookstore_backend.websocket;

import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.concurrent.CopyOnWriteArraySet;

@ServerEndpoint("/websocket/order")
@Component
public class OrderWebSocket {
    private static final Logger logger = LoggerFactory.getLogger(OrderWebSocket.class);
    private static final CopyOnWriteArraySet<Session> sessions = new CopyOnWriteArraySet<>();

    @OnOpen
    public void onOpen(Session session) {
        sessions.add(session);
        logger.info("WebSocket连接开启: " + session.getId());
    }

    @OnClose
    public void onClose(Session session) {
        sessions.remove(session);
        logger.info("WebSocket连接关闭: " + session.getId());
    }

    @OnError
    public void onError(Session session, Throwable error) {
        logger.error("WebSocket错误: " + error.getMessage());
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        logger.info("收到客户端消息: " + message);
    }

    // 静态方法：从Kafka监听器调用，广播消息
    public static void sendMessage(String message) {
        for (Session session : sessions) {
            try {
                if (session.isOpen()) {
                    session.getBasicRemote().sendText(message);
                }
            } catch (IOException e) {
                logger.error("发送WebSocket消息失败: " + e.getMessage());
            }
        }
    }
}