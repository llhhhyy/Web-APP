package com.bookstore.bookstore_backend.services.user;

import com.bookstore.bookstore_backend.model.User.CommonAddress;
import com.bookstore.bookstore_backend.model.User.LoginResponseDTO;
import com.bookstore.bookstore_backend.model.User.User;
import com.bookstore.bookstore_backend.model.User.UserDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface IUserService {
    User registerUser(UserDTO userDTO);
    User getUserByUsername(String username);
    User getUserById(Long id);
    User updateUser(UserDTO userDTO);
    void deleteUser(Long userId);
    User updatePassword(Long userId, String newPassword);
    User updateAvatar(Long userId, String avatar);
    User updateTagLine(Long userId, String tagLine);
    User addCommonAddress(Long userId, CommonAddress address);
    List<CommonAddress> getCommonAddresses(Long userId);
    LoginResponseDTO login(String username, String password);

    void deleteAddress(Long userId,Long addressId);
}