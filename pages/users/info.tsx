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
import Link from "next/link"
import { CalendarIcon, CreditCardIcon, UserIcon } from "lucide-react"

function UserInfoPage({ user }: { user: IUser }) {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left side: User Info */}
        <Card>
          <CardHeader>
            <CardTitle>Foydalanuvchi ma&apos;lumotlari</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ismi</Label>
                <Input id="name" value={user.name} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="number">Telefon raqami</Label>
                <Input id="number" value={user.number} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tg_name">Telegramdagi ismi</Label>
                <Input id="tg_name" value={user.tg_name} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Foydalanuvchi nomi</Label>
                <Input id="username" value={user.username} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lang">Tili</Label>
                <Input id="lang" value={user.lang} readOnly />
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Right side: Current Order Info */}
        <Card>
          <CardHeader>
            <CardTitle>Joriy buyurtma</CardTitle>
          </CardHeader>
          <CardContent>
            {user.current_order ? (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Buyurtma ID:</span>
                  <span>{user.current_order?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Holati:</span>
                  <Badge>{user.current_order?.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Yaratilgan vaqti:</span>
                  <span>{String(user.current_order?.order_time)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Yetkazib berish:</span>
                  <span>{user.current_order?.delivery}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">To&apos;lov usuli:</span>
                  <span>{user.current_order?.payment?.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Miqdori:</span>
                  <span>{user.current_order?.payment?.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">To&apos;lov holati:</span>
                  <Badge variant={user.current_order.payment?.status === "completed" ? "default" : "destructive"}>
                    {user.current_order?.payment?.status === "completed" ? "Bajarildi" : "Bajarilmadi"}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">Joriy buyurtma yo&apos;q</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom: Tab Switch Component */}
      <Card className="mt-4">
        <CardContent>
          <Tabs defaultValue="order-history">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="order-history">Buyurtmalar tarixi</TabsTrigger>
              <TabsTrigger value="used-coupons">Ishlatilgan kuponlar</TabsTrigger>
            </TabsList>
            <TabsContent value="order-history">
              {user?.carts?.map((order) => (
                <div key={order.order_id} className="flex items-center space-x-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex-1 space-y-1">
                    <Link href={`/users/info?id=${order.id}`} className="font-semibold hover:underline">
                      {user?.name || user?.tg_name}
                    </Link>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <UserIcon className="mr-1 h-4 w-4" />
                      <span>{user?.name || user?.tg_name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-green-600 bg-green-100">
                        {order.discount_price} so&apos;m
                      </Badge>
                      <span className="text-sm text-muted-foreground line-through">
                        {order.price} so&apos;m
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
            </TabsContent>
            <TabsContent value="used-coupons">
              <div className="p-4 text-center text-muted-foreground">Ishlatilgan kuponlar ma&apos;lumoti</div>
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
      return Promise.reject(new Error("foydalanuvchi id si null"));
    },
    refetchInterval: 30000
  })

  return <Layout page="users">
    {
      user && <UserInfoPage user={user} />
    }
  </Layout>
}