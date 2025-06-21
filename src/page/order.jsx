import React, {useEffect, useState, useContext} from "react";
import {Table, Image, Card, Form, Input, DatePicker, Button, Row, Col} from "antd";
import {PrivateLayout} from "../components/layout";
import axios from "axios";
import {BASEURL} from "../service/common";
import {UserContext} from "../lib/context";
import {message} from "antd";
import "../css/order.css";

const {RangePicker} = DatePicker;

function OrderPage() {
    const {user} = useContext(UserContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const fetchOrders = async (params = {}) => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASEURL}/order/search`, {params});
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

    useEffect(() => {
        if (!user?.id) {
            message.error("请先登录");
            setOrders([]);
            return;
        }
        fetchOrders(); // Fetch all orders initially
    }, [user]);

    const handleSearch = (values) => {
        const {keyword, dateRange} = values;
        const params = {
            keyword: keyword || undefined,
            startTime: dateRange && dateRange[0] ? dateRange[0].toISOString() : undefined,
            endTime: dateRange && dateRange[1] ? dateRange[1].toISOString() : undefined,
        };
        fetchOrders(params);
    };

    const handleReset = () => {
        form.resetFields();
        fetchOrders(); // Fetch all orders on reset
    };

    const columns = [
        {
            title: "商品详情",
            dataIndex: "book",
            key: "book",
            render: (book) => (
                <div className="product-details">
                    <Image src={book.cover} alt={book.title} width={50}/>
                    <span style={{marginLeft: 8}}>{book.title}</span>
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
            {/* 新增包裹整个内容的容器 */}
            <div className="order-page">
                <Card className="card-container">
                    <div className="search-container">
                        <Form form={form} onFinish={handleSearch} layout="vertical">
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item name="keyword" label="书籍名称">
                                        <Input placeholder="输入书籍名称搜索" allowClear/>
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
                                        <Button type="primary" htmlType="submit" style={{marginRight: 8}}>
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
                            pagination={{pageSize: 5}}
                            loading={loading}
                            // 移除了 className="order-page"
                        />
                    </div>
                </Card>
            </div>
        </PrivateLayout>
    );
}

export default OrderPage;