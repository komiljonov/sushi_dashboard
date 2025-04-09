"use client";

import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Minus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { CreateOrderForm } from "../types";
import { splitToHundreds } from "@/lib/utils";
import Image from "next/image";

export default function OrderItems({
  setIsAddItemOpen,
}: {
  setIsAddItemOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateOrderForm>();

  const { remove } = useFieldArray({
    control,
    name: "items",
    rules: {
      minLength: 1,
      validate: (value) => {
        return value.length > 0 || "At least one item is required";
      },
    },
  });

  const orderItems = watch("items");

  console.log(orderItems);

  const headers = ["MAHSULOT NOMI", "SONI", "NARX"];

  return (
    <Card className="shadow-none border-none p-0 bg-transparent">
      <CardContent className="p-0">
        <div className="grid grid-cols-7 py-3 border-b">
        {headers?.map((header, index) => (
          <span
            className={`text-sm text-[#A3A3A3] font-medium ${
              index === 0 ? "col-span-3" : " col-span-2"
            }`}
            key={index}
          >
            {header}
          </span>
        ))}
        </div>
        {orderItems.map((field, index) => (
          <div key={index} className="grid grid-cols-7 py-4 border-b">
            <div className="col-span-3 flex items-center gap-2">
              <Image
                src={field._product.image as string}
                alt={field._product.name_uz}
                width={40}
                height={40}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <span>{field._product.name_uz}</span>
            </div>
            <div className="flex items-center space-x-2 col-span-2  ">
              <div className="border border-[#F0F0F0] rounded-lg p-2 flex gap-2 items-center">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-7 p-0 h-7 bg-[#F0F0F0] roounded-lg"
                  size="sm"
                  disabled={field.quantity === 1}
                  onClick={() =>
                    setValue(`items.${index}.quantity`, field.quantity - 1)
                  }
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span>{field.quantity}</span>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-7 p-0 h-7 bg-[#F0F0F0] roounded-lg"
                  size="sm"
                  onClick={() =>
                    setValue(`items.${index}.quantity`, field.quantity + 1)
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between w-full col-span-2">
              <span>{splitToHundreds(field._product.price)} so&#39;m</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="bg-[#FFF0F1] p-1 rounded-full"
              >
                <X className="h-4 w-4 text-red-500" strokeWidth={3} />
              </Button>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsAddItemOpen(true)}
          className="mt-4 shadow-none font-normal border-orange-500 bg-orange-50 border hover:text-orange-500 hover:bg-orange-50 rounded-[10px]  text-orange-500"
        >
          <Plus className="h-4 w-4 mr-2" /> Taom qo'shish
        </Button>
      </CardContent>
        {errors.items && (
      <CardFooter>
          <p className="text-sm text-red-500 mt-1">
            {errors.items.message || "Mahsulotlar bo'sh"}
          </p>
        </CardFooter>
        )}
        {/* {errors.items && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {errors.items.message || "At least one item is required"}
                        </AlertDescription>
                    </Alert>
                )} */}
    </Card>
  );
}
