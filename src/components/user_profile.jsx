import {Avatar, Badge, Button, Card, Empty, Input, List, Modal, Space, Upload, DatePicker, Table} from "antd";
import { UserContext } from "../lib/context";
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useContext, useEffect, useState } from "react";
import useMessage from "antd/es/message/useMessage";
import ImgCrop from 'antd-img-crop';
import SaveAddressModal from "./save_address_modal";
import axios from 'axios';
import { BASEURL } from "../service/common";
axios.defaults.withCredentials = true;

const { RangePicker } = DatePicker;

export default function UserProfile() {
    const { user, setUser } = useContext(UserContext);
    const [imageUrl, setImageUrl] = useState(user?.avatar);
    const [introduction, setIntroduction] = useState(user?.tagLine || "");
    const [editAvatar, setEditAvatar] = useState(false);
    const [editIntroduction, setEditIntroduction] = useState(false);
    const [messageApi, contextHolder] = useMessage();
    const [addresses, setAddresses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [dateRange, setDateRange] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(false);

    const userId = user?.id;

    useEffect(() => {
        if (userId) {
            axios.get(`${BASEURL}/users/get/${userId}/addresses`)
                .then(response => {
                    if (response.data.code === 200) {
                        setAddresses(response.data.data.map(addr => ({
                            id: addr.id,
                            receiver: addr.recipient,
                            tel: addr.phone,
                            address: addr.address
                        })));
                    } else {
                        messageApi.error("获取地址失败");
                    }
                })
                .catch(error => {
                    messageApi.error("获取地址失败");
                    console.error(error);
                });
        }
    }, [userId]);

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
        axios.put(`${BASEURL}/users/${userId}/tagline`, { tagLine: introduction })
            .then(response => {
                if (response.data.code === 200) {
                    setEditIntroduction(false);
                    setUser({ ...user, tagLine: introduction });
                    messageApi.success("简介已更新");
                } else {
                    messageApi.error("更新简介失败");
                }
            })
            .catch(error => {
                messageApi.error("更新简介失败");
                console.error(error);
            });
    };

    const handleDeleteAddress = (addressId) => {
        Modal.confirm({
            title: '确认删除地址？',
            content: '此操作不可撤销',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                axios.delete(`${BASEURL}/users/delete/address/${userId}/${addressId}`)
                    .then(response => {
                        if (response.data.code === 200) {
                            setAddresses(prev => prev.filter(addr => addr.id !== addressId));
                            messageApi.success('地址已删除');
                        } else {
                            messageApi.error('删除失败：' + response.data.message);
                        }
                    })
                    .catch(error => {
                        messageApi.error('删除失败：网络错误');
                        console.error(error);
                    });
            }
        });
    };

    const handleChange = (info) => {
        if (info.file.status === 'done' || !info.file.status) {
            const formData = new FormData();
            formData.append('file', info.file.originFileObj);

            axios.post(`${BASEURL}/upload/avatar`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
                .then(response => {
                    if (response.data.code === 200) {
                        const avatarUrl = response.data.data;
                        return axios.put(`${BASEURL}/users/${userId}/avatar`, { avatar: avatarUrl });
                    } else {
                        throw new Error("上传头像失败");
                    }
                })
                .then(response => {
                    if (response.data.code === 200) {
                        setEditAvatar(false);
                        setUser({ ...user, avatar: response.data.data.avatar });
                        setImageUrl(response.data.data.avatar);
                        messageApi.success("头像已更新");
                    } else {
                        messageApi.error("更新头像失败");
                    }
                })
                .catch(error => {
                    messageApi.error("更新头像失败");
                    console.error(error);
                });
        }
    };

    const handleEditAvatar = () => {
        setEditAvatar(true);
    };

    const fetchStatistics = () => {
        if (!dateRange || dateRange.length !== 2) {
            messageApi.error("请选择时间范围");
            return;
        }
        setLoading(true);
        const [start, end] = dateRange;
        axios.get(`${BASEURL}/order/statistics`, {
            params: {
                startTime: start.toISOString(),
                endTime: end.toISOString()
            }
        })
            .then(response => {
                if (response.data.code === 200) {
                    setStatistics(response.data.data);
                } else {
                    messageApi.error("获取统计数据失败");
                }
            })
            .catch(error => {
                messageApi.error("获取统计数据失败");
                console.error(error);
            })
            .finally(() => setLoading(false));
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div>上传</div>
        </button>
    );

    const columns = [
        { title: '书籍标题', dataIndex: 'bookTitle', key: 'bookTitle' },
        { title: '购买数量', dataIndex: 'quantity', key: 'quantity' }
    ];

    return (
        <Card style={{ width: "800px", margin: "20px auto" }}>
            {contextHolder}
            {showModal && (
                <SaveAddressModal
                    onOk={(newAddress) => {
                        axios.post(`${BASEURL}/users/${userId}/address`, {
                            recipient: newAddress.receiver,
                            phone: newAddress.tel,
                            address: newAddress.address
                        })
                            .then(response => {
                                if (response.data.code === 200) {
                                    setShowModal(false);
                                    setAddresses([...addresses, {
                                        id: response.data.data.id,
                                        receiver: newAddress.receiver,
                                        tel: newAddress.tel,
                                        address: newAddress.address
                                    }]);
                                    messageApi.success("地址已添加");
                                } else {
                                    messageApi.error("添加地址失败");
                                }
                            })
                            .catch(error => {
                                messageApi.error("添加地址失败");
                                console.error(error);
                            });
                    }}
                    onCancel={() => setShowModal(false)}
                />
            )}
            <Space direction="vertical" style={{ width: "100%", alignItems: "center" }} size={16}>
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
                    <span style={{ fontSize: 20 }}>{user?.username}</span>
                    <Space style={{ color: "grey", width: "100%", justifyContent: "center" }}>
                        {!editIntroduction && (
                            <>
                                <span style={{ fontSize: 14, maxWidth: "500px", textAlign: "center" }}>
                                    {user?.tagLine ? user.tagLine : "这个人很懒，什么也没留下"}
                                </span>
                                <a onClick={() => handleEditIntroduction(user?.tagLine)}><EditOutlined /></a>
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

                <Card title="基础信息" style={{ width: "400px" }}>
                    <Space direction="vertical" style={{ width: "100%" }}>
                        <span style={{ fontSize: 16, color: "#222222" }}>用户名：{user?.username}</span>
                        <span style={{ fontSize: 16, color: "#222222" }}>余额：{user?.balance} 元</span>
                        <span style={{ fontSize: 16, color: "#222222" }}>邮箱：{user?.email}</span>
                    </Space>
                </Card>

                <Card
                    title="常用地址"
                    extra={<Button type="primary" onClick={() => setShowModal(true)}>添加</Button>}
                    style={{ width: "400px" }}
                >
                    {addresses.length === 0 ? (
                        <Empty description="暂无常用地址" />
                    ) : (
                        <List
                            dataSource={addresses}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={item.receiver}
                                        description={
                                            <>
                                                <div>{item.tel}</div>
                                                <div>{item.address}</div>
                                            </>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    )}
                </Card>

                <Card title="购书统计" style={{ width: "400px" }}>
                    <Space direction="vertical" style={{ width: "100%" }}>
                        <RangePicker
                            showTime
                            onChange={dates => setDateRange(dates ? [dates[0], dates[1]] : [])}
                        />
                        <Button type="primary" onClick={fetchStatistics} loading={loading}>
                            查询统计
                        </Button>
                        {statistics && (
                            <>
                                <Table
                                    columns={columns}
                                    dataSource={Object.entries(statistics.bookPurchaseCounts).map(([title, count]) => ({
                                        bookTitle: title,
                                        quantity: count
                                    }))}
                                    pagination={false}
                                />
                                <p>总购买书籍数量: {statistics.totalBooks}</p>
                                <p>总金额: {statistics.totalAmount.toFixed(2)} 元</p>
                            </>
                        )}
                    </Space>
                </Card>
            </Space>
        </Card>
    );
}