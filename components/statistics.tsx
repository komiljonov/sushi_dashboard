"use client";

import { Button } from "@/components/ui/Button";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/Label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Download } from "lucide-react";
import { request } from "@/lib/api";
import { Input } from "./ui/Input";
import { fetchFilials } from "@/lib/fetchers";

interface StatisticsFilter {
    filial: string | null | undefined;
    start_date: string;
    end_date: string;
    delivery_type?: "DELIVER" | "PICKUP" | null | undefined;
    payment_type?: string | null | undefined;
}

const downloadStatistics = async (data: StatisticsFilter) => {
    const filteredData = Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(data).filter(([_, v]) => v != null)
    );

    const response = await request.post("/xlsx", filteredData, {
        headers: {
            "Content-Type": "application/json",
        },
        responseType: "blob",
    });

    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "statistika.xlsx";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
};

export default function StatisticsModal() {
    const { control, handleSubmit } = useForm<StatisticsFilter>({
        defaultValues: {
            filial: undefined,
            start_date: undefined,
            end_date: undefined,
            delivery_type: undefined,
            payment_type: undefined,
        },
    });




    const { data: filials } = useQuery({
        queryKey: ["filials"],
        queryFn: fetchFilials,
    })


    const { mutate, isPending } = useMutation({
        mutationFn: downloadStatistics,
        onError: (error) => {
            console.error("Faylni yuklab olishda xatolik yuz berdi:", error);
        },
    });

    const onSubmit = (data: StatisticsFilter) => {
        mutate(data);
    };

    return (
        <Dialog >
            <DialogTrigger asChild>
                <Button variant="outline" className="bg-white">Statistikani ochish</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] text-black">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Statistika</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">



                    <div>
                        <Label htmlFor="start-date">Oraliq boshlanishi</Label>

                        <Controller
                            name="start_date"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    id="start-date"
                                    type="date"
                                    className="input"
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />


                    </div>
                    <div>
                        <Label htmlFor="end-date">Oraliq tugashi</Label>
                        {/* <Input
                            id="end-date"
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                        /> */}

                        <Controller
                            name="end_date"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    id="end_date"
                                    type="date"
                                    className="input"
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>



                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="filial" className="text-sm font-medium">
                                Filial
                            </Label>
                            <Controller
                                name="filial"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value || undefined} onValueChange={(value) => {
                                        console.log(value);
                                        field.onChange(value);
                                    }}>
                                        <SelectTrigger className="h-[44px] input">
                                            <SelectValue placeholder="Filialni tanlang" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                filials?.map((filial) => {
                                                    console.log(filial.id);
                                                    return <SelectItem key={filial.id} value={filial.id}>{filial.name_uz}</SelectItem>
                                                })
                                            }

                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        {/* <div className="space-y-2">
                            <Label className="text-sm font-medium">Sana oralig&apos;i</Label>
                            <div className="flex flex-wrap gap-4">
                                <Controller
                                    name="start_date"
                                    control={control}
                                    render={({ field }) => (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] justify-start text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? format(field.value, "PPP") : <span>Boshlanish sanasi</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value ?? undefined}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                />
                                <Controller
                                    name="end_date"
                                    control={control}
                                    render={({ field }) => (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] justify-start text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? format(field.value, "PPP") : <span>Tugash sanasi</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value ?? undefined}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                />
                            </div>
                        </div> */}

                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Yetkazib berish turi</Label>
                            <Controller
                                name="delivery_type"
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup
                                        className="flex flex-wrap gap-4"
                                        value={field.value || undefined}
                                        onValueChange={field.onChange}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="all" id="all" />
                                            <Label htmlFor="ALL">Barchasi</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="PICKUP" id="olib_ketish" />
                                            <Label htmlFor="olib_ketish">Olib ketish</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="DELIVER" id="yetkazib_berish" />
                                            <Label htmlFor="yetkazib_berish">Yetkazib berish</Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />

                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="payment" className="text-sm font-medium">
                                To&apos;lov turi
                            </Label>
                            <Controller
                                name="payment_type"
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup
                                        className="flex flex-wrap gap-4"
                                        value={field.value || undefined}
                                        onValueChange={field.onChange}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="ALL" id="all_payment" />
                                            <Label htmlFor="all_payment">Barchasi</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="CLICK" id="CLICK" />
                                            <Label htmlFor="CLICK">CLICK</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="PAYME" id="PAYME" />
                                            <Label htmlFor="PAYME">PAYME</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="CASH" id="CASH" />
                                            <Label htmlFor="CASH">CASH</Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full button" disabled={isPending}>
                        <Download className="mr-2 h-4 w-4" /> {isPending ? "Yuklanmoqda..." : "XLSX yuklab olish"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}