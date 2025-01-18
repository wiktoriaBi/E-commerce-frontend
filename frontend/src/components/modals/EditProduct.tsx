import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import {Formik, FormikValues} from "formik";
import * as yup from "yup";
import axios from "axios";
import {Category, Product} from "../../types";
import properties from "../../properties/properties.ts";

interface ProductEditModalProps {
    product: Product;
    categories: Category[];
    refreshData: () => void;
    showEdit: boolean;
    handleCloseEdit: () => void;
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({product, categories, refreshData, showEdit, handleCloseEdit}) => {

    const schemaEdit = yup.object().shape({
        name: yup.string().required("Name is required").min(2, "Name must be at least 2 characters long"),
        description: yup
            .string()
            .required("Description is required")
            .min(5, "Description must be at least 5 characters long"),
        weight: yup
            .number()
            .required("Weight is required")
            .positive("Weight must be a positive number")
            .typeError("Weight must be a valid number"),
        price: yup
            .number()
            .required("Price is required")
            .positive("Price must be a positive number")
            .typeError("Price must be a valid number"),
        category_id: yup.number().required("Category is required").typeError("Invalid category"),
    });


    const handleSubmit = async (values: FormikValues) => {
        const payload = {
            id: values.id,
            ...values
        };

        try {
            await axios.put(`${properties.serverAddress}/products/${product.id}`, payload, {
                headers: {  "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            refreshData();
            handleCloseEdit();
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    return (
        <>
            <Modal show={showEdit} onHide={handleCloseEdit} contentClassName="bg-light border-dark">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        validationSchema={schemaEdit}
                        initialValues={{
                            name: product.name,
                            description: product.description,
                            weight: product.weight,
                            price: product.price,
                            category_id: product.category_id,
                        }}
                        onSubmit={(values) => handleSubmit(values)}
                    >
                        {({ values, handleChange, handleSubmit, errors }) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={values.name}
                                        onChange={handleChange}
                                        isInvalid={!!errors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="description"
                                        value={values.description}
                                        onChange={handleChange}
                                        isInvalid={!!errors.description}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Weight</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="weight"
                                        value={values.weight}
                                        onChange={handleChange}
                                        isInvalid={!!errors.weight}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.weight}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="price"
                                        value={values.price}
                                        onChange={handleChange}
                                        isInvalid={!!errors.price}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="category_id"
                                        value={values.category_id}
                                        onChange={handleChange}
                                        isInvalid={!!errors.category_id}
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">{errors.category_id}</Form.Control.Feedback>
                                </Form.Group>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseEdit}>
                                        Close
                                    </Button>
                                    <Button variant="primary" type="submit">
                                        Save Changes
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        )}
                    </Formik>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ProductEditModal;
