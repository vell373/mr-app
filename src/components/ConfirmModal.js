import React from 'react';

function ConfirmModal({ isOpen, onConfirm, onCancel, message }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>{message}</p>
                <div className="modal-buttons">
                    <button onClick={onCancel}>いいえ</button>
                    <button onClick={onConfirm}>はい</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;