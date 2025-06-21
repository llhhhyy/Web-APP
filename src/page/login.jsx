import React, {useContext} from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { BasicLayout } from '../components/layout';
import {BASEURL} from "../service/common";
import axios from 'axios';
import useMessage from 'antd/es/message/useMessage';
import icon from '../image/icon.png';
import '../css/login.css';
import {UserContext} from "../lib/context";

axios.defaults.withCredentials = true; // 全局启用 withCredentials，确保发送 cookie
const LoginPage = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = useMessage();
    const { user, setUser } = useContext(UserContext); // 获取上下文中的 setUser

    const onSubmit = async (values) => {
        try {
            const response = await axios.post(`${BASEURL}/users/login`, {
                username: values.username,
                password: values.password
            });

            if (response.status === 200) {
                const { userId, username } = response.data.data;
                localStorage.setItem('userId', userId);
                localStorage.setItem('username', username); // 可选：存储用户名
                setUser({
                    id: userId,
                    username: username,
                    // 其他字段根据需求补充
                });
                messageApi.success('登录成功');
                navigate('/home');
            } else {
                messageApi.error('登录失败：' + response.data.message);
            }
        } catch (error) {
            // 从错误响应中提取消息
            const backendErrorMessage = error.response?.data?.message || error.message;
            messageApi.error(`登录失败：${backendErrorMessage}`);
            console.error(error);
        }
        const userId = localStorage.getItem('userId');
        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.get(`${BASEURL}/users/id/${userId}`);
            if (response.data.code === 200) {
                const userData = response.data.data;
                // 更新全局用户状态
                setUser({
                    id: userData.id,
                    username: userData.username,
                    email: userData.email,
                    avatar: userData.avatar,
                    balance: userData.balance,
                    tagLine: userData.tagLine,
                    role: userData.role
                });
            } else {
                throw new Error('获取用户信息失败');
            }
        } catch (error) {
            console.error(error);
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            setUser(null);
            navigate('');
        }
    };

    return (
        <BasicLayout>
            {contextHolder}
            <div className="login-background">
                <LoginForm
                    logo={icon}
                    title="Book Store"
                    subTitle="电子书城"
                    onFinish={onSubmit}
                    className="login-form"
                >
                    <ProFormText
                        name="username"
                        fieldProps={{
                            size: 'large',
                            prefix: <UserOutlined className="prefixIcon" />,
                        }}
                        placeholder="请输入用户名"
                        rules={[{ required: true, message: '请输入用户名!' }]}
                    />
                    <ProFormText.Password
                        name="password"
                        fieldProps={{
                            size: 'large',
                            prefix: <LockOutlined className="prefixIcon" />,
                        }}
                        placeholder="密码"
                        rules={[{ required: true, message: '请输入密码！' }]}
                    />
                    <div className="login-links">
                        <a href="/register">新账号？前往注册</a>
                        <a href="#/" className="forgot-password">
                            忘记密码
                        </a>
                    </div>
                </LoginForm>
            </div>
        </BasicLayout>
    );
};

export default LoginPage;