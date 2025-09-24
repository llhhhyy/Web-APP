package com.bookstore.bookstore_backend.model.order;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor  // 新增：生成无参构造函数
public class OrderMessage implements Serializable {
    private Long userId;
    private OrderItemDTO orderItemDTO;

    // 原有构造函数（可选保留）
    public OrderMessage(Long userId, OrderItemDTO orderItemDTO) {
        this.userId = userId;
        this.orderItemDTO = orderItemDTO;
    }
}