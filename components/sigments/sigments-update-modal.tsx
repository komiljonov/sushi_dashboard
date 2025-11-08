"use client";

import { useEffect, useState } from "react";
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
import { Edit } from "lucide-react";
import React from "react";
import CommaInput from "../helpers/number-input";
import { useMutation } from "@tanstack/react-query";
import { updateSigment } from "@/lib/actions/sigments.action";
import { queryClient } from "@/lib/query";
import { useToast } from "@/hooks/use-toast";
import { ISigment } from "@/lib/types/sigments.types";

interface ISigmentsForm {
  name: string;
  days: number | "";
  min_orders: number | "";
  max_orders: number | "";
}

const SigmentsUpdateModal = ({ sigment }: { sigment: ISigment }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<ISigmentsForm>();

  useEffect(() => {
    if (sigment) {
      reset({
        name: sigment.name,
        days: sigment.day,
        min_orders: sigment.min_orders,
        max_orders: sigment.max_orders,
      });
    }
  }, [sigment, reset]);

  const { mutate: updateMutation, isPending: isUpdating } = useMutation({
    mutationFn: (data: ISigmentsForm) =>
      updateSigment(sigment.id, {
        name: data.name,
        days: Number(data.days),
        min_orders: Number(data.min_orders),
        max_orders: Number(data.max_orders),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sigments"] });
      toast({
        title: "Yangilandi",
        description: "Sigment muvaffaqiyatli yangilandi",
      });
      setIsOpen(false);
      reset();
    },
  });

  const onSubmit = (data: ISigmentsForm) => updateMutation(data);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Sigmentni tahrirlash</DialogTitle>
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
              className="w-full bg-[#F5F5F5] hover:bg-gray-100 text-black shadow-none"
            >
              Bekor qilish
            </Button>
            <Button
              type="submit"
              className="w-full hover:bg-green-600 bg-[#0EA60A]"
              disabled={isUpdating}
            >
              Yangilash
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SigmentsUpdateModal;
