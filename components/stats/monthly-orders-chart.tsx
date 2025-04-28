"use client";

import { IMainAnalytics } from "@/lib/types";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// English to Uzbek month mapping
const uzMonthMap: Record<string, string> = {
  January: "Yanvar",
  February: "Fevral",
  March: "Mart",
  April: "Aprel",
  May: "May",
  June: "Iyun",
  July: "Iyul",
  August: "Avgust",
  September: "Sentyabr",
  October: "Oktabr",
  November: "Noyabr",
  December: "Dekabr",
};

export default function MonthlyOrdersChart({ data }: { data: IMainAnalytics }) {
  const chartData = data.sales_year.map((obj) => {
    const [month, value] = Object.entries(obj)[0];
    return {
      name: uzMonthMap[month] ?? month,
      soni: Number(value),
    };
  });

  return (
    <div className="w-full bg-white rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold mb-4">Oylik buyurtmalar soni</h2>
      </div>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#F4F4F4" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              fontSize={12}
              tick={{ fill: "#777" }}
              interval={0}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="soni"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#colorOrders)"
              dot={{ r: 2 }} // 👈 show dots even for value 0
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-sm text-gray-500">Maʼlumotlar mavjud emas</div>
      )}
    </div>
  );
}
