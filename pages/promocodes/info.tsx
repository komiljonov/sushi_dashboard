'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { useQuery, useMutation } from "@tanstack/react-query"
import { request } from '@/lib/api'
import Link from "next/link"
import { CalendarIcon, CreditCardIcon, UserIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Layout } from "@/components/Layout"
import { PromocodeForm, PromocodeFormOnSubmitProps } from "@/components/promocode/Form"
import { IPromocode } from "@/lib/types"

import PromocodeFormSkeleton from "@/components/promocode/Skeleton"
import { queryClient } from "@/lib/query"

const getCategoryIdFromUrl = (): string | null => {
    if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        const queryParams = new URLSearchParams(url.search)
        const id = queryParams.get('id')
        return id
    }
    return null
}

const fetchPromocodeInfo = async (id: string): Promise<IPromocode> => {
    const { data } = await request.get(`promocodes/${id}/`)
    return data
}

const updatePromocode = async (promocode: IPromocode) => {
    const { end_date } = promocode;

    // Format end_date if it's a Date object, otherwise keep it as-is
    const formattedEndDate = end_date instanceof Date
        ? `${end_date.getFullYear()}-${String(end_date.getMonth() + 1).padStart(2, '0')}-${String(end_date.getDate()).padStart(2, '0')}`
        : undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = promocode;
    if (formattedEndDate !== undefined) {
        payload.end_date = formattedEndDate;
    }

    const { data } = await request.put(`promocodes/${promocode.id}/`, payload);

    return data;
}

function EditPromocode() {
    const router = useRouter();

    const [promocodeId] = useState(getCategoryIdFromUrl);

    const { data: promocode, isLoading } = useQuery({
        queryKey: ['promocodes', promocodeId],
        queryFn: () => {
            if (promocodeId) {
                return fetchPromocodeInfo(promocodeId);
            }
            return Promise.reject(new Error("Promokod ID si null"));
        },
        enabled: !!promocodeId
    });

    const mutation = useMutation({
        mutationFn: updatePromocode,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['promocodes'] });
            router.push("/promocodes");
        },
        onError: (error) => {
            console.error("Promokodni yangilashda xatolik:", error);
        }
    });

    const handleSave = (data: PromocodeFormOnSubmitProps) => {
        if (promocodeId) {
            mutation.mutate({
                ...data,
                id: promocodeId,
            });
        }
    }

    if (!promocodeId) {
        return <div>Yuklanmoqda...</div>
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Promokodni tahrirlash</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Promokod tafsilotlari</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <PromocodeFormSkeleton /> : <PromocodeForm
                            onSubmit={handleSave}
                            defaultValues={promocode as Omit<IPromocode, "id">}
                        />}
                    </CardContent>
                </Card>
                <Card className="w-full max-w-3xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Bu promokoddan foydalangan foydalanuvchilar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {promocode?.orders.map((order) => (
                                <div key={order.order_id} className="flex items-center space-x-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                                    <div className="flex-1 space-y-1">
                                        <Link href={`/users/info?id=${order.id}`} className="font-semibold hover:underline">
                                            {order.user.name || order.user.tg_name}
                                        </Link>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <UserIcon className="mr-1 h-4 w-4" />
                                            <span>{order.user.name || order.user.tg_name}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="secondary" className="text-green-600 bg-green-100">
                                                {order.discount_price} so&apos;m
                                            </Badge>
                                            <span className="text-sm text-muted-foreground line-through">
                                                ${order.price} so&apos;m
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex items-center text-muted-foreground">
                                            <CalendarIcon className="mr-1 h-4 w-4" />
                                            <span>{new Date().toLocaleDateString()}</span>
                                        </div>
                                        <Link href={`/orders/info?id=${order.id}`} className="flex items-center text-primary hover:underline">
                                            <CreditCardIcon className="mr-1 h-4 w-4" />
                                            <span>Buyurtma #{order.order_id}</span>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Promokod statistikasi</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border p-4 rounded-lg">
                            <h3 className="font-bold mb-2">Jami foydalanishlar</h3>
                            <p className="text-4xl font-bold">{promocode?.orders?.length}</p>
                        </div>
                        <div className="border p-4 rounded-lg">
                            <h3 className="font-bold mb-2">Jami tejamlar</h3>
                            <p className="text-4xl font-bold">5,678 so&apos;m</p>
                        </div>
                        <div className="border p-4 rounded-lg">
                            <h3 className="font-bold mb-2">O&apos;rtacha buyurtma qiymati</h3>
                            <p className="text-4xl font-bold">89,990 so&apos;m</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function Page() {
    return <Layout page={"promocodes"}>
        <EditPromocode />
    </Layout>
}