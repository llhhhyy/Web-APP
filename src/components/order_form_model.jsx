import { Button, Form, Input, InputNumber, Modal, Space, message } from "antd";
import { useEffect, useContext } from "react";
import axios from "axios";
import { BASEURL } from "../service/common";
import { UserContext } from "../lib/context";

const { TextArea } = Input;

export default function OrderFormModal({
                                           visible,
                                           onCancel,
                                           onSubmit,
                                           selectedItems,
                                           book,
                                           form,
                                       }) {
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (!visible) {
            form.resetFields();
        }
    }, [visible, form]);

    const handleSubmit = async (values) => {
        if (!user?.id) {
            message.error("请先登录");
            return;
        }
        try {
            if (selectedItems && selectedItems.length > 0) {
                // Handle cart orders (multiple items)
                for (const item of selectedItems) {
                    const response = await axios.post(`${BASEURL}/order/add/${user.id}`, {
                        bookId: item.bookId,
                        number: item.number,
                        recipient: values.recipient,
                        phone: values.phone,
                        address: values.address,
                    });
                    if (response.data.code !== 200) {
                        message.error(`订单提交失败（书籍ID：${item.bookId}）：` + response.data.message);
                        return;
                    }
                }
                message.success("订单提交成功！");
            } else if (book) {
                // Handle single book order (from book_details)
                const response = await axios.post(`${BASEURL}/order/add/${user.id}`, {
                    bookId: book.id,
                    number: values.quantity,
                    recipient: values.recipient,
                    phone: values.phone,
                    address: values.address,
                });
                if (response.data.code !== 200) {
                    message.error(`订单提交失败（书籍ID：${book.id}）：` + response.data.message);
                    return;
                }
                message.success(
                    `订单提交成功！收货人：${values.recipient}，地址：${values.address}，数量：${values.quantity}`
                );
            } else {
                message.error("没有可提交的订单项");
                return;
            }
            onSubmit(values);
        } catch (error) {
            message.error("网络错误，请稍后重试");
        }
    };

    return (
        <Modal
            title="填写订单信息"
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{ quantity: 1 }}
            >
                <Form.Item
                    label="收货人"
                    name="recipient"
                    rules={[
                        { required: true, message: "请输入收货人姓名！" },
                        { max: 50, message: "收货人姓名不能超过50个字符！" },
                    ]}
                >
                    <Input placeholder="请输入收货人姓名" />
                </Form.Item>
                <Form.Item
                    label="联系电话"
                    name="phone"
                    rules={[
                        { required: true, message: "请输入联系电话！" },
                        {
                            pattern: /^[0-9]{10,15}$/,
                            message: "请输入有效的电话号码（10-15位数字）！",
                        },
                    ]}
                >
                    <Input placeholder="请输入联系电话" />
                </Form.Item>
                <Form.Item
                    label="收货地址"
                    name="address"
                    rules={[
                        { required: true, message: "请输入收货地址！" },
                        { max: 200, message: "收货地址不能超过200个字符！" },
                    ]}
                >
                    <TextArea rows={4} placeholder="请输入详细收货地址" />
                </Form.Item>
                {book && (
                    <Form.Item
                        label="购买数量"
                        name="quantity"
                        rules={[
                            { required: true, message: "请输入购买数量！" },
                            { type: "number", min: 1, message: "数量至少为1！" },
                        ]}
                    >
                        <InputNumber min={1} style={{ width: "100%" }} />
                    </Form.Item>
                )}
                <Form.Item>
                    <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                        <Button onClick={onCancel}>取消</Button>
                        <Button type="primary" htmlType="submit">
                            提交订单
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
}