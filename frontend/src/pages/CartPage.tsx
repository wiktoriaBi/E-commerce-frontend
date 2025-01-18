import React from 'react';
import Cart from '../components/Cart';
// import {UserProvider } from '../context/UserContext';
// import {CartProvider} from "../context/CartContext.tsx";

const CartPage: React.FC = () => {
    return (
        <div className="container mt-5">
            <h1 className="mb-4">Cart</h1>
            <Cart />
        </div>
    );
};

export default CartPage;