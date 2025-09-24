import { Button, Col, Image, Row, Space, Tag, message, Form } from "antd";
import { Divider, Typography } from "antd";
import {
    ExclamationCircleOutlined,
    ShoppingCartOutlined,
    ShoppingOutlined,
} from "@ant-design/icons";
import { useState, useContext } from "react";
import OrderFormModal from "./order_form_model";
import axios from "axios";
import { BASEURL } from "../service/common";
import { UserContext } from "../lib/context";

const { Title, Paragraph } = Typography;

export default function BookDetails({ book }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const { user } = useContext(UserContext);

    const handleAddToCart = async () => {
        if (!user?.id) {
            message.error("请先登录");
            return;
        }
        try {
            const response = await axios.post(`${BASEURL}/cart/add`, {
                bookId: book.id,
                number: 1,
            });
            if (response.data.code === 200) {
                message.success("已加入购物车");
            } else {
                message.error("加入购物车失败：" + response.data.message);
            }
        } catch (error) {
            message.error("网络错误，请稍后重试");
        }
    };

    const handleBuyNow = () => {
        if (!user?.id) {
            message.error("请先登录");
            return;
        }
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleOrderSubmit = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Row>
                <Col span={9}>
                    <Image src={book.cover} height={500} />
                </Col>
                <Col span={15}>
                    <Typography>
                        <Title>{book.title}</Title>
                        <Divider orientation="left">基本信息</Divider>
                        <Space>
                            <Paragraph>
                                {`作者：${book.author}`}
                                <Divider type="vertical" />
                                {`销量：${book.sales || 0}`}
                                <Divider type="vertical" />
                                {`库存：${book.inventory || 0}`}
                                <Divider type="vertical" />
                                标签：
                                {book.tags.map((t) => (
                                    <Tag key={t}>{t}</Tag>
                                ))}
                            </Paragraph>
                        </Space>
                        <Divider orientation="left">作品简介</Divider>
                        <Paragraph>{book.description}</Paragraph>
                        <Space direction="vertical" size="large" style={{ width: "100%" }}>
                            <div style={{ backgroundColor: "#fcfaf7", padding: "20px", width: "100%" }}>
                                <Paragraph style={{ marginBottom: 0 }} type="secondary">
                                    抢购价
                                </Paragraph>
                                <div>
                                    <Space>
                                        <div style={{ color: "#dd3735", fontSize: "16px" }}>¥</div>
                                        <div style={{ color: "#dd3735", fontSize: "30px" }}>
                                            {book.price}
                                        </div>
                                        <div style={{ color: "#dd3735", fontSize: "18px" }}>(7折)</div>
                                    </Space>
                                </div>
                                <div>
                                    <Space>
                                        <div
                                            style={{
                                                backgroundColor: "#f48484",
                                                padding: "0px 4px 0px 4px",
                                                borderRadius: "5px",
                                                color: "white",
                                            }}
                                        >
                                            店铺促销
                                        </div>
                                        <Paragraph style={{ marginBottom: 0 }} type="secondary">
                                            满¥18减¥1，满¥48减¥3，满¥98减¥5，满¥198减¥10
                                        </Paragraph>
                                    </Space>
                                </div>
                                <Space>
                                    <ExclamationCircleOutlined />
                                    <Paragraph style={{ marginBottom: 0 }} type="secondary">
                                        部分促销不可共享，请以购物车能享受的促销为准
                                    </Paragraph>
                                </Space>
                            </div>
                            <Space>
                                <Button
                                    icon={<ShoppingCartOutlined />}
                                    size="large"
                                    onClick={handleAddToCart}
                                    style={{ backgroundColor: "#fff0f6", color: "#eb2f96" }}
                                >
                                    加入购物车
                                </Button>
                                <Button
                                    icon={<ShoppingOutlined />}
                                    type="primary"
                                    size="large"
                                    onClick={handleBuyNow}
                                    style={{ backgroundColor: "#eb2f96", borderColor: "#eb2f96" }}
                                >
                                    立即购买
                                </Button>
                            </Space>
                        </Space>
                    </Typography>
                </Col>
            </Row>

            <OrderFormModal
                visible={isModalOpen}
                onCancel={handleCancel}
                onSubmit={handleOrderSubmit}
                book={book}
                form={form}
            />
        </>
    );
}