"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card";
import { useToast } from "@/hooks/use-toast";

type FormData = {
  radius: string;
};

export function MapRadiusSettings() {
    const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      radius: "1000",
    },
  });

  const onSubmit = (data: FormData) => {
    const radius = Number(data.radius);
    if (isNaN(radius) || radius <= 0) {
      toast({
        title: "Xatolik",
        description: "Radius musbat son bo'lishi kerak",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Radius saqlandi",
      description: `Tanlangan radius: ${radius} metr`,
    });

    console.log("Saved radius:", radius);
  };

  return (
    <Card >
      <CardHeader>
        <CardTitle>Xarita radiusi</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="radius">Radius (metr)</Label>
            <Input
              id="radius"
              type="number"
              min={1}
              step={10}
              {...register("radius", { required: "Radius majburiy" })}
              placeholder="Masalan: 1000"
            />
            {errors.radius && (
              <p className="text-sm text-red-500 mt-1">
                {errors.radius.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#0EA60A] hover:bg-green-600"
          >
            Saqlash
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
