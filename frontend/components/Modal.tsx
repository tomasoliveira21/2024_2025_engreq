import React, { useRef, useEffect } from "react";

export default function Modal({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on outside click
  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white rounded-lg overflow-hidden w-3/4 max-w-lg relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-3 py-1"
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
}
