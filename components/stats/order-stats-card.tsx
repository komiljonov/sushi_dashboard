// import { useDateFilterStore } from "@/lib/context/date-store";
// import { format } from "date-fns";
import Image, { StaticImageData } from "next/image";

type Props = {
  title: string;
  count: number;
  bot1: number;
  bot2: number;
  icon: StaticImageData;
};

export default function OrderStatsCard({ icon, title, count, bot1, bot2 }: Props) {
  // const {start_date, end_date} = useDateFilterStore();
  return (
    <div className="bg-white p-3 rounded-2xl w-full flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-700 max-w-[170px]">{title}</p>
          {/* <span className="text-xs text-gray-500">{ start_date && format(new Date(start_date), "dd - MMMM")} {(start_date || end_date) && "/"} { end_date && format(new Date(end_date), "dd - MMMM")}</span> */}
        </div>
          <Image  src={icon} alt={title} className=""/>
      </div>

      <div className="mt-2">
        <p className="text-2xl font-bold text-black">{count?.toLocaleString()}</p>
      </div>

      <div className="flex justify-between text-xs text-black mt-auto">
        <span>BOT 1: {bot1}</span>
        <span>BOT 2: {bot2}</span>
      </div>
    </div>
  );
}
