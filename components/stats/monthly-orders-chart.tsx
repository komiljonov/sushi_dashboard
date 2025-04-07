"use client";

import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { IMainAnalytics } from "../analytics";

const months = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentyabr", "Oktabr", "Noyabr", "Dekabr"
];

export default function MonthlyOrdersChart({ data }: {data: IMainAnalytics}) {
    const chartData = data?.sales_year?.map((value, index) => ({
        name: months[index],
        value
    }))

    console.log(chartData);
    
  return (
    <div className="w-full bg-white rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold mb-4">Oylik buyurtmalar soni</h2>
        {/* <Select >
          <SelectTrigger className="max-w-[100px] input !border-transparent">
            <SelectValue placeholder="2025" />
          </SelectTrigger>
          <SelectContent>
            {
             Array(12).fill(null).map((_, index) => <SelectItem key={index} value={(index + 2025)?.toString()}>{index + 2025}</SelectItem>)
            }
          </SelectContent>
        </Select> */}
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={chartData}>
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
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#colorOrders)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
