"use client";

import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { TimeInput } from "../helpers/time-input";
import { Button } from "../ui/Button";
import Switch from "../helpers/switch";
import { FileUploader } from "./file-uploader";

const FormSchema = z.object({
  isEnabled: z.boolean(),
  offMessage: z.string().optional(),
  workStart: z.string(),
  workEnd: z.string(),
  outOfTimeMessage: z.string().optional(),
});

type FormData = z.infer<typeof FormSchema>;

export default function BotSozlamalari() {
  const { toast } = useToast();

  const form = useForm<FormData>({
    defaultValues: {
      isEnabled: true,
      offMessage: "Bot hozirda o‘chirib qo‘yilgan.",
      workStart: "08:00",
      workEnd: "18:00",
      outOfTimeMessage: "Ish vaqtimizdan tashqaridamiz.",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const isEnabled = watch("isEnabled");

  const onSubmit = (data: FormData) => {
    console.log("Saqlangan:", data);
    toast({ title: "Bot sozlamalari muvaffaqiyatli saqlandi!" });
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Bot Sozlamalari</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center justify-between">
            <Label>Bot yoqilgan</Label>
            <Switch
              checked={isEnabled}
              onChange={(val) => setValue("isEnabled", val)}
            />
          </div>

          {!isEnabled && (
            <div className="grid grid-cols-2 gap-4">
              <FileUploader
                label="Fayl yuklash"
                accept="image/*,.pdf,.docx"
                onSuccess={(fileId) => {
                  console.log("Yuklangan fayl ID:", fileId);
                  // Save to form, database, etc.
                }}
              />

              <div>
                <Label>Bot o‘chirilganda yuboriladigan xabar</Label>
                <Input className="input" {...register("offMessage")} />
                {errors.offMessage && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.offMessage.message}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Ish boshlanish vaqti</Label>
              <Controller
                control={form.control}
                name="workStart"
                render={({ field }) => <TimeInput {...field} />}
              />
            </div>
            <div>
              <Label>Ish tugash vaqti</Label>
              <Controller
                control={form.control}
                name="workEnd"
                render={({ field }) => <TimeInput {...field} />}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FileUploader
              label="Fayl yuklash"
              accept="image/*,.pdf,.docx"
              onSuccess={(fileId) => {
                console.log("Yuklangan fayl ID:", fileId);
                // Save to form, database, etc.
              }}
            />
            <div>
              <Label>Ish vaqtidan tashqari yuboriladigan xabar</Label>
              <Input className="input" {...register("outOfTimeMessage")} />
              {errors.outOfTimeMessage && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.outOfTimeMessage.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full hover:bg-green-600 bg-[#0EA60A] button"
          >
            Saqlash
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
