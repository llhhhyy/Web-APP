import React from "react";
import {
    LockOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import useMessage from "antd/es/message/useMessage";
import { Link, useNavigate } from "react-router-dom";
import { BasicLayout } from "../components/layout";
import { login } from "../service/login";
import { handleBaseApiResponse } from "../utils/message";
import icon from '../image/icon.png';
import '../css/login.css'; // 引入 CSS 文件

const LoginPage = () => {
    const [messageApi, contextHolder] = useMessage();
    const navigate = useNavigate();

    const onSubmit = async (values) => {
        let email = values['username'];
        let password = values['password'];
        let res = await login(email, password);
        handleBaseApiResponse(res, messageApi, () => navigate("/"));
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
                        rules={[{
                            required: true,
                            message: '请输入用户名!',
                        }]}
                    />
                    <ProFormText.Password
                        name="password"
                        fieldProps={{
                            size: 'large',
                            prefix: <LockOutlined className="prefixIcon" />,
                        }}
                        placeholder="密码"
                        rules={[{
                            required: true,
                            message: '请输入密码！',
                        }]}
                    />
                    <div className="login-links">
                        <Link to="/register">新账号？前往注册</Link>
                        <a href="#/" className="forgot-password">忘记密码</a>
                    </div>
                </LoginForm>
            </div>
        </BasicLayout>
    );
};

export default LoginPage;