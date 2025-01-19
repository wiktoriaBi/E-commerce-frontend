import { CartItem } from "../../context/CartContext";
import React, {useState} from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import properties from "../../properties/properties.ts";
import AlertError from "../alerts/AlertError.tsx";


interface OrderModalProps {
    show: boolean;
    onClose: () => void;
    cart: CartItem[];
    onOrderSuccess: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ show, onClose, cart, onOrderSuccess }) => {
    const totalPrice = cart.reduce((acc, item) => acc + item.quantity * parseFloat(String(item.product.price)), 0);

    const [showFailed, setShowFailed] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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
        onSubmit: async (values) => {
            const orderData = {
                username: values.username,
                email: values.email,
                phone: values.phone,
                items: cart.map(item => ({
                    product_id: item.product.id,
                    quantity: item.quantity
                }))
            }
            try{
                const response = await axios.post(`${properties.serverAddress}/orders`, orderData, {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem('authToken')}`
                        }
                    }
                );
                if(response.status === 201){
                    alert("Order successfully placed!");
                    onOrderSuccess();
                    onClose();
                }
            } catch (error) {
                console.error("Error submitting order:", error);
                setErrorMessage(error.response.data);
                setShowFailed(true);
                alert("An error occurred. Please try again.");
            }
            //clearCart();
            //setShowModal(false);
        },
    });
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Make Order</Modal.Title>
            </Modal.Header>
            <AlertError message={errorMessage} show={showFailed} handleClose={ () => setShowFailed(false)}
                        className="m-2">
            </AlertError>
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
                        <Button variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" className="ms-2">
                            Confirm
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default OrderModal;