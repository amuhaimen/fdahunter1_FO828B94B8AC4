// components/ui/Modal.tsx
import React, { useEffect } from "react";
import CrossIcon from "../icons/subscription/CrossIcon";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subTitle?: string;
  children: React.ReactNode;
  //   closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

const CustomModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  //   closeOnOverlayClick = true,
  showCloseButton = true,
  subTitle,
}) => {
  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden"; // Prevent scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  //   const handleOverlayClick = () => {
  //     if (closeOnOverlayClick) onClose();
  //   };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent overlay click when clicking inside modal
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-[3px] p-4"
    >
      {/* Overlay */}
      <div
        className=""
        // onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative z-10 bg-[#0E121B] rounded-lg shadow-xl max-w-142.5  w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={handleContentClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between py-3 px-6  ">
            <div>
              {title && (
                <h3
                  id="modal-title"
                  className="text-lg font-semibold text-white"
                >
                  {title}
                </h3>
              )}
              {subTitle && <p className="text-base text-[#A5A5AB] mt-1">{subTitle}</p>}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-auto text-gray-400 hover:text-gray-500 cursor-pointer"
                aria-label="Close modal"
              >
                <CrossIcon />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-6">{children}</div>
      </div>
    </div>
  );
};

export default CustomModal;
