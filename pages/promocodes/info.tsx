'use client'

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { request } from '@/lib/api'
import { IPromocode } from "@/lib/types"
import Link from "next/link"
import { CalendarIcon, CreditCardIcon, UserIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Layout } from "@/components/Layout"
import { PromocodeForm, PromocodeFormOnSubmitProps } from "@/components/promocode/Form"

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
    const { data } = await request.put(`promocodes/${promocode.id}/`, promocode)
    return data
}

const users = [
    { id: 1, name: "Alice Johnson", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 2, name: "Bob Smith", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 3, name: "Carol Williams", avatar: "/placeholder.svg?height=40&width=40" },
]

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
                id: promocodeId
            });
        }
    }

    const memoizedUsers = useMemo(() => users, []);

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
                            {memoizedUsers.map((user) => (
                                <div key={user.id} className="flex items-center space-x-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                                    <div className="flex-1 space-y-1">
                                        <Link href={`/users/${user.id}`} className="font-semibold hover:underline">
                                            {user.name}
                                        </Link>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <UserIcon className="mr-1 h-4 w-4" />
                                            <span>User {user.id}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="secondary" className="text-green-600 bg-green-100">
                                                ${(Math.random() * 50 + 50).toFixed(2)}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground line-through">
                                                ${(Math.random() * 100 + 100).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex items-center text-muted-foreground">
                                            <CalendarIcon className="mr-1 h-4 w-4" />
                                            <span>{new Date().toLocaleDateString()}</span>
                                        </div>
                                        <Link href={`/orders/${user.id * 1000}`} className="flex items-center text-primary hover:underline">
                                            <CreditCardIcon className="mr-1 h-4 w-4" />
                                            <span>Order #{user.id * 1000}</span>
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
                            <p className="text-4xl font-bold">1,234</p>
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