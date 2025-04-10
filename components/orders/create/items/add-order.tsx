"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Minus, PackageOpen, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/Button";
import { ICategory, ICategoryWithStats, IFile, IProduct } from "@/lib/types";
import { fetchCatProducts } from "@/lib/fetchers";
import { OrderItem } from "../types";
import Search from "@/components/search";

export interface Option {
  label: string;
  value: string;
}
const AddProductModal = ({
  onChange,
  fields,
  categories,
}: {
  onChange: (product: IProduct, quantity: number) => void;
  fields: OrderItem[];
  categories: ICategory[];
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [path, setPath] = useState<ICategory[]>([]); // Navigation stack
  const [catId, setCatId] = useState<string>("");

  const [searchTerm, setSearchTerm] = useState("");

  const { data: productsList, isLoading } = useQuery<ICategoryWithStats>({
    queryKey: ["cat_products", catId],
    queryFn: () => fetchCatProducts(catId),
    enabled: !!catId,
  });

  const currentCategory = path[path.length - 1] || null;

  const goBack = () => {
    setPath((prev) => prev.slice(0, -1)); // Pop the last category from the stack
    setCatId(path[path.length - 2]?.id || ""); // Set the new category ID
  };

  const handleCategoryClick = (category: ICategory) => {
    setPath((prev) => [...prev, category]);
    setCatId(category.id); // Set category ID for fetching products
  };

  const handleProductChange = (product: IProduct, quantity: number) => {
    onChange(product, quantity);
  };

  const renderContent = () => {
    if (!currentCategory) {
      // Render root categories
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories?.filter(category=> searchTerm ?  category.name_uz?.toLowerCase() === searchTerm?.toLowerCase() : category)?.map(
            (category) =>
              (category?.children.length > 0 ||
                category.products_count > 0) && (
                <div
                  key={category.id}
                  className="cursor-pointer border rounded-md p-4 flex items-center gap-2"
                  onClick={() => handleCategoryClick(category)}
                >
                  <h3 className="text-md text-[#272d37]">{category.name_uz}</h3>
                </div>
              )
          )}
        </div>
      );
    }

    if (currentCategory.children?.length > 0) {
      // Render subcategories
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentCategory.children?.filter(category=> searchTerm ? category.name_uz?.toLowerCase() === searchTerm?.toLowerCase() : category)?.map((category) => (
            <div
              key={category.id}
              className="cursor-pointer border rounded-md p-4 flex items-center gap-2"
              onClick={() => handleCategoryClick(category)}
            >
              <h3 className="text-md text-[#272d37]">{category.name_uz}</h3>
            </div>
          ))}
        </div>
      );
    }
    if (productsList) {
      // Render products
      if (productsList?.products?.length === 0) {
        return (
          <div className="w-full h-full flex justify-center items-center flex-col">
            <PackageOpen className="w-12 h-12 opacity-70" />
            <h2 className="text-md">Hech narsa topilmadi</h2>
          </div>
        );
      }
      return (
        <div className="flex flex-col gap-2 bg-[#FAFAFA] p-2 rounded-lg">
          <div className="flex flex-col gap-2">
            {productsList?.products
              ?.filter((product) =>
                product.name_uz.toLowerCase().includes(searchTerm.toLowerCase())
              )
              ?.map((product) => (
                <div
                  key={product.id}
                  className={`flex mx-auto w-full justify-between rounded-lg items-center border p-2 ${
                    (fields.find((field) => field._product.id === product.id)
                      ?.quantity || 0) > 0
                      ? "border-orange-500"
                      : "border-transparent"
                  }`}
                >
                  <div className="flex gap-2 items-center">
                    <div className="bg-gray-200 rounded-md">
                      <Image
                        src={
                          (product?.image as IFile)?.file || "/placeholder.jpg"
                        }
                        alt="product image"
                        width={40}
                        height={40}
                        className="w-full opacity-0 h-[56px] object-cover"
                      />
                    </div>
                    <div className="flex w-full flex-col justify-center items-center gap-1">
                      <span className="whitespace-nowrap text-xs font-medium">
                        {product.name_uz}
                      </span>
                      <div className="text-xs">
                        {product?.price} so&#39;mdan
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-xs font-medium">
                      {product?.price *
                        (fields.find(
                          (field) => field._product.id === product.id
                        )?.quantity || 0)}{" "}
                      so&#39;m
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        className="w-7 p-0 h-7 bg-[#F0F0F0] hover:bg-[#F0F0F0] text-black roounded-lg"
                        onClick={() =>
                          handleProductChange(
                            product,
                            Math.max(
                              (fields.find(
                                (field) => field._product.id === product.id
                              )?.quantity || 1) - 1,
                              0
                            )
                          )
                        }
                      >
                        <Minus className="w-5 h-5" />
                      </Button>
                      <div className="sm:w-6 flex justify-center">
                        {fields.find(
                          (field) => field._product.id === product.id
                        )?.quantity || 0}
                      </div>
                      <Button
                        className="w-7 p-0 h-7 bg-[#F0F0F0] hover:bg-[#F0F0F0] text-black roounded-lg"
                        onClick={() =>
                          handleProductChange(
                            product,
                            (fields.find(
                              (field) => field._product.id === product.id
                            )?.quantity || 0) + 1
                          )
                        }
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="w-full flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-[50px]" />
          ))}
        </div>
      );
    }

    return <p>Taom topilmadi!</p>;
  };

  const handleClose = () => {
    setIsOpen((prev) => !prev);
    setPath([]);
  };


  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="mt-4 shadow-none font-normal border-orange-500 bg-orange-50 border hover:text-orange-500 hover:bg-orange-50 rounded-[10px]  text-orange-500"
        >
          <Plus className="h-4 w-4 mr-2" /> Taom qo'shish
        </Button>
      </DialogTrigger>
      <DialogContent className=" w-full max-w-[650px] flex flex-col items-start">
        <div className="flex w-full flex-col p-1 ">
          <div className="flex items-center whitespace-nowrap gap-2">
            <DialogTitle className="py-2 text-lg text-[#272d37]">
              {!productsList ? "Kategoriyani tanlang" : "Mahsulotni tanlang"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-[#A3A3A3]">
            {!productsList
              ? "Har bir kategoriyada mahsulotlar saralangan"
              : "Mahsulotni tanlang va uni miqdorini kiritng"}
          </DialogDescription>
        </div>
        <Search search={searchTerm} setSearch={setSearchTerm} />

        <div className="w-full overflow-y-auto h-[400px]">
          {renderContent()}
        </div>
        <div className="flex justify-end w-full" >
          {path.length > 0 && (
            <Button
              onClick={goBack}
              className="bg-gray-200 hover:bg-gray-200 text-black w-full button"
            >
              Orqaga
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
