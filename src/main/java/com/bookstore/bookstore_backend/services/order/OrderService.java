package com.bookstore.bookstore_backend.services.order;

import com.bookstore.bookstore_backend.model.User.User;
import com.bookstore.bookstore_backend.model.book.Book;
import com.bookstore.bookstore_backend.model.order.OrderItem;
import com.bookstore.bookstore_backend.model.order.OrderItemDTO;
import com.bookstore.bookstore_backend.model.order.OrderStatisticsDTO;
import com.bookstore.bookstore_backend.repository.BookRepository;
import com.bookstore.bookstore_backend.repository.OrderItemRepository;
import com.bookstore.bookstore_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrderService implements IOrderService {
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public List<OrderItem> getUserOrder(Long userId) {
        userRepository.findById(userId).orElseThrow(() -> {
            throw new IllegalArgumentException("无效的用户id，该用户不存在");
        });
        return orderItemRepository.findByUserId(userId);
    }

    @Override
    @Transactional
    public OrderItem addBookToOrder(Long userId, OrderItemDTO orderItemDTO) {
        // 确保使用传入的userID而不是DTO中的值
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("无效的用户id，该用户不存在"));

        Book book = bookRepository.findById(orderItemDTO.getBookId())
                .orElseThrow(() -> new IllegalArgumentException("无效的书籍id，该书籍不存在"));

        // 检查库存
        int requestedQuantity = orderItemDTO.getNumber();
        if (requestedQuantity <= 0) {
            throw new IllegalArgumentException("库存不足");
        }
        if (book.getInventory() < requestedQuantity) {
            throw new IllegalArgumentException("库存不足，当前库存：" + book.getInventory());
        }

        // 更新库存
        book.setInventory(book.getInventory() - requestedQuantity);
        book.setSales(book.getSales() + requestedQuantity);
        bookRepository.save(book);

        OrderItem orderItem = new OrderItem();
        // 设置用户ID为传入的userId
        orderItem.setUserId(userId);
        orderItem.setBookId(orderItemDTO.getBookId());
        orderItem.setNumber(requestedQuantity);
        orderItem.setAddress(orderItemDTO.getAddress());
        orderItem.setPhone(orderItemDTO.getPhone());
        orderItem.setRecipient(orderItemDTO.getRecipient());
        orderItem.setUser(user);
        orderItem.setBook(book);

        user.addOrderItem(orderItem);
        return orderItemRepository.save(orderItem);
    }

    @Override
    public List<OrderItem> searchUserOrders(Long userId, String keyword, LocalDateTime startTime, LocalDateTime endTime) {
        userRepository.findById(userId).orElseThrow(() -> {
            throw new IllegalArgumentException("无效的用户id，该用户不存在");
        });
        return orderItemRepository.searchOrdersByBookTitleAndTime(userId, keyword, startTime, endTime);
    }

    @Override
    public List<OrderItem> searchAllOrders(String keyword, LocalDateTime startTime, LocalDateTime endTime) {
        return orderItemRepository.searchAllOrders(keyword, startTime, endTime);
    }

    @Override
    public OrderStatisticsDTO getUserOrderStatistics(Long userId, LocalDateTime startTime, LocalDateTime endTime) {
        List<OrderItem> orders = orderItemRepository.searchOrdersByBookTitleAndTime(userId, null, startTime, endTime);
        Map<String, Integer> bookPurchaseCounts = new HashMap<>();
        int totalBooks = 0;
        double totalAmount = 0.0;

        for (OrderItem order : orders) {
            String bookTitle = order.getBook().getTitle();
            int quantity = order.getNumber();
            double price = Double.parseDouble(order.getBook().getPrice());

            bookPurchaseCounts.put(bookTitle, bookPurchaseCounts.getOrDefault(bookTitle, 0) + quantity);
            totalBooks += quantity;
            totalAmount += quantity * price;
        }

        OrderStatisticsDTO stats = new OrderStatisticsDTO();
        stats.setBookPurchaseCounts(bookPurchaseCounts);
        stats.setTotalBooks(totalBooks);
        stats.setTotalAmount(totalAmount);
        return stats;
    }
}