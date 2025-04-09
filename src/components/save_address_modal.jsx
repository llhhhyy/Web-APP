import { Button, Form, Input, Modal } from "antd";
import React from "react";
import useMessage from "antd/es/message/useMessage";

const { TextArea } = Input;
export default function SaveAddressModal({ onOk, onCancel }) {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = useMessage();

    const handleSubmit = async (values) => {
        if (!values.address || !values.receiver || !values.tel) {
            messageApi.error("请填写完整信息！");
            return;
        }
        messageApi.success("地址已添加");
        onOk(values);
        form.resetFields();
    };

    return (
        <Modal
            title={"添加新地址"}
            open
            onOk={onOk}
            onCancel={onCancel}
            footer={null}
            width={800}
        >
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                preserve={false}
            >
                <Form.Item name="receiver" label="收货人" required>
                    <Input />
                </Form.Item>
                <Form.Item name="tel" label="联系电话" required>
                    <Input />
                </Form.Item>
                <Form.Item name="address" label="收货地址" required>
                    <TextArea rows={2} maxLength={817} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        添加
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};