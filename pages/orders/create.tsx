"use client"

import React, { useEffect, useState } from "react";
import { useForm, Controller, FormProvider, FieldErrors, FieldValues } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { getDeliveryPrice } from "@/lib/fetchers";
import { CreateOrderForm } from "@/components/orders/create/types";
import DeliveryMap from "@/components/orders/create/map";
import PromocodeSelect from "@/components/orders/create/promocode";
import UserSelect from "@/components/orders/create/user";
import OrderItems from "@/components/orders/create/items/list";
import TotalPrices from "@/components/orders/create/prices";
import DeliveryTime from "@/components/orders/create/time";
import FilialSelect from "@/components/orders/create/flial";
import { CreateOrder } from "@/lib/mutators";
import { useFetchData } from "@/components/orders/create/useData";
import { Button } from "@/components/ui/Button";
import AddItemModal from "@/components/orders/create/items/add";
import { Layout } from "@/components/Layout";
import { useRouter } from "next/router";
import PaymentMethodSelector from "@/components/orders/create/select-payment-method";
import DeliveryMethodSelector from "@/components/orders/create/select-delivery-method";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCrumb } from "@/lib/context/crumb-provider";


function CreateOrderPage() {
  const router = useRouter();
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Step 1: Add state for button disable

  const { filials, promocodes, phone_numbers, products } = useFetchData();

  const { toast } = useToast();

  const methods = useForm<CreateOrderForm>({
    defaultValues: {
      delivery: "DELIVER",
      payment_type: "CASH",
      time: null,
      items: [],
      location: undefined,
    },
  });

  const { register, control, handleSubmit, watch, reset } = methods;

  const onError = (errors: FieldErrors<FieldValues>) => {
    if (Object.keys(errors).length > 0) {
      toast({
        title: "Xatolik",
        description: "Barcha majburiy maydonlarni to‘ldiring",
        variant: "destructive",
      });
    }
  };

  const deliveryMethod = watch("delivery");
  const orderItems = watch("items");

  const { data: _deliveryPrice, isLoading: deliveryPriceLoading } = useQuery({
    queryKey: [
      "deliveryPrice",
      watch("location.latitude"),
      watch("location.longitude"),
    ],
    queryFn: () =>
      getDeliveryPrice({
        latitude: watch("location.latitude"),
        longitude: watch("location.longitude"),
      }),
    enabled: !!watch("location.latitude") && !!watch("location.longitude"),
  });

  const createOrderMutation = useMutation({
    mutationFn: CreateOrder,
    onSuccess: (data) => {
      console.log(data);
      router.push(`/orders/info?id=${data.id}`);
      setIsSubmitting(false); // Step 2: Re-enable button on success
      // reset()
      // alert("Buyurtma muvaffaqiyatli yaratildi!")
    },
    onError: (e) => {
      console.log(e);
      alert("Xatolik yuz berdi");
      setIsSubmitting(false); // Step 2: Re-enable button on error
    },
  });

  const onSubmit = (data: CreateOrderForm) => {
    setIsSubmitting(true); // Step 3: Disable button on first click
    console.log("Buyurtma yuborildi", { ...data, orderItems });
    const {
      location, // destructure to potentially omit
      ...restData
    } = data;

    const payload = {
      ...restData,
      delivery_price: _deliveryPrice?.cost || 0,
      items: data?.items?.map((item) => ({
        ...item,
        product: item?._product?.id,
      })),
      ...(data.delivery !== "PICKUP" ? { location } : {}), // only add location if not PICKUP
    };

    createOrderMutation.mutate(payload);
  };

  return (
    <div className="mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="space-y-6 bg-white rounded-xl p-6"
      >
        <h1 className="text-2xl font-bold mb-10 text-center">
          Yangi buyurtma yaratish
        </h1>
        <FormProvider {...methods}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <UserSelect />
            </div>

            <div className="space-y-2 col-span-2">
              <Controller
                name="delivery"
                control={control}
                render={({ field }) => <DeliveryMethodSelector {...field} />}
              />
            </div>
            <div className="col-span-2">
              <FilialSelect filials={filials} phone_numbers={phone_numbers} />
            </div>

            <PromocodeSelect promocodes={promocodes} />

            <div className="space-y-2 ">
              <Label htmlFor="comment">Izoh</Label>
              <Input
                id="comment"
                className="input h-[44px]"
                maxLength={1023}
                {...register("comment", { maxLength: 1023 })}
                placeholder="Izoh kiriting"
              />
            </div>

            <div className="col-span-2">
              <Controller
                name="payment_type"
                control={control}
                defaultValue="CASH"
                render={({ field }) => <PaymentMethodSelector {...field} />}
              />
            </div>
          </div>
          {deliveryMethod == "DELIVER" && (
            <div className={`space-y-2 `}>
              <Label>Yetkazib berish joyi</Label>
              <DeliveryMap required={deliveryMethod === "DELIVER"} />
            </div>
          )}

          <DeliveryTime />

          <div className="col-span-2 bg-[#FAFAFA] rounded-2xl px-4 py-1 space-y-2">
            <OrderItems />

            <AddItemModal
              isOpen={isAddItemOpen}
              setIsOpen={setIsAddItemOpen}
              products={products}
            />

            <TotalPrices
              _deliveryPrice={_deliveryPrice}
              deliveryPriceLoading={deliveryPriceLoading}
              promocodes={promocodes}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              className="button bg-[#F0F0F0]"
              onClick={() => {
                reset();
                router.push("/orders");
              }}
              variant="ghost"
            >
              Bekor qilish
            </Button>
            <Button
              type="submit"
              className="button bg-green-500 hover:bg-green-600 w-[150px] text-center"
              disabled={isSubmitting} // Step 4: Disable button while submitting
            >
              {!isSubmitting ? (
                "Buyurtma yaratish"
              ) : (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          </div>
        </FormProvider>
      </form>
    </div>
  );
}

export default function Page() {
    const { setCrumb } = useCrumb();
  
    useEffect(() => {
      setCrumb([{ label: "Buyurtmalar", path: "/orders" }, 
        { label: "Buyurtma yaratish", path: "/orders/create" },
      ]);
    }, [setCrumb]);

  return (
    <Layout page="orders">
      <CreateOrderPage />
    </Layout>
  );
}
