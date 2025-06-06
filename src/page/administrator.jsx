import { Button, Card, Form, Input, Modal, Space, Table, Tag, message } from "antd";
import { PrivateLayout } from "../components/layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASEURL } from "../service/common";
import useMessage from "antd/es/message/useMessage";
import { useSearchParams } from "react-router-dom";

export default function AdministratorPage() {
    const [books, setBooks] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [currentBook, setCurrentBook] = useState(null);
    const [addForm] = Form.useForm();
    const [editForm] = Form.useForm();
    const [messageApi, contextHolder] = useMessage();
    const [searchParams, setSearchParams] = useSearchParams();
    const pageIndex = Number(searchParams.get("pageIndex")) || 0;
    const pageSize = Number(searchParams.get("pageSize")) || 5;

    // 获取书籍列表
    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${BASEURL}/books/find`, {
                    params: { pageIndex, pageSize },
                });
                if (response.data.code === 200) {
                    setBooks(response.data.data.map((book) => ({ ...book, key: book.id })));
                    setTotal(response.data.total);
                } else {
                    messageApi.error("获取书籍列表失败");
                    setBooks([]);
                    setTotal(0);
                }
            } catch (error) {
                messageApi.error("获取书籍列表失败：网络错误");
                setBooks([]);
                setTotal(0);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, [pageIndex, pageSize, messageApi]);

    // 处理分页变化
    const handlePageChange = (page, size) => {
        setSearchParams({
            pageIndex: (page - 1).toString(),
            pageSize: size.toString(),
        });
    };

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
                setAddModalVisible(false);
                addForm.resetFields();
                // 刷新书籍列表
                const fetchResponse = await axios.get(`${BASEURL}/books/find`, {
                    params: { pageIndex, pageSize },
                });
                if (fetchResponse.data.code === 200) {
                    setBooks(fetchResponse.data.data.map((book) => ({ ...book, key: book.id })));
                    setTotal(fetchResponse.data.total);
                }
            } else {
                messageApi.error("添加书籍失败：" + response.data.message);
            }
        } catch (error) {
            messageApi.error("添加书籍失败：网络错误");
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
                setEditModalVisible(false);
                editForm.resetFields();
                // 刷新书籍列表
                const fetchResponse = await axios.get(`${BASEURL}/books/find`, {
                    params: { pageIndex, pageSize },
                });
                if (fetchResponse.data.code === 200) {
                    setBooks(fetchResponse.data.data.map((book) => ({ ...book, key: book.id })));
                    setTotal(fetchResponse.data.total);
                }
            } else {
                messageApi.error("修改书籍失败：" + response.data.message);
            }
        } catch (error) {
            messageApi.error("修改书籍失败：网络错误");
        }
    };

    // 删除书籍
    const handleDeleteBook = async (id) => {
        try {
            const response = await axios.delete(`${BASEURL}/books/delete/${id}`);
            if (response.data.code === 200) {
                messageApi.success("删除书籍成功");
                // 刷新书籍列表
                const fetchResponse = await axios.get(`${BASEURL}/books/find`, {
                    params: { pageIndex, pageSize },
                });
                if (fetchResponse.data.code === 200) {
                    setBooks(fetchResponse.data.data.map((book) => ({ ...book, key: book.id })));
                    setTotal(fetchResponse.data.total);
                }
            } else {
                messageApi.error("删除书籍失败：" + response.data.message);
            }
        } catch (error) {
            messageApi.error("删除书籍失败：网络错误");
        }
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
            render: (tags) => tags.map((tag, index) => <Tag key={index}>{tag}</Tag>),
        },
        { title: "价格", dataIndex: "price", key: "price" },
        { title: "封面URL", dataIndex: "cover", key: "cover" },
        { title: "描述", dataIndex: "description", key: "description" },
        {
            title: "操作",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        onClick={() => {
                            setCurrentBook(record);
                            editForm.setFieldsValue({
                                ...record,
                                tags: record.tags.join(", "), // 将标签数组转为逗号分隔的字符串
                            });
                            setEditModalVisible(true);
                        }}
                    >
                        编辑
                    </Button>
                    <Button
                        type="primary"
                        danger
                        onClick={() => {
                            Modal.confirm({
                                title: "确认删除",
                                content: `确定要删除书籍 "${record.title}" 吗？`,
                                onOk: () => handleDeleteBook(record.id),
                            });
                        }}
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
                    pagination={{
                        current: pageIndex + 1,
                        pageSize,
                        total,
                        onChange: handlePageChange,
                    }}
                    loading={loading}
                />
            </Card>

            {/* 添加书籍模态框 */}
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
                        <Input placeholder="请输入标签，用逗号分隔" />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="价格"
                        rules={[{ required: true, message: "请输入价格" }]}
                    >
                        <Input placeholder="请输入价格" />
                    </Form.Item>
                    <Form.Item name="cover" label="封面URL">
                        <Input placeholder="请输入封面图片URL" />
                    </Form.Item>
                    <Form.Item name="description" label="描述">
                        <Input.TextArea placeholder="请输入书籍描述" rows={4} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* 修改书籍模态框 */}
            <Modal
                title="修改书籍"
                open={editModalVisible}
                onOk={() => editForm.submit()}
                onCancel={() => {
                    setEditModalVisible(false);
                    editForm.resetFields();
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
                        <Input placeholder="请输入标签，用逗号分隔" />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="价格"
                        rules={[{ required: true, message: "请输入价格" }]}
                    >
                        <Input placeholder="请输入价格" />
                    </Form.Item>
                    <Form.Item name="cover" label="封面URL">
                        <Input placeholder="请输入封面图片URL" />
                    </Form.Item>
                    <Form.Item name="description" label="描述">
                        <Input.TextArea placeholder="请输入书籍描述" rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </PrivateLayout>
    );
}