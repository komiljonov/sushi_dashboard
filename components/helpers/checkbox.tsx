"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import React from "react";

interface AnimatedCheckProps {
  checked: boolean;
  onClick: () => void;
}

export default function AnimatedCheck({ checked, onClick }: AnimatedCheckProps) {
  return (
    <motion.div
      className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-gray-300 cursor-pointer"
      onClick={onClick}
      animate={{
        backgroundColor: checked ? "#F97316" : "#fff",
        borderColor: checked ? "#F97316" : "#D1D5DB",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {checked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Check size={14} color="white" />
        </motion.div>
      )}
    </motion.div>
  );
}
