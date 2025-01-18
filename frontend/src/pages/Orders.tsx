import React from "react";
import OrderTable from "../components/OrderTable";
import { UserProvider } from '../context/UserContext';

const Orders: React.FC = () => {
    return (
        <UserProvider>
            <div className="container mt-4">
                <h1>Orders</h1>
                <OrderTable />
            </div>
        </UserProvider>
    );
};

export default Orders;
