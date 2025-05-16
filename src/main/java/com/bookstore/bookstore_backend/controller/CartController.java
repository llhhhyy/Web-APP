package com.bookstore.bookstore_backend.controller;

import com.bookstore.bookstore_backend.model.ResponseMessage;
import com.bookstore.bookstore_backend.model.cart.CartItem;
import com.bookstore.bookstore_backend.model.cart.CartItemDTO;
import com.bookstore.bookstore_backend.services.cart.ICartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {
    @Autowired
    private ICartService cartService;

    @GetMapping("/get/{userId}")
    public ResponseMessage<List<CartItem>> getUserCart(@PathVariable Long userId) {
        return ResponseMessage.success(cartService.getUserCart(userId));
    }

    @PostMapping("/add/{userId}")
    public ResponseMessage<CartItem> addBookToCart(@PathVariable Long userId, @RequestBody CartItemDTO cartItemDTO) {
        Long bookId = cartItemDTO.getBookId();
        int quantity = cartItemDTO.getNumber();
        CartItem cartItem = cartService.addBookToCart(userId, bookId, quantity);
        return ResponseMessage.success(cartItem);
    }

    @DeleteMapping("/delete/{cartItemId}")
    public ResponseMessage removeCartItem(@PathVariable Long cartItemId) {
        cartService.removeCartItem(cartItemId);
        return ResponseMessage.success(null);
    }

    @PutMapping("/update/{cartItemId}")
    public ResponseMessage<CartItem> updateCartItemQuantity(
            @PathVariable Long cartItemId,
            @RequestBody CartItemDTO cartItemDTO) {
        CartItem cartItem = cartService.updateCartItemQuantity(cartItemId, cartItemDTO.getNumber());
        return ResponseMessage.success(cartItem);
    }
}