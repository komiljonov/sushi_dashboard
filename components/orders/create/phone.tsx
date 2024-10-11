import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { IPhoneNumber } from "@/lib/types";
import { Select } from "@radix-ui/react-select";
import { useFormContext } from "react-hook-form";
import { CreateOrderForm } from "./types";

export default function PhoneNumberSelect({ phone_numbers }: { phone_numbers?: IPhoneNumber[] }) {

    const { watch, setValue } = useFormContext<CreateOrderForm>();



    const value = watch("phone_number");

    if (!phone_numbers) {
        return <Skeleton className="w-full h-10 rounded-md" />
    }


    return (
        <Select value={value} onValueChange={(val) => setValue("phone_number", val)}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Telefon raqamni tanlang" />
            </SelectTrigger>
            <SelectContent>
                {phone_numbers?.map((phone_number) => (
                    <SelectItem key={phone_number.id} value={phone_number.id}>
                        {phone_number.number}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}