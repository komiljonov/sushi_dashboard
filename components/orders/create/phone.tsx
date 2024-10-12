import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { IPhoneNumber } from "@/lib/types";
import { Select } from "@radix-ui/react-select";
import { useFormContext, Controller } from "react-hook-form";
import { CreateOrderForm } from "./types";

export default function PhoneNumberSelect({ phone_numbers }: { phone_numbers?: IPhoneNumber[] }) {
    const { control, formState: { errors } } = useFormContext<CreateOrderForm>();

    if (!phone_numbers) {
        return <Skeleton className="w-full h-10 rounded-md" />
    }

    return (
        <div>
            <Controller
                control={control}
                name="phone_number"
                rules={{ required: "Telefon raqami majburiy" }}
                render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
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
                )}
            />
            {errors.phone_number && (
                <p className="text-red-500 text-sm mt-1">
                    {errors.phone_number.message}
                </p>
            )}
        </div>
    )
}
