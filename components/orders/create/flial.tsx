import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Controller, useFormContext } from "react-hook-form";
import { CreateOrderForm } from "./types";
import { Label } from "@/components/ui/Label";
import PhoneNumberSelect from "./phone";
import { IFilial, IPhoneNumber } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

// Filial Select Component
export default function FilialSelect({ filials, phone_numbers }: { filials?: IFilial[], phone_numbers?: IPhoneNumber[] }) {

    const { control, watch, formState: { errors } } = useFormContext<CreateOrderForm>();

    const deliveryMethod = watch('delivery');

    if (!filials) {
        return <Skeleton className="w-full h-10 rounded-md" />
    }

    return (
        <div className="space-y-2">
            {/* Row container with flex to align both selects in one row */}
            <div className="flex space-x-4">
                {/* Filial Select will only appear when delivery method is PICKUP */}
                {deliveryMethod === 'PICKUP' && (
                    <div className="flex-1 space-y-2">
                        <Label>Filialni tanlang</Label>
                        {/* Use Controller for Filial select */}
                        <Controller
                            name="filial"
                            control={control}
                            rules={{ required: "Filialni tanlash shart" }}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full h-[44px] input">
                                        <SelectValue placeholder="Filialni tanlang" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filials?.map((filial) => (
                                            <SelectItem key={filial.id} value={filial.id}>
                                                {filial.name_uz}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {/* Error message for validation */}
                        {errors.filial && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.filial.message as string}
                            </p>
                        )}
                    </div>
                )}

                <div className="flex-1 space-y-2">
                    <Label>Filial telefon raqami</Label>
                    <PhoneNumberSelect phone_numbers={phone_numbers} />
                </div>
            </div>
        </div>
    );
}
