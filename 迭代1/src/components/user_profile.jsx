import { Avatar, Badge, Button, Card, Empty, Input, List, Space, Upload, Pagination } from "antd";
import { UserContext } from "../lib/context";
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useContext, useEffect, useState } from "react";
import UsernameAvatar from "./username_avatar";
import useMessage from "antd/es/message/useMessage";
import ImgCrop from 'antd-img-crop';
import SaveAddressModal from "./save_address_modal";
import { mockUser, getMockOrders } from "../data/bookdata";

export default function UserProfile() {
    const { user, setUser } = useContext(UserContext);
    const [imageUrl, setImageUrl] = useState();
    const [editAvatar, setEditAvatar] = useState(false);
    const [introduction, setIntroduction] = useState(user?.introduction || "");
    const [editIntroduction, setEditIntroduction] = useState(false);
    const [messageApi, contextHolder] = useMessage();
    const [addresses, setAddresses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const pageSize = 5;

    useEffect(() => {
        if (!user) {
            setUser(mockUser);
            setIntroduction(mockUser.introduction);
        }
        setAddresses([
            { id: 1, receiver: "张三", tel: "123-456-7890", address: "北京市朝阳区123号" },
            { id: 2, receiver: "李四", tel: "098-765-4321", address: "上海市浦东新区456路" },
        ]);
        const { total, items } = getMockOrders(currentPage, pageSize);
        setOrders(items);
        setTotalOrders(total);
    }, [user, setUser, currentPage]);

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            messageApi.error('系统只支持 jpeg 或 png 格式的图片！');
            return false;
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            messageApi.error('图片大小不能超过 10M');
            return false;
        }
        return true;
    };

    const handleEditIntroduction = (initialValue) => {
        if (editIntroduction) return;
        setIntroduction(initialValue ?? "");
        setEditIntroduction(true);
    };

    const handleSaveIntroduction = () => {
        setEditIntroduction(false);
        setUser({ ...user, introduction });
        messageApi.success("简介已更新");
    };

    const handleDeleteAddress = (addressId) => {
        setAddresses(addresses.filter(addr => addr.id !== addressId));
        messageApi.success("地址已删除");
    };

    const handleChange = (info) => {
        if (info.file.status === 'done' || !info.file.status) {
            setEditAvatar(false);
            const mockAvatarUrl = URL.createObjectURL(info.file.originFileObj);
            setUser({ ...user, avatar: mockAvatarUrl });
            setImageUrl(mockAvatarUrl);
            messageApi.success("头像已更新");
        }
    };

    const handleEditAvatar = () => {
        setEditAvatar(true);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page - 1);
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div>上传</div>
        </button>
    );

    return (
        <Card style={{ width: "800px", margin: "20px auto" }}>
            {contextHolder}
            {showModal && (
                <SaveAddressModal
                    onOk={(newAddress) => {
                        setShowModal(false);
                        setAddresses([...addresses, { ...newAddress, id: Date.now() }]);
                    }}
                    onCancel={() => setShowModal(false)}
                />
            )}
            <Space direction="vertical" style={{ width: "100%", alignItems: "center" }} size={16}>
                {/* 头像部分 */}
                <Space direction="vertical" style={{ textAlign: "center", width: "100%" }} size={2}>
                    {!editAvatar && (
                        <div style={{ textAlign: 'center' }}>
                            <Badge
                                count={
                                    <Button
                                        shape="circle"
                                        icon={<EditOutlined />}
                                        size="small"
                                        onClick={handleEditAvatar}
                                        style={{ border: 'none', boxShadow: 'none', backgroundColor: 'transparent' }}
                                    />
                                }
                                offset={[-5, 85]}
                            >
                                <Avatar
                                    src={user?.avatar || "/default_avatar.jpeg"}
                                    style={{ width: "100px", height: "100px" }}
                                />
                            </Badge>
                        </div>
                    )}
                    {editAvatar && (
                        <ImgCrop showGrid showReset rotationSlider modalOk="确定" modalCancel="取消">
                            <Upload
                                name="file"
                                accept="image/*"
                                listType="picture-circle"
                                className="avatar-uploader"
                                showUploadList={false}
                                beforeUpload={beforeUpload}
                                onChange={handleChange}
                            >
                                {imageUrl ? (
                                    <img src={imageUrl} alt="avatar" style={{ width: "100px", height: "100px" }} />
                                ) : (
                                    uploadButton
                                )}
                            </Upload>
                        </ImgCrop>
                    )}
                    <span style={{ fontSize: 20 }}>{user?.nickname}</span>
                    <Space style={{ color: "grey", width: "100%", justifyContent: "center" }}>
                        {!editIntroduction && (
                            <>
                                <span style={{ fontSize: 14, maxWidth: "500px", textAlign: "center" }}>
                                    {user?.introduction ? user.introduction : "这个人很懒，什么也没留下"}
                                </span>
                                <a onClick={() => handleEditIntroduction(user?.introduction)}><EditOutlined /></a>
                            </>
                        )}
                        {editIntroduction && (
                            <Input
                                value={introduction}
                                style={{ height: "25px", width: "100%", maxWidth: "800px" }}
                                onPressEnter={handleSaveIntroduction}
                                onChange={e => setIntroduction(e.target.value)}
                            />
                        )}
                    </Space>
                </Space>

                {/* 基础信息部分 */}
                <Card title="基础信息" style={{ width: "400px" }}>
                    <Space direction="vertical" style={{ width: "100%" }}>
                        <span style={{ fontSize: 16, color: "#222222" }}>用户名：user</span>
                        <span style={{ fontSize: 16, color: "#222222" }}>余额：{user?.balance / 100} 元</span>
                        <span style={{ fontSize: 16, color: "#222222" }}>邮箱：123456789@163.com</span>
                    </Space>
                </Card>

                {/* 常用地址部分 */}
                <Card
                    title="常用地址"
                    extra={<Button type="primary" onClick={() => setShowModal(true)}>添加</Button>}
                    style={{ width: "400px" }}
                >
                    <Space direction="vertical" style={{ width: "100%" }}>
                        {addresses.length === 0 && <Empty description="无" />}
                        {addresses.length > 0 && (
                            <List
                                dataSource={addresses}
                                renderItem={address => (
                                    <List.Item
                                        actions={[
                                            <a onClick={() => handleDeleteAddress(address.id)}>删除</a>,
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={<UsernameAvatar username={address.receiver} />}
                                            title={`${address.receiver} ${address.tel}`}
                                            description={address.address}
                                        />
                                    </List.Item>
                                )}
                            />
                        )}
                    </Space>
                </Card>

                {/* 我的订单部分 */}
                <Card title="我的订单" style={{ width: "400px" }}>
                    <Space direction="vertical" style={{ width: "100%" }}>
                        {orders.length === 0 && <Empty description="暂无订单" />}
                        {orders.length > 0 && (
                            <>
                                <List
                                    dataSource={orders}
                                    renderItem={order => (
                                        <List.Item>
                                            <List.Item.Meta
                                                title={order.bookTitle}
                                                description={
                                                    <Space direction="vertical">
                                                        <span>价格：{(order.price / 100).toFixed(2)} 元</span>
                                                        <span>数量：{order.quantity}</span>
                                                        <span>状态：{order.status}</span>
                                                        <span>下单时间：{new Date(order.createdAt).toLocaleString()}</span>
                                                    </Space>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                                <Pagination
                                    current={currentPage + 1}
                                    pageSize={pageSize}
                                    total={totalOrders}
                                    onChange={handlePageChange}
                                    style={{ textAlign: "center", marginTop: 16 }}
                                />
                            </>
                        )}
                    </Space>
                </Card>
            </Space>
        </Card>
    );
}