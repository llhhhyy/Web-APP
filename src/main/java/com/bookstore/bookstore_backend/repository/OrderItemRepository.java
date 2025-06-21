package com.bookstore.bookstore_backend.repository;

import com.bookstore.bookstore_backend.model.cart.CartItem;
import com.bookstore.bookstore_backend.model.order.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByUserId(Long userId);

    @Query("SELECT oi FROM OrderItem oi WHERE oi.user.id = :userId " +
            "AND (:keyword IS NULL OR LOWER(oi.book.title) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:startTime IS NULL OR oi.createdAt >= :startTime) " +
            "AND (:endTime IS NULL OR oi.createdAt <= :endTime)")
    List<OrderItem> searchOrdersByBookTitleAndTime(@Param("userId") Long userId,
                                                   @Param("keyword") String keyword,
                                                   @Param("startTime") LocalDateTime startTime,
                                                   @Param("endTime") LocalDateTime endTime);

    @Query("SELECT oi FROM OrderItem oi " +
            "JOIN FETCH oi.user " + // 确保加载用户实体
            "JOIN FETCH oi.book " + // 确保加载书籍实体
            "WHERE (:keyword IS NULL OR LOWER(oi.book.title) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:startTime IS NULL OR oi.createdAt >= :startTime) " +
            "AND (:endTime IS NULL OR oi.createdAt <= :endTime)")
    List<OrderItem> searchAllOrders(@Param("keyword") String keyword,
                                    @Param("startTime") LocalDateTime startTime,
                                    @Param("endTime") LocalDateTime endTime);
}