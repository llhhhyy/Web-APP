package com.bookstore.bookstore_backend.services.user;

import com.bookstore.bookstore_backend.model.User.CommonAddress;
import com.bookstore.bookstore_backend.model.User.LoginResponseDTO;
import com.bookstore.bookstore_backend.model.User.User;
import com.bookstore.bookstore_backend.model.User.UserAuth;
import com.bookstore.bookstore_backend.model.User.UserDTO;
import com.bookstore.bookstore_backend.repository.CommonAddressRepository;
import com.bookstore.bookstore_backend.repository.UserAuthRepository;
import com.bookstore.bookstore_backend.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements IUserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserAuthRepository userAuthRepository;

    @Autowired
    private CommonAddressRepository commonAddressRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public User registerUser(UserDTO userDTO) {
        if (userRepository.findByUsername(userDTO.getUsername()).isPresent()) {
            throw new IllegalArgumentException("用户名已存在");
        }

        User user = new User();
        BeanUtils.copyProperties(userDTO, user, "password"); // 排除 password 字段
//        user = userRepository.save(user); // 确保持久化

        UserAuth userAuth = new UserAuth();
        userAuth.setPassword(userDTO.getPassword()); // 密码加密
        userAuth.setUser(user);
        user.setUserAuth(userAuth); // 级联管理 userAuth

        return userRepository.save(user); // 级联保存 userAuth，无需单独调用 userAuthRepository.save(userAuth);
    }

    @Override
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("用户不存在，参数异常"));
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("用户不存在，参数异常"));
    }

    @Override
    public User updateUser(UserDTO userDTO) {
        User user = getUserById(userDTO.getId());
        BeanUtils.copyProperties(userDTO, user, "password"); // 排除 password 字段
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id); // 由于 cascade = CascadeType.ALL，UserAuth 会自动删除
    }

    @Override
    public User updatePassword(Long userId, String newPassword) {
        User user = getUserById(userId);
        UserAuth userAuth = user.getUserAuth();
        if (userAuth == null) {
            userAuth = new UserAuth();
            user.setUserAuth(userAuth);
            userAuth.setUser(user);
        }
        userAuth.setPassword(newPassword); // 密码会在 setter 中加密
        user.setUserAuth(userAuth);
        return userRepository.save(user);
    }

    @Override
    public User updateAvatar(Long userId, String avatar) {
        User user = getUserById(userId);
        if (avatar == null || !avatar.matches("^(https?://.*\\.(?:png|jpg|jpeg|gif|svg))?$")) {
            throw new IllegalArgumentException("头像必须是有效的图片URL");
        }
        user.setAvatar(avatar);
        return userRepository.save(user);
    }

    @Override
    public User updateTagLine(Long userId, String tagLine) {
        User user = getUserById(userId);
        if (tagLine == null) {
            tagLine = "";
        }
        user.setTagLine(tagLine);
        return userRepository.save(user);
    }

    @Override
    public User addCommonAddress(Long userId, CommonAddress address) {
        User user = getUserById(userId);
        if (address.getRecipient() == null || address.getPhone() == null || address.getAddress() == null) {
            throw new IllegalArgumentException("收货人、电话和地址不能为空");
        }
        address.setUser(user);
        user.getCommonAddresses().add(address);
        return userRepository.save(user);
    }

    @Override
    public List<CommonAddress> getCommonAddresses(Long userId) {
        User user = getUserById(userId);
        return user.getCommonAddresses();
    }

    @Override
    public LoginResponseDTO login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("用户名或密码错误"));

        UserAuth userAuth = user.getUserAuth();
        if (userAuth == null || !passwordEncoder.matches(password, userAuth.getPassword())) {
            throw new IllegalArgumentException("用户名或密码错误");
        }

        return new LoginResponseDTO(user);
    }

    @Override
    public void deleteAddress(Long userId, Long addressId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("用户id错误"));
        CommonAddress address = commonAddressRepository.findById(addressId)
                .orElseThrow(() -> new IllegalArgumentException("地址id错误"));
        user.getCommonAddresses().remove(address);
        userRepository.save(user);
    }
}