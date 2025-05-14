import { Button, Form, Input, InputNumber, Modal, Space, message } from "antd";
import { useEffect } from "react";
import { addOrder } from "../data/bookdata";

const { TextArea } = Input;

export default function OrderFormModal({
                                           visible,
                                           onCancel,
                                           onSubmit,
                                           book,
                                           form,
                                       }) {
    // 当 Modal 关闭时重置表单
    useEffect(() => {
        if (!visible) {
            form.resetFields();
        }
    }, [visible, form]);

    // 处理表单提交
    const handleSubmit = (values) => {
        // 保存订单
        addOrder({
            book,
            quantity: values.quantity,
            recipient: values.recipient,
            address: values.address,
        });
        // 调用外部提交回调
        onSubmit(values);
        // 显示成功提示
        message.success(
            `订单提交成功！收货人：${values.recipient}，地址：${values.address}，数量：${values.quantity}`
        );
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
                    label="收货地址"
                    name="address"
                    rules={[
                        { required: true, message: "请输入收货地址！" },
                        { max: 200, message: "收货地址不能超过200个字符！" },
                    ]}
                >
                    <TextArea rows={4} placeholder="请输入详细收货地址" />
                </Form.Item>
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