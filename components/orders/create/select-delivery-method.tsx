import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import Deliver from "@/public/images/deliver.svg";
import Pickup from "@/public/images/pickup.svg";

const deliveryMethods = [
  {
    id: "PICKUP",
    title: "Olib ketish",
    description: "Mijoz buyurtmani restorandan shaxsan olib ketadi",
    icon: Pickup,
    check: true,
  },
  {
    id: "DELIVER",
    title: "Yetkazib berish",
    description: "Mijozga buyurtma kuryer orqali yetkazib beriladi",
    icon: Deliver,
    check: false,
  },
];

const DeliveryMethodSelector = ({
  onChange,
}: {
  onChange: (value: string) => void;
}) => {
  const [selected, setSelected] = useState("pickup");

  return (
    <div className="space-y-4 w-full">
      <div className="text-sm font-medium">Yetkazib berish turi</div>
      <div className="grid grid-cols-2 gap-4 w-full">
        {deliveryMethods.map((method) => {
          const isSelected = selected === method.id;
          return (
            <motion.button
              key={method.id}
              type="button"
              onClick={() => {
                onChange(method.id);
                setSelected(method.id);
              }}
              className={`relative flex flex-col hover:border-orange-500 items-start text-left w-full rounded-xl px-4 py-3 border transition ${
                isSelected
                  ? "border-orange-500 bg-orange-50"
                  : "border-muted bg-muted/10"
              }`}
              whileTap={{ scale: 0.97 }}
            >
              <div className="flex items-center space-x-3">
                <Image
                  src={method.icon}
                  alt={method.title}
                  width={72}
                  height={72}
                />
                <div className="flex flex-col">
                  <div className="text-md font-semibold">{method.title}</div>
                  <div className="text-sm text-[#A3A3A3] mt-2">
                    {method.description}
                  </div>
                </div>
              </div>
              {isSelected && (
                <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-orange-500" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default DeliveryMethodSelector;
