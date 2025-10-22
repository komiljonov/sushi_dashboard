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

interface SigmentsForm {
  name: string;
  count: string;
  range_start: string;
  range_end: string;
}

const SigmentsModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SigmentsForm>();

  const onSubmit = (data: SigmentsForm) => {
    console.log(data);
    
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
              className="input"
              id="name"
              {...register("name", { required: "Ism kiritish shart" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="count">Oxirgi nechi kun</Label>
            <Input
              className="input"
              id="count"
              {...register("count", {
                required: "Familya kiritish shart",
              })}
            />
            {errors.count && (
              <p className="text-red-500 text-sm mt-1">
                {errors.count.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="username">Foydalanuvchilar dan</Label>
            <Controller
              name="range_start"
              control={control}
              rules={{ required: "Miqdor kiritilishi shart" }}
              render={({ field }) => <CommaInput {...field} />}
            />
            {errors.range_start && (
              <p className="text-red-500 text-sm mt-1">
                {errors.range_start.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="username">Foydalanuvchilar gacha</Label>
            <Controller
              name="range_end"
              control={control}
              rules={{ required: "Miqdor kiritilishi shart" }}
              render={({ field }) => <CommaInput {...field} />}
            />
            {errors.range_end && (
              <p className="text-red-500 text-sm mt-1">
                {errors.range_end.message}
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
            >
              Qo&apos;shish
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SigmentsModal;
