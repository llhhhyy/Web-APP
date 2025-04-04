import { Button, Form, Input, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import useMessage from "antd/es/message/useMessage";
import { placeOrder } from "../service/order";
import { handleBaseApiResponse } from "../utils/message";
import { getMyAddresses } from "../service/user";

const { TextArea } = Input;
export default function PlaceOrderModal({
    selectedItems,
    onOk,
    onCancel }) {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = useMessage();
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        getMyAddresses().then(setAddresses);
    }, []);

    const handleSubmit = async ({ address, receiver, tel }) => {
        if (!address || !receiver || !tel) {
            messageApi.error("请填写完整信息！");
            return;
        }
        let orderInfo = {
            address,
            receiver,
            tel,
            itemIds: selectedItems.map(item => item.id)
        }
        let res = await placeOrder(orderInfo);
        handleBaseApiResponse(res, messageApi, onOk);
    };

    return (
        <Modal
            title={"确认下单"}
            open
            onOk={onOk}
            onCancel={onCancel}
            footer={null}
            width={800}
        >
            {contextHolder}
            {addresses.length > 0 &&
                <Select placeholder="选择常用地址" options={addresses.map(address => ({
                    value: [address.receiver, address.tel, address.address],
                    label: `${address.receiver}, ${address.tel}, ${address.address}`
                }))}
                    style={{
                        marginBottom: 10,
                        width: "100%"
                    }}
                    onSelect={address => {
                        form.setFieldsValue({
                            receiver: address[0],
                            tel: address[1],
                            address: address[2]
                        });
                    }}
                >
                </Select>}
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                preserve={false}
            >
                <Form.Item
                    name="receiver"
                    label="收货人"
                    required
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="tel"
                    label="联系电话"
                    required
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="address"
                    label="收货地址"
                    required
                >
                    <TextArea rows={2} maxLength={817} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};