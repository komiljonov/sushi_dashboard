"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { request } from "@/lib/api";
import Link from "next/link";
import {
  CalendarIcon,
  CreditCardIcon,
  UserIcon,
  DollarSign,
  DownloadIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import {
  PromocodeForm,
  PromocodeFormOnSubmitProps,
} from "@/components/promocode/Form";
import { IPromocode } from "@/lib/types";

import PromocodeFormSkeleton from "@/components/promocode/Skeleton";
import { queryClient } from "@/lib/query";
import { splitToHundreds } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useCrumb } from "@/lib/context/crumb-provider";

const getCategoryIdFromUrl = (): string | null => {
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    const queryParams = new URLSearchParams(url.search);
    const id = queryParams.get("id");
    return id;
  }
  return null;
};

const fetchPromocodeInfo = async (id: string): Promise<IPromocode> => {
  const { data } = await request.get(`promocodes/${id}/`);
  return data;
};

const updatePromocode = async (promocode: IPromocode) => {
  const { end_date } = promocode;

  // Format end_date if it's a Date object, otherwise keep it as-is
  const formattedEndDate =
    end_date instanceof Date
      ? `${end_date.getFullYear()}-${String(end_date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(end_date.getDate()).padStart(2, "0")}`
      : undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload = promocode;
  if (formattedEndDate !== undefined) {
    payload.end_date = formattedEndDate;
  }

  const { data } = await request.put(`promocodes/${promocode.id}/`, payload);

  return data;
};

const downloadStatistics = async (promocodeId?: string) => {
  if (!promocodeId) return;

  const response = await request.get(`promocodes/${promocodeId}/xlsx/`, {
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "blob",
  });

  const blob = new Blob([response.data]);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = "statistika.xlsx";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
};

function EditPromocode() {
  const router = useRouter();

  const [promocodeId] = useState(getCategoryIdFromUrl);

  const { data: promocode, isLoading } = useQuery({
    queryKey: ["promocodes", promocodeId],
    queryFn: () => {
      if (promocodeId) {
        return fetchPromocodeInfo(promocodeId);
      }
      return Promise.reject(new Error("Promokod ID si null"));
    },
    enabled: !!promocodeId,
  });

  const mutation = useMutation({
    mutationFn: updatePromocode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promocodes"] });
      router.push("/promocodes");
    },
    onError: (error) => {
      console.error("Promokodni yangilashda xatolik:", error);
    },
  });

  const handleSave = (data: PromocodeFormOnSubmitProps) => {
    if (promocodeId) {
      mutation.mutate({
        ...data,
        id: promocodeId,
      });
    }
  };

  const { mutate: download } = useMutation({
    mutationFn: downloadStatistics,
    onError: (error) => {
      console.error("Faylni yuklab olishda xatolik yuz berdi:", error);
    },
  });

  if (!promocodeId) {
    return <div>Yuklanmoqda...</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-5">Promokodni tahrirlash</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Promokod tafsilotlari</CardTitle>
            <Button onClick={() => download(promocode?.id)}>
              <DownloadIcon className="h-4 w-4 mr-2" />
              Yuklab olish
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <PromocodeFormSkeleton />
            ) : (
              <PromocodeForm
                onSubmit={handleSave}
                defaultValues={promocode as Omit<IPromocode, "id">}
              />
            )}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Promokod statistikasi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border p-4 rounded-lg">
                    <h3 className="font-bold mb-2">Jami foydalanishlar</h3>
                    <p className="text-2xl font-bold">
                      {promocode?.orders?.length}
                    </p>
                  </div>
                  <div className="border p-4 rounded-lg">
                    <h3 className="font-bold mb-2">Jami tejamlar</h3>
                    <p className="text-2xl font-bold">
                      {promocode && splitToHundreds(promocode?.total_savings)}{" "}
                      so&apos;m
                    </p>
                  </div>
                  <div className="border p-4 rounded-lg">
                    <h3 className="font-bold mb-2">Ja'mi sotuv summasi</h3>
                    <p className="text-2xl font-bold">
                      {splitToHundreds(promocode?.total_sold)} so'm
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Bu promokoddan foydalangan foydalanuvchilar
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              {promocode?.orders.map((order) => (
                <div
                  key={order.order_id}
                  className="flex items-center space-x-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
                >
                  <div className="flex-1 space-y-1">
                    <Link
                      href={`/orders/info?id=${order.id}`}
                      className="font-semibold hover:underline"
                    >
                      {order.user ?? "Anonym foydalanuvchi"}
                    </Link>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <UserIcon className="mr-1 h-4 w-4" />
                      <span>{order.user ?? "Anonym foydalanuvchi"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="secondary"
                        className="text-green-600 bg-green-100"
                      >
                        {splitToHundreds(order.discount_price)} so&apos;m
                      </Badge>
                      <span className="text-sm text-muted-foreground line-through">
                        {order.price && splitToHundreds(order.price)} so&apos;m
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <CalendarIcon className="mr-1 h-4 w-4" />
                      <span>{order?.order_time}</span>
                    </div>
                    <Link
                      href={`/orders/info?id=${order.id}`}
                      className="flex items-center text-primary hover:underline"
                    >
                      <CreditCardIcon className="mr-1 h-4 w-4" />
                      <span>Buyurtma #{order.order_id}</span>
                    </Link>
                    <div className="flex items-center text-muted-foreground">
                      <DollarSign className="mr-1 h-4 w-4" />
                      <span>Tejaldi: {splitToHundreds(order.saving)} </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Page() {
  const { setCrumb } = useCrumb();

  useEffect(() => {
    setCrumb([
      { label: "Promokodlar", path: "/promocodes" },
      { label: "Promokodni tahrirlash", path: "/promocodes/edit" },
    ]);
  }, [setCrumb]);

  return (
    <Layout page={"promocodes"}>
      <EditPromocode />
    </Layout>
  );
}
