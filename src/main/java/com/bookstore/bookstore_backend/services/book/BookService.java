package com.bookstore.bookstore_backend.services.book;

import com.bookstore.bookstore_backend.model.book.Book;
import com.bookstore.bookstore_backend.model.book.BookDTO;
import com.bookstore.bookstore_backend.model.comment.Comment;
import com.bookstore.bookstore_backend.model.comment.CommentDTO;
import com.bookstore.bookstore_backend.repository.BookRepository;
import com.bookstore.bookstore_backend.repository.CommentRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BookService implements IBookService {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Override
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    @Override
    public Page<Book> getBooks(String keyword, String tag, Pageable pageable) {
        return bookRepository.findBooksByKeywordAndTagWithPagination(keyword, tag, pageable);
    }

    @Override
    public long countBooks(String keyword, String tag) {
        return 0;
    }

    @Override
    public Book getBookById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("书籍ID不能为空");
        }
        return bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("书籍不存在，参数异常"));
    }

    @Override
    public Book saveBook(Book book) {
        if (book == null) {
            throw new IllegalArgumentException("书籍信息不能为空");
        }
        if (book.getTitle() == null || book.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("书籍标题不能为空");
        }
        return bookRepository.save(book);
    }

    @Override
    public void deleteBook(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("书籍ID不能为空");
        }
        if (!bookRepository.existsById(id)) {
            throw new IllegalArgumentException("书籍不存在，参数异常");
        }
        bookRepository.deleteById(id);
    }

    @Override
    public Comment addCommentToBook(Long bookId, CommentDTO commentDTO) {
        if (bookId == null) {
            throw new IllegalArgumentException("书籍ID不能为空");
        }
        if (commentDTO == null) {
            throw new IllegalArgumentException("评论信息不能为空");
        }
        if (commentDTO.getContent() == null || commentDTO.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("评论内容不能为空");
        }
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("书籍不存在，参数异常"));
        Comment newComment = new Comment();
        BeanUtils.copyProperties(commentDTO, newComment);
        newComment.setBook(book);
        return commentRepository.save(newComment);
    }

    @Override
    public List<Comment> getCommentsByBookId(Long bookId) {
        return commentRepository.findByBookId(bookId);
    }

    @Override
    public Set<String> getAllTags() {
        List<List<String>> tagsList = bookRepository.findAllTags();
        return tagsList.stream().flatMap(List::stream).collect(Collectors.toSet());
    }

    @Override
    public Book updateBook(Long id, BookDTO bookDTO) {
        if (id == null) {
            throw new IllegalArgumentException("书籍ID不能为空");
        }
        if (bookDTO == null) {
            throw new IllegalArgumentException("书籍信息不能为空");
        }
        if (bookDTO.getTitle() == null || bookDTO.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("书籍标题不能为空");
        }
        Book existingBook = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("书籍不存在，参数异常"));
        BeanUtils.copyProperties(bookDTO, existingBook, "id", "comments");
        return bookRepository.save(existingBook);
    }
}
