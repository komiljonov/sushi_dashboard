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
import { IOrder } from '@/lib/types/order';
import { request } from "@/lib/api";
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';



const statuses = [
    { value: "ALL", name: "All", color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
    { value: "PENDING", name: "PENDING", color: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800" },
    { value: "PENDING_PAYMENT", name: "Pending payment", color: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800" },
    { value: "DELIVERING", name: "Delivering", color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
    { value: "COMPLETED", name: "Completed", color: "bg-green-100 hover:bg-green-200 text-green-800" },
    { value: "CANCELLED", name: "Cancelled", color: "bg-red-100 hover:bg-red-200 text-red-800" }
]

function OrderList({ orders }: { orders: IOrder[] }) {
    const [selectedStatus, setSelectedStatus] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");
    const [dateRange, setDateRange] = useState<{ from?: Date, to?: Date }>({ from: undefined, to: undefined });
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;



    const { push } = useRouter();







    const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.order_time)
        const isInDateRange = (!dateRange.from || orderDate >= dateRange.from) &&
            (!dateRange.to || orderDate <= dateRange.to)
        return (selectedStatus === "ALL" || order.status === selectedStatus) &&
            (order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.order_id.toString().includes(searchTerm)) &&
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
            <h1 className="text-3xl font-bold mb-6">Order List</h1>

            <div className="flex flex-col space-y-4 mb-6">
                <div className="flex items-center space-x-4">
                    <Label>Date Range:</Label>
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
                                    <span>Pick a date range</span>
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
                        Clear Dates
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Label className="flex items-center mr-2">Filter by Status:</Label>
                    {statuses.map((status) => (
                        <Button
                            key={status.name}
                            variant="outline"
                            onClick={() => setSelectedStatus(status.value)}
                            className={`transition-colors duration-200 ${selectedStatus === status.value
                                ? `${status.color} border-2 border-primary`
                                : `bg-white hover:${status.color}`
                                }`}
                        >
                            {status.name}
                        </Button>
                    ))}
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="search">Search:</Label>
                    <Input
                        id="search"
                        placeholder="Search by ID or user"
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
                            <TableHead>User</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Products Count</TableHead>
                            <TableHead>Coupon</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Status</TableHead>
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
                                }}>{order.user.name}</TableCell>
                                <TableCell onClick={() => {
                                    push(`orders/info?id=${order.id}`)
                                }}>
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="secondary" className="text-green-600 bg-green-100">
                                            ${order.discount_price ? order.discount_price.toFixed(2) : order.price.toFixed(2)}
                                        </Badge>
                                        {order.discount_price && (
                                            <span className="text-sm text-muted-foreground line-through">
                                                ${order.price.toFixed(2)}
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
                                    push(`orders/info?id=${order.id}`)
                                }}>{order.order_time && new Date(order.order_time).toLocaleString()}</TableCell>
                                <TableCell onClick={() => {
                                    push(`orders/info?id=${order.id}`)
                                }}>
                                    <Badge
                                        variant="outline"
                                        className={
                                            order.status === "PENDING" ? "border-yellow-500 text-yellow-800 bg-yellow-100" :
                                                order.status === "DELIVERING" ? "border-blue-500 text-blue-800 bg-blue-100" :
                                                    order.status === "COMPLETED" ? "border-green-500 text-green-800 bg-green-100" :
                                                        "border-red-500 text-red-800 bg-red-100"
                                        }
                                    >
                                        {order.status}
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
        refetchInterval: 30000,
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