package com.bookstore.bookstore_backend.services.user;

import com.bookstore.bookstore_backend.model.User.CommonAddress;
import com.bookstore.bookstore_backend.model.User.LoginResponseDTO;
import com.bookstore.bookstore_backend.model.User.User;
import com.bookstore.bookstore_backend.model.User.UserDTO;
import com.bookstore.bookstore_backend.repository.CommonAddressRepository;
import com.bookstore.bookstore_backend.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements IUserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommonAddressRepository commonAddressRepository;

    @Override
    public User registerUser(UserDTO userDTO) {
        if (userRepository.findByUsername(userDTO.getUsername()).isPresent()) {
            throw new IllegalArgumentException("用户名已存在");
        }

        User user = new User();
        BeanUtils.copyProperties(userDTO, user);
        return userRepository.save(user);
    }

    @Override
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> {
            throw new IllegalArgumentException("用户不存在，参数异常");
        });
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> {
            throw new IllegalArgumentException("用户不存在，参数异常");
        });
    }

    @Override
    public User updateUser(UserDTO userDTO) {
        User user = getUserById(userDTO.getId());
        BeanUtils.copyProperties(userDTO, user);
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public User updatePassword(Long userId, String newPassword) {
        User user = getUserById(userId);
        if (newPassword == null || newPassword.length() < 6) {
            throw new IllegalArgumentException("密码长度至少为6位");
        }
        user.setPassword(newPassword);
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

        if (!user.getPassword().equals(password)) {
            throw new IllegalArgumentException("用户名或密码错误");
        }

        return new LoginResponseDTO(user);
    }

    @Override
    public void deleteAddress(Long userId,Long addressId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("用户id错误"));
        List<CommonAddress> addressList = user.getCommonAddresses();
        CommonAddress address = commonAddressRepository.findById(addressId).orElseThrow(()->new IllegalArgumentException("地址id错误"));
        addressList.remove(address);
        user.setCommonAddresses(addressList);
        userRepository.save(user);
    }
}