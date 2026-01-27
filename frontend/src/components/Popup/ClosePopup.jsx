import React from "react";

const ClosePopup = ({ onClose, children }) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* STOP CLICK BUBBLE */}
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default ClosePopup;
