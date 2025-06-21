import { Button, Card, DatePicker, Form, Input, Table, Tag, Row, Col, Space, Image } from "antd";
import { PrivateLayout } from "../components/layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASEURL } from "../service/common";
import useMessage from "antd/es/message/useMessage";
import "../css/order.css";

const { RangePicker } = DatePicker;

const AdminOrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = useMessage();
    const [form] = Form.useForm();

    const fetchOrders = async (params = {}) => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASEURL}/order/admin/search`, {
                params: {
                    keyword: params.keyword || undefined,
                    startTime: params.startTime ? new Date(params.startTime).toISOString() : undefined,
                    endTime: params.endTime ? new Date(params.endTime).toISOString() : undefined,
                },
            });

            if (response.data.code === 200) {
                setOrders(response.data.data.map(order => {
                    // 安全处理可能缺失的数据
                    const book = order.book ?? {};
                    const user = order.user ?? {};

                    return {
                        ...order,
                        key: order.id,
                        totalPrice: ((book.price ?? 0) * order.number).toFixed(2),
                        book: {
                            ...book,
                            cover: book.cover || "https://via.placeholder.com/50", // 默认封面
                            title: book.title || "未知书籍",
                            price: book.price || 0
                        },
                        user: {
                            ...user,
                            username: user.username || "未知用户",
                            id: user.id || "N/A"
                        }
                    };
                }));
            } else {
                messageApi.error("获取订单失败: " + response.data.message);
            }
        } catch (error) {
            messageApi.error("网络错误，请稍后重试");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleSearch = (values) => {
        const { keyword, dateRange } = values;
        const params = {
            keyword: keyword || undefined,
            startTime: dateRange && dateRange[0] ? dateRange[0].toISOString() : undefined,
            endTime: dateRange && dateRange[1] ? dateRange[1].toISOString() : undefined,
        };
        fetchOrders(params);
    };

    const handleReset = () => {
        form.resetFields();
        fetchOrders();
    };

    const columns = [
        {
            title: "订单ID",
            dataIndex: "id",
            key: "id",
            width: 80,
        },
        {
            title: "用户信息",
            dataIndex: "user",
            key: "user",
            render: (user) => (
                <div>
                    <div>{user?.username ?? "未知用户"}</div>
                    <Tag color="blue">ID: {user?.id ?? "N/A"}</Tag>
                </div>
            ),
        },
        {
            title: "商品信息",
            dataIndex: "book",
            key: "book",
            render: (book) => (
                <div className="product-details">
                    <Image
                        src={book?.cover || "https://via.placeholder.com/50"}
                        alt={book?.title || "未知书籍"}
                        width={50}
                        preview={false}
                    />
                    <div className="book-info">
                        <div className="book-title">{book?.title || "未知书籍"}</div>
                        <div>¥{(book?.price || 0)}</div>
                    </div>
                </div>
            ),
        },
        {
            title: "数量",
            dataIndex: "number",
            key: "number",
            render: (number) => <Tag color="green">x{number}</Tag>,
        },
        {
            title: "总价",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (totalPrice) => <span className="total-price">¥{totalPrice}</span>,
        },
        {
            title: "收货信息",
            dataIndex: "recipient",
            key: "recipient",
            render: (_, record) => (
                <div className="recipient-info">
                    <div><strong>{record.recipient || "未提供"}</strong></div>
                    <div>{record.phone || "未提供"}</div>
                    <div className="address">{record.address || "未提供"}</div>
                </div>
            ),
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
            {contextHolder}
            <div className="order-page">
                <Card className="card-container">
                    <div className="search-container">
                        <Form form={form} onFinish={handleSearch} layout="vertical">
                            <Row gutter={16} align="middle">
                                <Col span={7}>
                                    <Form.Item name="keyword" label="书籍名称">
                                        <Input placeholder="输入书籍名称搜索" allowClear />
                                    </Form.Item>
                                </Col>
                                <Col span={10}>
                                    <Form.Item name="dateRange" label="订单时间范围">
                                        <RangePicker
                                            showTime={{ format: 'HH:mm' }}
                                            format="YYYY-MM-DD HH:mm"
                                            placeholder={["开始时间", "结束时间"]}
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={7} style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <div className="button-container">
                                        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                                            搜索
                                        </Button>
                                        <Button onClick={handleReset}>重置</Button>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Card>

                <Card className="card-container">
                    <Table
                        columns={columns}
                        dataSource={orders}
                        loading={loading}
                        pagination={{ pageSize: 8 }}
                        scroll={{ x: 1500 }}
                    />
                </Card>
            </div>
        </PrivateLayout>
    );
};

export default AdminOrderPage;