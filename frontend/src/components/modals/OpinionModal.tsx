import React from "react";
import {Button, Form, Modal } from "react-bootstrap";
import AlertError from "../alerts/AlertError.tsx";


interface OpinionModalProps {
    showRateModal: boolean;
    rating: number | null;
    onRatingChange: (e: any) => void;
    content: string;
    onContentChange: (e: any) => void;
    onClose: () => void;
    handleSubmitReview: () => void;
    error: boolean;
    showFailed: boolean;
    handleCloseFailed: () => void;
}

const OpinionModal: React.FC<OpinionModalProps> = ({ showRateModal, onClose, rating, onRatingChange,
                                                       content, onContentChange, handleSubmitReview,
                                                       error, showFailed, handleCloseFailed}) => {
    return (
        <Modal show={showRateModal} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Rate Order</Modal.Title>
            </Modal.Header>
            {error &&   (<AlertError message="Opinion already exist" show={showFailed} handleClose={handleCloseFailed}
                         className="m-2">
            </AlertError>)}
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Rating</Form.Label>
                        <Form.Select
                            value={rating || ""}
                            onChange={onRatingChange}
                        >
                            <option value="">Select Rating</option>
                            {[1, 2, 3, 4, 5].map((r) => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Review</Form.Label>
                        <Form.Control
                            as="textarea"
                            value={content}
                            onChange={onContentChange}
                            rows={3}
                            placeholder="Write your review here"
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmitReview}>
                    Submit Review
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default OpinionModal;