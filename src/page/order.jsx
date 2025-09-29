import React, { useEffect, useState, useContext } from "react";
import { Table, Image, Card, Form, Input, DatePicker, Button, Row, Col } from "antd";
import { PrivateLayout } from "../components/layout";
import axios from "axios";
import { BASEURL } from "../service/common";
import { UserContext } from "../lib/context";
import { message } from "antd";
import "../css/order.css";

const { RangePicker } = DatePicker;

function OrderPage() {
    const { user } = useContext(UserContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const fetchOrders = async (params = {}) => {
        message.config("开始获取订单...");
        try {
            setLoading(true);
            let url = `${BASEURL}/order/get`;
            let config = {};
            if (Object.keys(params).length > 0) {
                url = `${BASEURL}/order/search`;
                config = { params };
            }
            const response = await axios.get(url, config);
            console.log(response);
            if (response.data.code === 200) {
                // 处理多物品订单：计算总价，并保留 orderItems
                console.log(response.data.data.orderItems);
                setOrders(
                    response.data.data.map((order) => ({
                        ...order,
                        key: order.id,
                        totalPrice: order.orderItems
                            ? order.orderItems
                                .reduce((sum, item) => sum + parseFloat(item.bookPrice) * item.number, 0)
                                .toFixed(2)
                            : "0.00",
                    }))
                );
            } else {
                message.error("获取订单失败：" + response.data.message);
            }
        } catch (error) {
            message.error("网络错误，请稍后重试");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user?.id) {
            message.error("请先登录");
            setOrders([]);
            return;
        }
        fetchOrders(); // 初始获取所有订单，使用 /order/get
    }, [user]);

    const handleSearch = (values) => {
        const { keyword, dateRange } = values;
        const params = {
            keyword: keyword || undefined,
            startTime: dateRange && dateRange[0] ? dateRange[0].toISOString() : undefined,
            endTime: dateRange && dateRange[1] ? dateRange[1].toISOString() : undefined,
        };
        fetchOrders(params); // 搜索时使用 /order/search
    };

    const handleReset = () => {
        form.resetFields();
        fetchOrders(); // 重置时使用 /order/get
    };

    // 子表格列：显示订单物品详情
    const itemColumns = [
        {
            title: "书籍",
            dataIndex: "bookTitle",
            key: "bookTitle",
            render: (text, record) => (
                <div className="product-details">
                    <Image src={record.bookCover} alt={text} width={50} />
                    <span style={{ marginLeft: 8 }}>{text}</span>
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
            title: "单价",
            dataIndex: "bookPrice",
            key: "bookPrice",
            render: (price) => `¥${price}`,
        },
    ];

    // 主表格列：订单基本信息
    const columns = [
        {
            title: "订单ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "总价",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (totalPrice) => `¥${totalPrice}`,
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
            render: (createdAt) =>
                new Date(createdAt).toLocaleString("zh-CN", {
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
            <div className="order-page">
                <Card className="card-container">
                    <div className="search-container">
                        <Form form={form} onFinish={handleSearch} layout="vertical">
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item name="keyword" label="书籍名称">
                                        <Input placeholder="输入书籍名称搜索" allowClear />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="dateRange" label="订单时间">
                                        <RangePicker
                                            showTime
                                            format="YYYY-MM-DD HH:mm"
                                            placeholder={["开始时间", "结束时间"]}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label=" ">
                                        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                                            搜索
                                        </Button>
                                        <Button onClick={handleReset}>重置</Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Card>
                <Card className="card-container">
                    <div className="table-container">
                        <Table
                            columns={columns}
                            dataSource={orders}
                            pagination={{ pageSize: 5 }}
                            loading={loading}
                            expandable={{
                                expandedRowRender: (record) => (
                                    <Table
                                        columns={itemColumns}
                                        dataSource={record.orderItems}
                                        pagination={false}
                                    />
                                ),
                                rowExpandable: (record) => record.orderItems.length > 0,
                            }}
                        />
                    </div>
                </Card>
            </div>
        </PrivateLayout>
    );
}

export default OrderPage;