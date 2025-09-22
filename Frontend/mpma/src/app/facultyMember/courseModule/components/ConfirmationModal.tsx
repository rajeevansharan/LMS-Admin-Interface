import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning" | "info";
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title = "Confirm Action",
  message,
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "warning",
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: (
            <svg
              className="w-6 h-6 text-error"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ),
          confirmButtonClass: "btn-error",
          alertClass: "alert-error",
        };
      case "warning":
        return {
          icon: (
            <svg
              className="w-6 h-6 text-warning"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ),
          confirmButtonClass: "btn-primary",
          alertClass: "alert-warning",
        };
      case "info":
        return {
          icon: (
            <svg
              className="w-6 h-6 text-info"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          ),
          confirmButtonClass: "btn-info",
          alertClass: "alert-info",
        };
      default:
        return {
          icon: (
            <svg
              className="w-6 h-6 text-warning"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ),
          confirmButtonClass: "btn-primary",
          alertClass: "alert-warning",
        };
    }
  };

  const { icon, confirmButtonClass, alertClass } = getVariantStyles();

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        {/* Alert Section */}
        <div className={`alert ${alertClass} mb-4`}>
          <div className="flex items-center">
            {icon}
            <h3 className="font-bold text-lg ml-2">{title}</h3>
          </div>
        </div>

        {/* Message */}
        <p className="py-4 text-base leading-relaxed">{message}</p>

        {/* Action Buttons */}
        <div className="modal-action">
          <button onClick={onCancel} className="btn btn-ghost">
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className={`btn ${confirmButtonClass}`}>
            {confirmLabel}
          </button>
        </div>
      </div>

      {/* Modal backdrop - clicking outside closes modal */}
      <label className="modal-backdrop" onClick={onCancel}>
        Close
      </label>
    </div>
  );
};

export default ConfirmationModal;
