import React, { useEffect, useState, useContext } from "react";
import { Table, Image, Card } from "antd";
import { PrivateLayout } from "../components/layout";
import axios from "axios";
import { BASEURL } from "../service/common";
import { UserContext } from "../lib/context";
import { message } from "antd";
import "../css/order.css";

function OrderPage() {
    const { user } = useContext(UserContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user?.id) {
            message.error("请先登录");
            setOrders([]);
            return;
        }
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BASEURL}/order/get/${user.id}`);
                if (response.data.code === 200) {
                    setOrders(response.data.data.map(order => ({
                        ...order,
                        key: order.id,
                        price: order.book.price,
                    })));
                } else {
                    message.error("获取订单失败：" + response.data.message);
                }
            } catch (error) {
                message.error("网络错误，请稍后重试");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    const columns = [
        {
            title: "商品详情",
            dataIndex: "book",
            key: "book",
            render: (book) => (
                <div className="product-details">
                    <Image src={book.cover} alt={book.title} width={50} />
                    <span style={{ marginLeft: 8 }}>{book.title}</span>
                </div>
            ),
        },
        {
            title: "数量",
            dataIndex: "number",
            key: "number",
            render: (number) => `x${number}`,
        },
        {
            title: "价格",
            dataIndex: "price",
            key: "price",
            render: (price) => `¥${price}`,
        },
        {
            title: "收货人",
            dataIndex: "recipient",
            key: "recipient",
        },
        {
            title: "收货地址",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "订单时间",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt) => new Date(createdAt).toLocaleString("zh-CN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            }),
        },
    ];

    return (
        <PrivateLayout>
            <Card className="card-container">
                <Table
                    columns={columns}
                    dataSource={orders}
                    pagination={{ pageSize: 5 }}
                    className="order-page"
                    loading={loading}
                />
            </Card>
        </PrivateLayout>
    );
}

export default OrderPage;