import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import PaymeImage from "../../../public/images/payme.svg";
import ClickImage from "../../../public/images/click.svg";
import CashImage from "../../../public/images/cash.svg";

const paymentMethods = [
  {
    id: "cash",
    label: "Naqd pul",
    icon: CashImage,
  },
  {
    id: "payme",
    label: "",
    icon: PaymeImage,
  },
  {
    id: "click",
    label: "",
    icon: ClickImage,
  },
];

const PaymentMethodSelector = () => {
  const [selected, setSelected] = useState("cash");

  return (
    <div className="space-y-4 w-full">
      <div className="text-sm font-medium">To'lov usulini tanlang</div>
      <div className="grid grid-cols-3 gap-4 w-full">
        {paymentMethods.map((method) => {
          const isSelected = selected === method.id;
          return (
            <motion.button
              key={method.id}
              type="button"
              onClick={() => setSelected(method.id)}
              className={`flex items-center justify-center space-x-2 rounded-xl p-4 border transition hover:border-orange-500 ${
                isSelected ? "border-orange-500" : "border-muted"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src={method.icon}
                alt={method.label}
                width={90}
                height={32}
                className="h-8 w-auto object-contain"
              />
              <span className="font-medium text-sm">{method.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;