import React from "react";

export interface ButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
}

export default function Button({
  type = "button",
  onClick,
  disabled = false,
  isLoading = false,
  loadingText,
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
}: ButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "secondary":
        return "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500";
      case "danger":
        return "bg-red-600 hover:bg-red-700 focus:ring-red-500";
      case "primary":
      default:
        return "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "py-1 px-3 text-xs";
      case "lg":
        return "py-3 px-6 text-base";
      case "md":
      default:
        return "py-2 px-4 text-sm";
    }
  };

  const baseClasses = `
    ${fullWidth ? "w-full" : ""} 
    flex justify-center 
    border border-transparent 
    rounded-md shadow-sm 
    font-medium text-white 
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed
    ${getVariantClasses()} 
    ${getSizeClasses()}
    ${className}
  `.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={baseClasses}
    >
      {isLoading ? loadingText || "Loading..." : children}
    </button>
  );
}
