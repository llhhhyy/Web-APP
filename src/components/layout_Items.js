import {
    LogoutOutlined,
    UserOutlined,
    AccountBookOutlined,
    FormOutlined,
    HomeOutlined,
    ShoppingCartOutlined,
    ProfileOutlined,
} from '@ant-design/icons';

export const siderMenuItems = [
    { key: "/home", label: "首页", icon: <HomeOutlined /> },
    { key: "/profile", label: "个人主页", icon: <ProfileOutlined /> },
    { key: "/cart", label: "购物车", icon: <ShoppingCartOutlined /> },
];

export const dropMenuItems = [
    { key: "nickname", label: "user", icon: <UserOutlined /> },
    { key: "password", label: "修改密码", icon: <FormOutlined /> },
    { key: "balance", label: `余额：1000元`, icon: <AccountBookOutlined />},
    { key: "/logout", label: "登出", icon: <LogoutOutlined />, danger: true },
];
