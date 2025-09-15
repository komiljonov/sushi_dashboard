"use client";

import {  useState } from "react";
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
import { request } from "@/lib/api";
import { Plus } from "lucide-react";
import { queryClient } from "@/lib/query";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IAdmin, IAdminRole } from "@/lib/types";
import PasswordInput from "@/components/password-input";

interface CreateAdminData extends IAdmin {
  password: string;
  password_repeat: string;
}


const AddAdminModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    control,
  } = useForm<CreateAdminData>();

  const onSubmit = async (data: CreateAdminData) => {
    try {
      await request.post("admins/", {
        ...data,
        password_repeat: data.password,
      });
      queryClient.invalidateQueries({
        queryKey: ["admins"],
      });
      setIsOpen(false);
      reset();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="button">
          <Plus className="mr-2 w-4 h-4" /> Xodim qo'shish
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Xodim qo'shish</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="first_name">Ism</Label>
            <Input
              className="input"
              id="first_name"
              {...register("first_name", { required: "Ism kiritish shart" })}
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.first_name.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="last_name">Familya</Label>
            <Input
              className="input"
              id="last_name"
              {...register("last_name", {
                required: "Familya kiritish shart",
              })}
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.last_name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="username">Foydalanuvchi nomi</Label>
            <Input
              className="input"
              id="username"
              {...register("username", { required: "Username kiritish shart" })}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="role">Lavozim</Label>
            <Select
              onValueChange={(value) => setValue("role", value as IAdminRole)}
            >
              <SelectTrigger className="input h-[44px]">
                <SelectValue placeholder="Lavozimni tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="OPERATOR">Operator</SelectItem>
                <SelectItem value="CASHIER">Kassir</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Parol</Label>
            <Controller
              name="password"
              control={control}
              rules={{ required: "Parol kiritish shart" }}
              render={({ field }) => <PasswordInput id="password" {...field} />}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
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

export default AddAdminModal;