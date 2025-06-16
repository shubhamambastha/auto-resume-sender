import React from "react";

export interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "select";
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  minLength?: number;
  options?: Array<{ value: string; label: string; title?: string }>;
  loadingText?: string;
  className?: string;
}

export default function FormField({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  disabled = false,
  minLength,
  options = [],
  loadingText,
  className = "",
}: FormFieldProps) {
  const baseInputClasses = `mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
    disabled ? "disabled:opacity-50 disabled:cursor-not-allowed" : ""
  } ${className}`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && "*"}
      </label>

      {type === "select" ? (
        <select
          id={id}
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${baseInputClasses} pl-3 pr-10 py-2 text-base`}
        >
          <option value="" disabled>
            {loadingText || `Select ${label.toLowerCase()}`}
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              title={option.title}
            >
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          disabled={disabled}
          minLength={minLength}
          className={baseInputClasses}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
