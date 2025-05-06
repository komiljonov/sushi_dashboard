"use client";

import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ITaxiCallForm } from "@/lib/types";
import { fetchFilials } from "@/lib/fetchers";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/Input";
import DeliveryMap from "../orders/create/map";
import { callTaxi } from "@/lib/mutators";
import { Loader2 } from "lucide-react";

const CallTaxiModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: filials } = useQuery({
    queryKey: ["filials"],
    queryFn: fetchFilials,
  });

  const methods = useForm<ITaxiCallForm>();

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = methods;

  const { mutate } = useMutation({
    mutationFn: callTaxi,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["taxi"] });
      setIsOpen(false);
      reset();
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Error updating user:", error);
      setIsLoading(false);
    },
  });

  const onSubmit = (data: ITaxiCallForm) => {
    const payload = {
      ...data,
      lat: data?.location?.latitude,
      lon: data?.location?.longitude,
      after: Number(data?.after),
    };
    setIsLoading(true);
    mutate(payload);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="bg_green button">
            <span className="text-md">Taksi chaqirish</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Taksi chaqirish</DialogTitle>
          </DialogHeader>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="filial">Filial</Label>
                  <Controller
                    name="filial"
                    control={control}
                    rules={{ required: "Filialni tanlash shart" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="input h-[44px]">
                          <SelectValue placeholder="Filialni tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          {filials?.map((filial) => (
                            <SelectItem key={filial.id} value={filial.id}>
                              {filial.name_uz}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.filial && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.filial.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="after">
                    Qanchadan keyin taksi chaqirish(min)
                  </Label>
                  <Controller
                    name="after"
                    control={control}
                    rules={{ required: "Vaqtni kiritish shart" }}
                    render={({ field }) => (
                      <Input id="after" className="input" {...field} />
                    )}
                  />
                  {errors.after && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.after.message}
                    </p>
                  )}
                </div>
              </div>

              <div className={`space-y-2 `}>
                <Label>Joylashuv</Label>
                <DeliveryMap taxi required />
              </div>

              <div>
                <Label htmlFor="comment">Izoh</Label>
                <Controller
                  name="comment"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="comment"
                      className="resize-none input"
                      {...field}
                    />
                  )}
                />
              </div>

              <div className="flex justify-between gap-2">
                <Button
                  variant={"outline"}
                  className="w-full  button bg-gray-200  shadow-none"
                  onClick={() => setIsOpen(false)}
                >
                  Bekor qilish
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full hover:bg-green-600 bg-[#0EA60A] button"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <span>Yuborish</span>
                  )}
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CallTaxiModal;
