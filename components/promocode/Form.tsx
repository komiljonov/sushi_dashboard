"use client"

import { Controller, useForm } from "react-hook-form"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IPromocode } from "@/lib/types"
import { Checkbox } from "../ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns/format"
import { Calendar } from "../ui/calendar"

export type PromocodeFormOnSubmitProps = Omit<IPromocode, "id">;

interface PromocodeFormProps {
    onSubmit: (data: PromocodeFormOnSubmitProps) => void;
    defaultValues: Omit<IPromocode, "id">;
}

export const PromocodeForm = ({ onSubmit, defaultValues }: PromocodeFormProps) => {
    const { register, handleSubmit, watch, formState: { errors }, control } = useForm<Omit<IPromocode, "id">>({
        defaultValues,
    })

    const measurement = watch('measurement');
    const is_limited = watch('is_limited');
    const is_max_limited = watch('is_max_limited');

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name_uz">Nomi</Label>
                    <Input
                        id="name_uz"
                        {...register("name_uz", { required: "Nom kiritish shart" })}
                        aria-invalid={errors.name_uz ? "true" : "false"}
                    />
                    {errors.name_uz && (
                        <p className="text-red-500 text-sm" id="name-error">
                            {errors.name_uz.message}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="name_ru">Nomi</Label>
                    <Input
                        id="name_ru"
                        {...register("name_ru", { required: "Nom kiritish shart" })}
                        aria-invalid={errors.name_ru ? "true" : "false"}
                    />
                    {errors.name_ru && (
                        <p className="text-red-500 text-sm" id="name-error">
                            {errors.name_ru.message}
                        </p>
                    )}
                </div>


            </div>


            <div className="space-y-2">
                <Label htmlFor="code">Kod</Label>
                <Input
                    id="code"
                    {...register("code", { required: "Kod kiritish shart" })}
                    aria-invalid={errors.code ? "true" : "false"}
                />
                {errors.code && (
                    <p className="text-red-500 text-sm" id="code-error">
                        {errors.code.message}
                    </p>
                )}
            </div>



            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="measurement">O&apos;lchov</Label>
                    <Controller
                        name="measurement"
                        control={control}
                        rules={{ required: "O'lchov tanlash shart" }}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="measurement">
                                    <SelectValue placeholder="O'lchovni tanlang" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ABSOLUTE">Absolute</SelectItem>
                                    <SelectItem value="PERCENT">Foiz</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.measurement && (
                        <p className="text-red-500 text-sm" id="measurement-error">
                            {errors.measurement.message}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="amount">Miqdor</Label>
                    <Input
                        id="amount"
                        type="number"
                        className="no-spinner"
                        {...register("amount", {
                            required: "Miqdor kiritish shart",
                            validate: (value) => {
                                if (measurement === "PERCENT" && (value < 1 || value > 100)) {
                                    return "Foiz 1 dan 100 gacha bo'lishi kerak";
                                }
                                if (measurement === "ABSOLUTE" && value < 0) {
                                    return "Miqdor manfiy bo'lishi mumkin emas";
                                }
                                return true;
                            }
                        })}
                        aria-invalid={errors.amount ? "true" : "false"}
                    />
                    {errors.amount && (
                        <p className="text-red-500 text-sm" id="amount-error">
                            {errors.amount.message}
                        </p>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="count">Soni</Label>
                    <Input
                        id="count"
                        type="number"
                        className="no-spinner"
                        {...register("count", { required: "Son kiritish shart" })}
                        aria-invalid={errors.count ? "true" : "false"}
                    />
                    {errors.count && (
                        <p className="text-red-500 text-sm" id="count-error">
                            {errors.count.message}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="end_date">Tugash sanasi</Label>
                    <Controller
                        name="end_date"
                        control={control}
                        rules={{ required: "Tugash sanasini kiritish shart" }}
                        render={({ field }) => (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? format(field.value, "PPP") : <span>Sanani tanlang</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={(field.value as Date) || undefined}
                                        onSelect={field.onChange}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                    {errors.end_date && (
                        <p className="text-red-500 text-sm" id="endDate-error">
                            {errors.end_date.message}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <Controller
                    name="is_limited"
                    control={control}
                    render={({ field }) => (
                        <Checkbox
                            id="is_limited"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    )}
                />
                <Label htmlFor="is_limited">Promokodni ma&apos;lum miqdor oralig&apos;ida cheklash</Label>
            </div>
            {is_limited && (
                <div className="flex items-center space-x-2">
                    <Controller
                        name="is_max_limited"
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                id="is_max_limited"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        )}
                    />
                    <Label htmlFor="isMaxValue">Maksimal qiymatni o&apos;rnatish</Label>
                </div>
            )}
            {is_limited && (
                <div className="space-y-2">
                    <Label htmlFor="min_amount">Minimal miqdor</Label>
                    <Input
                        id="min_amount"
                        type="number"

                        {...register("min_amount", { required: is_limited ? "Minimal miqdorni kiritish shart" : false })}
                        aria-invalid={errors.min_amount ? "true" : "false"}
                        className="no-spinner"
                    />
                    {errors.min_amount && (
                        <p className="text-red-500 text-sm" id="min-amount-error">
                            {errors.min_amount.message}
                        </p>
                    )}
                </div>
            )}
            {is_limited && is_max_limited && (
                <div className="space-y-2">
                    <Label htmlFor="max_amount">Maksimal miqdor</Label>
                    <Input
                        id="max_amount"
                        type="number"
                        {...register("max_amount", { required: is_limited && is_max_limited ? "Maksimal miqdorni kiritish shart" : false })}
                        aria-invalid={errors.max_amount ? "true" : "false"}
                        className="no-spinner"
                    />
                    {errors.max_amount && (
                        <p className="text-red-500 text-sm" id="max-amount-error">
                            {errors.max_amount.message}
                        </p>
                    )}
                </div>
            )}
            <Button type="submit" className="w-full">O&apos;zgarishlarni saqlash</Button>
        </form>
    )
}