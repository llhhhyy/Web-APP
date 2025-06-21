import { Button, Card, Form, Input, Modal, Space, Table, Tag, Select, Image } from "antd";
import { PrivateLayout } from "../components/layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASEURL } from "../service/common";
import useMessage from "antd/es/message/useMessage";
import "../css/home.css";

const { Option } = Select;

const AdminUserPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [addForm] = Form.useForm();
    const [editForm] = Form.useForm();
    const [messageApi, contextHolder] = useMessage();

    // 获取用户列表
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${BASEURL}/users/all`);
                if (response.data.code === 200) {
                    setUsers(response.data.data);
                } else {
                    messageApi.error("获取用户列表失败");
                }
            } catch (error) {
                messageApi.error("获取用户列表失败：网络错误");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [messageApi]);

    // 添加用户
    const handleAddUser = async (values) => {
        try {
            const userData = {
                ...values,
                role: values.role || "USER", // 默认角色为USER
            };
            const response = await axios.post(`${BASEURL}/users/register`, userData);
            if (response.data.code === 200) {
                messageApi.success("添加用户成功");
                setUsers([...users, response.data.data]);
                setAddModalVisible(false);
                addForm.resetFields();
            } else {
                messageApi.error("添加用户失败：" + response.data.message);
            }
        } catch (error) {
            messageApi.error("添加用户失败：网络错误");
            console.error(error);
        }
    };

    // 修改用户
    const handleEditUser = async (values) => {
        try {
            const response = await axios.put(`${BASEURL}/users/update`, {
                ...values,
                id: currentUser.id,
            });
            if (response.data.code === 200) {
                messageApi.success("修改用户成功");
                setUsers(
                    users.map((user) =>
                        user.id === currentUser.id ? response.data.data : user
                    )
                );
                setEditModalVisible(false);
                editForm.resetFields();
                setCurrentUser(null);
            } else {
                messageApi.error("修改用户失败：" + response.data.message);
            }
        } catch (error) {
            messageApi.error("修改用户失败：网络错误");
            console.error(error);
        }
    };

    // 删除用户
    const handleDeleteUser = async (id) => {
        try {
            const response = await axios.delete(`${BASEURL}/users/delete/${id}`);
            if (response.data.code === 200) {
                messageApi.success("删除用户成功");
                setUsers(users.filter((user) => user.id !== id));
            } else {
                messageApi.error("删除用户失败：" + response.data.message);
            }
        } catch (error) {
            messageApi.error("删除用户失败：网络错误");
            console.error(error);
        }
    };

    // 禁用用户
    const handleDisableUser = async (id) => {
        try {
            const response = await axios.put(`${BASEURL}/users/disable/${id}`);
            if (response.data.code === 200) {
                messageApi.success("禁用用户成功");
                setUsers(
                    users.map((user) =>
                        user.id === id ? { ...user, disabled: true } : user
                    )
                );
            } else {
                messageApi.error("禁用用户失败：" + response.data.message);
            }
        } catch (error) {
            messageApi.error("禁用用户失败：网络错误");
            console.error(error);
        }
    };

    // 解禁用户
    const handleEnableUser = async (id) => {
        try {
            const response = await axios.put(`${BASEURL}/users/enable/${id}`);
            if (response.data.code === 200) {
                messageApi.success("解禁用户成功");
                setUsers(
                    users.map((user) =>
                        user.id === id ? { ...user, disabled: false } : user
                    )
                );
            } else {
                messageApi.error("解禁用户失败：" + response.data.message);
            }
        } catch (error) {
            messageApi.error("解禁用户失败：网络错误");
            console.error(error);
        }
    };

    // 打开编辑弹窗
    const openEditModal = (user) => {
        setCurrentUser(user);
        editForm.setFieldsValue({
            ...user,
            role: user.role,
        });
        setEditModalVisible(true);
    };

    // 表格列定义
    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "用户名", dataIndex: "username", key: "username" },
        { title: "邮箱", dataIndex: "email", key: "email" },
        {
            title: "头像",
            dataIndex: "avatar",
            key: "avatar",
            render: (avatar) => (
                <Image
                    src={avatar}
                    width={50}
                    height={50}
                    style={{ borderRadius: "50%" }}
                    fallback="https://i-blog.csdnimg.cn/blog_migrate/a4fa5161369727154bc3a7d1c52bb9c0.png"
                />
            ),
        },
        { title: "签名", dataIndex: "tagLine", key: "tagLine" },
        { title: "余额", dataIndex: "balance", key: "balance" },
        {
            title: "角色",
            dataIndex: "role",
            key: "role",
            render: (role) => <Tag color={role === "ADMIN" ? "red" : "blue"}>{role}</Tag>,
        },
        {
            title: "状态",
            dataIndex: "disabled",
            key: "disabled",
            render: (disabled) => (
                <Tag color={disabled ? "red" : "green"}>
                    {disabled ? "已禁用" : "正常"}
                </Tag>
            ),
        },
        {
            title: "常用地址",
            dataIndex: "commonAddresses",
            key: "commonAddresses",
            render: (addresses) => `${addresses.length}个地址`,
        },
        {
            title: "操作",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => openEditModal(record)}>
                        编辑
                    </Button>
                    {record.disabled ? (
                        <Button type="link" onClick={() => handleEnableUser(record.id)}>
                            解禁
                        </Button>
                    ) : (
                        <Button
                            type="link"
                            danger
                            onClick={() => handleDisableUser(record.id)}
                        >
                            禁用
                        </Button>
                    )}
                    <Button
                        type="link"
                        danger
                        onClick={() => handleDeleteUser(record.id)}
                    >
                        删除
                    </Button>
                </Space>
            ),
        },
    ];

    // 过滤用户列表
    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    return (
        <PrivateLayout>
            {contextHolder}
            <Card
                className="card-container"
                title="用户管理"
                extra={
                    <Space>
                        <Input
                            placeholder="按用户名搜索"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            style={{ width: 200 }}
                        />
                        <Button type="primary" onClick={() => setAddModalVisible(true)}>
                            添加用户
                        </Button>
                    </Space>
                }
            >
                <Table
                    columns={columns}
                    dataSource={filteredUsers}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            {/* 添加用户弹窗 */}
            <Modal
                title="添加用户"
                open={addModalVisible}
                onOk={() => addForm.submit()}
                onCancel={() => {
                    setAddModalVisible(false);
                    addForm.resetFields();
                }}
                okText="确认"
                cancelText="取消"
            >
                <Form form={addForm} onFinish={handleAddUser} layout="vertical">
                    <Form.Item
                        name="username"
                        label="用户名"
                        rules={[{ required: true, message: "请输入用户名" }]}
                    >
                        <Input placeholder="请输入用户名" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[
                            { required: true, message: "请输入邮箱" },
                            { type: "email", message: "请输入有效的邮箱地址" },
                        ]}
                    >
                        <Input placeholder="请输入邮箱" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="密码"
                        rules={[{ required: true, message: "请输入密码" }]}
                    >
                        <Input.Password placeholder="请输入密码" />
                    </Form.Item>
                    <Form.Item name="avatar" label="头像URL">
                        <Input placeholder="请输入头像URL" />
                    </Form.Item>
                    <Form.Item name="tagLine" label="签名">
                        <Input placeholder="请输入个性签名" />
                    </Form.Item>
                    <Form.Item name="role" label="角色">
                        <Select placeholder="请选择用户角色">
                            <Option value="USER">普通用户</Option>
                            <Option value="ADMIN">管理员</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* 编辑用户弹窗 */}
            <Modal
                title="编辑用户"
                open={editModalVisible}
                onOk={() => editForm.submit()}
                onCancel={() => {
                    setEditModalVisible(false);
                    editForm.resetFields();
                    setCurrentUser(null);
                }}
                okText="确认"
                cancelText="取消"
            >
                <Form form={editForm} onFinish={handleEditUser} layout="vertical">
                    <Form.Item
                        name="username"
                        label="用户名"
                        rules={[{ required: true, message: "请输入用户名" }]}
                    >
                        <Input placeholder="请输入用户名" disabled />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[
                            { required: true, message: "请输入邮箱" },
                            { type: "email", message: "请输入有效的邮箱地址" },
                        ]}
                    >
                        <Input placeholder="请输入邮箱" />
                    </Form.Item>
                    <Form.Item name="avatar" label="头像URL">
                        <Input placeholder="请输入头像URL" />
                    </Form.Item>
                    <Form.Item name="tagLine" label="签名">
                        <Input placeholder="请输入个性签名" />
                    </Form.Item>
                    <Form.Item name="balance" label="余额">
                        <Input placeholder="请输入用户余额" type="number" />
                    </Form.Item>
                    <Form.Item name="role" label="角色">
                        <Select placeholder="请选择用户角色">
                            <Option value="USER">普通用户</Option>
                            <Option value="ADMIN">管理员</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </PrivateLayout>
    );
};

export default AdminUserPage;