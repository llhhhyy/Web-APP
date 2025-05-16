package com.bookstore.bookstore_backend.repository;

import com.bookstore.bookstore_backend.model.book.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    @Query("SELECT DISTINCT tags FROM Book")
    List<List<String>> findAllTags();
    @Query("SELECT b FROM Book b WHERE (:keyword IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND (:tag IS NULL OR :tag MEMBER OF b.tags)")
    Page<Book> findBooksByKeywordAndTagWithPagination(@Param("keyword") String keyword, @Param("tag") String tag, Pageable pageable);

    @Query("SELECT b FROM Book b WHERE (:keyword IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND (:tag IS NULL OR :tag MEMBER OF b.tags)")
    List<Book> findBooksByKeywordAndTag(@Param("keyword") String keyword, @Param("tag") String tag);

    @Query("SELECT COUNT(b) FROM Book b WHERE (:keyword IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND (:tag IS NULL OR :tag MEMBER OF b.tags)")
    long countBooksByKeywordAndTag(@Param("keyword") String keyword, @Param("tag") String tag);
}