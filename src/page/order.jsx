import React from "react";
import { Table, Image, Card } from "antd";
import { PrivateLayout } from "../components/layout";
import { mockOrders, mockBooks } from "../data/bookdata";
import "../css/order.css";

function OrderPage() {
    const columns = [
        {
            title: "商品详情",
            dataIndex: "bookId",
            key: "book",
            render: (bookId) => {
                const book = mockBooks.find((b) => b.id === bookId);
                return (
                    <div className="product-details">
                        <Image src={book.cover} alt={book.title} width={50} />
                        <span style={{ marginLeft: 8 }}>{book.title}</span>
                    </div>
                );
            },
        },
        {
            title: "数量",
            dataIndex: "quantity",
            key: "quantity",
            render: (quantity) => `x${quantity}`,
        },
        {
            title: "价格",
            dataIndex: "price",
            key: "price",
            render: (price) => `¥${(price / 100).toFixed(2)}`,
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
            render: (createdAt) => new Date(createdAt).toLocaleString("zh-CN"),
        },
    ];

    return (
        <PrivateLayout>
            <Card className="card-container">
                <Table
                    columns={columns}
                    dataSource={mockOrders.map((order) => ({ ...order, key: order.id }))}
                    pagination={{ pageSize: 5 }}
                    className="order-page"
                />
            </Card>
        </PrivateLayout>
    );
}

export default OrderPage;