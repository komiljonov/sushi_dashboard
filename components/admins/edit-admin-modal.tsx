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
import { request } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { MoreVertical } from "lucide-react";
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
import DeleteConfirmationDialog from "./delete-admin-modal";


interface CreateAdminData extends IAdmin {
  password: string;
  password_repeat: string;
}



const UpdateAdminModal = ({ admin }: { admin: IAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm<CreateAdminData>();

  useEffect(() => {
    reset({
      first_name: admin.first_name,
      last_name: admin.last_name,
      username: admin.username,
      role: admin.role,
    });
  }, [admin, reset]);

  const updateAdminMutation = useMutation({
    mutationFn: (data: CreateAdminData) =>
      request.put(`admins/${admin.id}/`, data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["admins"] });
      setIsOpen(false);
      reset();
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });

  const deleteAdminMutation = useMutation({
    mutationFn: () => request.delete(`admins/${admin.id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admins"],
      });
      setIsOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
    },
  });

  const onSubmit = (data: CreateAdminData) => {
    updateAdminMutation.mutate({ ...data, password_repeat: password });
  };

  const onDelete = () => {
    deleteAdminMutation.mutate();
  };

  const password = watch("password");

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <span className="sr-only">Menyuni ochish</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Xodimni tahrirlash</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="first_name">Ism</Label>
              <Input
                className="input"
                id="first_name"
                {...register("first_name", {
                  required: "Ism kiritish shart",
                })}
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
              <Label htmlFor="username">Username</Label>
              <Input
                className="input"
                id="username"
                {...register("username", {
                  required: "Username kiritish shart",
                })}
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
                defaultValue={admin.role}
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
                <p className="text-red-500 text-sm mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Parol</Label>
              <Controller
                name="password"
                control={control}
                rules={{ required: "Parol kiritish shart" }}
                render={({ field }) => (
                  <PasswordInput id="password" {...field} />
                )}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex justify-between gap-2">
              <Button
                variant="destructive"
                className="w-full  button  shadow-none"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                O&apos;chirish
              </Button>
              <Button
                type="submit"
                className="w-full hover:bg-green-600 bg-[#0EA60A] button"
              >
                Saqlash
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <DeleteConfirmationDialog
        onConfirm={onDelete}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
      />
    </>
  );
};


export default UpdateAdminModal;