import React, { useState } from 'react';
import Spinner from './Spinner';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="dialog-actions">
          <button className="dialog-button secondary" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </button>
          <button className="dialog-button primary" onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting && <Spinner />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;