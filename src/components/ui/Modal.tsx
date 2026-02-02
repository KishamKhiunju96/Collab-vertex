"use client";

import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";

export interface ModalProps {
  open: boolean; // required
  title?: string;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

export default function Modal({
  open,
  title,
  onClose,
  children,
  size = "md",
}: ModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={`relative w-full ${sizeClasses[size]} mx-4 rounded-xl bg-white shadow-xl animate-scaleIn`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
          <button onClick={onClose} className="rounded p-1 hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
