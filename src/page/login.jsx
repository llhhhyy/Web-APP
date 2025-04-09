import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { BasicLayout } from '../components/layout';
import icon from '../image/icon.png';
import '../css/login.css';

const LoginPage = () => {
    const navigate = useNavigate();

    const onSubmit = async (values) => {
        // 模拟登录成功，直接跳转到 /home
        navigate('/home');
    };

    return (
        <BasicLayout>
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
                        <a href="#/">新账号？前往注册</a>
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