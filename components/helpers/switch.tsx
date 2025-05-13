import { motion } from "framer-motion";

export default function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  label?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm text-gray-700">{label}</span>}
      <div
        onClick={() => onChange(!checked)}
        className={`w-10 h-6 flex items-center rounded-full cursor-pointer px-1 transition-colors ${
          checked ? "bg-[#FF2735]" : "bg-gray-300"
        }`}
      >
        <motion.div
          className="w-4 h-4 bg-white rounded-full shadow"
          layout
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
          animate={{
            x: checked ? 16 : 0,
          }}
        />
      </div>
    </div>
  );
}
