import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import OrderModal from "./modals/OrderModal.tsx";

const Cart: React.FC = () => {
    const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="container mt-4">
            {cart.length === 0 ? (
                <p>Pusto jak w mojej głowie</p>
            ) : (
                <>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cart.map((item) => (
                            <tr key={item.product.id}>
                                <td>{item.product.name}</td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                        >
                                            -
                                        </Button>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            min="1"
                                            onChange={(e) =>
                                                updateQuantity(item.product.id, parseInt(e.target.value, 10))
                                            }
                                            className="form-control mx-2"
                                            style={{ width: "70px" }}
                                        />
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </td>
                                <td>${(item.quantity * parseFloat(String(item.product.price))).toFixed(2)}</td>
                                <td>
                                    <Button variant="danger" onClick={() => removeFromCart(item.product.id)}>
                                        Remove
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    <div className="d-flex justify-content-between align-items-center">
                        <Button variant="secondary" onClick={clearCart}>
                            Clear Cart
                        </Button>
                        <Button variant="primary" onClick={() => setShowModal(true)}>
                            Make Order
                        </Button>
                    </div>
                </>
            )}

            {/* Order modal */}
            <OrderModal
                show={showModal}
                onClose={() => setShowModal(false)}
                cart={cart}
                onOrderSuccess={clearCart}
            />
        </div>
    );
};

export default Cart;
