import React from 'react';
import {mockOrder} from '../data/bookdata'
import '../css/order.css'
import {PrivateLayout} from "../components/layout";

function OrderPage() {
    return (
        <PrivateLayout>
            <div className="order-page">
                <table>
                    <thead>
                    <tr>
                        <th>商品详情</th>
                        <th>数量</th>
                        <th>价格</th>
                        <th>收货人</th>
                        <th>订单时间</th>
                    </tr>
                    </thead>
                    <tbody>
                    {mockOrder.map((order, index) => (
                        <tr key={index}>
                            <td>
                                <div className="product-details">
                                    <img src={order.productImage} alt="product"/>
                                    <span>{order.description}</span>
                                </div>
                            </td>
                            <td>x{order.quantity}</td>
                            <td>{order.price}</td>
                            <td>{order.recipient || 'N/A'}</td>
                            <td>{order.date}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </PrivateLayout>
    );
}

export default OrderPage;