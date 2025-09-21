import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: "success" | "warning" | "error" | "info";
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "info",
}) => {
  if (!isOpen) return null;

  const getAlertClass = () => {
    switch (type) {
      case "success":
        return "bg-green-100 border-green-300 text-green-800";
      case "warning":
        return "bg-green-100 border-green-300 text-green-800";
      case "error":
        return "alert-error";
      default:
        return "alert-info";
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case "success":
        return "bg-green-200 hover:bg-green-300 text-green-800 border-green-300";
      case "warning":
        return "bg-green-200 hover:bg-green-300 text-green-800 border-green-300";
      case "error":
        return "btn-error";
      default:
        return "btn-primary";
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className={`alert ${getAlertClass()} mb-4 border rounded-lg`}>
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="py-2">{message}</p>
          </div>
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onCancel}>
            {cancelText}
          </button>
          <button className={`btn ${getButtonClass()}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onCancel}></div>
    </div>
  );
};

export default ConfirmationModal;
