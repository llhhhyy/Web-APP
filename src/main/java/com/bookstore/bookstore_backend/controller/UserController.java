package com.bookstore.bookstore_backend.controller;

import com.bookstore.bookstore_backend.model.ResponseMessage;
import com.bookstore.bookstore_backend.model.User.CommonAddress;
import com.bookstore.bookstore_backend.model.User.LoginResponseDTO;
import com.bookstore.bookstore_backend.model.User.User;
import com.bookstore.bookstore_backend.model.User.UserDTO;
import com.bookstore.bookstore_backend.services.user.IUserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.bookstore.bookstore_backend.model.User.LoginDTO;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private IUserService userService;
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @PostMapping("/register")
    public ResponseMessage registerUser(@Validated @RequestBody UserDTO userDTO) {
        User user = userService.registerUser(userDTO);
        return ResponseMessage.success(user);
    }

    @PostMapping("/{userId}/address")
    public ResponseMessage addCommonAddress(@PathVariable Long userId, @Validated @RequestBody CommonAddress address) {
        User user = userService.addCommonAddress(userId, address);
        return ResponseMessage.success(user);
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseMessage<?>> login(@RequestBody LoginDTO loginRequest) {
        logger.info("/login 被调用");
        try {
            LoginResponseDTO response = userService.login(loginRequest.getUsername(), loginRequest.getPassword());
            return ResponseEntity.ok(ResponseMessage.success(response));
        } catch (IllegalArgumentException e) {
            // 返回结构化的错误信息
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ResponseMessage.error(e.getMessage()));
        }
    }

    @GetMapping("/username/{username}")
    public ResponseMessage<User> getUserByUsername(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        return ResponseMessage.success(user);
    }

    @GetMapping("/id/{id}")
    public ResponseMessage<User> getUserById(@PathVariable Long id) {
        logger.info("/id/{id}被调用");
        User newUser = userService.getUserById(id);
        return ResponseMessage.success(newUser);
    }

    @GetMapping("/get/{userId}/addresses")
    public ResponseMessage<List<CommonAddress>> getCommonAddresses(@PathVariable Long userId) {
        List<CommonAddress> addresses = userService.getCommonAddresses(userId);
        return ResponseMessage.success(addresses);
    }

    @PutMapping("/update")
    public ResponseMessage updateUser(@Validated @RequestBody UserDTO userDTO) {
        User user = userService.updateUser(userDTO);
        return ResponseMessage.success(user);
    }

    @PutMapping("/{userId}/password")
    public ResponseMessage updatePassword(@PathVariable Long userId, @Validated @RequestBody UserDTO userDTO) {
        User user = userService.updatePassword(userId, userDTO.getPassword());
        return ResponseMessage.success(user);
    }

    @PutMapping("/{userId}/avatar")
    public ResponseMessage updateAvatar(@PathVariable Long userId, @Validated @RequestBody UserDTO userDTO) {
        User user = userService.updateAvatar(userId, userDTO.getAvatar());
        return ResponseMessage.success(user);
    }

    @PutMapping("/{userId}/tagline")
    public ResponseMessage updateTagLine(@PathVariable Long userId, @Validated @RequestBody UserDTO userDTO) {
        User user = userService.updateTagLine(userId, userDTO.getTagLine());
        return ResponseMessage.success(user);
    }



    @DeleteMapping("/delete/{userId}")
    public ResponseMessage deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseMessage.success(null);
    }

    @DeleteMapping("delete/address/{userId}/{addressId}")
    public ResponseMessage deleteAddress(@PathVariable Long userId, @PathVariable Long addressId) {
        userService.deleteAddress(userId,addressId);
        return ResponseMessage.success(null);
    }
}