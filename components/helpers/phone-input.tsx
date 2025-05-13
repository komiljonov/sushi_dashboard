import React, { useEffect, useState } from "react";
import { Input } from "../ui/Input";

export const formatUzbekistanPhoneNumber = (input: string): string => {
    const prefix = "+998";
    const digits = input?.replace(/\D/g, "").slice(prefix.length - 1);
    let formatted = prefix;
  
    if (digits.length > 0) formatted += " " + digits.slice(0, 2);
    if (digits.length > 2) formatted += " " + digits.slice(2, 5);
    if (digits.length > 5) formatted += " " + digits.slice(5, 7);
    if (digits.length > 7) formatted += " " + digits.slice(7, 9);
  
    return formatted.trim();
  };

  export const unformatUzbekistanNumber = (formattedPhone: string): string => {
    return formattedPhone.replace(/\s+/g, ""); // Remove all spaces
  };

const PhoneInput = ({
  value, // Default to empty string to avoid undefined issues
  onChange,
  placeholder,
  disabled,
  styles,
  onBlur,
  onFocus,
}: {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  styles?: {paddingLeft: string}
  onBlur?: () => void;
  onFocus?: () => void;
}) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const formattedValue = formatUzbekistanPhoneNumber(value || "");
    if (formattedValue !== inputValue) {
      setInputValue(formattedValue);
    }
  }, [value, inputValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value || ""; // Ensure it's never undefined
    const formattedValue = formatUzbekistanPhoneNumber(rawValue);
    setInputValue(formattedValue);
    onChange(unformatUzbekistanNumber(formattedValue)); // Send unformatted number
  };

  return (
    <div>
      <Input
        id="phone"
        type="tel"
        disabled={disabled}
        value={inputValue}
        className="input"
        maxLength={17}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        placeholder={placeholder}
        aria-describedby="phone-hint"
        style={{...styles}}
      />
    </div>
  );
};

export default PhoneInput;

// import React, { useEffect, useState } from "react";
// import { Input } from "../ui/input";
// import {
//   unformatUzbekistanNumber,
//   formatUzbekistanPhoneNumber,
// } from "@/lib/functions";
// import { useMutation } from "@tanstack/react-query";
// import { checkPhone } from "@/lib/actions/auth.action";

// const PhoneInput = ({
//   value = "", // Default to empty string to avoid undefined issues
//   onChange,
//   placeholder,
//   disabled,
//   styles,
//   check
// }: {
//   value?: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
//   disabled?: boolean;
//   styles?: { paddingLeft: string };
//   check?: boolean;
// }) => {
//   const [inputValue, setInputValue] = useState("");
// 

//   useEffect(() => {
//     const formattedValue = formatUzbekistanPhoneNumber(value);
//     if (formattedValue !== inputValue) {
//       setInputValue(formattedValue);
//     }
//   }, [value, inputValue]);

//   // Debounce effect (Waits 500ms after typing stops)
//   useEffect(() => {
//     if (!debouncedValue) return; // Avoid unnecessary calls

//     const delay = setTimeout(() => {
//     if (check) {
//         mutate(unformatUzbekistanNumber(debouncedValue)); // Send request after delay
//       }
//     }, 500);

//     return () => clearTimeout(delay); // Cleanup timeout on new input
//   }, [debouncedValue, mutate, check]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const rawValue = e.target.value;
//     const formattedValue = formatUzbekistanPhoneNumber(rawValue);

//     setInputValue(formattedValue);
//     onChange(unformatUzbekistanNumber(formattedValue)); // Send unformatted number

//     setDebouncedValue(formattedValue); // Update debounced state
//   };

//   return (
//     <div>
//       <Input
//         id="phone"
//         type="tel"
//         disabled={disabled}
//         value={inputValue}
//         className="input"
//         onChange={handleChange}
//         placeholder={placeholder}
//         aria-describedby="phone-hint"
//         style={{ ...styles }}
//         required
//       />
//       {message && <p className="text-sm mt-1 text-red-500">{message}</p>}
//     </div>
//   );
// };

// export default PhoneInput;
