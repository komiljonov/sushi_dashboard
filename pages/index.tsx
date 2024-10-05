"use client"

import { useState } from 'react'
import type { NextPage } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { ScrollArea } from "@/components/ui/scroll-area"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DollarSign, Users, ShoppingCart } from 'lucide-react'

import { Layout } from '@/components/Layout';
import { useQuery } from '@tanstack/react-query'
import { request } from "@/lib/api";
import { IOrder } from '@/lib/types'
import { Badge } from '@/components/ui/badge'





// const revenueData = [
//   { name: 'Mon', revenue: 2400 },
//   { name: 'Tue', revenue: 1398 },
//   { name: 'Wed', revenue: 9800 },
//   { name: 'Thu', revenue: 3908 },
//   { name: 'Fri', revenue: 4800 },
//   { name: 'Sat', revenue: 3800 },
//   { name: 'Sun', revenue: 4300 },
// ]

// const userActivityData = [
//   { name: 'Mon', active: 1000, new: 400 },
//   { name: 'Tue', active: 1200, new: 300 },
//   { name: 'Wed', active: 1500, new: 500 },
//   { name: 'Thu', active: 1300, new: 200 },
//   { name: 'Fri', active: 1400, new: 400 },
//   { name: 'Sat', active: 1100, new: 300 },
//   { name: 'Sun', active: 1000, new: 200 },
// ]



interface IStatistics {
  user_count: number,
  user_delta: number
  orders_count: number,
  orders_delta: number,
  today_revenue: number,
  revenue_delta: number,
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

  // These would typically come from your backend or state management
  // const userCount = 10567
  // const todayJoinedUsers = 123
  // const todayOrdersCount = 456
  // const todayRevenue = 78900
  // const conversionRate = 3.45
  // 
  // const orders = [
  //   { id: 1, customer: "John Doe", price: 150, discount_price: 125, status: "completed" },
  //   { id: 2, customer: "Jane Smith", price: 200, discount_price: null, status: "processing" },
  //   { id: 3, customer: "Bob Johnson", price: 100, discount_price: 75, status: "completed" },
  //   { id: 4, customer: "Alice Brown", price: 150, discount_price: null, status: "processing" },
  //   { id: 5, customer: "Charlie Davis", price: 120, discount_price: 100, status: "completed" },
  // ]

  // const trendingProducts = [
  //   { id: 1, name: "Wireless Earbuds", price: 99, sales: 1234, visits: 5000, trend: "up" },
  //   { id: 2, name: "Smart Watch", price: 199, sales: 987, visits: 4500, trend: "down" },
  //   { id: 3, name: "Fitness Tracker", price: 79, sales: 879, visits: 3800, trend: "up" },
  //   { id: 4, name: "Bluetooth Speaker", price: 59, sales: 765, visits: 3200, trend: "up" },
  //   { id: 5, name: "Noise-Cancelling Headphones", price: 299, sales: 654, visits: 2800, trend: "down" },
  // ]

  // const sortedProducts = [...trendingProducts].sort((a, b) => {
  //   if (productSort === 'price') return b.price - a.price
  //   if (productSort === 'sales') return b.sales - a.sales
  //   if (productSort === 'visits') return b.visits - a.visits
  //   return 0
  // })





  const { data: statistics } = useQuery({
    queryKey: ['users'],
    queryFn: fetchStatistics,
    refetchInterval: 60000
  })






  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        {/* <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select> */}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.user_count.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{statistics?.user_delta} today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.orders_count}</div>
            <p className="text-xs text-muted-foreground">+2.5% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${statistics?.orders_delta.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+18.1% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">User Activity</TabsTrigger>
        </TabsList> */}
      {/* <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent> */}
      {/* <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="active" stroke="#8884d8" />
                  <Line type="monotone" dataKey="new" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent> */}
      {/* </Tabs> */}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {statistics?.recent_orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium leading-none">{order.user.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-green-600 bg-green-100">
                        ${order.discount_price ? order.discount_price.toFixed(2) : order.price?.toFixed(2)}
                      </Badge>

                      {order.promocode && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${order.saving?.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                    {order.status}
                  </Badge>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Trending Products</CardTitle>
            <Select value={productSort} onValueChange={setProductSort}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="visits">Visits</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {/* {sortedProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={`/placeholder.svg?text=${product.name.charAt(0)}`} />
                      <AvatarFallback>{product.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{product.name}</p>
                      <p className="text-sm text-muted-foreground">${product.price} | {product.sales} sales | {product.visits} visits</p>
                    </div>
                  </div>
                  {product.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                </div>
              ))} */}
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