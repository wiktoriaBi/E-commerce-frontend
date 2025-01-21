import React from "react";
import OrderTable from "../components/OrderTable";

const Orders: React.FC = () => {
    return (
            <div className="container mt-4">
                <h1>Orders</h1>
                <OrderTable />
            </div>
    );
};

export default Orders;
