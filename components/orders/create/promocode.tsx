import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { IPromocode } from "@/lib/types";
import { useFormContext } from "react-hook-form";
import { CreateOrderForm } from "./types";





export default function PromocodeSelect({ promocodes }: { promocodes?: IPromocode[] }) {

    const { watch, setValue } = useFormContext<CreateOrderForm>();


    const promocode = watch("promocode");


    return (
        <div className="space-y-2">
            <Label htmlFor="promocode">Promokod</Label>
            {!promocodes ? (
                <Skeleton className="h-10 w-full" />
            ) : (
                <Select value={promocode} onValueChange={(val) => {
                    setValue("promocode", val == "null" ? "" : val)
                }} >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Promokodni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="null" >Promokodni tanlang</SelectItem>
                        {
                            promocodes.map((promocode) => (
                                <SelectItem key={promocode.id} value={promocode.id}>{promocode.name_uz}</SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
            )}
        </div>
    )
}