import { Button, Col, Image, Row, Table, InputNumber, Space, Modal, Form } from "antd";
import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import useMessage from "antd/es/message/useMessage";
import axios from "axios";
import { BASEURL } from "../service/common";
import { UserContext } from "../lib/context";
import OrderFormModal from "./order_form_model";

export default function CartItemTable({ cartItems: initialCartItems = [], onMutate }) {
    const [messageApi, contextHolder] = useMessage();
    const [items, setItems] = useState(initialCartItems);
    const [selectedItems, setSelectedItems] = useState([]);
    const { user } = useContext(UserContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        setItems(initialCartItems);
        setSelectedItems(prevSelected =>
            prevSelected
                .map(selected => {
                    const updatedItem = initialCartItems.find(item => item.id === selected.id);
                    return updatedItem ? { ...selected, ...updatedItem } : null;
                })
                .filter(item => item !== null)
        );
    }, [initialCartItems]);

    const handleDeleteItem = async (id) => {
        try {
            const response = await axios.delete(`${BASEURL}/cart/delete/${id}`);
            if (response.data.code === 200) {
                const updatedItems = items.filter(item => item.id !== id);
                setItems(updatedItems);
                setSelectedItems(selectedItems.filter(item => item.id !== id));
                onMutate(updatedItems);
                messageApi.success("删除成功");
            } else {
                messageApi.error("删除失败：" + response.data.message);
            }
        } catch (error) {
            messageApi.error("网络错误，请稍后重试");
        }
    };

    const handleNumberChange = async (id, number) => {
        try {
            const response = await axios.put(`${BASEURL}/cart/update/${id}`, { number });
            if (response.data.code === 200) {
                const updatedItems = items.map(item =>
                    item.id === id ? { ...item, number } : item
                );
                setItems(updatedItems);
                setSelectedItems(prevSelected =>
                    prevSelected.map(selected =>
                        selected.id === id ? { ...selected, number } : selected
                    )
                );
                onMutate(updatedItems);
                messageApi.success("数量更新成功");
            } else {
                messageApi.error("更新数量失败：" + response.data.message);
            }
        } catch (error) {
            messageApi.error("网络错误，请稍后重试");
        }
    };

    const computeTotalPrice = () => {
        const total = selectedItems.reduce((sum, item) => {
            const price = parseFloat(item.book?.price) || 0;
            const number = item.number || 0;
            return sum + price * number;
        }, 0);
        return total.toFixed(2);
    };

    const computeItemPrice = (price, number) => {
        const parsedPrice = parseFloat(price) || 0;
        return (parsedPrice * number).toFixed(2);
    };

    const handleSubmit = () => {
        if (!user?.id) {
            messageApi.error("请先登录");
            return;
        }
        if (selectedItems.length === 0) {
            messageApi.warning("请先选择商品！");
            return;
        }
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleOrderSubmit = async () => {
        setIsModalOpen(false);
        form.resetFields();
        // 清空已下单的购物车项
        try {
            for (const item of selectedItems) {
                await axios.delete(`${BASEURL}/cart/delete/${item.id}`);
            }
            const updatedItems = items.filter(
                item => !selectedItems.some(selected => selected.id === item.id)
            );
            setItems(updatedItems);
            setSelectedItems([]);
            onMutate(updatedItems);
            messageApi.success("订单提交成功，购物车已更新");
            // 可选：跳转到订单页
            navigate("/order");
        } catch (error) {
            messageApi.error("清空购物车失败，请手动删除");
        }
    };

    const columns = [
        {
            title: "书名",
            dataIndex: "book",
            key: "book_title",
            width: "40%",
            render: book => <Link to={`/book/${book.id}`}>{book.title}</Link>,
        },
        {
            title: "数量",
            dataIndex: "number",
            key: "number",
            width: "20%",
            render: (number, item) => (
                <InputNumber
                    min={1}
                    value={number}
                    onChange={(newNumber) => handleNumberChange(item.id, newNumber)}
                />
            ),
        },
        {
            title: "总价",
            dataIndex: "book",
            key: "book_price",
            width: "20%",
            render: (book, item) => computeItemPrice(book.price, item.number),
        },
        {
            title: "操作",
            dataIndex: "",
            key: "action",
            width: "100px",
            render: (item) => (
                <Button type="primary" onClick={() => handleDeleteItem(item.id)}>
                    删除
                </Button>
            ),
        },
    ];

    return (
        <div style={{ width: "100%" }}>
            {contextHolder}
            <Table
                columns={columns}
                rowSelection={{
                    columnWidth: 40,
                    onChange: (_, selectedRows) => {
                        const updatedSelected = selectedRows.map(row => {
                            const matchingItem = items.find(item => item.id === row.id);
                            return matchingItem ? { ...row, number: matchingItem.number } : row;
                        });
                        setSelectedItems(updatedSelected);
                    },
                }}
                expandable={{
                    expandedRowRender: (cartItem) => (
                        <Row justify={"space-between"} gutter={8}>
                            <Col span={4}>
                                <Image src={cartItem.book.cover} height={200} />
                            </Col>
                            <Col span={20}>
                                <p>{cartItem.book.description}</p>
                            </Col>
                        </Row>
                    ),
                }}
                dataSource={items && items.length ? items.map(item => ({ ...item, key: item.id })) : []}
                style={{ width: "100%" }}
                pagination={{ pageSize: 5 }}
            />
            <Space
                style={{
                    width: "100%",
                    justifyContent: "flex-end",
                    marginTop: 16,
                }}
                size={16}
            >
                <p style={{ fontSize: 16, margin: 0 }}>
                    总价：{computeTotalPrice()}元
                </p>
                <Button
                    type="primary"
                    disabled={selectedItems.length === 0}
                    onClick={handleSubmit}
                >
                    立刻下单
                </Button>
            </Space>
            <OrderFormModal
                visible={isModalOpen}
                onCancel={handleCancel}
                onSubmit={handleOrderSubmit}
                selectedItems={selectedItems}
                form={form}
            />
        </div>
    );
}