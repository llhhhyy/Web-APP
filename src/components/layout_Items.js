import {
    LogoutOutlined,
    UserOutlined,
    AccountBookOutlined,
    FormOutlined,
    HomeOutlined,
    ShoppingCartOutlined,
    ProfileOutlined,
    ContainerOutlined, BarChartOutlined,
} from '@ant-design/icons';

export const siderMenuItems = [
    { key: "/home", label: "首页", icon: <HomeOutlined /> },
    { key: "/profile", label: "个人主页", icon: <ProfileOutlined /> },
    { key: "/cart", label: "购物车", icon: <ShoppingCartOutlined /> },
    { key: "/order", label: "订单", icon: <ContainerOutlined /> },
    { key: "/adminbook", label: "书籍管理", icon: <FormOutlined /> },
    { key: "/adminorder", label: "订单管理", icon: <FormOutlined /> },
    { key: "/adminuser", label: "用户管理", icon: <FormOutlined /> },
    { key: "/statistics", label: "统计", icon:<BarChartOutlined /> },
];
