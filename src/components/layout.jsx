import { Button, Dropdown, Form, Layout, Menu, Modal, Space, Input } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../lib/context";
import { dropMenuItems, siderMenuItems } from "./layout_Items";
import { UserOutlined } from "@ant-design/icons";
import { BASEURL } from "../service/common";
import "../css/layout.css";
import icon from "../image/icon.png";
import axios from "axios";
import useMessage from "antd/es/message/useMessage";

export function BasicLayout({ children }) {
    return (
        <Layout className="basic-layout">
            <Content>{children}</Content>
            <Footer className="footer">
                <Space direction="vertical">
                    <Link target="_blank" to="https://github.com/Okabe-Rintarou-0">
                        关于作者
                    </Link>
                    <div>电子书城 REINS 2024</div>
                </Space>
            </Footer>
        </Layout>
    );
}

const { Sider } = Layout;

export function PrivateLayout({ children }) {
    const { user, setUser } = useContext(UserContext);
    const [messageApi, contextHolder] = useMessage();
    const location = useLocation();
    const navigate = useNavigate();
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm] = Form.useForm();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                setLoading(false);
                navigate("/login", { replace: true });
                return;
            }

            try {
                const response = await axios.get(`${BASEURL}/users/id/${userId}`);
                console.log("API Response:", response.data);
                if (response.data.code === 200) {
                    const userData = response.data.data; // 调整为 response.data.data
                    setUser({
                        id: userData.id,
                        username: userData.username,
                        email: userData.email,
                        avatar: userData.avatar,
                        balance: userData.balance,
                        tagLine: userData.tagLine,
                        role: userData.role, // 添加 role 字段
                    });
                } else {
                    throw new Error("获取用户信息失败");
                }
            } catch (error) {
                messageApi.error("获取用户信息失败");
                localStorage.removeItem("userId");
                localStorage.removeItem("username");
                setUser(null);
                navigate("/login", { replace: true });
            } finally {
                setLoading(false);
            }
        };

        if (!user && loading) {
            fetchUserData();
        } else {
            setLoading(false);
        }
    }, [navigate, setUser, user, messageApi]);

    const handleChangePassword = async (values) => {
        try {
            const response = await axios.put(`${BASEURL}/users/${user?.id}/password`, {
                password: values.newPassword,
            });

            if (response.data.code === 200) {
                messageApi.success("密码修改成功");
                setShowPasswordModal(false);
                passwordForm.resetFields();
            } else {
                messageApi.error("密码修改失败：" + response.data.message);
            }
        } catch (error) {
            messageApi.error("密码修改失败：网络错误");
            console.error(error);
        }
    };

    const handleNavMenuClick = (e) => {
        if (e.key.startsWith("/")) {
            navigate(e.key);
        }
    };

    const handleDropMenuClick = (e) => {
        if (e.key === "/logout") {
            localStorage.removeItem("userId");
            localStorage.removeItem("username");
            setUser(null);
            navigate("/login");
            messageApi.success("已登出");
        } else if (e.key === "password") {
            setShowPasswordModal(true);
        }
    };

    // 动态过滤菜单，仅在 role 为 ADMIN 时包含 /administrator
    const filteredMenuItems = siderMenuItems.filter(
        (item) => item.key !== "/admin" || user?.role === "ADMIN"
    );

    const selectedKey = filteredMenuItems.find((item) => item.key === location.pathname)?.key || "/";

    const dynamicDropMenuItems = [
        { key: "nickname", label: user?.username || "user", icon: <UserOutlined /> },
        { key: "password", label: "修改密码", icon: <UserOutlined /> },
        { key: "balance", label: `余额：${user?.balance || 0} 元`, icon: <UserOutlined /> },
        { key: "/logout", label: "登出", icon: <UserOutlined />, danger: true },
    ];

    if (loading || !user) {
        return null;
    }

    return (
        <Layout className="basic-layout">
            <Modal
                title="修改密码"
                open={showPasswordModal}
                onOk={() => passwordForm.submit()}
                onCancel={() => {
                    setShowPasswordModal(false);
                    passwordForm.resetFields();
                }}
                okText="确认"
                cancelText="取消"
            >
                <Form form={passwordForm} onFinish={handleChangePassword}>
                    <Form.Item
                        name="oldPassword"
                        label="旧密码"
                        rules={[{ required: true, message: "请输入旧密码" }]}
                    >
                        <Input.Password placeholder="请输入当前密码" />
                    </Form.Item>
                    <Form.Item
                        name="newPassword"
                        label="新密码"
                        rules={[
                            { required: true, message: "请输入新密码" },
                            { min: 6, message: "密码至少6位" },
                        ]}
                    >
                        <Input.Password placeholder="至少6位字符" />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label="确认新密码"
                        dependencies={["newPassword"]}
                        rules={[
                            { required: true, message: "请确认新密码" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("newPassword") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("两次输入的密码不一致"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="再次输入新密码" />
                    </Form.Item>
                </Form>
            </Modal>
            {contextHolder}
            <Sider className="sider">
                <div className="sider-user-section">
                    <Dropdown
                        menu={{
                            items: dynamicDropMenuItems,
                            onClick: handleDropMenuClick,
                        }}
                        trigger={["click"]}
                    >
                        <Button
                            shape="circle"
                            icon={<UserOutlined />}
                            size="large"
                            className="user-button"
                        />
                    </Dropdown>
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    className="sider-menu"
                    items={filteredMenuItems.map((item) => ({
                        key: item.key,
                        icon: item.icon,
                        label: <Link to={item.key}>{item.label}</Link>,
                    }))}
                    onClick={handleNavMenuClick}
                />
            </Sider>

            <Layout>
                <Header className="header">
                    <Link to="/home">
                        <h1>
                            <img src={icon} alt="Book Store Icon" className="header-icon" />
                            BOOK STORE
                        </h1>
                    </Link>
                </Header>

                <Content className="content">
                    <UserContext.Provider value={{ user, setUser }}>
                        {children}
                    </UserContext.Provider>
                </Content>

                <Footer className="footer">
                    <Space direction="vertical">
                        <Link target="_blank" to="https://github.com/Okabe-Rintarou-0">
                            关于作者
                        </Link>
                        <div>电子书城 REINS 2024</div>
                    </Space>
                </Footer>
            </Layout>
        </Layout>
    );
}