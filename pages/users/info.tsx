import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Layout } from "@/components/Layout"
import { IUser } from "@/lib/types"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { request } from '@/lib/api';


// interface IUser {
//     id: string;
//     name: string;
//     number: string;
//     tg_name: string;
//     username: string;
//     lang: string;
//     has_order: boolean;
//     current_order?: {
//         id: string;
//         status: string;
//         created_at: string;
//         delivery: string;
//         payment: {
//             provider: string;
//             amount: string;
//             status: string;
//         };
//     };
// }

function UserInfoPage({ user }: { user: IUser }) {


    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left side: User Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>User Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={user.name} readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="number">Phone Number</Label>
                                <Input id="number" value={user.number} readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tg_name">Telegram Name</Label>
                                <Input id="tg_name" value={user.tg_name} readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" value={user.username} readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lang">Language</Label>
                                <Input id="lang" value={user.lang} readOnly />
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Right side: Current Order Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Current Order</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {user.current_order ? (
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="font-semibold">Order ID:</span>
                                    <span>{user.current_order.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Status:</span>
                                    <Badge>{user.current_order.status}</Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Created At:</span>
                                    <span>{String(user.current_order.order_time)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Delivery:</span>
                                    <span>{user.current_order.delivery}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Payment Provider:</span>
                                    <span>{user.current_order.payment.provider}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Amount:</span>
                                    <span>{user.current_order.payment.amount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Payment Status:</span>
                                    <Badge variant={user.current_order.payment.status === "completed" ? "default" : "destructive"}>
                                        {user.current_order.payment.status}
                                    </Badge>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground">No current order</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Bottom: Tab Switch Component */}
            <Card className="mt-4">
                <CardContent>
                    <Tabs defaultValue="order-history">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="order-history">Order History</TabsTrigger>
                            <TabsTrigger value="used-coupons">Used Coupons</TabsTrigger>
                        </TabsList>
                        <TabsContent value="order-history">
                            {/* Order History content will go here */}
                            <div className="p-4 text-center text-muted-foreground">Order History Content</div>
                        </TabsContent>
                        <TabsContent value="used-coupons">
                            {/* Used Coupons content will go here */}
                            <div className="p-4 text-center text-muted-foreground">Used Coupons Content</div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}


const getUserIdFromUrl = (): string | null => {
    if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        const queryParams = new URLSearchParams(url.search)
        const id = queryParams.get('id')
        return id
    }
    return null
}


const fetchUserInfo = async (id: string): Promise<IUser> => {
    const { data } = await request.get(`users/${id}/`)
    return data
}


export default function Page() {

    const [userId] = useState(getUserIdFromUrl);



    const { data: user } = useQuery({
        queryKey: ['users', userId],
        queryFn: () => {
            if (userId !== null) {
                return fetchUserInfo(userId);
            }
            return Promise.reject(new Error("user id is null"));
        }
    })



    return <Layout page="users">
        {
            user && <UserInfoPage user={user} />
        }

    </Layout>
}