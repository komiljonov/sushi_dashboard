import { format } from "date-fns";
import Image, { StaticImageData } from "next/image";

type Props = {
  title: string;
  count: number;
  bot1: number;
  bot2: number;
  icon: StaticImageData;
  start: string;
  end: string;
};

export default function OrderStatsCard({
  icon,
  title,
  count,
  bot1,
  bot2,
  end,
  start,
}: Props) {

  const titles = ["Bugungi jami daromad", "Bugun buyurtmalar soni"];

  return (
    <div className="bg-white p-3 rounded-2xl w-full flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-700 max-w-[170px]">{title}</p>
          {titles.includes(title) ? (
            <span className="text-xs text-gray-500">{format(new Date(), "dd - MMMM")}</span>
          ) : (
            <span className="text-xs text-gray-500">
              {start && format(new Date(start), "dd - MMMM")}{" "}
              {(start || end) && "/"}{" "}
              {end &&
                format(new Date(end), "dd - MMMM")}
            </span>
          )}
        </div>
        <Image src={icon} alt={title} className="" />
      </div>

      <div className="mt-2">
        <p className="text-2xl font-bold text-black">
          {count?.toLocaleString()}
        </p>
      </div>

      <div className="flex justify-between text-xs text-black mt-auto">
        <span>BOT 1: {bot1?.toLocaleString()}</span>
        <span>BOT 2: {bot2?.toLocaleString()}</span>
      </div>
    </div>
  );
}
