import React, { useState, useRef, useEffect } from "react";

export default function FilterButton({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const [width, setWidth] = useState(null);

  // Lấy chiều rộng button lúc render để giữ cố định
  useEffect(() => {
    if (buttonRef.current) {
      setWidth(buttonRef.current.offsetWidth);
    }
  }, []);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        style={{ minWidth: width }} // giữ chiều rộng
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-textMuted text-sm hover:border-primary hover:text-primary transition"
        onClick={() => setOpen((prev) => !prev)}
      >
        {label}
        <span className="material-symbols-outlined text-sm">expand_more</span>
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-1 bg-white border border-border rounded shadow z-10"
          style={{ minWidth: width }} // dropdown bằng width button
        >
          <button
            className="block w-full text-left px-3 py-2 hover:bg-primarySoft"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
          >
            Tất cả
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              className="block w-full text-left px-3 py-2 hover:bg-primarySoft"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
