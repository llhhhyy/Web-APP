package com.bookstore.bookstore_backend.model.order;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class OrderItemDTO {

    @NotNull(message = "书籍ID不能为空")
    private Long bookId;

    @Min(value = 1, message = "数量至少为1")
    private int number = 1;

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    @Override
    public String toString() {
        return "OrderItemDTO{" +
                "bookId=" + bookId +
                ", number=" + number +
                '}';
    }
}