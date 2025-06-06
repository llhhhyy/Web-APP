import {
    LogoutOutlined,
    UserOutlined,
    AccountBookOutlined,
    FormOutlined,
    HomeOutlined,
    ShoppingCartOutlined,
    ProfileOutlined,
    ContainerOutlined,
} from '@ant-design/icons';

export const siderMenuItems = [
    { key: "/home", label: "首页", icon: <HomeOutlined /> },
    { key: "/profile", label: "个人主页", icon: <ProfileOutlined /> },
    { key: "/cart", label: "购物车", icon: <ShoppingCartOutlined /> },
    { key: "/order", label: "订单", icon: <ContainerOutlined /> },
    { key: "/admin", label: "管理", icon: <FormOutlined /> },
];
