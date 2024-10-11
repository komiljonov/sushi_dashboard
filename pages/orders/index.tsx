'use client'

import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, ExternalLink, MoreHorizontalIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from 'react-day-picker';
import { Layout } from '@/components/Layout';
import { request } from "@/lib/api";
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { IOrder } from '@/lib/types';
import React from 'react';
import { splitToHundreds } from '@/lib/utils';



const statuses = [
    { value: "ALL", name: "Hammasi", color: "bg-gray-100 hover:bg-gray-200 text-gray-800", border: "border-gray-800" },
    { value: "PENDING", name: "Kutilmoqda", color: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800", border: "border-yellow-800" },
    { value: "PENDING_KITCHEN", name: "Tayyorlanishi kutilmoqda", color: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800", border: "border-yellow-800" },
    { value: "PREPARING", name: "Tayyorlanmoda", color: "bg-blue-100 hover:bg-blue-200 text-blue-800", border: "border-blue-800" },
    { value: "DELIVERING", name: "Yetkazib berilmoqda", color: "bg-purple-100 hover:bg-purple-200 text-purple-800", border: "border-purple-800" },
    { value: "COMPLETED", name: "Yakunlangan", color: "bg-green-100 hover:bg-green-200 text-green-800", border: "border-green-800" },
    { value: "CANCELLED", name: "Bekor qilingan", color: "bg-red-100 hover:bg-red-200 text-red-800", border: "border-red-800" },
]

function OrderList({ orders }: { orders: IOrder[] }) {
    const router = useRouter();
    const [selectedStatus, setSelectedStatus] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");
    const [dateRange, setDateRange] = useState<{ from?: Date, to?: Date }>({ from: undefined, to: undefined });
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 20;

    const { push } = useRouter();

    const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.order_time)
        const isInDateRange = (!dateRange.from || orderDate >= dateRange.from) &&
            (!dateRange.to || orderDate <= dateRange.to)
        return (selectedStatus === "ALL" || order.status === selectedStatus) &&
            (
                order.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.order_id?.toString().includes(searchTerm) ||
                order.iiko_order_id?.toString().includes(searchTerm) ||
                order.phone_number?.toLowerCase().includes(searchTerm)
            ) &&
            isInDateRange
    });

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const renderPaginationButtons = () => {
        const pageNumbers = []
        const maxVisibleButtons = 3
        let startPage, endPage

        if (totalPages <= maxVisibleButtons) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= Math.ceil(maxVisibleButtons / 2)) {
                startPage = 1;
                endPage = maxVisibleButtons;
            } else if (currentPage + Math.floor(maxVisibleButtons / 2) >= totalPages) {
                startPage = totalPages - maxVisibleButtons + 1;
                endPage = totalPages;
            } else {
                startPage = currentPage - Math.floor(maxVisibleButtons / 2);
                endPage = currentPage + Math.floor(maxVisibleButtons / 2);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <Button
                    key={i}
                    variant={currentPage === i ? "default" : "outline"}
                    onClick={() => paginate(i)}
                    className="w-10 h-10 p-0"
                >
                    {i}
                </Button>
            );
        }

        if (startPage > 1) {
            pageNumbers.unshift(
                <Button key="start-ellipsis" variant="outline" className="w-10 h-10 p-0" disabled>
                    <MoreHorizontalIcon className="w-4 h-4" />
                </Button>
            );
            pageNumbers.unshift(
                <Button
                    key={1}
                    variant="outline"
                    onClick={() => paginate(1)}
                    className="w-10 h-10 p-0"
                >
                    1
                </Button>
            );
        }

        if (endPage < totalPages) {
            pageNumbers.push(
                <Button key="end-ellipsis" variant="outline" className="w-10 h-10 p-0" disabled>
                    <MoreHorizontalIcon className="w-4 h-4" />
                </Button>
            );
            pageNumbers.push(
                <Button
                    key={totalPages}
                    variant="outline"
                    onClick={() => paginate(totalPages)}
                    className="w-10 h-10 p-0"
                >
                    {totalPages}
                </Button>
            );
        }

        return pageNumbers;
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Buyurtmalar</h1>
                {/* <CreateOrderButton /> */}
                {/* <Button ></Button> */}

                <Button variant="default" onClick={() => router.push("/orders/create")}>Buyurtma yaratish</Button>
            </div>

            <div className="flex flex-col space-y-4 mb-6">
                <div className="flex items-center space-x-4">
                    <Label>Vaqt bo&apos;yicha filter:</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={`w-[300px] justify-start text-left font-normal ${dateRange.from && dateRange.to ? "text-primary" : "text-muted-foreground"
                                    }`}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange.from ? (
                                    dateRange.to ? (
                                        <>
                                            {format(dateRange.from, "LLL dd, y")} -{" "}
                                            {format(dateRange.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(dateRange.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Oraliqni tanlang</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={dateRange.from}
                                selected={{
                                    from: dateRange.from,
                                    to: dateRange.to
                                }}
                                onSelect={(range: DateRange | undefined) => {
                                    setDateRange({
                                        from: range?.from,
                                        to: range?.to
                                    })
                                }}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                    <Button
                        variant="outline"
                        onClick={() => setDateRange({ from: undefined, to: undefined })}
                    >
                        Tozalash
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Label className="flex items-center mr-2">Holat bo&apos;yicha saralash:</Label>
                    {statuses.map((status) => (
                        <Button
                            key={status.name}
                            variant="outline"
                            onClick={() => setSelectedStatus(status.value)}
                            className={`transition-colors duration-200 ${selectedStatus === status.value
                                ? `${status.color} border-2 ${status.border}`
                                : `bg-white hover:${status.color}`
                                }`}
                        >
                            {status.name}
                        </Button>
                    ))}
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="search">Qidirish:</Label>
                    <Input
                        id="search"
                        placeholder="Buyurtma raqami, mijoz ismi yoki telefon raqam."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
            </div>
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Iiko ID</TableHead>
                            <TableHead>Mijoz</TableHead>
                            <TableHead>Telefon raqami</TableHead>
                            <TableHead>Narxi</TableHead>
                            <TableHead>Mahsulotlar soni</TableHead>
                            <TableHead>Promokod</TableHead>
                            <TableHead>Buyurtma vaqti</TableHead>
                            <TableHead>Yetkazish/Olib ketish</TableHead>
                            <TableHead>Holati</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentOrders.map((order) => (
                            <TableRow key={order.id} className='cursor-pointer'>

                                <TableCell onClick={() => {
                                    push(`orders/info?id=${order.id}`)
                                }}>{order.order_id}</TableCell>

                                <TableCell onClick={() => {
                                    push(`orders/info?id=${order.id}`)
                                }}>{order.iiko_order_id}</TableCell>


                                <TableCell onClick={() => {
                                    push(`orders/info?id=${order.id}`)
                                }}>{order.user?.name ?? "Call center orqali"}</TableCell>
                                <TableCell onClick={() => {
                                    push(`orders/info?id=${order.id}`)
                                }}>{order.phone_number}</TableCell>
                                <TableCell onClick={() => {
                                    push(`orders/info?id=${order.id}`)
                                }}>
                                    <div className="flex items-center space-x-2">
                                        {order.price && <Badge variant="secondary" className="text-green-600 bg-green-100">
                                            {splitToHundreds(order.discount_price)} so&apos;m
                                        </Badge>}
                                        {order.promocode && (
                                            <span className="text-sm text-muted-foreground line-through">
                                                {splitToHundreds(order.price)} so&apos;m
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell onClick={() => {
                                    push(`orders/info?id=${order.id}`)
                                }}>{order.products_count}</TableCell>
                                <TableCell>
                                    {order.promocode ?
                                        <Link
                                            href={`/promocodes/info?id=${order.promocode?.id}`}
                                            className="flex items-center text-blue-500 hover:text-blue-700"
                                        >
                                            <ExternalLink className="h-4 w-4 mr-1" /> {order.promocode?.name}</Link>
                                        : '-'}
                                </TableCell>
                                <TableCell onClick={() => {
                                    push(`orders/info?id=${order.id}`);
                                }}>{order.time ? new Date(order.time).toLocaleString() : "Iloji boricha tez"}</TableCell>
                                <TableCell>{order.delivery == "DELIVER" ? "Yetkazib berish" : "Olib ketish"}</TableCell>
                                <TableCell onClick={() => {
                                    push(`orders/info?id=${order.id}`)
                                }}>
                                    <Badge
                                        variant="outline"
                                        className={statuses.find((status) => (status.value === order.status))?.color}
                                    >
                                        {statuses.find((s) => s.value === order.status)?.name}

                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="mt-4 flex justify-between items-center">
                <div>
                    Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
                </div>
                <div className="flex space-x-2 items-center">
                    <Button
                        variant="outline"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-10 h-10 p-0"
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                        <span className="sr-only">Previous page</span>
                    </Button>
                    {renderPaginationButtons()}
                    <Button
                        variant="outline"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 p-0"
                    >
                        <ChevronRightIcon className="w-4 h-4" />
                        <span className="sr-only">Next page</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}





const fetchOrders = async (): Promise<IOrder[]> => {


    const { data } = await request.get('orders');
    return data;
}


function OrderSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-10 w-1/4" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {[...Array(7)].map((_, index) => (
                                <TableHead key={index}>
                                    <Skeleton className="h-6 w-full" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(5)].map((_, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {[...Array(7)].map((_, cellIndex) => (
                                    <TableCell key={cellIndex}>
                                        <Skeleton className="h-6 w-full" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}


export default function Page() {
    const { data: orders, isLoading, error } = useQuery({
        queryKey: ['orders'],
        queryFn: fetchOrders,
        refetchInterval: 3000,
        refetchOnWindowFocus: true
    });

    return (
        <Layout page="orders">
            {isLoading ? (
                <OrderSkeleton />
            ) : error ? (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {error instanceof Error ? error.message : 'An error occurred while fetching orders.'}
                    </AlertDescription>
                </Alert>
            ) : orders ? (
                <OrderList orders={orders} />
            ) : null}
        </Layout>
    );
}