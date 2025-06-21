import {useContext, useEffect, useState} from "react";
import {Card, message} from "antd";
import CartItemTable from "../components/cart_item_table";
import { PrivateLayout } from "../components/layout";
import { initialCartItems } from "../data/bookdata";
import {UserContext} from "../lib/context";
import axios from "axios";
import {BASEURL} from "../service/common";
axios.defaults.withCredentials = true; // 全局启用 withCredentials，确保发送 cookie
export default function CartPage() {
    const { user } = useContext(UserContext);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user?.id) {
            message.error("请先登录");
            return;
        }
        const fetchCartItems = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BASEURL}/cart/get`);
                if (response.data.code === 200) {
                    setCartItems(response.data.data);
                } else {
                    message.error("获取购物车失败：" + response.data.message);
                }
            } catch (error) {
                message.error("网络错误，请稍后重试");
            } finally {
                setLoading(false);
            }
        };
        fetchCartItems();
    }, [user]);

    return (
        <PrivateLayout>
            <Card className="card-container">
                <CartItemTable cartItems={cartItems} onMutate={setCartItems} />
            </Card>
        </PrivateLayout>
    );
}