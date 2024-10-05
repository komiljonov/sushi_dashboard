"use client"

import { useState } from 'react'
import type { NextPage } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, Users, ShoppingCart } from 'lucide-react'

import { Layout } from '@/components/Layout';
import { useQuery } from '@tanstack/react-query'
import { request } from "@/lib/api";
import { IOrder } from '@/lib/types'
import { Badge } from '@/components/ui/badge'

interface IStatistics {
  user_count: number,
  user_delta: number
  orders_count: number,
  orders_delta: number,
  today_revenue: number,
  revenue_delta_percent: number,
  active_users: number,
  active_users_delta: number
  recent_orders: IOrder[]
}

const fetchStatistics = async (): Promise<IStatistics> => {
  const { data } = await request.get('statistics');
  return data;
}

function EnhancedAnalyticsDashboard() {
  const [productSort, setProductSort] = useState('sales')

  const { data: statistics } = useQuery({
    queryKey: ['users'],
    queryFn: fetchStatistics,
    refetchInterval: 60000
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tahliliy panel</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami foydalanuvchilar</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.user_count.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Bugun +{statistics?.user_delta}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bugungi buyurtmalar</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.orders_count}</div>
            <p className="text-xs text-muted-foreground">Kechagidan +{statistics?.orders_delta}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bugungi daromad</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.today_revenue.toLocaleString()} so&apos;m</div>
            <p className="text-xs text-muted-foreground">Kechagidan {statistics?.revenue_delta_percent}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>So&apos;nggi buyurtmalar</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {statistics?.recent_orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium leading-none">{order.user.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-green-600 bg-green-100">
                        {order.discount_price ? order.discount_price.toFixed(2) : order.price?.toFixed(2)} so&apos;m
                      </Badge>

                      {order.promocode && (
                        <span className="text-sm text-muted-foreground line-through">
                          {order.saving?.toFixed(2)} so&apos;m
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                    {order.status === 'completed' ? 'Bajarildi' : 'Jarayonda'}
                  </Badge>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Trend mahsulotlar</CardTitle>
            <Select value={productSort} onValueChange={setProductSort}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Saralash" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Sotuvlar</SelectItem>
                <SelectItem value="price">Narx</SelectItem>
                <SelectItem value="visits">Tashriflar</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {/* Trend mahsulotlar ro'yxati bu yerda bo'ladi */}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const Home: NextPage = () => {
  return <Layout page='home'>
    <EnhancedAnalyticsDashboard />
  </Layout>
}

export default Home;