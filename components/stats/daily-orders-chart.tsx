"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { IMainAnalytics } from "@/lib/types";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// const months = [
//   "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
//   "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
// ];

export default function DailyOrdersChart({data}: {data: IMainAnalytics}) {
  const chartData = Array.from({ length: 31 }, (_, index) => ({
    day: index + 1,
    value: data?.sales?.[index] || 0,
  }));
  return (
    <div className="bg-white p-5 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold mb-4">Kunlik buyurtmalar soni</h2>
        {/* <Select>
          <SelectTrigger className="max-w-[100px] input !border-transparent">
            <SelectValue placeholder="Yanvar" />
          </SelectTrigger>
          <SelectContent>
            {
             months?.map((month) => <SelectItem key={month} value={month}>{month}</SelectItem>)
            }
          </SelectContent>
        </Select> */}
      </div>

      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} stroke="#F4F4F4" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            fontSize={10}
            tick={{ fill: "#999" }}
          />
          <YAxis hide />
          <Tooltip />
          <Bar
            dataKey="value"
            fill="#F97316"
            radius={[4, 4, 0, 0]}
            barSize={16}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
