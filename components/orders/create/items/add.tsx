"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  ChangeEvent,
} from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { splitToHundreds } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
// import { FixedSizeList as List } from "react-window";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";
import debounce from "lodash.debounce";
// import { Skeleton } from "@/components/ui/skeleton";
import { CreateOrderForm, OrderItem } from "../types";
import { ICategory, ICategoryWithStats, IProduct } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "@/lib/api";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { fetchCatProducts } from "@/lib/fetchers";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Add Item Modal Component
export default function AddItemModal({
  isOpen,
  setIsOpen,
}: //   products,
{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  products?: IProduct[];
}) {
  //   const [selectedProductId, setSelectedProductId] = useState<string | null>(
  //     null
  //   );
  const [productId, setProductId] = useState<string>("");
  const { data: cat_products, isLoading } = useQuery<ICategoryWithStats>({
    queryKey: ["cat_products", productId],
    queryFn: () => fetchCatProducts(productId),
    enabled: !!productId,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("CATEGORY");
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const { data: categoriesData } = useQuery<ICategory[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await request.get(`/categories`);
      return data;
    },
  });

  const { control, watch } = useFormContext<CreateOrderForm>();

  const { append } = useFieldArray({
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
  const idList = orderItems?.map((order) => order.product);
  const queryClient = useQueryClient();

  const filteredProducts = useMemo(() => {
    return (
      cat_products?.products
        ?.map((product) => ({
          ...product,
          count: 1,
        }))
        ?.filter((product) =>
          product.name_uz.toLowerCase().includes(searchTerm.toLowerCase())
        ) ?? []
    );
  }, [cat_products, searchTerm]);

  useEffect(() => {
    setCategories(categoriesData as ICategory[]);
    setProducts(filteredProducts);
  }, [categoriesData, filteredProducts]);
  const handleAddItem = useCallback(
    (id: string) => {
      const selectedProduct = products.find((p) => p.id === id);
      if (selectedProduct) {
        const newItem: OrderItem = {
          product: id,
          _product: selectedProduct,
          quantity: selectedProduct.count,
        };
        append(newItem);
        // setIsOpen(false);
        setSearchTerm("");
        setCategories(categoriesData as ICategory[]);
        // setActiveTab("CATEGORY");
      }
    },
    [append, categoriesData, products]
  );

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearchTerm(value), 300),
    []
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debouncedSearch(e.target.value);
    },
    [debouncedSearch]
  );

  const ProductItem = useCallback(
    ({ index }: { index: number }) => {
      const product = products[index];
      const handleIncrease = () => {
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === product.id ? { ...p, count: p.count + 1 } : p
          )
        );
      };
      const handleDecrease = () => {
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === product.id && p.count > 1
              ? { ...p, count: p.count - 1 }
              : p
          )
        );
      };
      return (
        <div
          className={`p-2 flex justify-between cursor-pointer border hover:bg-gray-100 
            `}
        >
          <div className="flex items-center">
            {product?.name_uz} - {splitToHundreds(product?.price)} so'm
          </div>
          <div className="flex gap-2">
            <div className="flex items-center w-[120px] justify-between">
              <Button
                variant="ghost"
                className="border"
                onClick={handleDecrease}
                disabled={idList?.includes(product?.id)}
              >
                -
              </Button>
              <span>{product?.count}</span>
              <Button
                disabled={idList?.includes(product?.id)}
                variant="ghost"
                className="border"
                onClick={handleIncrease}
              >
                +
              </Button>
            </div>
            <Button
              disabled={idList?.includes(product?.id)}
              onClick={() => {
                //   setSelectedProductId((prev) =>
                //     prev === product.id ? "" : product?.id
                //   );
                handleAddItem(product.id);
              }}
            >
              Qo'shish
            </Button>
          </div>
        </div>
      );
    },
    [handleAddItem, products, idList]
  );

  const handleSearchCategory = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    if (value) {
      setCategories(
        categoriesData?.filter((cat) =>
          cat.name_uz.toLowerCase().includes(value)
        ) ?? []
      );
    } else {
      setCategories(categoriesData ?? []);
    }
  };

  const handleSwitchTab = (category: ICategory) => {
    const type = category?.content_type;
    if (type === "CATEGORY") {
      setCategories(category?.children);
    } else {
      // Only invalidate query if the category ID has actually changed
      if (category?.id !== productId) {
        setProductId(category?.id); // Update productId to fetch new products
      }
      setActiveTab(type);
    }
    queryClient.invalidateQueries({ queryKey: ["cat_products", productId] });
  };

  const handleBack = () => {
    setActiveTab("CATEGORY");
    setCategories(categoriesData as ICategory[]);
  };

  const handleClose = () => {
    setIsOpen(false);
    setProducts(filteredProducts);
    setActiveTab("CATEGORY");
  };
  console.log(isLoading);

  console.log(filteredProducts.length);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex w-full justify-between items-center">
              <span>Mahsulot qo&apos;shish</span>
              <Button size="icon" variant="ghost" onClick={handleBack}>
                <ChevronLeft />
              </Button>
            </DialogTitle>
            <DialogDescription>
              Buyurtmaga mahsulot va miqdorini qo&apos;shing.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full "
            >
              {activeTab === "PRODUCT" && (
                <Input
                  placeholder="Mahsulot nomini qidirish"
                  onChange={handleSearchChange}
                />
              )}
              {activeTab === "CATEGORY" && (
                <Input
                  placeholder="Kategoriyalar nomini qidirish"
                  onChange={handleSearchCategory}
                />
              )}
              <TabsContent value="CATEGORY" className="grid grid-cols-2 gap-2">
                {categories?.map((category, index) => {
                  return (
                    <div
                      key={index}
                      className="border p-3 cursor-pointer hover:bg-slate-100"
                      onClick={() => handleSwitchTab(category)}
                    >
                      {category?.name_uz}
                    </div>
                  );
                })}
              </TabsContent>
              <TabsContent value="PRODUCT">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ) : (
                  <div className="border rounded max-h-[400px] overflow-y-auto">
                    {products.length > 0 ? (
                      //   <List
                      //     height={500}
                      //     itemCount={filteredProducts.length}
                      //     itemSize={54}
                      //     width="100%"
                      //   >
                      //     {ProductItem}
                      //   </List>

                      filteredProducts.map((_, index) => {
                        return <ProductItem key={index} index={index} />;
                      })
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Mahsulot topilmadi.
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter>
            <Button onClick={handleClose} variant="outline">
              Chiqish
            </Button>
            {/* <Button onClick={handleAddItem}>Qo&apos;shish</Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
