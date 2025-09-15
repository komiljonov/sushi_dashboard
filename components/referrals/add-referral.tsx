"use client";

import {  useState } from "react";
import {  useForm } from "react-hook-form";
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
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export interface ReferralData{
  name: string;
  title: string;
}

const createReferral = async (payload: ReferralData) => {
  const { data } = await request.post("referrals", payload);
  return data;
};


const AddReferralModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReferralData>();

    const createMutation = useMutation({
    mutationFn: createReferral,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
      toast({
        title: "Muvaffaqiyat",
        description: "Referal havolasi muvaffaqiyatli yaratildi.",
      });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Referal havolasi yaratishda xatolik yuz berdi.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = async (data: ReferralData) => {
    createMutation.mutate({
        name: data.name,
        title: data.title,
    });
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
          <DialogTitle>Referal qo'shish</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Npmi</Label>
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
            <Label htmlFor="title">Sarlavhasi</Label>
            <Input
              className="input"
              id="title"
              {...register("title", {
                required: "Familya kiritish shart",
              })}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
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

export default AddReferralModal;

