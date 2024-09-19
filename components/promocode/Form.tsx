"use client"

import { Controller, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IPromocode } from "@/lib/types"
import * as Slider from '@radix-ui/react-slider'
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
    const { register, handleSubmit, watch, formState: { errors }, control } = useForm<Omit<IPromocode & { isLimited: boolean; isMaxLimited: boolean }, "id">>({
        defaultValues,
    })


    const measurement = watch('measurement');
    const isLimited = watch('isLimited');
    const isMaxLimited = watch('isMaxLimited');

    return (

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        {...register("name", { required: "Name is required" })}
                        aria-invalid={errors.name ? "true" : "false"}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm" id="name-error">
                            {errors.name.message}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="code">Code</Label>
                    <Input
                        id="code"
                        {...register("code", { required: "Code is required" })}
                        aria-invalid={errors.code ? "true" : "false"}
                    />
                    {errors.code && (
                        <p className="text-red-500 text-sm" id="code-error">
                            {errors.code.message}
                        </p>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="measurement">Measurement</Label>
                    <Controller
                        name="measurement"
                        control={control}
                        rules={{ required: "Measurement is required" }}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="measurement">
                                    <SelectValue placeholder="Select measurement" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ABSOLUTE">Absolute</SelectItem>
                                    <SelectItem value="PERCENT">Percent</SelectItem>
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
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                        id="amount"
                        type="number"
                        {...register("amount", {
                            required: "Amount is required",
                            validate: (value) => {
                                if (measurement === "PERCENT" && (value < 1 || value > 100)) {
                                    return "Percentage must be between 1 and 100";
                                }
                                if (measurement === "ABSOLUTE" && value < 0) {
                                    return "Amount cannot be negative";
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
                    <Label htmlFor="count">Count</Label>
                    <Input
                        id="count"
                        type="number"
                        {...register("count", { required: "Count is required" })}
                        aria-invalid={errors.count ? "true" : "false"}
                    />
                    {errors.count && (
                        <p className="text-red-500 text-sm" id="count-error">
                            {errors.count.message}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Controller
                        name="endDate"
                        control={control}
                        rules={{ required: "End date is required" }}
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
                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value || undefined}
                                        onSelect={field.onChange}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                    {errors.endDate && (
                        <p className="text-red-500 text-sm" id="endDate-error">
                            {errors.endDate.message}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <Controller
                    name="isLimited"
                    control={control}
                    render={({ field }) => (
                        <Checkbox
                            id="isLimited"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    )}
                />
                <Label htmlFor="isLimited">Limit promocode to specific amount range</Label>
            </div>
            {isLimited && (
                <div className="flex items-center space-x-2">
                    <Controller
                        name="isMaxLimited"
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                id="isMaxLimited"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        )}
                    />
                    <Label htmlFor="isMaxValue">Set to maximum value</Label>
                </div>
            )}

            {isLimited && (
                <div className="space-y-2">
                    <Label htmlFor="amount-range">Amount Range</Label>
                    <Controller
                        name="minAmount"
                        control={control}
                        rules={{ required: "Minimum amount is required" }}
                        render={({ field: { onChange, value } }) => (
                            <Controller
                                name="maxAmount"
                                control={control}
                                rules={{ required: "Maximum amount is required" }}
                                render={({ field: { onChange: onChangeMax, value: valueMax } }) => (
                                    <Slider.Root
                                        className="relative flex items-center select-none touch-none w-full h-5"
                                        value={!isMaxLimited ? [value] : [value, valueMax]}
                                        onValueChange={(newValues) => {
                                            if (!isMaxLimited) {
                                                onChange(newValues[0]);
                                            } else {
                                                onChange(newValues[0]);
                                                onChangeMax(newValues[1]);
                                            }
                                        }}
                                        max={1000000}
                                        step={1}
                                        aria-label="Amount range"
                                    >


                                        <Slider.Track className="bg-blackA10 relative grow rounded-full h-[3px]">
                                            <Slider.Range className="absolute bg-primary rounded-full h-full" />
                                        </Slider.Track>


                                        <Slider.Thumb
                                            className="block w-5 h-5 bg-primary shadow-md rounded-full hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary"
                                            aria-label="Minimum amount"
                                        />



                                        {isMaxLimited && <Slider.Thumb

                                            className="block w-5 h-5 bg-primary shadow-md rounded-full hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary"
                                            aria-label="Maximum amount"
                                        />}

                                    </Slider.Root>
                                )}
                            />
                        )}
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Min: {watch('minAmount')}</span>

                        {isMaxLimited && <span>Max: {watch('maxAmount')}</span>}
                    </div>

                    {(errors.minAmount || errors.maxAmount) && (
                        <p className="text-red-500 text-sm" id="amount-range-error">
                            {errors.minAmount?.message || errors.maxAmount?.message}
                        </p>
                    )}
                </div>
            )}
            <Button type="submit" className="w-full">Save Changes</Button>
        </form>

    )
}