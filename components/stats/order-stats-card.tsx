import Image, { StaticImageData } from "next/image";

type Props = {
  title: string;
  count: number;
  bot1: number;
  bot2: number;
  icon: StaticImageData;
};

export default function OrderStatsCard({ icon, title, count, bot1, bot2 }: Props) {
  return (
    <div className="bg-white p-3 rounded-2xl w-full flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-700 max-w-[170px]">{title}</p>
        </div>
          <Image  src={icon} alt={title} className=""/>
      </div>

      <div className="mt-2">
        <p className="text-3xl font-bold text-black">{count}</p>
      </div>

      <div className="flex justify-between text-xs text-black mt-auto">
        <span>BOT 1: {bot1}</span>
        <span>BOT 2: {bot2}</span>
      </div>
    </div>
  );
}
