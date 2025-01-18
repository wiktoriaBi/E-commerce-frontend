import React from 'react';
import ProductTable from '../components/ProductTable';
// import { UserProvider } from '../context/UserContext';
// import {CartProvider} from "../context/CartContext.tsx";

const Products: React.FC = () => {
    return (
        <div className="container mt-5">
            <h1 className="mb-4">Products</h1>
            <ProductTable />
        </div>
    );
};

export default Products;
