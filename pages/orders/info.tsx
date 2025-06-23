import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import {
  CalendarIcon,
  CreditCardIcon,
  ExternalLink,
  PackageIcon,
  UserIcon,
  PhoneCallIcon,
  Timer,
  MapPin,
  Hash,
  Ticket,
  MessageCircle,
  CreditCard,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { useEffect, useState } from "react";
import { request } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IFile, IOrder } from "@/lib/types";
import Link from "next/link";
import { format } from "date-fns";
import React from "react";
import { TaxiInfoCard } from "@/components/orders/taxiInfo";
import { splitToHundreds } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { acceptOrder, cancelOrder } from "@/lib/mutators";
import { queryClient } from "@/lib/query";
import { useToast } from "@/hooks/use-toast";
import { statuses } from ".";
import { useCrumb } from "@/lib/context/crumb-provider";

function UserInformationCard({
  order,
  order: { user, comment },
}: {
  order: IOrder;
}) {
  return (
    <Card className="border-none shadow-none rounded-2xl">
      <CardHeader className="space-y-3">
        <CardTitle className="text-lg font-medium">
          Foydalanuvchi haqida ma&apos;lumot
        </CardTitle>
        <CardDescription className="text-sm text-[#A3A3A3]">
          Foydalanuvchuning muhim ma&apos;lumotlari
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center space-x-2 w-full justify-between">
          <div className="flex items-center text-[#A3A3A3] gap-2">
            <UserIcon className="h-5 w-5" />
            <Label className="font-normal">Foydalanuvchi:</Label>
          </div>
          <span className="font-medium text-sm">
            {user?.name ?? "Anonym foydalanuvchi"}
          </span>
        </div>

        <div className="flex items-center space-x-2 w-full justify-between">
          <div className="flex items-center text-[#A3A3A3] gap-2">
            <PhoneCallIcon className="h-4 w-4" />
            <Label className="font-normal">Telefon raqamlari:</Label>
          </div>
          <Link
            href={`tel:${order.phone_number}`}
            className="text-blue-500 hover:text-blue-700"
          >
            {order.phone_number}{" "}
          </Link>
        </div>

        {user && (
          <div className="flex items-center space-x-2 w-full justify-between">
            <div className="flex items-center text-[#A3A3A3] gap-2">
              <MessageCircle className="h-4 w-4" />
              <Label className="font-normal">Telegram:</Label>
            </div>
            <Link
              href={`https://t.me/${user.username?.replaceAll("@", "")}`}
              className="flex items-center text-blue-500 hover:text-blue-700 gap-2"
            >
              {user.tg_name || user.name}{" "}
              <ExternalLink className="h-4 w-4 mr-1" />
            </Link>
          </div>
        )}

        {/* {user && (
          <div className="flex items-center space-x-2">
            <Languages className="h-4 w-4" />
            <Label className="font-normal">Tili:</Label>
            <span>{user.lang}</span>
          </div>
        )} */}

        <div className="flex items-center space-x-2 w-full justify-between">
          <div className="flex items-center text-[#A3A3A3] gap-2">
            {" "}
            <CalendarIcon className="h-4 w-4" />
            <Label className="font-normal">Buyurtma yaratildi:</Label>
          </div>
          <span className="font-medium text-sm">
            {order.order_time && format(new Date(order.order_time), "PPpp")}
          </span>
        </div>

        <div className="flex items-center space-x-2 w-full justify-between">
          <div className="flex items-center text-[#A3A3A3] gap-2">
            {" "}
            <Timer className="h-4 w-4" />
            <Label className="font-normal">Yetkazib berish vaqti:</Label>
          </div>
          <span className="font-medium text-sm">
            {" "}
            {order.time
              ? format(new Date(order.time), "PPpp")
              : "Iloji boricha tezroq"}{" "}
          </span>
        </div>

        {comment && (
          <div className="space-y-1">
            <Label className="font-normal">Comment:</Label>
            <p className="text-sm text-muted-foreground">{comment}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function OrderDetailsCard({ order }: { order: IOrder }) {
  return (
    <Card className="border-none shadow-none rounded-2xl">
      <CardHeader className="space-y-3">
        <CardTitle className="text-lg font-medium">Buyurtma</CardTitle>
        <CardDescription className="text-sm text-[#A3A3A3]">
          Buyurtma haqida ma&apos;lumotlar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center space-x-2 w-full justify-between">
          <div className="flex items-center text-[#A3A3A3] gap-2">
            {" "}
            <Hash className="h-4 w-4" />
            <Label className="font-normal">Buyrtma ID:</Label>
          </div>
          <span className="font-medium text-sm">{order.order_id}</span>
        </div>
        {order.iiko_order_id && (
          <div className="flex items-center space-x-2 w-full justify-between">
            <div className="flex items-center text-[#A3A3A3] gap-2">
              {" "}
              <Hash className="h-4 w-4" />
              <Label className="font-normal">Iiko ID:</Label>
            </div>
            <span className="font-medium text-sm">{order.iiko_order_id}</span>
          </div>
        )}
        {order.filial && (
          <div className="flex items-center space-x-2 w-full justify-between">
            <div className="flex items-center text-[#A3A3A3] gap-2">
              {" "}
              <MapPin className="h-4 w-4" />
              <Label className="font-normal">Filial:</Label>
            </div>
            <span className="font-medium text-sm">{order.filial.name_uz}</span>
          </div>
        )}
        <div className="flex items-center space-x-2 w-full justify-between">
          <div className="flex items-center text-[#A3A3A3] gap-2">
            {" "}
            <PackageIcon className="h-4 w-4" />
            <Label className="font-normal">Mahsulotlar soni:</Label>
          </div>
          {/* <span>{order.items?.reduce((sum, product) => sum + product.count, 0)}</span> */}
          <span className="font-medium text-sm">
            {order.items?.reduce((sum, product) => sum + product.count, 0)}
          </span>
        </div>
        <div className="flex items-center space-x-2 w-full justify-between">
          <div className="flex items-center text-[#A3A3A3] gap-2">
            {" "}
            <PackageIcon className="h-4 w-4" />
            <Label className="font-normal">Buyurtma turi:</Label>
          </div>
          {/* <span>{order.items?.reduce((sum, product) => sum + product.count, 0)}</span> */}
          <span className="font-medium text-sm">
            {order?.delivery === "DELIVER" ? "Yetkazib berish" : "Olib ketish"}
          </span>
        </div>
        <div className="flex items-center space-x-2 w-full justify-between">
          <div className="flex items-center text-[#A3A3A3] gap-2">
            {" "}
            <CreditCardIcon className="h-4 w-4" />
            <Label className="font-normal">Buyurtma narxi:</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-green-600 bg-green-100">
              {splitToHundreds(order.discount_price)} so&apos;m
            </Badge>

            {order.promocode && (
              <>
                <span className="text-sm text-muted-foreground line-through">
                  {splitToHundreds(order.price)} so&apos;m{" "}
                </span>
                {[1, 2].map(() => (
                  <>&nbsp;</>
                ))}
                ({splitToHundreds(order.saving)} so&apos;m)
              </>
            )}
          </div>
        </div>

        {order?.delivery === "DELIVER" && (
          <div className="flex items-center space-x-2 w-full justify-between">
            <div className="flex items-center text-[#A3A3A3] gap-2">
              {" "}
              <CreditCardIcon className="h-4 w-4" />
              <Label className="font-normal">Yetkazish narxi:</Label>
            </div>
            {/* <span>{order.items?.reduce((sum, product) => sum + product.count, 0)}</span> */}
            <Badge variant="secondary" className="text-green-600 bg-green-100">
              {splitToHundreds(order.delivery_price)} so&apos;m
            </Badge>
          </div>
        )}

        <div className="flex items-center space-x-2 w-full justify-between">
          <div className="flex items-center text-[#A3A3A3] gap-2">
            {" "}
            <CreditCard className="h-4 w-4" />
            <Label className="font-normal">To'lov turi:</Label>
          </div>
          {/* <span>{order.items?.reduce((sum, product) => sum + product.count, 0)}</span> */}
          <span className="font-medium text-sm">
            {order.payment?.provider &&
              {
                CASH: "Naqd",
                PAYME: "Payme",
                CLICK: "Click",
              }[order.payment?.provider]}
          </span>
        </div>

        {order.promocode && (
          <div className="flex items-center space-x-2 w-full justify-between">
            <div className="flex items-center text-[#A3A3A3] gap-2">
              {" "}
              <Ticket className="h-4 w-4" />
              <Label className="font-normal">Promokod:</Label>
            </div>
            <div className="text-sm flex gap-2">
              <span className="font-medium text-sm">
                {order.promocode?.name_uz}
              </span>
              <span>
                {order.promocode?.amount}
                {order.promocode?.measurement === "PERCENT"
                  ? "% chegirma"
                  : " so'm chegirma"}
              </span>
            </div>
          </div>
        )}
        <div className="flex items-center space-x-2 w-full justify-between">
          <div className="flex items-center text-[#A3A3A3] gap-2">
            {" "}
            <Label className="font-normal">Holati:</Label>
          </div>
          <div
            className={`px-2 py-1 text-xs rounded-full text-white ${
              statuses.find((status) => status.value === order.status)?.color
            }`}
          >
            {statuses.find((s) => s.value === order.status)?.name}
          </div>
          {/* <Badge variant="outline">
            {order.status === "DONE"
              ? "Yakunlangan"
              : order.status === "PENDING_KITCHEN"
              ? "Tayyorlanishi kutilmoqda"
              : order.status === "PENDING"
              ? "Kutilmoqda"
              : order.status === "PREPARING"
              ? "Tayyorlanmoqda"
              : order.status === "DELIVERING"
              ? "Yetkazib berilmoqda"
              : order.status === "CANCELLED"
              ? "Bekor qilingan"
              : ""}
          </Badge> */}
        </div>

        {order.location && (
          <div className="flex space-x-2">
            <Label className="font-normal">Joylashuv:</Label>
            <p className="text-sm">{order.location.address}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProductListCard({ order: { items: items } }: { order: IOrder }) {
  const headers = ["MAHSULOT NOMI", "SONI", "NARX"];
  return (
    <Card className="md:col-span-2 border-none shadow-none rounded-2xl">
      <CardHeader>
        <CardTitle>Mahsulotlar</CardTitle>
        <CardDescription>Buyurtma ichidagi mahsulotlar</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`w-full grid grid-cols-5 `}>
          {headers.map((header, index) => (
            <span
              className={`text-sm text-[#A3A3A3] font-medium ${
                index === 0 ? "col-span-3" : ""
              }`}
              key={index}
            >
              {header}
            </span>
          ))}
        </div>
        <div className="flex items-center flex-col">
          {items?.map((item) => (
            <div
              key={item.id}
              className={`w-full grid grid-cols-5 items-center gap-2 py-2 border-b`}
            >
              <div className="col-span-3 flex items-center gap-2">
                {item.product?.image ? (
                  <Image
                    src={
                      (item?.product?.image as IFile).file ||
                      "/images/no_image.png"
                    }
                    alt={item.product.name_uz}
                    width={64}
                    height={64}
                    className="rounded-md w-[64px] h-[64px] object-cover"
                  />
                ) : (
                  <div className="w-16 h-16"></div>
                )}
                <div className="flex-1">
                  {item.product ? (
                    <Link
                      href={`/products/info?id=${item.product.id}`}
                      className="hover:underline"
                    >
                      <h3 className="font-semibold">{item.product.name_uz}</h3>
                    </Link>
                  ) : (
                    "Unknow product"
                  )}
                  <div className="text-sm text-muted-foreground">
                    {splitToHundreds(item.price)} so&apos;m x {item.count}
                  </div>
                </div>
              </div>

              <div className="font-semibold">
                x{splitToHundreds(item.count)}
              </div>
              <div className="font-semibold">
                {splitToHundreds(item.price * item.count)} so&apos;m
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ConfirmationButtons({ order }: { order: IOrder }) {
  const { toast } = useToast();

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);

  const { mutate: cancel, isPending: cancelPending } = useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", order.id] });
    },
    onError: () => {
      toast({
        title: "Nimadur noto'g'ri ketdi.",
        description:
          "Buyurtmani bekor qilishni iloji bo'lmadi. Tizimda xatolik.",
      });
    },
  });
  const { mutate: confirm, isPending: confirmPending } = useMutation({
    mutationFn: acceptOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", order.id] });
    },
    onError: () => {
      toast({
        title: "Nimadur noto'g'ri ketdi.",
        description: "Buyurtmani tasdiqlashni iloji bo'lmadi. Tizimda xatolik.",
      });
    },
  });

  const handleConfirm = () => {
    if (order?.status === "PENDING_PAYMENT") {
      toast({
        title: "Nimadur noto'g'ri ketdi.",
        description: "Buyurtmani tasdiqlash uchun to'lovni amalga oshiring!",
      });
    } else {
      confirm(order.id);
      setOpenConfirm(false);
    }
  };

  const handleCancel = () => {
    cancel(order.id);
    setOpenCancel(false);
  };

  return (
    <div className="flex gap-2">
      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogTrigger asChild>
          <Button
            className="bg-[#1AD012] hover:bg-green-600 h-[44px] rounded-[10px] text-white"
            disabled={confirmPending || !["PENDING"]?.includes(order.status)}
          >
            Tasdiqlash
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tasdiqlaysizmi?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu amalni bajarishni xohlayotganingizga ishonchingiz komilmi?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenConfirm(false)}>
              Yo'q
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Ha</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openCancel} onOpenChange={setOpenCancel}>
        <AlertDialogTrigger asChild>
          <Button
            className="bg-[#FF2735] h-[44px] rounded-[10px] hover:bg-red-600 text-white"
            disabled={
              cancelPending ||
              !["PENDING", "PENDING_PAYMENT"]?.includes(order.status)
            }
          >
            Bekor qilish
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bekor qilishni tasdiqlaysizmi?</AlertDialogTitle>
            <AlertDialogDescription>
              Haqiqatan ham bu amalni bekor qilmoqchimisiz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenCancel(false)}>
              Yo'q
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel}>Ha</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function OrderInfo({ order }: { order: IOrder }) {
  // if (!order) {
  //   return <div>Buyurtma topilmadi.</div>;
  // }

  return (
    <div className="mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Buyurtma ma'lumotlari</h1>

        <ConfirmationButtons order={order} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <UserInformationCard order={order} />
        <OrderDetailsCard order={order} />
        <ProductListCard order={order} />
        {order.taxi && <TaxiInfoCard order={order} />}
      </div>
    </div>
  );
}

const getOrderIdFromUrl = (): string | null => {
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    const queryParams = new URLSearchParams(url.search);
    const id = queryParams.get("id");
    return id;
  }
  return null;
};

const fetchOrderInfo = async (id: string): Promise<IOrder> => {
  const { data } = await request.get(`orders/${id}`);
  return data;
};

export default function Page() {
  const [orderId] = useState(getOrderIdFromUrl);

  const { setCrumb } = useCrumb();

  useEffect(() => {
    setCrumb([
      { label: "Buyurtmalar", path: "/orders" },
      { label: "Buyurtma ma'lumotlari", path: `/orders/info?id=${orderId}` },
    ]);
  }, [setCrumb, orderId]);

  const { data: order } = useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => {
      if (orderId) {
        return fetchOrderInfo(orderId);
      }
      return Promise.reject(new Error("Promocode Id is null"));
    },
    enabled: !!orderId,
  });

  return <Layout page="orders">{order && <OrderInfo order={order} />}</Layout>;
}
