import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FiChevronDown } from "react-icons/fi";

export interface ColorOption {
  readonly value: string;
  readonly label: string;
  //   readonly color: string;
}

// const options: ColorOption[] = [
//   { label: "Officeda", value: "IN_OFFICE", color: "#47C77D" },
//   { label: "Ketgan", value: "GONE", color: "#8491A5" },
//   { label: "Ishga kelmadi", value: "DIDNTCOME", color: "#F55555" },
//   { label: "Kech qoldi", value: "LATE", color: "#FEB23A" },
// ];

export default function Selector({
  value,
  onChange,
  options,
  placeholder,
  position = "bottom",
  style,
}: {
  value: string;
  onChange: (value: string) => void;
  options: ColorOption[];
  placeholder?: string;
  position?: "top" | "bottom";
  style?: React.CSSProperties;
}) {
  const [selectedValue, setSelectedValue] = useState<ColorOption | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (value) {
      setSelectedValue(
        options.find((option) => option.value === value) || null
      );
    } else {
      setSelectedValue(null);
    }
  }, [value, onChange, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: ColorOption) => {
    setSelectedValue(option);
    onChange(option.value);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dropdown from opening
    setSelectedValue(null);
    onChange("");
  };

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "relative",
        maxWidth: style?.maxWidth || "100%",
        width: style?.width || "100%",
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          ...style,
          width: style?.width || "100%",
          height: style?.height || "44px",
          borderRadius: "10px",
          border: `${isOpen ? "1px" : (style?.borderWidth || "1px")} solid ${
            isOpen ? "#E5E5E5" : "#E5E5E5"
          }`,
          backgroundColor: "#FAFAFA",
          fontSize: style?.fontSize || "14px",
          color: "#4B4B4B",
          textAlign: "left",
          padding: "0 12px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span className="line-clamp-1">
          {selectedValue ? selectedValue.label : placeholder || "Tanlang"}
        </span>

        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {selectedValue && (
            <span className="hover:text-red-500">
              <IoClose
                size={18}
                onClick={handleClear}
                style={{ cursor: "pointer" }}
              />
            </span>
          )}
          <FiChevronDown size={20} color="#666" />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: position === "top" ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: position === "top" ? 10 : -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              top: position === "top" ? "-86px" : "48px",
              width: "100%",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow:
                position === "top"
                  ? "0px -4px 10px rgba(0, 0, 0, 0.1)"
                  : "0px 4px 10px rgba(0, 0, 0, 0.1)",
              padding: "6px 0",
              listStyle: "none",
              zIndex: 50,
              maxHeight: "200px",
              overflowX: "auto"
            }}
          >
            {options.map((option) => (
              <motion.li
                key={option.value}
                onClick={() => handleSelect(option)}
                whileHover={{ backgroundColor: "#EEF3FF" }}
                className="hover:bg-[#EEF3FF]"
                style={{
                  padding: "10px 12px",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#4B4B4B",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor:
                    selectedValue === option ? "#EEF3FF" : "transparent",
                }}
              >
                {option.label}
                {/* <span
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: option.color,
                    borderRadius: "50%",
                  }}
                /> */}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
