import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { DateRange, Range } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main styles
import "react-date-range/dist/theme/default.css"; // Theme styles
import { format } from "date-fns";
import { uz } from "date-fns/locale";
import { Calendar, X } from "lucide-react";
import { Button } from "../ui/Button";
import { useDateFilterStore } from "@/lib/context/date-store";

interface Props {
  disabled?: boolean;
}

const SelectCoupleDate: React.FC<Props> = ({ disabled = false }) => {
  const [open, setOpen] = useState(false);

  // Get Zustand state for date filters
  const { start, end, setDateFilter, resetDateFilters } = useDateFilterStore();

  // Local state for selected date range
  const [range, setRange] = useState<Range[]>([
    {
      startDate: start ? new Date(start) : new Date(),
      endDate: end ? new Date(end) : start ? new Date(start) : new Date(), // ✅ Use new Date(start) to avoid unwanted range selection
      key: "selection",
    },
  ]);
  
  useEffect(() => {
    setRange([
      {
        startDate: start ? new Date(start) : new Date(),
        endDate: end ? new Date(end) : start ? new Date(start) : new Date(), // ✅ Ensure it's null when missing
        key: "selection",
      },
    ]);
  }, [start, end]);
  

  // Auto-remove focus on open
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        const activeElement = document.activeElement as HTMLElement;
        activeElement?.blur?.();
      }, 50);
    }
  }, [open]);

  // Format displayed date
  const formattedStartDate = start
    ? format(new Date(start), "d MMMM", { locale: uz })
    : "";
  const formattedEndDate = end
    ? format(new Date(end), "d MMMM", { locale: uz })
    : "";
  const isSameDate = formattedStartDate === formattedEndDate;

  const handleConfirm = () => {
    setOpen(false);
    const { startDate, endDate } = range[0];

    // ✅ If only one date is selected, save `start` and set `end` as ""
    if (!endDate || format(startDate as Date, "yyyy-MM-dd") === format(endDate as Date, "yyyy-MM-dd")) {
      setDateFilter(format(startDate as Date, "yyyy-MM-dd"), ""); // ✅ Set empty string for end
    } else {
      setDateFilter(format(startDate as Date, "yyyy-MM-dd"), format(endDate as Date, "yyyy-MM-dd"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div
        className="w-full flex justify-between min-w-[100px] text-sm border cursor-pointer range_open px-3 items-center"
        // onClick={() => !disabled && setOpen(true)}
      >
        {!start && !end ? (
          <span className="text-black">Oraliqni tanlang</span>
        ) : (
          <div className="whitespace-nowrap flex gap-1">
            <span>{formattedStartDate}</span>
            {!isSameDate && end && <span>/</span>}
            {!isSameDate && end && <span>{formattedEndDate}</span>}
          </div>
        )}
        <div className="flex items-center">
        {start && <X
          className="ml-2 h-4 w-4 object-contain hover:text-red-500"
          onClick={() => {
            setOpen(false);
            resetDateFilters()}}
          />}
        <Calendar
          className="ml-1 h-4 min-w-4 object-contain cursor-pointer"
          onClick={() => !disabled && setOpen(true)}
          />
          </div>
      </div>

      <DialogContent className="max-w-[400px] px-2 sm:px-5">
        <DialogTitle className="text-black">Oraliqni tanlang</DialogTitle>
        <div className="flex justify-center w-full">
          <DateRange
            editableDateInputs={false}
            onChange={(item) => {
              setRange([
                {
                  startDate: item.selection.startDate,
                  endDate: item.selection.endDate, // ✅ Allows selecting 2 dates
                  key: "selection",
                },
              ]);
            }}
            moveRangeOnFirstSelection={false}
            ranges={range}
            locale={uz}
            className="w-full"
          />
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleConfirm}
            className="button bg_green h-[48px] hover:bg-green-600 bg-green-500"
          >
            Saqlash
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectCoupleDate;
