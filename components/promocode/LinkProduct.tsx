"use client";

import React, { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import Image from "next/image";
import { ICategory, IFile, IProduct } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { request } from "@/lib/api";
import { CreateOrderForm } from "../orders/create/types";
import AddProduct from "./AddProduct";
import { IPromocodeProduct } from "@/lib/types/promocode.types";

interface ILinkProductProps {
  setPromocodeProducts: (products: IPromocodeProduct[]) => void;
}

const LinkProduct: React.FC<ILinkProductProps> = ({ setPromocodeProducts }) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateOrderForm>();

  const { fields, remove, update, append } = useFieldArray({
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

  const selectedProducts = watch("items");

  const { data: categories } = useQuery<ICategory[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await request.get(`/categories`);
      return data;
    },
  });

  const handleProductChange = (product: IProduct, quantity: number) => {
    const existingIndex = selectedProducts.findIndex(
      (item) => item?._product?.id === product?.id
    );

    const safeProduct = {
      ...product,
      image: product.image || { id: "", file: "/images/no_image.png" },
    };

    if (quantity < 1) {
      if (existingIndex >= 0) {
        remove(existingIndex);
      }
      return;
    }

    if (existingIndex >= 0) {
      update(existingIndex, {
        _product: safeProduct,
        product: safeProduct?.name_uz,
        quantity,
      });
    } else {
      append({
        _product: safeProduct,
        product: safeProduct?.name_uz,
        quantity,
      });
    }
  };

  useEffect(() => {
    if (orderItems && Array.isArray(orderItems)) {
      setPromocodeProducts(
        orderItems.map((item) => ({
          product: item._product?.id || "",
          quantity: item.quantity || 1,
        }))
      );
    }
  }, [orderItems, setPromocodeProducts]);

  return (
    <Card className="shadow-none border-none p-0 bg-transparent">
      <CardContent className="p-0">
        <div>
          <AddProduct
            fields={fields}
            categories={categories as ICategory[]}
            onChange={handleProductChange}
          />
        </div>

        <div className="bg-[#FAFAFA] rounded-lg px-2 mt-2 ">
          {orderItems?.map((field, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-4 border-b"
            >
              <div className="col-span-4 flex items-center gap-2">
                <Image
                  src={
                    (field._product.image as IFile)?.file ||
                    "/images/no_image.png"
                  }
                  alt={field._product.name_uz}
                  width={40}
                  height={40}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <span>{field._product.name_uz}</span>
              </div>
              <div className="flex items-center gap-4">
                <div>
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
        </div>
      </CardContent>

      {errors.items && (
        <CardFooter>
          <p className="text-sm text-red-500 mt-1">
            {errors.items.message || "Mahsulotlar bo'sh"}
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default LinkProduct;
