"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import React from "react";
import CommaInput from "../helpers/number-input";
import { useMutation } from "@tanstack/react-query";
import { createSigment } from "@/lib/actions/sigments.action";
import { queryClient } from "@/lib/query";
import { useToast } from "@/hooks/use-toast";

interface ISigmentsForm {
  name: string;
  days: number | "";
  min_orders: number | "";
  max_orders: number | "";
}

const SigmentsAddModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<ISigmentsForm>({
    defaultValues: {
      name: "",
      days: "",
      min_orders: "",
      max_orders: "",
    },
  });

  const { mutate: createMutation, isPending: isCreating } = useMutation({
    mutationFn: createSigment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sigments"] });
      toast({
        title: "Muvaffaqiyatli",
        description: "Sigment muvaffaqiyatli yaratildi",
      });
      setIsOpen(false);
      reset();
    },
  });

  const onSubmit = (data: ISigmentsForm) => {
    createMutation({
      name: data.name,
      days: Number(data.days),
      min_orders: Number(data.min_orders),
      max_orders: Number(data.max_orders),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="button">
          <Plus className="mr-2 w-4 h-4" /> Sigment qo'shish
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Sigment qo'shish</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nomi</Label>
            <Input
              id="name"
              className="input"
              {...register("name", { required: "Ism kiritish shart" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="days">Oxirgi nechi kun</Label>
            <Input
              id="days"
              type="number"
              className="input"
              {...register("days", {
                required: "Oxirgi nechi kun kiritish shart",
                valueAsNumber: true,
              })}
            />
            {errors.days && (
              <p className="text-red-500 text-sm mt-1">{errors.days.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="min_orders">Foydalanuvchilar dan</Label>
            <Controller
              name="min_orders"
              control={control}
              rules={{ required: "Miqdor kiritilishi shart" }}
              render={({ field }) => (
                <CommaInput
                  {...field}
                  onChange={(val: string) =>
                    field.onChange(
                      val === "" ? "" : Number(val.replace(/,/g, ""))
                    )
                  }
                />
              )}
            />
            {errors.min_orders && (
              <p className="text-red-500 text-sm mt-1">
                {errors.min_orders.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="max_orders">Foydalanuvchilar gacha</Label>
            <Controller
              name="max_orders"
              control={control}
              rules={{ required: "Miqdor kiritilishi shart" }}
              render={({ field }) => (
                <CommaInput
                  {...field}
                  onChange={(val: string) =>
                    field.onChange(
                      val === "" ? "" : Number(val.replace(/,/g, ""))
                    )
                  }
                />
              )}
            />
            {errors.max_orders && (
              <p className="text-red-500 text-sm mt-1">
                {errors.max_orders.message}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full bg-[#F5F5F5] button hover:bg-gray-100 text-black shadow-none"
            >
              Bekor qilish
            </Button>
            <Button
              type="submit"
              className="w-full hover:bg-green-600 bg-[#0EA60A] button"
              disabled={isCreating}
            >
              Qo&apos;shish
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SigmentsAddModal;
