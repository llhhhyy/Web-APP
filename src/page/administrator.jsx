import { Button, Card, Form, Input, Modal, Space, Table, Tag, InputNumber } from "antd";
import { PrivateLayout } from "../components/layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASEURL } from "../service/common";
import useMessage from "antd/es/message/useMessage";
import "../css/home.css"; // 复用 home.css 样式

const AdministratorPage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [currentBook, setCurrentBook] = useState(null);
    const [addForm] = Form.useForm();
    const [editForm] = Form.useForm();
    const [messageApi, contextHolder] = useMessage();

    // 获取书籍列表
    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${BASEURL}/books/find`, {
                    params: { pageIndex: 0, pageSize: 1000 }, // 获取所有书籍
                });
                if (response.data.code === 200) {
                    setBooks(response.data.data);
                } else {
                    messageApi.error("获取书籍列表失败");
                }
            } catch (error) {
                messageApi.error("获取书籍列表失败：网络错误");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, [messageApi]);

    // 添加书籍
    const handleAddBook = async (values) => {
        try {
            const bookData = {
                ...values,
                tags: values.tags ? values.tags.split(",").map((tag) => tag.trim()) : [],
            };
            const response = await axios.post(`${BASEURL}/books/save`, bookData);
            if (response.data.code === 200) {
                messageApi.success("添加书籍成功");
                setBooks([...books, response.data.data]);
                setAddModalVisible(false);
                addForm.resetFields();
            } else {
                messageApi.error("添加书籍失败：" + response.data.message);
            }
        } catch (error) {
            messageApi.error("添加书籍失败：网络错误");
            console.error(error);
        }
    };

    // 修改书籍
    const handleEditBook = async (values) => {
        try {
            const bookData = {
                ...values,
                tags: values.tags ? values.tags.split(",").map((tag) => tag.trim()) : [],
            };
            const response = await axios.put(`${BASEURL}/books/update/${currentBook.id}`, bookData);
            if (response.data.code === 200) {
                messageApi.success("修改书籍成功");
                setBooks(
                    books.map((book) =>
                        book.id === currentBook.id ? response.data.data : book
                    )
                );
                setEditModalVisible(false);
                editForm.resetFields();
                setCurrentBook(null);
            } else {
                messageApi.error("修改书籍失败：" + response.data.message);
            }
        } catch (error) {
            messageApi.error("修改书籍失败：网络错误");
            console.error(error);
        }
    };

    // 删除书籍
    const handleDeleteBook = async (id) => {
        try {
            const response = await axios.delete(`${BASEURL}/books/delete/${id}`);
            if (response.data.code === 200) {
                messageApi.success("删除书籍成功");
                setBooks(books.filter((book) => book.id !== id));
            } else {
                messageApi.error("删除书籍失败：" + response.data.message);
            }
        } catch (error) {
            messageApi.error("删除书籍失败：网络错误");
            console.error(error);
        }
    };

    // 打开编辑弹窗
    const openEditModal = (book) => {
        setCurrentBook(book);
        editForm.setFieldsValue({
            ...book,
            tags: book.tags ? book.tags.join(", ") : "",
        });
        setEditModalVisible(true);
    };

    // 表格列定义
    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "标题", dataIndex: "title", key: "title" },
        { title: "作者", dataIndex: "author", key: "author" },
        {
            title: "标签",
            dataIndex: "tags",
            key: "tags",
            render: (tags) =>
                tags.map((tag) => <Tag key={tag}>{tag}</Tag>),
        },
        { title: "价格", dataIndex: "price", key: "price" },
        { title: "描述", dataIndex: "description", key: "description" },
        { title: "封面URL", dataIndex: "cover", key: "cover" },
        {
            title: "操作",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => openEditModal(record)}>
                        编辑
                    </Button>
                    <Button
                        type="link"
                        danger
                        onClick={() => handleDeleteBook(record.id)}
                    >
                        删除
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <PrivateLayout>
            {contextHolder}
            <Card
                className="card-container"
                title="书籍管理"
                extra={
                    <Button type="primary" onClick={() => setAddModalVisible(true)}>
                        添加书籍
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={books}
                    rowKey="id"
                    loading={loading}
                    pagination={false}
                />
            </Card>

            {/* 添加书籍弹窗 */}
            <Modal
                title="添加书籍"
                open={addModalVisible}
                onOk={() => addForm.submit()}
                onCancel={() => {
                    setAddModalVisible(false);
                    addForm.resetFields();
                }}
                okText="确认"
                cancelText="取消"
            >
                <Form form={addForm} onFinish={handleAddBook} layout="vertical">
                    <Form.Item
                        name="title"
                        label="标题"
                        rules={[{ required: true, message: "请输入书籍标题" }]}
                    >
                        <Input placeholder="请输入书籍标题" />
                    </Form.Item>
                    <Form.Item
                        name="author"
                        label="作者"
                        rules={[{ required: true, message: "请输入作者" }]}
                    >
                        <Input placeholder="请输入作者" />
                    </Form.Item>
                    <Form.Item name="tags" label="标签">
                        <Input placeholder="输入标签，用逗号分隔" />
                    </Form.Item>
                    <Form.Item name="price" label="价格">
                        <InputNumber
                            min={0}
                            step={0.01}
                            placeholder="请输入价格"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item name="description" label="描述">
                        <Input.TextArea placeholder="请输入书籍描述" />
                    </Form.Item>
                    <Form.Item name="cover" label="封面URL">
                        <Input placeholder="请输入封面图片URL" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* 编辑书籍弹窗 */}
            <Modal
                title="编辑书籍"
                open={editModalVisible}
                onOk={() => editForm.submit()}
                onCancel={() => {
                    setEditModalVisible(false);
                    editForm.resetFields();
                    setCurrentBook(null);
                }}
                okText="确认"
                cancelText="取消"
            >
                <Form form={editForm} onFinish={handleEditBook} layout="vertical">
                    <Form.Item
                        name="title"
                        label="标题"
                        rules={[{ required: true, message: "请输入书籍标题" }]}
                    >
                        <Input placeholder="请输入书籍标题" />
                    </Form.Item>
                    <Form.Item
                        name="author"
                        label="作者"
                        rules={[{ required: true, message: "请输入作者" }]}
                    >
                        <Input placeholder="请输入作者" />
                    </Form.Item>
                    <Form.Item name="tags" label="标签">
                        <Input placeholder="输入标签，用逗号分隔" />
                    </Form.Item>
                    <Form.Item name="price" label="价格">
                        <InputNumber
                            min={0}
                            step={0.01}
                            placeholder="请输入价格"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item name="description" label="描述">
                        <Input.TextArea placeholder="请输入书籍描述" />
                    </Form.Item>
                    <Form.Item name="cover" label="封面URL">
                        <Input placeholder="请输入封面图片URL" />
                    </Form.Item>
                </Form>
            </Modal>
        </PrivateLayout>
    );
};

export default AdministratorPage;