package com.bookstore.bookstore_backend.model.order;

import java.util.Map;

public class OrderStatisticsDTO {
    private Map<String, Integer> bookPurchaseCounts; // Book title to purchase count
    private int totalBooks;
    private double totalAmount;

    public Map<String, Integer> getBookPurchaseCounts() {
        return bookPurchaseCounts;
    }

    public void setBookPurchaseCounts(Map<String, Integer> bookPurchaseCounts) {
        this.bookPurchaseCounts = bookPurchaseCounts;
    }

    public int getTotalBooks() {
        return totalBooks;
    }

    public void setTotalBooks(int totalBooks) {
        this.totalBooks = totalBooks;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }
}

