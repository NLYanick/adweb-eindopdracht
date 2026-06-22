import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Props = {
  monthLabel: string;
  prevMonth: () => void;
  nextMonth: () => void;
};

export default function TransactionsMonthNav({ monthLabel, prevMonth, nextMonth }: Props) {
  const [direction, setDirection] = useState<1 | -1>(1);

  const handlePrev = () => { setDirection(-1); prevMonth(); };
  const handleNext = () => { setDirection(1);  nextMonth(); };

  return (
    <div className="flex items-center gap-3 justify-center mb-4">
      <button
        onClick={handlePrev}
        className="bg-gray-100 border border-gray-200 rounded-md px-3 py-1.5 font-mono text-sm hover:bg-gray-50 transition-colors"
        aria-label="Previous month"
      >
        ‹
      </button>

      <div className="w-36 overflow-hidden text-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={monthLabel}
            initial={{ x: direction * 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -24, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="font-mono text-sm text-gray-700 block"
          >
            {monthLabel}
          </motion.span>
        </AnimatePresence>
      </div>

      <button
        onClick={handleNext}
        className="bg-gray-100 border border-gray-200 rounded-md px-3 py-1.5 font-mono text-sm hover:bg-gray-50 transition-colors"
        aria-label="Next month"
      >
        ›
      </button>
    </div>
  );
}