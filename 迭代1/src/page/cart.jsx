import { useState } from "react";
import { Card } from "antd";
import CartItemTable from "../components/cart_item_table";
import { PrivateLayout } from "../components/layout";
import { initialCartItems } from "../data/bookdata";

export default function CartPage() {
    const [cartItems, setCartItems] = useState(initialCartItems);

    return (
        <PrivateLayout>
            <Card className="card-container">
                <CartItemTable cartItems={cartItems} onMutate={setCartItems} />
            </Card>
        </PrivateLayout>
    );
}