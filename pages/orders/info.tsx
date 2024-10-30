import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Label } from "@/components/ui/Label"
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
    Ticket, Languages, MessageCircle,
    CreditCard
} from "lucide-react"
import { Layout } from "@/components/Layout"
import { useState } from "react"
import { request } from "@/lib/api"
import { useMutation, useQuery } from "@tanstack/react-query"
import { IFile, IOrder } from "@/lib/types"
import Link from "next/link"
import { format } from "date-fns"
import React from "react"
import { TaxiInfoCard } from "@/components/orders/taxiInfo"
import { splitToHundreds } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
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
} from "@/components/ui/alert-dialog"
import { acceptOrder, cancelOrder } from "@/lib/mutators"
import { queryClient } from "@/lib/query"
import { useToast } from "@/hooks/use-toast"




function UserInformationCard({ order, order: { user, comment } }: { order: IOrder }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Foydalanuvchi haqida ma&apos;lumot</CardTitle>
                <CardDescription>Buyurtmachi haqida ma&apos;lumotlar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                    <UserIcon className="h-4 w-4" />
                    <Label>Ismi:</Label>
                    <span>{user?.name ?? "Anonym foydalanuvchi"}</span>
                </div>

                <div className="flex items-center space-x-2">
                    <PhoneCallIcon className="h-4 w-4" />
                    <Label>Telefon raqamlari:</Label>
                    <Link href={`tel:${order.phone_number}`} className="text-blue-500 hover:text-blue-700">{order.phone_number} </Link>
                </div>


                {user && <div className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4" />
                    <Label>Telegram:</Label>

                    <Link href={`https://t.me/${user.username?.substring(1)}`} className="flex items-center text-blue-500 hover:text-blue-700">
                        {user.tg_name || user.name} <ExternalLink className="h-4 w-4 mr-1" />
                    </Link>

                </div>}

                {user && <div className="flex items-center space-x-2">
                    <Languages className="h-4 w-4" />
                    <Label>Tili:</Label>
                    <span>{user.lang}</span>
                </div>}


                <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4" />
                    <Label>Buyurtma yaratilgan vaqt:</Label>
                    <span>{order.order_time && format(new Date(order.order_time), "PPpp")}</span>
                </div>

                <div className="flex items-center space-x-2">
                    <Timer className="h-4 w-4" />
                    <Label>Buyurtma berilgan vaqt:</Label>
                    <span> {order.time ? format(new Date(order.time), "PPpp") : "Iloji boricha tezroq"} </span>
                </div>

                {comment && <div className="space-y-1">
                    <Label>Comment:</Label>
                    <p className="text-sm text-muted-foreground">{comment}</p>
                </div>}
            </CardContent>
        </Card>
    )
}

