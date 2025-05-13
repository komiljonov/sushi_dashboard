import React, { useState, useRef } from "react";
import { Input } from "../ui/Input";

interface CustomTimeInputProps {
  value?: string | null;
  onChange: (value: string) => void;
  readOnly?: boolean;
  disabled?: boolean;
  minValue?: string;
}

export function TimeInput({ value, onChange, readOnly = false, disabled, minValue }: CustomTimeInputProps) {
  if (!value) {
    value = "";
  }

  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const timeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;

  const validateTime = (value: string) => {
    if (!timeRegex.test(value)) {
      setIsValid(false);
      setErrorMessage("Iltimos vaqtni HH:MM formatda kiriting.");
      return;
    }

    const [hours, minutes] = value.split(":").map(Number);
    
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      setIsValid(false);
      setErrorMessage("Soatlar 00 va 23 orasida bo'lishi kerak, minutlar esa 00 va 59 orasida.");
      return;
    }

    if (minValue && timeToMinutes(value) < timeToMinutes(minValue)) {
      setIsValid(false);
      setErrorMessage(`Vaqt ${minValue} dan katta bo'lishi kerak!`);
      return;
    }

    setIsValid(true);
    setErrorMessage("");
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value.replace(/[^\d:]/g, "");

    if (newValue.length > 5) {
      newValue = newValue.slice(0, 5);
    }

    if (newValue.length === 2 && !newValue.includes(":") && value.length === 1) {
      newValue += ":";
    } else if (newValue.length === 2 && value.length === 3) {
      newValue = newValue.slice(0, 1);
    }

    if (newValue.length === 1 && "3456789".includes(newValue)) {
      newValue = `0${newValue}:`;
    }

    const [hours, minutes] = newValue.split(":").map(Number);
    if (hours > 23) {
      newValue = "23:";
    } else if (minutes > 59) {
      newValue = String(hours).padStart(2, "0") + ":59";
    }

    onChange(newValue);
    validateTime(newValue);
  };

  const handleBlur = () => {
    if (value.length === 3) {
      onChange(`${value}00`);
    }

    // Re-validate on blur to ensure correctness
    validateTime(value);
  };

  // Converts "HH:MM" to total minutes for proper comparison
  const timeToMinutes = (time: string): number => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  return (
    <div className="w-full space-y-2">
      <Input
        ref={inputRef}
        type="text"
        readOnly={readOnly}
        disabled={disabled}
        inputMode="numeric"
        placeholder="HH:MM"
        value={value}
        onChange={handleTimeChange}
        onBlur={handleBlur}
        className={`${!isValid && value.length > 0 ? "border-red-500" : "w-full"} input`}
        aria-invalid={!isValid}
      />
      {!isValid && value.length > 0 && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
