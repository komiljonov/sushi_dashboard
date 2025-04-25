"use client";

import { IMainAnalytics } from "@/lib/types";
import { PieChart, Pie, Cell } from "recharts";


const COLORS = ["#DCDDFE", "#5E4BFE", 'rgb(255, 159, 64)', 'rgb(255, 99, 132)'];

const BranchsChart = ({data}: {data: IMainAnalytics}) => {
    const chartData = data?.filials?.map((item) => ({name: item.filial, value: item.count}))
  return (
    <div className="bg-white p-6 rounded-2xl w-full">
      <h2 className="text-lg font-semibold mb-4">
        Filiallar kesimida buyurtmalar
      </h2>
      <div className="flex items-center relative min-h-[230px] min-w-[230px]">
        <div className="flex items-center relative min-h-[230px] min-w-[230px]">
          <div className="absolute w-[230px] h-[230px] border-[60px] border-[#F3F3FF] rounded-full"></div>
          <div className="ml-[15px]">
            <PieChart width={200} height={200}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
              >
                {chartData?.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </div>
        </div>
        <div className="ml-6 text-sm space-y-6 w-full">
          {chartData?.map((item, index) => (
            <div key={index} className="flex items-center gap-2 w-full justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-[18px] h-[18px] rounded-full border-4"
                  style={{ borderColor: COLORS[index % COLORS.length] }}
                ></span>
                <span className="text-xs font-medium">{item.name}</span>
              </div>

              <span className="ml-auto font-medium text-xs">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BranchsChart;
