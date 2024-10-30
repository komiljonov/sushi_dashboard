"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Badge } from "@/components/ui/badge"
import { Layout } from "@/components/Layout"
import { IOrder, IUser } from "@/lib/types"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { request } from '@/lib/api'
import Link from "next/link"
import { CalendarIcon, CreditCardIcon, DollarSign } from "lucide-react"
import { splitToHundreds } from "@/lib/utils"

const UserInfoCard = ({ user }: { user: IUser }) => (
  <Card>
    <CardHeader>
      <CardTitle>Foydalanuvchi ma&apos;lumotlari</CardTitle>
    </CardHeader>
    <CardContent>
      <form className="space-y-4">
        {[
          { label: "Ismi", value: user.name },
          { label: "Telefon raqami", value: user.number },
          { label: "Telegramdagi ismi", value: user.tg_name },
          { label: "Foydalanuvchi nomi", value: user.username },
          { label: "Tili", value: user.lang },
        ].map((field) => (
          <div key={field.label} className="space-y-2">
            <Label htmlFor={field.label}>{field.label}</Label>
            <Input id={field.label} value={field.value || ''} readOnly />
          </div>
        ))}
      </form>
    </CardContent>
  </Card>
)

const CurrentOrderCard = ({ order }: { order?: IOrder }) => (
  <Card>
    <CardHeader>
      <CardTitle>Joriy buyurtma</CardTitle>
    </CardHeader>
    <CardContent>
      {order ? (
        <div className="space-y-4">
          {[
            { label: "Buyurtma ID", value: order.id },
            { label: "Holati", value: <Badge>{order.status}</Badge> },
            { label: "Yaratilgan vaqti", value: String(order.order_time) },
            { label: "Yetkazib berish", value: order.delivery },
            { label: "To'lov usuli", value: order.payment?.provider },
            { label: "Miqdori", value: order.payment?.amount },
            {
              label: "To'lov holati", value: (
                <Badge variant={order.payment?.status === "completed" ? "default" : "destructive"}>
                  {order.payment?.status === "completed" ? "Bajarildi" : "Bajarilmadi"}
                </Badge>
              )
            },
          ].map((field) => (
            <div key={field.label} className="flex justify-between items-center">
              <span className="font-semibold">{field.label}:</span>
              <span>{field.value}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">Joriy buyurtma yo&apos;q</div>
      )}
    </CardContent>
  </Card>
)


const OrderItem = ({ order }: { order: IOrder }) => (
  <Card className="p-4 hover:shadow-md transition-shadow duration-200">
    <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 sm:space-x-4">
      <div className="space-y-2">
        <Link href={`/orders/info?id=${order.id}`} className="flex items-center text-primary hover:underline">
          <CreditCardIcon className="mr-1 h-4 w-4" />
          <span>Buyurtma #{order.order_id}</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-green-600 bg-green-100">
            {splitToHundreds(order.discount_price)} so'm
          </Badge>
          {order.promocode && (
            <span className="text-sm text-muted-foreground line-through">
              {splitToHundreds(order.price)} so'm
            </span>
          )}
        </div>

      </div>
      <div className="flex flex-col space-y-2 text-sm min-w-60">
        <div className="flex items-center text-muted-foreground">
          <CalendarIcon className="mr-1 h-4 w-4" />
          <span>{new Date(order.order_time).toLocaleDateString()}</span>
        </div>
        {order.promocode && <div className="flex items-center text-muted-foreground">
          <DollarSign className="mr-1 h-4 w-4" />
          <span>Tejaldi: {splitToHundreds(order.saving)} so'm</span>
        </div>}

      </div>
    </div>
  </Card>
)

const OrdersList = ({ orders }: { orders: IOrder[] }) => (
  <Card className="mt-8">
    <CardHeader>
      <CardTitle className="text-2xl font-bold">Foydalanuvchi buyurtmalari</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderItem key={order.order_id} order={order} />
        ))}
      </div>
    </CardContent>
  </Card>
)

function UserInfoPage({ user }: { user: IUser }) {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <UserInfoCard user={user} />
        <CurrentOrderCard order={user.current_order} />
      </div>
      <OrdersList orders={user.carts || []} />
    </div>
  )
}

const getUserIdFromUrl = (): string | null => {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href)
    const queryParams = new URLSearchParams(url.search)
    return queryParams.get('id')
  }
  return null
}

const fetchUserInfo = async (id: string): Promise<IUser> => {
  const { data } = await request.get(`users/${id}/`)
  return data
}

export default function Page() {
  const [userId] = useState(getUserIdFromUrl)

  const { data: user } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => {
      if (userId !== null) {
        return fetchUserInfo(userId)
      }
      return Promise.reject(new Error("foydalanuvchi id si null"))
    },
    refetchInterval: 30000
  })

  return (
    <Layout page="users">
      {user && <UserInfoPage user={user} />}
    </Layout>
  )
}