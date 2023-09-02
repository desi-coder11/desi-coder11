
import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="EditFormHeader">
          <h3>Confirm Deletion</h3>
          <p>Are you sure you want to delete this item?</p>
          <div className="ButtonGroup">
            <button onClick={onConfirm}>Confirm</button>
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
