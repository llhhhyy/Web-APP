import { Layout, Space } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
// import NavBar from "./navbar";
import { Link, /*useNavigate*/ } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { getMe } from "../service/user";
// import { UserContext } from "../lib/context";
// import useMessage from "antd/es/message/useMessage";

export function BasicLayout({ children }) {
    return (
        <Layout className="basic-layout">
            {/*<Header className="header"></Header>*/}
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