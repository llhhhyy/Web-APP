package com.bookstore.bookstore_backend.controller;

import com.bookstore.bookstore_backend.model.ResponseMessage;
import com.bookstore.bookstore_backend.model.book.*;
import com.bookstore.bookstore_backend.model.comment.Comment;
import com.bookstore.bookstore_backend.model.comment.CommentDTO;
import com.bookstore.bookstore_backend.services.book.IBookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/books")
public class BookController {
    @Autowired
    private IBookService bookService;

    @GetMapping("/find")
    public ResponseMessage<List<Book>> getBooks(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String tag,
            @RequestParam(defaultValue = "0") int pageIndex,
            @RequestParam(defaultValue = "5") int pageSize) {
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        Page<Book> bookPage = bookService.getBooks(keyword, tag, pageable);
        return ResponseMessage.success(bookPage.getContent()).setTotal(bookPage.getTotalElements());
    }

    @GetMapping("/find/{id}")
    public ResponseMessage<Book> getBookById(@PathVariable Long id) {
        Book book = bookService.getBookById(id);
        return ResponseMessage.success(book);
    }

    @GetMapping("/get/{id}/comments")
    public ResponseMessage<List<Comment>> getComments(@PathVariable Long id) {
        List<Comment> comments = bookService.getCommentsByBookId(id);
        return ResponseMessage.success(comments);
    }

    @GetMapping("/tags")
    public ResponseMessage<Set<String>> getAllTags() {
        return ResponseMessage.success(bookService.getAllTags());
    }

    @PostMapping("/save")
    public ResponseMessage<Book> addBook(@RequestBody Book book) {
        Book savedBook = bookService.saveBook(book);
        return ResponseMessage.success(savedBook);
    }

    @PostMapping("/add/{id}/comments")
    public ResponseMessage<Comment> addComment(@PathVariable Long id, @RequestBody CommentDTO commentDTO) {
        Comment newComment = bookService.addCommentToBook(id, commentDTO);
        return ResponseMessage.success(newComment);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseMessage deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseMessage.success(null);
    }
}