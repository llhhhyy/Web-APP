package com.bookstore.bookstore_backend.services.order;

import com.bookstore.bookstore_backend.model.User.User;
import com.bookstore.bookstore_backend.model.book.Book;
import com.bookstore.bookstore_backend.model.order.OrderItem;
import com.bookstore.bookstore_backend.model.order.OrderItemDTO;
import com.bookstore.bookstore_backend.repository.BookRepository;
import com.bookstore.bookstore_backend.repository.OrderItemRepository;
import com.bookstore.bookstore_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("无效的用户id，该用户不存在"));
        Book book = bookRepository.findById(orderItemDTO.getBookId())
                .orElseThrow(() -> new IllegalArgumentException("无效的书籍id，该书籍不存在"));

        OrderItem orderItem = new OrderItem();
        orderItem.setBookId(orderItemDTO.getBookId());
        orderItem.setUserId(orderItemDTO.getUserId());
        orderItem.setNumber(orderItemDTO.getNumber());
        orderItem.setAddress(orderItemDTO.getAddress());
        orderItem.setPhone(orderItemDTO.getPhone());
        orderItem.setRecipient(orderItemDTO.getRecipient());
        orderItem.setUser(user);
        orderItem.setBook(book);

        // createdAt 由 @PrePersist 自动设置，无需手动设置
        user.addOrderItem(orderItem);
        bookRepository.save(book);

        return orderItemRepository.save(orderItem);
    }
}