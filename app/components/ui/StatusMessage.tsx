import React from "react";

export interface StatusMessageProps {
  type: "success" | "error" | "info" | "warning";
  message: string;
  className?: string;
}

export default function StatusMessage({
  type,
  message,
  className = "",
}: StatusMessageProps) {
  const getColorClasses = () => {
    switch (type) {
      case "success":
        return "bg-green-50 text-green-800";
      case "error":
        return "bg-red-50 text-red-800";
      case "warning":
        return "bg-yellow-50 text-yellow-800";
      case "info":
      default:
        return "bg-blue-50 text-blue-800";
    }
  };

  return (
    <div className={`rounded-md p-4 ${getColorClasses()} ${className}`}>
      <div className="flex">
        <div className="ml-3">
          <p className="text-sm font-medium">
            {type === "error" && "Error: "}
            {type === "success" && "Success! "}
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
