import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { FileUploader } from "./post-uploader";

interface FormData {
  title: string;
  text: string;
  file: string;
}

export function PostForm() {
  const [open, setOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>();

  // Reset form on close
  React.useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const submitHandler = (data: FormData) => {
    console.log(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="flex items-center gap-2 justify-center button">
          <Plus /> Post qo’shish
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Post qo’shish</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div>
            <label className="text-sm mb-2 font-medium" htmlFor="title">
              Post sarlavhasi
            </label>
            <Input
              id="title"
              placeholder="Post sarlavhasi"
              className="input"
              {...register("title", { required: "Post sarlavhasi majburiy" })}
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm mb-2 font-medium" htmlFor="text">
              Post mazmuni
            </label>
            <Textarea
              id="text"
              placeholder="Post mazmuni"
              className="input resize-none min-h-24"
              {...register("text", { required: "Post mazmuni majburiy" })}
              rows={4}
            />
            {errors.text && (
              <p className="text-red-600 text-sm mt-1">{errors.text.message}</p>
            )}
          </div>

          <Controller
            control={control}
            name="file"
            render={({ field }) => <FileUploader {...field} />}
          />

          <DialogFooter className="flex w-full gap-2">
            <Button
              className="hover:bg-gray-200 w-full shadow-none text-black bg-[#F5F5F5] button"
              onClick={() => setOpen(false)}
            >
              Bekor qilish
            </Button>
            <Button className="hover:bg-green-600 bg-[#0EA60A] button w-full">
              Qo’shish
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
