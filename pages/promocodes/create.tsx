import CommaInput from "@/components/helpers/number-input";
import SelectSingleDate from "@/components/helpers/selecte-single-date";
import { Layout } from "@/components/Layout";
import LinkProduct from "@/components/promocode/LinkProduct";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createPromocode } from "@/lib/actions/promocodes.action";
import { useCrumb } from "@/lib/context/crumb-provider";
import { ICreatePromocode } from "@/lib/types/promocode.types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import {
  Controller,
  FieldErrors,
  FieldValues,
  FormProvider,
  useForm,
} from "react-hook-form";

const CreatePromocodePage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const methods = useForm<ICreatePromocode>({
    defaultValues: {
      name_uz: "",
      name_ru: "",
      code: "",
      measurement: "ABSOLUTE",
      amount: 0,
      is_active: true,
      count: 0,
      min_amount: 0,
      end_date: new Date(),
      promocode_products: [],
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createPromocode,
    onSuccess: () => {
      toast({
        title: "Muvaffaqiyatli",
        description: "Yangi promokod muvaffaqiyatli yaratildi",
      });
      router.push("/promocodes");
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Promokod yaratishda xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const onError = (errors: FieldErrors<FieldValues>) => {
    if (Object.keys(errors).length > 0) {
      toast({
        title: "Xatolik",
        description: "Barcha majburiy maydonlarni to‘ldiring",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: ICreatePromocode) => {
    mutate({ ...data, is_active: true });
  };

  const measurement = watch("measurement");

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl">
        <h1 className="text-2xl font-bold mb-10 text-center">Yangi promokod</h1>

        <div className="flex items-center gap-4">
          <Button
            type="button"
            className="button bg-[#F0F0F0]"
            onClick={() => {
              reset();
              router.push("/promocodes");
            }}
            variant="ghost"
          >
            Bekor qilish
          </Button>
          <Button className="button" type="submit" disabled={isPending}>
            Qo'shish
          </Button>
        </div>
      </div>

      <FormProvider {...methods}>
        <div className="bg-white p-4 rounded-xl flex items-center justify-center">
          <div className="flex flex-col gap-4 min-w-[400px]">
            <div className="space-y-2 ">
              <Label htmlFor="name_uz">Promokod nomi(uz)</Label>
              <Input
                id="name_uz"
                className="input h-[44px]"
                {...register("name_uz", {
                  required: "Promokod nomini(uz) kiritish majburiy",
                })}
                placeholder="Promokod nomini kiriting (uz)"
              />
              {errors.name_uz && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name_uz.message}
                </p>
              )}
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="name_ru">Promokod nomi(ru)</Label>
              <Input
                id="name_ru"
                className="input h-[44px]"
                {...register("name_ru", {
                  required: "Promokod nomini(ru) kiritish majburiy",
                })}
                placeholder="Promokod nomini kiriting (ru)"
              />
              {errors.name_ru && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name_ru.message}
                </p>
              )}
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="code">Kod</Label>
              <Input
                id="code"
                className="input h-[44px]"
                {...register("code", {
                  required: "Kodni kiritish majburiy",
                })}
                placeholder="Kodni kiriting"
              />
              {errors.code && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.code.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="measurement">Promokod turi</Label>
              <Select
                value={methods.watch("measurement")}
                onValueChange={(value) => setValue("measurement", value)}
              >
                <SelectTrigger className="input h-[44px]">
                  <SelectValue placeholder="Promokod turini tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ABSOLUTE">Absolut</SelectItem>
                  <SelectItem value="PERCENT">Foiz</SelectItem>
                </SelectContent>
              </Select>
              {errors.measurement && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.measurement.message}
                </p>
              )}
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="amount">
                {measurement === "ABSOLUTE" ? "Narxi" : "Foiz"}
              </Label>
              <Controller
                name="amount"
                control={control}
                rules={{
                  required: "Promokod narxi kiritish majburiy",
                  min: {
                    value: 1,
                    message: "Narxi 0 dan katta bo‘lishi kerak",
                  },
                }}
                render={({ field }) => (
                  <CommaInput
                    {...field}
                    placeholder="0"
                    maxLength={measurement === "PERCENT" ? 3 : undefined}
                    onChange={(value) => {
                      // allow empty while editing
                      if (value === "" || value == null) {
                        field.onChange("");
                        return;
                      }
                      const n = Number(value);
                      if (Number.isNaN(n)) return; // ignore invalid

                      if (measurement === "PERCENT") {
                        const next = Math.min(n, 100); // hard cap while typing
                        field.onChange(next);
                        setValue("amount", next, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      } else {
                        field.onChange(n);
                        setValue("amount", n, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }
                    }}
                  />
                )}
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="count">Soni</Label>
              <Input
                id="count"
                className="input h-[44px]"
                type="number"
                {...register("count", {
                  required: "Promokod sonini kiritish majburiy",
                  min: {
                    value: 1,
                    message: "Sonni 0 dan katta bo‘lishi kerak",
                  },
                })}
                placeholder="0"
              />
              {errors.count && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.count.message}
                </p>
              )}
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="min_amount">Minimal buyurtma narxi</Label>
              <Controller
                name="min_amount"
                control={control}
                rules={{
                  required: "Promokod minimal narxini kiritish majburiy",
                  min: {
                    value: 1,
                    message: "Minimal narxi 0 dan katta bo‘lishi kerak",
                  },
                }}
                render={({ field }) => (
                  <CommaInput {...field} placeholder={"0"} />
                )}
              />
              {errors.min_amount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.min_amount.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">Amal qilish muddati</Label>

              <Controller
                name="end_date"
                control={control}
                render={({ field }) => (
                  <SelectSingleDate {...field} minDate={true} />
                )}
              />
            </div>

            <LinkProduct
              setPromocodeProducts={(products) =>
                setValue("promocode_products", products)
              }
            />
          </div>
        </div>
      </FormProvider>
    </form>
  );
};

export default function Page() {
  const { setCrumb } = useCrumb();

  useEffect(() => {
    setCrumb([
      { label: "Promokodlar", path: "/promocodes" },
      { label: "Promokod yaratish", path: "/promocodes/create" },
    ]);
  }, [setCrumb]);

  return (
    <Layout page="promocodes">
      <CreatePromocodePage />
    </Layout>
  );
}
