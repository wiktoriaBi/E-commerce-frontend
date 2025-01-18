import {Button, Form, Modal} from "react-bootstrap";
import React from "react";
import {Status} from "../../types";
import AlertError from "../alerts/AlertError.tsx";

interface ChangeStatusModalProps {
    statuses: Status[];
    newStatusId: number | null
    setNewStatusId: (newStatusId: number | null) => void;
    showModal: boolean;
    handleCloseModal: () => void;
    handleStatusChange: () => void;
    error: boolean;
    showFailed: boolean;
    handleCloseFailed: () => void;
}

const changeStatusModal: React.FC<ChangeStatusModalProps> = ({statuses, newStatusId, setNewStatusId, showModal,
                                                                 handleCloseModal, handleStatusChange, error,
                                                                 showFailed, handleCloseFailed}) => {

    return (
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Change Order Status</Modal.Title>
            </Modal.Header>
            {error &&   (<AlertError message="Forbidden status transition" show={showFailed} handleClose={handleCloseFailed}
                                     className="m-2">
            </AlertError>)}
            <Modal.Body>
                <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                        value={newStatusId || ""}
                        onChange={(e) => setNewStatusId(parseInt(e.target.value))}
                    >
                        <option value="" disabled>
                            Select status
                        </option>
                        {statuses.map((status) => (
                            <option key={status.id} value={status.id}>
                                {status.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleStatusChange}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
export default changeStatusModal;