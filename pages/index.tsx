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

const fetchStatistics = async (): Promise<DashboardData> => {
  const { data } = await request.get("statistics");
  return data;
};

function EnhancedAnalyticsDashboard() {
  const { data: statistics, isLoading: statsLoading, isError: statsError } = useQuery({
    queryKey: ["statistics"],
    queryFn: fetchStatistics,
    refetchInterval: 60000,
  });

  const {
    data: analytics,
    isLoading,
    isError,
  } = useQuery<IMainAnalytics>({
    queryKey: ["date_analytics"],
    queryFn: fetchDateAnalytics,
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
    {
      title: "Joriy oydagi jami daromad",
      count: statistics?.this_month_revenue || 0,
      bot1: bot1?.this_month_revenue || 0,
      bot2: bot2?.this_month_revenue || 0,
      icon: ProfitMonth,
    },
  ];


  if (isError || statsError) {
    return <div>Ma'lumotlarni yuklashda xatolik yuz berdi!</div>
  }

  if (isLoading || statsLoading) {
    return <div>Ma'lumotlar yuklanmoqda...</div>
  }

  return (
    <div className=" space-y-4 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin panel</h1>
        <StatisticsModal />
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
