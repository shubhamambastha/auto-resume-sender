import React from "react";

export interface FormContainerProps {
  title: string;
  subtitle?: string;
  description?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl";
  children: React.ReactNode;
  className?: string;
}

export default function FormContainer({
  title,
  subtitle,
  description,
  maxWidth = "md",
  children,
  className = "",
}: FormContainerProps) {
  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case "sm":
        return "max-w-sm";
      case "lg":
        return "max-w-lg";
      case "xl":
        return "max-w-xl";
      case "2xl":
        return "max-w-2xl";
      case "4xl":
        return "max-w-4xl";
      case "md":
      default:
        return "max-w-md";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div
        className={`${getMaxWidthClass()} mx-auto bg-white rounded-xl shadow-md overflow-hidden ${
          maxWidth === "2xl" || maxWidth === "4xl" ? "md:max-w-2xl" : ""
        } ${className}`}
      >
        <div className="p-8 w-full">
          {subtitle && (
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">
              {subtitle}
            </div>
          )}
          <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
            {title}
          </h1>
          {description && <p className="mt-2 text-gray-500">{description}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
