import React, { useEffect, useState } from "react";
import { Input } from "../ui/Input";

const formatNumber = (value: string | number = "", minus?: boolean): string => {
  // ✅ keep zeros: use ?? instead of ||
  const stringValue = String(value ?? "");

  // Remove invalid characters except numbers, minus, dot, comma
  let sanitizedValue = stringValue.replace(/[^0-9.,-]/g, "");

  // Single leading minus only (and only if minus is allowed)
  if (sanitizedValue.startsWith("-")) {
    sanitizedValue = minus
      ? "-" + sanitizedValue.slice(1).replace(/-/g, "")
      : sanitizedValue.slice(1).replace(/-/g, "");
  } else {
    sanitizedValue = sanitizedValue.replace(/-/g, "");
  }

  // Prevent multiple decimal points
  const dotCount = (sanitizedValue.match(/\./g) || []).length;
  if (dotCount > 1) {
    sanitizedValue = sanitizedValue.slice(0, sanitizedValue.lastIndexOf("."));
  }

  // Remove commas for correct formatting
  const numberWithoutCommas = sanitizedValue.replace(/,/g, "");

  // Keep empty or just "-" as-is
  if (numberWithoutCommas === "" || numberWithoutCommas === "-") {
    return sanitizedValue;
  }

  // Split integer and decimal parts
  const [integer, decimal] = numberWithoutCommas.split(".");

  // Add thousands separators
  const integerWithCommas = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return decimal ? `${integerWithCommas}.${decimal}` : integerWithCommas;
};

// Props
interface CommaInputProps {
  value?: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  minus?: boolean;
  maxLength?: number; // currently used as max length; rename to maxLength if that’s the intent
  required?: string;
}

const CommaInput: React.FC<CommaInputProps> = ({
  value = "", // controlled default
  onChange,
  placeholder,
  disabled,
  readOnly,
  maxLength: maxValue,
  required,
  minus,
}) => {
  // ✅ keep zeros: use ?? here as well
  const removeCommas = (val: string | number = ""): string =>
    String(val ?? "").replace(/,/g, "");

  const [inputValue, setInputValue] = useState(
    value === undefined || value === null || value === ""
      ? ""
      : formatNumber(value, minus)
  );

  useEffect(() => {
    if (value === undefined || value === null || value === "") {
      setInputValue("");
    } else {
      setInputValue(formatNumber(value, minus));
    }
  }, [value, minus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value ?? ""; // keep "0"
    // Note: this is a character limit, not a numeric max
    rawValue = rawValue.slice(0, maxValue || 41);

    const formattedValue = formatNumber(rawValue, minus);
    setInputValue(formattedValue);

    // Emit raw numeric string without commas
    onChange(removeCommas(formattedValue));
  };

  return (
    <div className="w-full">
      <Input
        disabled={disabled}
        readOnly={readOnly}
        required={!!required}
        value={inputValue ?? ""} // ensure controlled
        className={`${readOnly ? "pointer-events-none" : ""} input w-full`}
        onChange={handleChange}
        placeholder={placeholder}
      />
      {required && <p className="text-sm mt-1 text-red-500">{required}</p>}
    </div>
  );
};

export default CommaInput;
