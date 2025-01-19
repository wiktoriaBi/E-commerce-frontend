import React, { useEffect, useMemo, useState } from 'react';
import { Product, Category } from '../types';
import axios from 'axios';
import { useUserContext } from "../context/UserContext.tsx";
import properties from "../properties/properties.ts";
import Table from 'react-bootstrap/Table';
import { Button } from "react-bootstrap";
import ProductEditModal from './modals/EditProduct';
import { useCart } from "../context/CartContext";
import {AddProductModal} from "./modals/AddProductModal.tsx";

const ProductTable: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [nameFilter, setNameFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null); // Produkt do edycji
    const { role } = useUserContext();
    const { addToCart } = useCart();

    // Funkcja pobierająca produkty i kategorie
    const fetchProducts = () => {
        axios.get<Product[]>(`${properties.serverAddress}/products`, { withCredentials: true }).then((response) => {
            setProducts(response.data);
        });

        axios.get<Category[]>(`${properties.serverAddress}/categories`).then((response) => {
            setCategories(response.data);
        });
    };

    // Użycie useEffect do załadowania danych
    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            return (
                product.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
                (categoryFilter === '' || product.category.name === categoryFilter)
            );
        });
    }, [nameFilter, categoryFilter, products]);

    // Funkcja otwierająca modal do edycji produktu
    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setShowEditModal(true);
    };

    // Funkcja zamykająca modal
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditingProduct(null);
    };

    return (
        <div className="container mt-4">
            <div className="row mb-3">
                {role === 'WORKER' && (
                    <div className="row mb-4">
                        <div className="col">
                            <Button onClick={ () => setShowAddModal(true)}>Add product</Button>
                        </div>
                    </div>
                )}
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Filter by name"
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <select
                        className="form-select"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="table-responsive">
                <Table striped bordered hover>
                    <thead>
                    <tr className="table-info">
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Weight</th>
                        <th>Category</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredProducts.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>${product.price}</td>
                            <td>{product.weight}</td>
                            <td>{product.category.name}</td>
                            <td>
                                {role === 'CLIENT' && (
                                    <Button className="btn btn-success"
                                    onClick={() => addToCart(product)}>Buy</Button>
                                )}
                                {role === 'WORKER' && (
                                    <Button
                                        className="btn btn-primary"
                                        onClick={() => handleEditProduct(product)} // Otwarcie modala do edycji
                                    >
                                        Edit
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>

            <AddProductModal showEdit={showAddModal} handleCloseEdit={() => {setShowAddModal(false)}}
                             refreshData={fetchProducts} categories={categories}></AddProductModal>

            {/* Modal do edycji produktu */}
            {editingProduct && (
                <ProductEditModal
                    product={editingProduct}
                    categories={categories}
                    refreshData={fetchProducts}
                    showEdit={showEditModal}
                    handleCloseEdit={handleCloseEditModal}
                />
            )}
        </div>
    );
};

export default ProductTable;
