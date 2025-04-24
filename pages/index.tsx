"use client";

import type { NextPage } from "next";
import { Layout } from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { request } from "@/lib/api";
import { DashboardData, IMainAnalytics } from "@/lib/types";
import StatisticsModal from "@/components/statistics";
import OrderStatsCard from "@/components/stats/order-stats-card";
import {
  AllOrders,
  OrdersThisMonth,
  OrdersToday,
  ProfitMonth,
} from "@/lib/icons";
import BranchsChart from "@/components/stats/branchs-chart";
import DailyOrdersChart from "@/components/stats/daily-orders-chart";
import MonthlyOrdersChart from "@/components/stats/monthly-orders-chart";
import { fetchDateAnalytics } from "@/lib/fetchers";
import AdminPanelSkeleton from "@/components/stats/stats-skeleton";
import { useDateFilterStore } from "@/lib/context/date-store";
import SelectCoupleDate from "@/components/date-range/select-date-range";

const fetchStatistics = async (start_date: string, end_date: string): Promise<DashboardData> => {
  const { data } = await request.get(`statistics?start_date=${start_date}&end_date=${end_date}`);
  return data;
};

function EnhancedAnalyticsDashboard() {

  const {start_date, end_date} = useDateFilterStore();

  const { data: statistics, isLoading: statsLoading, isError: statsError } = useQuery({
    queryKey: ["statistics"],
    queryFn: ()=> fetchStatistics(start_date, end_date),
    refetchInterval: 60000,
  });

  const {
    data: analytics,
    isLoading,
    isError,
  } = useQuery<IMainAnalytics>({
    queryKey: ["date_analytics"],
    queryFn: ()=> fetchDateAnalytics(start_date, end_date),
  });

  const bot1 = statistics?.bot_orders?.find((bot) => bot.bot === "BOT1");
  const bot2 = statistics?.bot_orders?.find((bot) => bot.bot === "BOT2");

  const orderStats = [
    {
      title: "Jami buyurtmalar soni",
      count: statistics?.all_orders || 0,
      bot1: bot1?.order_count || 0,
      bot2: bot2?.order_count || 0,
      icon: AllOrders,
    },
    {
      title: "Jami daromad",
      count: statistics?.this_month_revenue || 0,
      bot1: bot1?.this_month_revenue || 0,
      bot2: bot2?.this_month_revenue || 0,
      icon: ProfitMonth,
    },
    {
      title: "Bugun buyurtmalar soni",
      count: statistics?.orders_count || 0,
      bot1: bot1?.today_orders || 0,
      bot2: bot2?.today_orders || 0,
      icon: OrdersToday,
    },
    {
      title: "Bugungi jami daromad",
      count: statistics?.today_revenue || 0,
      bot1: bot1?.today_revenue || 0,
      bot2: bot2?.today_revenue || 0,
      icon: OrdersThisMonth,
    },
  ];


  if (isError || statsError) {
    return <div>Ma'lumotlarni yuklashda xatolik yuz berdi!</div>
  }

  if (isLoading || statsLoading) {
    return <AdminPanelSkeleton/>
  }

  return (
    <div className=" space-y-4 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin panel</h1>
        <div className="flex items-center gap-4">
        <SelectCoupleDate/>
        <StatisticsModal />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
        {orderStats.map((stat) => (
          <OrderStatsCard key={stat.title} {...stat} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 w-full">
        <BranchsChart data={analytics as IMainAnalytics} />
        <DailyOrdersChart data={analytics as IMainAnalytics} />
      </div>
      <MonthlyOrdersChart data={analytics as IMainAnalytics} />
    </div>
  );
}

const Home: NextPage = () => {
  return (
    <Layout page="home">
      <EnhancedAnalyticsDashboard />
    </Layout>
  );
};

export default Home;
