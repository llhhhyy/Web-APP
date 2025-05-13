import { Button, Col, Image, Row, Table, InputNumber, Space } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useMessage from "antd/es/message/useMessage";


export default function CartItemTable({ cartItems: initialCartItems = [], onMutate }) {
    const [messageApi, contextHolder] = useMessage();
    const [items, setItems] = useState(initialCartItems || []);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        setItems(initialCartItems || []);
        setSelectedItems(prevSelected => {
            return prevSelected
                .map(selected => {
                    const updatedItem = (initialCartItems || []).find(item => item.id === selected.id);
                    return updatedItem ? { ...selected, ...updatedItem } : null;
                })
                .filter(item => item !== null);
        });
    }, [initialCartItems]);

    const handleDeleteItem = (id) => {
        const updatedItems = items.filter(item => item.id !== id);
        setItems(updatedItems);
        setSelectedItems(selectedItems.filter(item => item.id !== id));
        onMutate(updatedItems);
    };

    const handleNumberChange = (id, number) => {
        const updatedItems = items.map(item =>
            item.id === id ? { ...item, number } : item
        );
        setItems(updatedItems);

        setSelectedItems(prevSelected => {
            return prevSelected.map(selected =>
                selected.id === id ? { ...selected, number } : selected
            );
        });
    };

    const computeTotalPrice = () => {
        console.log("Selected Items:", selectedItems);

        const total = selectedItems.reduce((sum, item) => {
            const price = item.book?.price || 0;
            const number = item.number || 0;
            console.log(`Item ID: ${item.id}, Price: ${price}, Number: ${number}, Subtotal: ${price * number}`);
            return sum + (price * number);
        }, 0);

        return (total / 100).toFixed(2);
    };

    const computeItemPrice = (price, number) => {
        return ((price * number) / 100).toFixed(2);
    };

    const handleOrderSubmit = () => {
        if (selectedItems.length === 0) {
            messageApi.warning("请先选择商品！");
            return;
        }
        messageApi.success("下单成功！");
        const remainingItems = items.filter(
            item => !selectedItems.some(selected => selected.id === item.id)
        );
        setItems(remainingItems);
        setSelectedItems([]);
        onMutate(remainingItems);
    };

    const columns = [
        {
            title: '书名',
            dataIndex: 'book',
            key: 'book_title',
            width: '40%',
            render: book => <Link to={`/book/${book.id}`}>{book.title}</Link>,
        },
        {
            title: '数量',
            dataIndex: 'number',
            key: 'number',
            width: '20%',
            render: (number, item) => (
                <InputNumber
                    min={1}
                    defaultValue={number}
                    value={number}
                    onChange={(newNumber) => handleNumberChange(item.id, newNumber)}
                />
            ),
        },
        {
            title: '总价',
            dataIndex: 'book',
            key: 'book_price',
            width: '20%',
            render: (book, item) => computeItemPrice(book.price, item.number),
        },
        {
            title: '操作',
            dataIndex: '',
            key: 'action',
            width: '20%',
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
                    columnWidth: 4, // 设置选择列宽度为 40px
                    onChange: (_, selectedRows) => {
                        const updatedSelected = selectedRows.map(row => {
                            const matchingItem = items.find(item => item.id === row.id);
                            return matchingItem ? { ...row, number: matchingItem.number } : row;
                        });
                        console.log("Updated Selected Items:", updatedSelected);
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
                    onClick={handleOrderSubmit}
                >
                    立刻下单
                </Button>
            </Space>
        </div>
    );
}