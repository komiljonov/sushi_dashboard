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
import SelectCoupleDate from "@/components/helpers/select-date-range";

const fetchStatistics = async (
  start: string,
  end: string
): Promise<DashboardData> => {
  const { data } = await request.get(`statistics?start=${start}&end=${end}`);
  return data;
};

const fetchTodayStats = async (

): Promise<DashboardData> => {
  const { data } = await request.get(`/statistics/today/`);
  return data;
};


function EnhancedAnalyticsDashboard() {
  const { start, end } = useDateFilterStore();

  const {
    data: statistics,
    isLoading: statsLoading,
    isError: statsError,
  } = useQuery({
    queryKey: ["statistics", start, end],
    queryFn: () => fetchStatistics(start, end),
    refetchInterval: 60000,
  });

  const {
    data: today,
    isLoading: todayLoading,
    isError: todayError,
  } = useQuery({
    queryKey: ["statistics"],
    queryFn: () => fetchTodayStats(),
    refetchInterval: 60000,
  });

  const {
    data: analytics,
    isLoading,
    isError,
  } = useQuery<IMainAnalytics>({
    queryKey: ["date_analytics", start, end],
    queryFn: () => fetchDateAnalytics(start, end),
  });

  const bot1 = statistics?.bot_stats?.find((bot) => bot.bot === "BOT1");
  const bot2 = statistics?.bot_stats?.find((bot) => bot.bot === "BOT2");
  const today_bot1 = today?.bot_orders?.find((bot) => bot.bot === "BOT1");
  const today_bot2 = today?.bot_orders?.find((bot) => bot.bot === "BOT2");

  console.log(today_bot1);
  

  const orderStats = [
    {
      title: "Jami buyurtmalar soni",
      count: statistics?.total_orders || 0,
      bot1: bot1?.orders_count || 0,
      bot2: bot2?.orders_count || 0,
      icon: AllOrders,
    },
    {
      title: "Jami daromad",
      count: statistics?.total_revenue || 0,
      bot1: bot1?.revenue || 0,
      bot2: bot2?.revenue || 0,
      icon: ProfitMonth,
    },
    {
      title: "Bugun buyurtmalar soni",
      count: today?.total_orders || 0,
      bot1: today_bot1?.orders_count || 0,
      bot2: today_bot2?.orders_count || 0,
      icon: OrdersToday,
    },
    {
      title: "Bugungi jami daromad",
      count: today?.total_revenue || 0,
      bot1: today_bot1?.today_revenue || 0,
      bot2: today_bot2?.today_revenue || 0,
      icon: OrdersThisMonth,
    },
  ];

  if (isError || statsError || todayError) {
    return <div>Ma'lumotlarni yuklashda xatolik yuz berdi!</div>;
  }

  if (isLoading || statsLoading || todayLoading) {
    return <AdminPanelSkeleton />;
  }

  return (
    <div className=" space-y-4 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin panel</h1>
        <div className="flex items-center gap-4">
          <SelectCoupleDate />
          <StatisticsModal />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
        {orderStats.map((stat) => (
          <OrderStatsCard
            key={stat.title}
            {...stat}
            start={statistics?.start || ""}
            end={statistics?.end || ""}
          />
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