function OrderDetailsCard({ order }: { order: IOrder }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Buyurtma</CardTitle>
                <CardDescription>Buyurtma haqida ma&apos;lumotlar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Hash className="h-4 w-4" />
                    <Label>Buyrtma ID:</Label>
                    <Badge variant="outline">#{order.order_id}</Badge>
                </div>
                <div className="flex items-center space-x-2">
                    <Hash className="h-4 w-4" />
                    <Label>Iiko ID:</Label>
                    <Badge variant="outline">#{order.iiko_order_id}</Badge>
                </div>
                {
                    order.filial && <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <Label>Filial:</Label>
                        <Badge variant="outline">{order.filial.name_uz}</Badge>
                    </div>
                }
                <div className="flex items-center space-x-2">
                    <PackageIcon className="h-4 w-4" />
                    <Label>Mahsulotlar soni:</Label>
                    {/* <span>{order.items?.reduce((sum, product) => sum + product.count, 0)}</span> */}
                    <Badge variant="outline">{order.items?.reduce((sum, product) => sum + product.count, 0)}</Badge>
                </div>
                <div className="flex items-center space-x-2">
                    <CreditCardIcon className="h-4 w-4" />
                    <Label>Buyurtma narxi:</Label>
                    <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-green-600 bg-green-100">
                            {splitToHundreds(order.discount_price)} so&apos;m
                        </Badge>

                        {order.promocode && (
                            <>
                                <span className="text-sm text-muted-foreground line-through">{splitToHundreds(order.price)} so&apos;m  </span>
                                {[1, 2].map(() => <>&nbsp;</>)}
                                ({splitToHundreds(order.saving)} so&apos;m)
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <Label>To'lov turi:</Label>
                    {/* <span>{order.items?.reduce((sum, product) => sum + product.count, 0)}</span> */}
                    <Badge variant="outline">{order.payment?.provider && {
                        "CASH": "Naqd",
                        "PAYME": "Payme",
                        "CLICK": "Click"
                    }[order.payment?.provider]}</Badge>
                </div>





                {order.promocode && <div className="flex items-center space-x-2">
                    <Ticket className="h-4 w-4" />
                    <Label>Promokod:</Label>
                    <div className="text-sm">
                        <Badge variant="outline" className="mr-2">{order.promocode?.name_uz}</Badge>
                        <span>
                            {order.promocode?.amount}
                            {order.promocode?.measurement === "PERCENT" ? "% chegirma" : " so'm chegirma"}
                        </span>
                    </div>
                </div>}
                <div className="flex items-center space-x-2">
                    <Label>Holati:</Label>
                    <Badge variant="outline">{order.status}</Badge>
                </div>

                {order.location && <div className="flex space-x-2">
                    <Label>Joylashuv:</Label>
                    <p className="text-sm" >{order.location.address}</p>
                </div>}

            </CardContent>
        </Card>
    )
}

function ProductListCard({ order: { items: items } }: { order: IOrder }) {
    return (
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle>Mahsulotlar</CardTitle>
                <CardDescription>Buyurtma ichidagi mahsulotlar</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {items?.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                            {item.product?.image ? <Image src={(item?.product?.image as IFile).file} alt={item.product.name_uz} width={64} height={64} className="rounded-md" /> : <div className="w-16 h-16"></div>}

                            <div className="flex-1">
                                {item.product ? <Link href={`/products/info?id=${item.product.id}`} className="hover:underline"><h3 className="font-semibold">{item.product.name_uz}</h3></Link> : "Unknow product"}
                                <div className="text-sm text-muted-foreground">
                                    {splitToHundreds(item.price)} so&apos;m x {item.count}
                                </div>
                            </div>
                            <div className="font-semibold">
                                {splitToHundreds(item.price * item.count)} so&apos;m
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}





function ConfirmationButtons({ order }: { order: IOrder }) {

    const { toast } = useToast();

    const [openConfirm, setOpenConfirm] = useState(false);
    const [openCancel, setOpenCancel] = useState(false);



    const { mutate: cancel, isPending: cancelPending } = useMutation(
        {
            mutationFn: cancelOrder,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['orders', order.id] });
            },
            onError: () => {
                toast({
                    title: "Nimadur noto'g'ri ketdi.",
                    description: "Buyurtmani bekor qilishni iloji bo'lmadi. Tizimda hatolik."
                })
            }
        }
    )
    const { mutate: confirm, isPending: confirmPending } = useMutation(
        {
            mutationFn: acceptOrder,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['orders', order.id] });
            },
            onError: () => {
                toast({
                    title: "Nimadur noto'g'ri ketdi.",
                    description: "Buyurtmani tasdiqlashni iloji bo'lmadi. Tizimda hatolik."
                })
            }
        }
    )

    const handleConfirm = () => {

        confirm(order.id);
        setOpenConfirm(false);
    }

    const handleCancel = () => {
        cancel(order.id);
        setOpenCancel(false);
    }

    return (
        <div className="flex gap-2">
            <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
                <AlertDialogTrigger asChild>
                    <Button className="bg-green-500 hover:bg-green-600 text-white" disabled={confirmPending || order.status != "PENDING"}>
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
                        <AlertDialogCancel onClick={() => setOpenConfirm(false)}>Yo'q</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm}>Ha</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={openCancel} onOpenChange={setOpenCancel}>
                <AlertDialogTrigger asChild>
                    <Button className="bg-red-500 hover:bg-red-600 text-white" disabled={cancelPending || order.status != "PENDING"}>
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
                        <AlertDialogCancel onClick={() => setOpenCancel(false)}>Yo'q</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancel}>Ha</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}



function OrderInfo({ order }: { order: IOrder }) {


    if (!order) {
        return <div>Buyurtma topilmadi.</div>
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Buyurtma ma'lumotlari</h1>

                <ConfirmationButtons order={order} />



            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <UserInformationCard order={order} />
                <OrderDetailsCard order={order} />
                {
                    order.taxi && <TaxiInfoCard taxi={order.taxi} />
                }
                <ProductListCard order={order} />

            </div>
        </div>
    )
}

const getOrderIdFromUrl = (): string | null => {
    if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        const queryParams = new URLSearchParams(url.search)
        const id = queryParams.get('id')
        return id
    }
    return null
}

const fetchOrderInfo = async (id: string): Promise<IOrder> => {
    const { data } = await request.get(`orders/${id}`)
    return data
}

export default function Page() {
    const [orderId] = useState(getOrderIdFromUrl);

    const { data: order } = useQuery({
        queryKey: ['orders', orderId],
        queryFn: () => {
            if (orderId) {
                return fetchOrderInfo(orderId);
            }
            return Promise.reject(new Error("Promocode Id is null"));
        },
        enabled: !!orderId
    });

    return (
        <Layout page="orders">
            {order && <OrderInfo order={order} />}
        </Layout>
    )
}