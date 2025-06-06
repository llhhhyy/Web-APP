package com.bookstore.bookstore_backend.controller;

import com.bookstore.bookstore_backend.model.ResponseMessage;
import com.bookstore.bookstore_backend.model.User.CommonAddress;
import com.bookstore.bookstore_backend.model.User.LoginResponseDTO;
import com.bookstore.bookstore_backend.model.User.User;
import com.bookstore.bookstore_backend.model.User.UserDTO;
import com.bookstore.bookstore_backend.model.User.PasswordUpdateDTO;
import com.bookstore.bookstore_backend.services.user.IUserService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.bookstore.bookstore_backend.model.User.LoginDTO;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private IUserService userService;
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @PostMapping("/register")
    public ResponseMessage registerUser(@Validated @RequestBody UserDTO userDTO) {
        User user = userService.registerUser(userDTO);
        return ResponseMessage.success(user);
    }

    @PostMapping("/{userId}/address")
//    @PreAuthorize("authentication.principal.id == #userId")
    public ResponseMessage addCommonAddress(@PathVariable Long userId, @Validated @RequestBody CommonAddress address) {
        User user = userService.addCommonAddress(userId, address);
        return ResponseMessage.success(user);
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseMessage<?>> login(@Validated @RequestBody LoginDTO loginRequest, HttpServletRequest request) {
        logger.info("Login request for username: {}", loginRequest.getUsername());
        try {
            LoginResponseDTO response = userService.login(loginRequest.getUsername(), loginRequest.getPassword());

            // 手动触发 Spring Security 认证
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword());
            Authentication authentication = authenticationManager.authenticate(authToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 将认证信息存储到会话
            request.getSession().setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, SecurityContextHolder.getContext());

            return ResponseEntity.ok(ResponseMessage.success(response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ResponseMessage.error(e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseMessage logout(HttpServletRequest request) {
        request.getSession().invalidate(); // 清除会话
        SecurityContextHolder.clearContext(); // 清除 Spring Security 上下文
        return ResponseMessage.success("登出成功");
    }

    @GetMapping("/username/{username}")
//    @PreAuthorize("hasRole('ADMIN') or authentication.principal.username == #username")
    public ResponseMessage<User> getUserByUsername(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        return ResponseMessage.success(user);
    }

    @GetMapping("/id/{id}")
//    @PreAuthorize("hasRole('ADMIN') or authentication.principal.id == #id")
    public ResponseMessage<User> getUserById(@PathVariable Long id) {
        logger.info("Fetching user by id: {}", id);
        User user = userService.getUserById(id);
        return ResponseMessage.success(user);
    }

    @GetMapping("/get/{userId}/addresses")
//    @PreAuthorize("authentication.principal.id == #userId")
    public ResponseMessage<List<CommonAddress>> getCommonAddresses(@PathVariable Long userId) {
        List<CommonAddress> addresses = userService.getCommonAddresses(userId);
        return ResponseMessage.success(addresses);
    }

    @PutMapping("/update")
//    @PreAuthorize("authentication.principal.id == #userDTO.id")
    public ResponseMessage updateUser(@Validated @RequestBody UserDTO userDTO) {
        User user = userService.updateUser(userDTO);
        return ResponseMessage.success(user);
    }

    @PutMapping("/{userId}/password")
//    @PreAuthorize("authentication.principal.id == #userId")
    public ResponseMessage updatePassword(@PathVariable Long userId, @Validated @RequestBody PasswordUpdateDTO passwordDTO) {
        User user = userService.updatePassword(userId, passwordDTO.getPassword());
        return ResponseMessage.success(user);
    }

    @PutMapping("/{userId}/avatar")
//    @PreAuthorize("authentication.principal.id == #userId")
    public ResponseMessage updateAvatar(@PathVariable Long userId, @Validated @RequestBody UserDTO userDTO) {
        User user = userService.updateAvatar(userId, userDTO.getAvatar());
        return ResponseMessage.success(user);
    }

    @PutMapping("/{userId}/tagline")
//    @PreAuthorize("authentication.principal.id == #userId")
    public ResponseMessage updateTagLine(@PathVariable Long userId, @Validated @RequestBody UserDTO userDTO) {
        User user = userService.updateTagLine(userId, userDTO.getTagLine());
        return ResponseMessage.success(user);
    }

    @DeleteMapping("/delete/{userId}")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseMessage deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseMessage.success(null);
    }

    @DeleteMapping("/delete/address/{userId}/{addressId}")
//    @PreAuthorize("authentication.principal.id == #userId")
    public ResponseMessage deleteAddress(@PathVariable Long userId, @PathVariable Long addressId) {
        userService.deleteAddress(userId, addressId);
        return ResponseMessage.success(null);
    }
}