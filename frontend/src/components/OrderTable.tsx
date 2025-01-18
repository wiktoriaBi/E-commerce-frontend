import React, { useEffect, useState } from "react";
import {Button, Table } from "react-bootstrap";
import axios from "axios";
import properties from "../properties/properties";
import { useUserContext } from "../context/UserContext";
import {Order, Status, OrderItem} from "../types";
import moment from 'moment';
import ChangeStatusModal from "./modals/ChangeStatusModal.tsx";
import "../styles/noOrder.css"

const OrderTable: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [newStatusId, setNewStatusId] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showFailedAlert, setShowFailedAlert] = useState(false);
    const [error, setError] = useState(false);
    const { role } = useUserContext();
    const [statusFilter, setStatusFilter] =  useState<Status | null>(null);

    let endpoint = `${properties.serverAddress}/orders`;
    if(role === "CLIENT") endpoint =  `${properties.serverAddress}/orders/user/${localStorage.getItem("username")}`;
    const fetchOrders = async () => {
        try {
            const response = await axios.get<Order[]>(endpoint, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    // Fetch statuses for worker only
    const fetchStatuses = async () => {
        if (role === "WORKER") {
            try {
                const response = await axios.get<Status[]>(
                    `${properties.serverAddress}/order_status`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                        },
                    }
                );
                setStatuses(response.data);
            } catch (error) {
                console.error("Error fetching statuses:", error);
            }
        }
    };
    useEffect(() => {
        fetchOrders();
        fetchStatuses();

    }, [role]);

    const filteredOrders = async () => {
        if (role === "WORKER" && statusFilter) {
            let response;
            try {
                response = await axios.get<Order[]>(`${properties.serverAddress}/orders/status/${statusFilter.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });
                setOrders(response.data);
            } catch (error) {
                setOrders([]);
                console.error("Error filtering orders:", error);
            }
        }
    }

    useEffect(() => {
        filteredOrders();
    }, [statusFilter]);

    const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStatus = statuses.find((status) => status.id === Number(e.target.value)) || null;
        setStatusFilter(selectedStatus);
        if (e.target.value === "") {
            setStatusFilter(null);
            fetchOrders();
            fetchStatuses();
        }
    };

    const calculateTotalPrice = (items: OrderItem[]) => {
        return items.reduce((total, item) => {
            return total + parseFloat(String(item.product.price)) * item.quantity;
        }, 0).toFixed(2);
    };

    const formatApprovalDate = (approval_date: string | null) => {
        return approval_date ? moment(approval_date).format("YYYY-MM-DD") : "Not approved";
    };

    const handleOpenModal = (order: Order) => {
        setSelectedOrder(order);
        setNewStatusId(order.status.id);
        setShowFailedAlert(false);
        setError(false);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
        setShowModal(false);
    };

    const handleCloseFailedAlert = () => {setShowFailedAlert(false);};

    const handleStatusChange = () => {
        if (!selectedOrder || newStatusId === null) return;

        axios
            .patch(
                `${properties.serverAddress}/orders/${selectedOrder.id}`,
                {   order_id: selectedOrder.id,
                    status_id: newStatusId
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                }
            )
            .then(() => {
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === selectedOrder.id
                            ? {...order, status_id: newStatusId}
                            : order
                    )
                );
                handleCloseModal();
                fetchOrders();
                fetchStatuses();
            })
            .catch((error) => {
                console.error("Error updating status:", error);
                setError(true);
                setShowFailedAlert(true);
            });
    };

    return (
        <div className="container mt-4">
            <div className="col-md-6 m-1">
                <select
                    className="form-select"
                    value={statusFilter?.id || ""}
                    onChange={handleStatusFilter}
                >
                    <option value="">All Statuses</option>
                    {statuses.map((status) => (
                        <option key={status.id} value={status.id}>
                            {status.name}
                        </option>
                    ))}
                </select>
            </div>
            {orders.length === 0 ? (
                <div className="no-orders">
                    <p>No orders found</p>
                </div>
            ) : (
            <div className="table-responsive">
                <Table striped bordered hover>
                    <thead>
                    <tr className="table-info">
                        <th>Approval Date</th>
                        <th>Username</th>
                        <th>Products</th>
                        <th>Total Price</th>
                        <th>Status</th>
                        {role === "WORKER" && <th>Action</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{formatApprovalDate(order.approval_date)}</td>
                            <td>{order.username}</td>
                            <td>
                                <ul>
                                    {order.items.map((item, index) => (
                                        <li key={index}>
                                            {item.product.name} (x{item.quantity})
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>${calculateTotalPrice(order.items)}</td>
                            <td>{order.status.name}</td>
                            {role === "WORKER" && (
                                <td>
                                    <Button
                                        variant="primary"
                                        onClick={() => handleOpenModal(order)}
                                    >
                                        Change Status
                                    </Button>
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </Table>
                {/* Modal for changing status */}
                <ChangeStatusModal
                    statuses={statuses}
                    newStatusId={newStatusId}
                    setNewStatusId={setNewStatusId}
                    showModal={showModal}
                    handleCloseModal={handleCloseModal}
                    handleStatusChange={handleStatusChange}
                    error={error}
                    showFailed={showFailedAlert}
                    handleCloseFailed={handleCloseFailedAlert}
                />
            </div>
            )}
        </div>
    );
};

export default OrderTable;
