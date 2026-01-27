import React from "react";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-2">
      <span className="text-sm text-textMuted">
        Trang {page} / {totalPages}
      </span>

      <div className="flex gap-2">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="
            px-3 py-1 rounded-lg border border-borderLight
            text-sm
            hover:bg-primarySoft
            disabled:opacity-40
          "
        >
          Trước
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`
                px-3 py-1 rounded-lg border text-sm
                ${
                  p === page
                    ? "bg-primary text-white border-primary"
                    : "border-borderLight hover:bg-primarySoft"
                }
              `}
            >
              {p}
            </button>
          );
        })}

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="
            px-3 py-1 rounded-lg border border-borderLight
            text-sm
            hover:bg-primarySoft
            disabled:opacity-40
          "
        >
          Sau
        </button>
      </div>
    </div>
  );
}
