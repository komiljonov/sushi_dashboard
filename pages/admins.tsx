"use client";

import { Layout } from "@/components/Layout";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { request } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreVertical, Plus } from "lucide-react";
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

const fetchAdmins = async (): Promise<IAdmin[]> => {
  const { data } = await request.get("admins/");
  return data;
};

const AdminsTable = ({ admins }: { admins: IAdmin[] }) => (
  <div className="p-4 rounded-2xl bg-white">
    <Table>
      <TableHeader>
        <TableRow className="border-none h-[50px] bg-[#F5F5F5]">
          <TableHead className="rounded-l-xl ">Ismi</TableHead>
          <TableHead>Familyasi</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Lavozim</TableHead>
          <TableHead className="rounded-r-xl"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {admins?.map((admin) => (
          <TableRow key={admin.id}>
            <TableCell className="rounded-l-xl ">{admin.first_name}</TableCell>
            <TableCell>{admin.last_name}</TableCell>
            <TableCell>{admin.username}</TableCell>
            <TableCell>{admin.role}</TableCell>
            <TableCell className="rounded-r-xl">
              <UpdateAdminDialog admin={admin} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const CreateAdminDialog = () => {
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
      await request.post("admins/", {...data, password_repeat: data.password});
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

const DeleteConfirmationDialog = ({
  onConfirm,
  isOpen,
  setIsOpen,
}: {
  onConfirm: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => (
  <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogContent className="bg-white">
      <DialogHeader>
        <DialogTitle>
          Aniq bu foydalanuvchini o&apos;chirmoqchimisiz?
        </DialogTitle>
        <DialogDescription>
          Bu foydalanuvchini o&apos;chirgandan so&apos;ng qaytarib
          bo&apos;lmaydi
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button onClick={() => setIsOpen(false)}>Bekor qilish</Button>
        <Button
          variant="destructive"
          onClick={() => {
            onConfirm();
            setIsOpen(false);
          }}
        >
          O&apos;chirish
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const UpdateAdminDialog = ({ admin }: { admin: IAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
    control
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
    updateAdminMutation.mutate({...data, password_repeat: password});
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
            <DialogTitle>Update User</DialogTitle>
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
              render={({ field }) => <PasswordInput id="password" {...field} />}
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

const Admins: NextPage = () => {
  const { data: admins, isLoading } = useQuery({
    queryKey: ["admins"],
    queryFn: fetchAdmins,
  });

  if (isLoading || !admins) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Foydalanuvchilar</h1>
        <CreateAdminDialog />
      </div>
      <AdminsTable admins={admins} />
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="mx-auto">
    <div className="flex justify-between items-center mb-6">
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-10 w-40" />
    </div>
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="h-12 w-1/4" />
          <Skeleton className="h-12 w-1/4" />
          <Skeleton className="h-12 w-1/4" />
          <Skeleton className="h-12 w-1/4" />
        </div>
      ))}
    </div>
  </div>
);

const Page = () => {
  return (
    <Layout page={"admins"}>
      <Admins />
    </Layout>
  );
};

export default Page;
