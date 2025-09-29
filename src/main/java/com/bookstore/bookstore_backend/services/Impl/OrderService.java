package com.bookstore.bookstore_backend.services.Impl;

import com.bookstore.bookstore_backend.model.User.User;
import com.bookstore.bookstore_backend.model.book.Book;
import com.bookstore.bookstore_backend.model.order.*;
import com.bookstore.bookstore_backend.repository.BookRepository;
import com.bookstore.bookstore_backend.repository.OrderRepository;
import com.bookstore.bookstore_backend.repository.UserRepository;
import com.bookstore.bookstore_backend.services.IOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderService implements IOrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public List<OrderResponseDTO> getUserOrders(Long userId) {
        userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("无效的用户id，该用户不存在"));
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream().map(order -> {
            OrderResponseDTO dto = new OrderResponseDTO();
            dto.setId(order.getId());
            dto.setUserId(order.getUserId());
            dto.setRecipient(order.getRecipient());
            dto.setPhone(order.getPhone());
            dto.setAddress(order.getAddress());
            dto.setCreatedAt(order.getCreatedAt());
            List<OrderItemDTO> itemDTOs = order.getOrderItems().stream().map(item -> {
                OrderItemDTO itemDTO = new OrderItemDTO();
                itemDTO.setBookId(item.getBookId());
                itemDTO.setNumber(item.getNumber());
                itemDTO.setBookTitle(item.getBook().getTitle());
                itemDTO.setBookPrice(item.getBook().getPrice());
                itemDTO.setBookCover(item.getBook().getCover());
                return itemDTO;
            }).collect(Collectors.toList());
            dto.setOrderItems(itemDTOs);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
    public Order createOrder(Long userId, OrderDTO orderDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("无效的用户id，该用户不存在"));

        Order order = new Order();
        order.setUser(user);
        order.setRecipient(orderDTO.getRecipient());
        order.setPhone(orderDTO.getPhone());
        order.setAddress(orderDTO.getAddress());

        for (OrderItemDTO itemDTO : orderDTO.getItems()) {
            Book book = bookRepository.findById(itemDTO.getBookId())
                    .orElseThrow(() -> new IllegalArgumentException("无效的书籍id，该书籍不存在"));

            int requestedQuantity = itemDTO.getNumber();
            if (requestedQuantity <= 0) {
                throw new IllegalArgumentException("数量必须大于0");
            }
            if (book.getInventory() < requestedQuantity) {
                throw new IllegalArgumentException("库存不足，书籍 " + book.getTitle() + " 当前库存：" + book.getInventory());
            }

            // 更新库存
            book.setInventory(book.getInventory() - requestedQuantity);
            book.setSales(book.getSales() + requestedQuantity);
            bookRepository.save(book);

            OrderItem orderItem = new OrderItem();
            orderItem.setBook(book);
            orderItem.setNumber(requestedQuantity);
            order.addOrderItem(orderItem);
        }

        user.addOrder(order);
        return orderRepository.save(order);
    }

    @Override
    public List<Order> searchUserOrders(Long userId, String keyword, LocalDateTime startTime, LocalDateTime endTime) {
        userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("无效的用户id，该用户不存在"));
        return orderRepository.searchOrdersByBookTitleAndTime(userId, keyword, startTime, endTime);
    }

    @Override
    public List<Order> searchAllOrders(String keyword, LocalDateTime startTime, LocalDateTime endTime) {
        return orderRepository.searchAllOrders(keyword, startTime, endTime);
    }

    @Override
    public OrderStatisticsDTO getUserOrderStatistics(Long userId, LocalDateTime startTime, LocalDateTime endTime) {
        List<Order> orders = orderRepository.searchOrdersByBookTitleAndTime(userId, null, startTime, endTime);
        Map<String, Integer> bookPurchaseCounts = new HashMap<>();
        int totalBooks = 0;
        double totalAmount = 0.0;

        for (Order order : orders) {
            for (OrderItem item : order.getOrderItems()) {
                String bookTitle = item.getBook().getTitle();
                int quantity = item.getNumber();
                double price = Double.parseDouble(item.getBook().getPrice());

                bookPurchaseCounts.put(bookTitle, bookPurchaseCounts.getOrDefault(bookTitle, 0) + quantity);
                totalBooks += quantity;
                totalAmount += quantity * price;
            }
        }

        OrderStatisticsDTO stats = new OrderStatisticsDTO();
        stats.setBookPurchaseCounts(bookPurchaseCounts);
        stats.setTotalBooks(totalBooks);
        stats.setTotalAmount(totalAmount);
        return stats;
    }
}