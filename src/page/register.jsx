import React, { useContext } from 'react';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { BasicLayout } from '../components/layout';
import { BASEURL } from "../service/common";
import axios from 'axios';
import useMessage from 'antd/es/message/useMessage';
import icon from '../image/icon.png';
import '../css/login.css';
import { UserContext } from "../lib/context";

axios.defaults.withCredentials = true;

const RegisterPage = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = useMessage();
    const { setUser } = useContext(UserContext);

    // 校验用户名是否重复
    const validateUsername = async (_, value) => {
        if (!value) {
            return Promise.reject('请输入用户名');
        }
        try {
            const response = await axios.get(`${BASEURL}/users/username/${value}/exists`);
            console.log(response.data);
            if (response.data.data) {
                return Promise.reject('该用户名已被使用');
            }
            return Promise.resolve();
        } catch (error) {
            return Promise.reject('用户名验证失败');
        }
    };

    // 校验邮箱格式
    const validateEmail = (_, value) => {
        if (!value) {
            return Promise.reject('请输入邮箱');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return Promise.reject('邮箱格式不正确');
        }
        return Promise.resolve();
    };

    // 提交注册表单
    const onSubmit = async (values) => {
        console.log(values.username);
        console.log(values.password);
        try {
            const response = await axios.post(`${BASEURL}/users/register`, {
                username: values.username,
                password: values.password,
                email: values.email
            });

            if (response.status === 200) {
                messageApi.success('注册成功！请登录');
                navigate('/login');
            } else {
                messageApi.error('注册失败: ' + response.data.message);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || '注册请求失败';
            messageApi.error(`注册失败: ${errorMsg}`);
            console.error(error);
        }
    };

    return (
        <BasicLayout>
            {contextHolder}
            <div className="login-background">
                <LoginForm
                    logo={icon}
                    title="Book Store"
                    subTitle="新用户注册"
                    onFinish={onSubmit}
                    className="login-form"
                    submitter={{
                        searchConfig: {
                            submitText: '注册'
                        }
                    }}
                >
                    <ProFormText
                        name="username"
                        fieldProps={{
                            size: 'large',
                            prefix: <UserOutlined className="prefixIcon" />,
                        }}
                        placeholder="请输入用户名"
                        rules={[
                            { required: true, message: '请输入用户名!' },
                            { validator: validateUsername }
                        ]}
                    />
                    <ProFormText.Password
                        name="password"
                        fieldProps={{
                            size: 'large',
                            prefix: <LockOutlined className="prefixIcon" />,
                        }}
                        placeholder="设置密码"
                        rules={[
                            { required: true, message: '请输入密码！' },
                            { min: 6, message: '密码长度至少6位' }
                        ]}
                    />
                    <ProFormText.Password
                        name="confirmPassword"
                        fieldProps={{
                            size: 'large',
                            prefix: <LockOutlined className="prefixIcon" />,
                        }}
                        placeholder="确认密码"
                        rules={[
                            { required: true, message: '请确认密码！' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('两次输入的密码不一致');
                                },
                            }),
                        ]}
                    />
                    <ProFormText
                        name="email"
                        fieldProps={{
                            size: 'large',
                            prefix: <MailOutlined className="prefixIcon" />,
                        }}
                        placeholder="请输入邮箱"
                        rules={[
                            { required: true, message: '请输入邮箱！' },
                            { validator: validateEmail }
                        ]}
                    />
                    <div className="login-links">
                        <a href="/login">已有账号？前往登录</a>
                    </div>
                </LoginForm>
            </div>
        </BasicLayout>
    );
};

export default RegisterPage;