'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { request } from '@/lib/api'
import Link from "next/link"
import { CalendarIcon, CreditCardIcon, UserIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Layout } from "@/components/Layout"
import { PromocodeForm, PromocodeFormOnSubmitProps } from "@/components/promocode/Form"
import { IPromocode } from "@/lib/types"

import PromocodeFormSkeleton from "@/components/promocode/Skeleton"

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

    // Construct request payload conditionally
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = { ...promocode };
    if (formattedEndDate !== undefined) {
        payload.end_date = formattedEndDate;
    }

    const { data } = await request.put(`promocodes/${promocode.id}/`, payload);

    return data;
}

// const users = [
//     { id: 1, name: "Alice Johnson", avatar: "/placeholder.svg?height=40&width=40" },
//     { id: 2, name: "Bob Smith", avatar: "/placeholder.svg?height=40&width=40" },
//     { id: 3, name: "Carol Williams", avatar: "/placeholder.svg?height=40&width=40" },
// ]

function EditPromocode() {
    const router = useRouter();
    const queryClient = useQueryClient();




    const [promocodeId] = useState(getCategoryIdFromUrl);

    const { data: promocode, isLoading } = useQuery({
        queryKey: ['promocodes', promocodeId],
        queryFn: () => {
            if (promocodeId) {
                return fetchPromocodeInfo(promocodeId);
            }
            return Promise.reject(new Error("Promocode Id is null"));
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
            console.error("Error updating promocode:", error);
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

    // const memoizedUsers = useMemo(() => users, []);

    if (!promocodeId) {
        return <div>Loading...</div>
    }



    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Edit Promocode</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Promocode Details</CardTitle>
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
                        <CardTitle className="text-2xl font-bold">Users Who Used This Promocode</CardTitle>
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
                                            <span>Order #{order.order_id}</span>
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
                    <CardTitle>Promocode Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border p-4 rounded-lg">
                            <h3 className="font-bold mb-2">Total Uses</h3>
                            <p className="text-4xl font-bold">{promocode?.orders?.length}</p>
                        </div>
                        <div className="border p-4 rounded-lg">
                            <h3 className="font-bold mb-2">Total Savings</h3>
                            <p className="text-4xl font-bold">$5,678</p>
                        </div>
                        <div className="border p-4 rounded-lg">
                            <h3 className="font-bold mb-2">Average Order Value</h3>
                            <p className="text-4xl font-bold">$89.99</p>
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