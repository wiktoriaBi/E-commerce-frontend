import React, { useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as yup from "yup";
import { useCart } from "../context/CartContext";

const Cart: React.FC = () => {
    const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
    const [showModal, setShowModal] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);

    // Calculate total price
    const calculateTotalPrice = () => {
        const total = cart.reduce((acc, item) => acc + item.quantity * parseFloat(String(item.product.price)), 0);
        setTotalPrice(total);
    };

    // Show order modal
    const handleMakeOrder = () => {
        calculateTotalPrice();
        setShowModal(true);
    };

    // Formik validation schema
    const validationSchema = yup.object({
        username: yup.string().required("Username is required"),
        email: yup.string().email("Invalid email address").required("Email is required"),
        phone: yup
            .string()
            .matches(/^\+?\d{9,15}$/, "Invalid phone number")
            .required("Phone number is required"),
    });

    const formik = useFormik({
        initialValues: { username: "", email: "", phone: "" },
        validationSchema,
        onSubmit: (values) => {
            console.log("Order submitted:", { ...values, cart, totalPrice });
            clearCart();
            setShowModal(false);
            alert("Order successfully placed!");
        },
    });

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
                        <Button variant="primary" onClick={handleMakeOrder}>
                            Make Order
                        </Button>
                    </div>
                </>
            )}

            {/* Order modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Make Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={formik.handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={!!formik.errors.username && formik.touched.username}
                            />
                            <Form.Control.Feedback type="invalid">{formik.errors.username}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={!!formik.errors.email && formik.touched.email}
                            />
                            <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={!!formik.errors.phone && formik.touched.phone}
                            />
                            <Form.Control.Feedback type="invalid">{formik.errors.phone}</Form.Control.Feedback>
                        </Form.Group>
                        <p className="font-weight-bold">
                            Do you really want to make an order with total price ${totalPrice.toFixed(2)}?
                        </p>
                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" className="ms-2">
                                Confirm
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Cart;
