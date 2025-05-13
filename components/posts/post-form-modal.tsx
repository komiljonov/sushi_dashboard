"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";

export interface PostFormData {
  title: string;
  description: string;
  file?: FileList;
}
    
interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  initialData?: PostFormData | null;
  loading?: boolean;
}

export default function PostFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  loading,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<PostFormData>({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description || "",
      });
    } else {
      reset();
    }
  }, [initialData, reset]);

  const file = watch("file")?.[0];

  const submitHandler = (values: PostFormData) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    if (values.file?.[0]) {
      formData.append("file", values.file[0]);
    }
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Postni tahrirlash" : "Yangi post yaratish"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div>
            <Label>Sarlavha</Label>
            <Input
              {...register("title", { required: "Sarlavha majburiy" })}
              placeholder="Sarlavha"
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label>Tavsif</Label>
            <Textarea
              {...register("description")}
              placeholder="Post tavsifi (ixtiyoriy)"
            />
          </div>

          <div>
            <Label>Fayl (rasm, video yoki fayl)</Label>
            <Input
              type="file"
              accept="image/*,video/*,.pdf,.doc,.docx"
              {...register("file")}
            />
            {file && (
              <p className="text-sm text-muted-foreground mt-1">
                Tanlangan: <strong>{file.name}</strong>
              </p>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading
              ? initialData
                ? "Tahrirlanmoqda..."
                : "Yaratilmoqda..."
              : initialData
              ? "Tahrirlash"
              : "Yaratish"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
