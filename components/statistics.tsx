"use client";

import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/calendar";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
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
import { request } from "@/lib/api"




interface StatisticsFilter {
    filial: string;
    start_date: Date | null;
    end_date: Date | null;
    delivery_type: string;
    payment_type: string;
}

// API call function
const downloadStatistics = async (data: StatisticsFilter) => {
    const response = await request.post("/xlsx", data, {
        headers: {
            "Content-Type": "application/json",
        },
        responseType: "blob",  // Ensure Axios handles it as a blob
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
            filial: "",
            start_date: null,
            end_date: null,
            delivery_type: "olib_ketish",
            payment_type: "",
        },
    });

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
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Statistikani ochish</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px]">
                <DialogHeader>
                    <DialogTitle>Statistika</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                            <Label htmlFor="filial" className="text-right">
                                Filial
                            </Label>
                            <Controller
                                name="filial"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Filialni tanlang" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="filial1">Filial 1</SelectItem>
                                            <SelectItem value="filial2">Filial 2</SelectItem>
                                            <SelectItem value="filial3">Filial 3</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                            <Label className="text-right">Sana oralig&apos;i</Label>
                            <div className="col-span-3 flex gap-2">
                                <Controller
                                    name="start_date"
                                    control={control}
                                    render={({ field }) => (
                                        <Calendar
                                            mode="single"
                                            selected={field.value ?? undefined}
                                            onSelect={field.onChange}
                                            className="rounded-md border"
                                        />
                                    )}
                                />
                                <Controller
                                    name="end_date"
                                    control={control}
                                    render={({ field }) => (
                                        <Calendar
                                            mode="single"
                                            selected={field.value ?? undefined}
                                            onSelect={field.onChange}
                                            className="rounded-md border"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                            <Label className="text-right">Yetkazib berish turi</Label>
                            <Controller
                                name="delivery_type"
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup
                                        className="row-span-3"
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="all" id="all" />
                                            <Label htmlFor="all">Barchasi</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="olib_ketish" id="olib_ketish" />
                                            <Label htmlFor="olib_ketish">Olib ketish</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="yetkazib_berish" id="yetkazib_berish" />
                                            <Label htmlFor="yetkazib_berish">Yetkazib berish</Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                            <Label htmlFor="payment" className="text-right">
                                To&apos;lov turi
                            </Label>
                            <Controller
                                name="payment_type"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="To'lov turini tanlang" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="naqd">Naqd</SelectItem>
                                            <SelectItem value="karta">Karta</SelectItem>
                                            <SelectItem value="online">Online</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        <Download className="mr-2 h-4 w-4" /> {isPending ? "Yuklanmoqda..." : "XLSX yuklab olish"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
