package com.bookstore.bookstore_backend.exception;

import com.bookstore.bookstore_backend.model.ResponseMessage;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {
    Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // 处理 IllegalArgumentException
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseMessage handleIllegalArgumentException(IllegalArgumentException e) {
        log.warn("非法参数异常: {}", e.getMessage());
        return new ResponseMessage(400, e.getMessage(), null);
    }

    // 处理参数校验异常
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseMessage handleValidationException(MethodArgumentNotValidException e) {
        BindingResult bindingResult = e.getBindingResult();
        List<FieldError> fieldErrors = bindingResult.getFieldErrors();

        StringBuilder errorMsg = new StringBuilder("参数校验失败：");
        for (FieldError error : fieldErrors) {
            errorMsg.append("[").append(error.getField()).append(": ").append(error.getDefaultMessage()).append("] ");
        }

        log.warn("参数校验失败: {}", errorMsg.toString());
        return new ResponseMessage(400, errorMsg.toString(), null);
    }

    // 处理其他未捕获的异常
    @ExceptionHandler(Exception.class)
    public ResponseMessage handlerException(Exception e, HttpServlet request, HttpServletResponse response) {
        log.error("未捕获的异常：", e);
        return new ResponseMessage(500, "服务器内部错误", null);
    }
}