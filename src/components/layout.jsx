import {Button, Dropdown, Layout, Menu, Space} from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import {Link, useLocation, useNavigate} from "react-router-dom";
import { useState } from "react";
import { UserContext } from "../lib/context";
import {dropMenuItems, siderMenuItems} from "./layout_Items";
import {UserOutlined} from "@ant-design/icons";
import '../css/layout.css';
import icon from '../image/icon.png';

export function BasicLayout({ children }) {
    return (
        <Layout className="basic-layout">
            <Content>
                {children}
            </Content>
            <Footer className="footer">
                <Space direction="vertical">
                    <Link target="_blank" to="https://github.com/Okabe-Rintarou-0">关于作者</Link>
                    <div>电子书城 REINS 2024</div>
                </Space>
            </Footer>
        </Layout>
    )
}

const {Sider} = Layout;

export function PrivateLayout({children}) {
    const [user] = useState({nickname: "user", balance: 1000});
    const location = useLocation();
    const navigate = useNavigate();

    const handleNavMenuClick = (e) => {
        if (e.key.startsWith("/")) {
            navigate(e.key);
        }
    };

    const handleDropMenuClick = (e) => {
        if (e.key === "/logout") {
            navigate("/login");
            return;
        }
        if (e.key === "password") {
            console.log("打开修改密码模态框");
        }
    };

    const selectedKey = siderMenuItems.find(item => item.key === location.pathname)?.key || "/";

    return (
        <Layout className="basic-layout">
            <Sider className="sider">
                <div className="sider-user-section">
                    <Dropdown
                        menu={{
                            items: dropMenuItems,
                            onClick: handleDropMenuClick,
                        }}
                        trigger={["click"]}
                    >
                        <Button
                            shape="circle"
                            icon={<UserOutlined/>}
                            size="large"
                            className="user-button"
                        />
                    </Dropdown>
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    className="sider-menu"
                    items={siderMenuItems.map(item => ({
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
                    <UserContext.Provider value={{user}}>
                        {user && children}
                    </UserContext.Provider>
                </Content>

                <Footer className="footer">
                    <Space direction="vertical">
                        <Link target="_blank" to="https://github.com/Okabe-Rintarou-0">关于作者</Link>
                        <div>电子书城 REINS 2024</div>
                    </Space>
                </Footer>
            </Layout>
        </Layout>
    );
}