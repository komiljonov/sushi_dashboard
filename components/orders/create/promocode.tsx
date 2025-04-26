import { Label } from "@/components/ui/Label";

import { Skeleton } from "@/components/ui/skeleton";
import { IPromocode } from "@/lib/types";
import { useFormContext } from "react-hook-form";
import { CreateOrderForm } from "./types";
import Selector from "@/components/selector";

export default function PromocodeSelect({
  promocodes,
}: {
  promocodes?: IPromocode[];
}) {
  const { watch, setValue } = useFormContext<CreateOrderForm>();

  const promocode = watch("promocode");

  return (
    <div className="space-y-2">
      <Label htmlFor="promocode">Promokod</Label>
      {!promocodes ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <Selector
          value={promocode || ""}
          onChange={(val) => {
            setValue("promocode", val == "null" ? "" : val);
          }}
          placeholder="Promokodni tanlang"
          options={promocodes
            ?.filter((promocode) => promocode?.is_active)
            .map((promocode) => ({
              label: promocode.name_uz,
              value: promocode.id,
            }))}
        />
        // <Select
        //   value={promocode}
        //   onValueChange={(val) => {
        //     setValue("promocode", val == "null" ? "" : val);
        //   }}
        // >
        //   <SelectTrigger className="w-full h-[44px] input">
        //     <SelectValue placeholder="Promokodni tanlang" />
        //   </SelectTrigger>
        //   <SelectContent>
        //     {promocodes
        //       ?.filter((promocode) => promocode?.is_active)
        //       .map((promocode) => (
        //         <SelectItem key={promocode.id} value={promocode.id}>
        //           {promocode.name_uz}
        //         </SelectItem>
        //       ))}
        //   </SelectContent>
        // </Select>
      )}
    </div>
  );
}
