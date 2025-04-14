import { Button, Col, Image, Row, Space, Tag, message } from "antd"; // 引入 message 组件
import { Divider, Typography } from 'antd';
import {ExclamationCircleOutlined, ShoppingCartOutlined, ShoppingOutlined} from '@ant-design/icons'

const { Title, Paragraph } = Typography;

export default function BookDetails({ book }) {
    // 点击“加入购物车”的处理函数
    const handleAddToCart = () => {
        alert('已加入购物车'); // 显示“已加入购物车”提示
    };

    // 点击“立即购买”的处理函数
    const handleBuyNow = () => {
        alert('已购买'); // 显示“已购买”提示
    };

    return (
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
                            {`销量：${book.sales}`}
                            <Divider type="vertical" />
                            标签：{book.tags.map(t => <Tag key={t.name}>{t.name}</Tag>)}
                        </Paragraph>
                    </Space>
                    <Divider orientation="left">作品简介</Divider>
                    <Paragraph>
                        {book.description}
                    </Paragraph>
                    <Space direction="vertical" size="large" style={{ width: "100%" }}>
                        <div style={{ backgroundColor: "#fcfaf7", padding: "20px", width: "100%" }}>
                            <Paragraph style={{ marginBottom: 0 }} type="secondary">抢购价</Paragraph>
                            <div>
                                <Space>
                                    <div style={{ color: "#dd3735", fontSize: "16px" }}>¥</div>
                                    <div style={{ color: "#dd3735", fontSize: "30px" }}>{book.price / 100}</div>
                                    <div style={{ color: "#dd3735", fontSize: "18px" }}>（7折）</div>
                                </Space>
                            </div>
                            <div>
                                <Space>
                                    <div style={{
                                        backgroundColor: "#f48484",
                                        padding: "0px 4px 0px 4px",
                                        borderRadius: "5px",
                                        color: "white"
                                    }}>店铺促销</div>
                                    <Paragraph style={{ marginBottom: 0 }} type="secondary">满¥18减¥1，满¥48减¥3，满¥98减¥5，满¥198减¥10</Paragraph>
                                </Space>
                            </div>
                            <Space>
                                <ExclamationCircleOutlined />
                                <Paragraph style={{ marginBottom: 0 }} type="secondary">部分促销不可共享，请以购物车能享受的促销为准</Paragraph>
                            </Space>
                        </div>
                        <Space>
                            <Button icon={<ShoppingCartOutlined />} color="pink" size="large" onClick={handleAddToCart}>加入购物车</Button>
                            <Button icon={<ShoppingOutlined />} color="pink" type="primary" size="large" variant="solid" onClick={handleBuyNow}>立即购买</Button>
                        </Space>
                    </Space>
                </Typography>
            </Col>
        </Row>
    );
}