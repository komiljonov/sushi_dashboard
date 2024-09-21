import Image from "next/image"
import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/Label"
import {
    CalendarIcon,
    CreditCardIcon,
    ExternalLink,
    PackageIcon,
    UserIcon,
    PhoneCallIcon
} from "lucide-react"
import { Layout } from "@/components/Layout"
import { useState } from "react"
import { request } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { IFile, IOrder } from "@/lib/types"
import Link from "next/link"
import { format } from "date-fns"



function UserInformationCard({ order: { user, comment } }: { order: IOrder }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Foydalanuvchi haqida ma&apos;lumot</CardTitle>
                <CardDescription>Buyurtmachi haqida ma&apos;lumotlar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                    <UserIcon className="h-4 w-4" />
                    <Label>Name:</Label>
                    <span>{user.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <PhoneCallIcon className="h-4 w-4" />
                    <Label>Phone:</Label>
                    <span>{user.number}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Label>Telegram:</Label>

                    <Link href={`https://t.me/${user.username.substring(1)}`} className="flex items-center text-blue-500 hover:text-blue-700">
                        {user.tg_name || user.name} <ExternalLink className="h-4 w-4 mr-1" />
                    </Link>

                </div>

                <div className="flex items-center space-x-2">
                    <Label>Language:</Label>
                    <span>{user.lang}</span>
                </div>
                <div className="space-y-1">
                    <Label>Comment:</Label>
                    <p className="text-sm text-muted-foreground">{comment}</p>
                </div>
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
                    <Label>Buyrtma ID:</Label>
                    <span>#{order.order_id}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4" />
                    <Label>Buyurtma berilgan vaqt:</Label>
                    <span>{order.order_time && format(new Date(order.order_time), "PPpp")}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <PackageIcon className="h-4 w-4" />
                    <Label>Mahsulotlar soni:</Label>
                    <span>{order.items?.reduce((sum, product) => sum + product.count, 0)}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <CreditCardIcon className="h-4 w-4" />
                    <Label>Narxi:</Label>
                    <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-green-600 bg-green-100">
                            {order.discount_price ? order.discount_price.toFixed(2) : order.price.toFixed(2)} so&apos;m
                        </Badge>
                        {order.discount_price && (
                            <>
                                <span className="text-sm text-muted-foreground line-through">{order.price.toFixed(2)} so&apos;m  </span>
                                {[1, 2].map(() => <>&nbsp;</>)}
                                ({order.saving} so&apos;m)
                            </>
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Label>Holati:</Label>
                    <Badge variant="outline">{order.status}</Badge>
                </div>

                {order.promocode && <div className="space-y-1">
                    <Label>Promokod:</Label>
                    <div className="text-sm">
                        <Badge variant="outline" className="mr-2">{order.promocode?.name}</Badge>
                        <span>
                            {order.promocode?.amount}
                            {order.promocode?.measurement === "PERCENT" ? "% off" : " so'm chegirma"}
                        </span>
                    </div>
                </div>}
            </CardContent>
        </Card>
    )
}

function ProductListCard({ order: { items: items } }: { order: IOrder }) {
    return (
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle>Product List</CardTitle>
                <CardDescription>Items included in this order</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {items?.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                            <Image src={(item?.product?.image as IFile).file} alt={item.product.name_uz} width={64} height={64} className="rounded-md" />
                            <div className="flex-1">
                                <h3 className="font-semibold">{item.product.name_uz}</h3>
                                <div className="text-sm text-muted-foreground">
                                    ${item.price.toFixed(2)} x {item.count}
                                </div>
                            </div>
                            <div className="font-semibold">
                                ${(item.price * item.count).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

// function SendMessageDialog({ onSendMessage }: { onSendMessage: (message: string) => void }) {
//     //   const [message, setMessage] = useState("")

//     const methods = useForm<{ message: string }>();

//     const handleSend = (message: string) => {
//         console.log(message);

//         onSendMessage(message);
//     }



//     const { getValues } = methods;



//     return (
//         <form onSubmit={(e) => {
//             e.preventDefault();
//         }} >


//             <Dialog>
//                 <DialogTrigger asChild>
//                     <Button>
//                         <MessageCircleIcon className="mr-2 h-4 w-4" />
//                         Send Message to User
//                     </Button>
//                 </DialogTrigger>
//                 <DialogContent className="sm:max-w-[425px] bg-white">
//                     <DialogHeader>
//                         <DialogTitle>Send Message to User</DialogTitle>
//                         <DialogDescription>
//                             Type your message below. It will be sent to the user&apos;s Telegram.
//                         </DialogDescription>
//                     </DialogHeader>
//                     <div className="grid gap-4 py-4">

//                         <FormProvider {...methods} >

//                             <FormattedInput id={"message"} label={"Habarni yozing."} placeholder="Habarni yozing" always_show_preview />

//                         </FormProvider>

//                     </div>
//                     <DialogFooter>
//                         <Button type="submit" onClick={() => {
//                             handleSend(getValues('message'));
//                         }}>Send Message</Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </form>
//     )
// }

// function ConfirmationDialog({
//     title,
//     description,
//     onConfirm,
// }: {
//     title: string
//     description: string
//     onConfirm: () => void
// }) {
//     return (
//         <Dialog>
//             <DialogTrigger asChild>
//                 <Button variant={title === "Accept Order" ? "default" : "outline"}>{title}</Button>
//             </DialogTrigger>
//             <DialogContent className="bg-white">
//                 <DialogHeader>
//                     <DialogTitle>{title}</DialogTitle>
//                     <DialogDescription>{description}</DialogDescription>
//                 </DialogHeader>
//                 <DialogFooter>
//                     <Button onClick={onConfirm}>{title}</Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     )
// }

function OrderInfo({ order }: { order: IOrder }) {
    // const handleSendMessage = (message: string) => {
    //     console.log("Sending message:", message)
    //     // Implement the actual message sending logic here
    // }

    // const handleAccept = () => {
    //     console.log("Order accepted")
    //     // Implement the order acceptance logic here
    // }

    // const handleCancel = () => {
    //     console.log("Order cancelled")
    //     // Implement the order cancellation logic here
    // }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Order Information</h1>
                {/* <SendMessageDialog onSendMessage={handleSendMessage} /> */}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <UserInformationCard order={order} />
                <OrderDetailsCard order={order} />
                <ProductListCard order={order} />
            </div>
            {/* <div className="mt-4 flex justify-end space-x-2">
                <ConfirmationDialog
                    title="Cancel Order"
                    description="Are you sure you want to cancel this order?"
                    onConfirm={handleCancel}
                />
                <ConfirmationDialog
                    title="Accept Order"
                    description="Are you sure you want to accept this order?"
                    onConfirm={handleAccept}
                />
            </div> */}
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
        queryKey: ['promocodes', orderId],
        queryFn: () => {
            if (orderId) {
                return fetchOrderInfo(orderId);
            }
            return Promise.reject(new Error("Promocode Id is null"));
        },
        enabled: !!orderId
    });




    return <Layout page="orders">
        {
            order && <OrderInfo order={order} />
        }

    </Layout>
}