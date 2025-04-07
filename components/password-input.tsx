import React, { useState } from "react";
import { Input } from "./ui/Input";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({
  onChange,
  value,
  id,
  style,
  placeholder,
}: {
  onChange: (value: string) => void;
  value: string;
  id: string;
  style?: React.CSSProperties;
  placeholder?: string;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        style={style}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        placeholder={placeholder}
      />
      <div
        onClick={() => setShowPassword(!showPassword)}
        className="absolute top-1/2 right-3 -translate-y-1/2 w-6 h-6 hover:bg-slate-200 rounded-full flex items-center justify-center cursor-pointer ease-linear duration-200"
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </div>
    </div>
  );
};

export default PasswordInput;
