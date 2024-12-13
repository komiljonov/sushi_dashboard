"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
// import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
// import {
//   // Popover,
//   // PopoverContent,
//   // PopoverTrigger,
// } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  // CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLink,
} from "lucide-react";
// import { format } from "date-fns";
// import { DateRange } from "react-day-picker";
import { Layout } from "@/components/Layout";
import { request } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { Skeleton } from "@/components/ui/skeleton";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PaginatedOrderResponse } from "@/lib/types";
import React from "react";
import { splitToHundreds } from "@/lib/utils";
import { queryClient } from "@/lib/query";

const statuses = [
  {
    value: "",
    name: "Hammasi",
    color: "bg-gray-100 hover:bg-gray-200 text-gray-800",
    border: "border-gray-800",
  },
  {
    value: "PENDING",
    name: "Kutilmoqda",
    color: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800",
    border: "border-yellow-800",
  },
  {
    value: "PENDING_KITCHEN",
    name: "Tayyorlanishi kutilmoqda",
    color: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800",
    border: "border-yellow-800",
  },
  {
    value: "PREPARING",
    name: "Tayyorlanmoda",
    color: "bg-blue-100 hover:bg-blue-200 text-blue-800",
    border: "border-blue-800",
  },
  {
    value: "DELIVERING",
    name: "Yetkazib berilmoqda",
    color: "bg-purple-100 hover:bg-purple-200 text-purple-800",
    border: "border-purple-800",
  },
  {
    value: "DONE",
    name: "Yakunlangan",
    color: "bg-green-100 hover:bg-green-200 text-green-800",
    border: "border-green-800",
  },
  {
    value: "CANCELLED",
    name: "Bekor qilingan",
    color: "bg-red-100 hover:bg-red-200 text-red-800",
    border: "border-red-800",
  },
];

function OrderList({
  orders,
  setCurrentPage,
  setSearchTerm,
  searchTerm,
  // dateRange,
  setSelectedStatus,
  selectedStatus,
  // setDateRange,
  currentPage,
  isLoading
}: {
  orders: PaginatedOrderResponse;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  // setDateRange: Dispatch<SetStateAction<{ from?: Date; to?: Date }>>;
  setSelectedStatus: Dispatch<SetStateAction<string>>;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  currentPage: number;
  selectedStatus: string;
  searchTerm: string;
  // dateRange: { from?: Date; to?: Date }
  isLoading: boolean
}) {
  const router = useRouter();
 
  
  const ordersPerPage = 10;
  const totalPages = Math.ceil(orders?.count / ordersPerPage);
  const { push } = useRouter();

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = (currentPage - 1) * ordersPerPage;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getPaginationButtons = () => {
    const buttons: (number | string)[] = [];
    if (totalPages <= 1) return buttons;
    buttons.push(1);
    if (currentPage > 3) {
      buttons.push("...");
    }
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      buttons.push(i);
    }
    if (currentPage < totalPages - 2) {
      buttons.push("...");
    }
    buttons.push(totalPages);
    return buttons;
  };

  const buttons = getPaginationButtons();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= orders?.count) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Buyurtmalar</h1>
        {/* <CreateOrderButton /> */}
        {/* <Button ></Button> */}

        <Button variant="default" onClick={() => router.push("/orders/create")}>
          Buyurtma yaratish
        </Button>
      </div>

      <div className="flex flex-col space-y-4 mb-6">
        {/* <div className="flex items-center space-x-4">
          <Label>Vaqt bo&apos;yicha filter:</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-[300px] justify-start text-left font-normal ${
                  dateRange.from && dateRange.to
                    ? "text-primary"
                    : "text-muted-foreground"
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
                  to: dateRange.to,
                }}
                onSelect={(range: DateRange | undefined) => {
                  setDateRange({
                    from: range?.from,
                    to: range?.to,
                  });
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
        </div> */}
        <div className="flex flex-wrap gap-2">
          <Label className="flex items-center mr-2">
            Holat bo&apos;yicha saralash:
          </Label>
          {statuses.map((status) => (
            <Button
              key={status.name}
              variant="outline"
              onClick={() => setSelectedStatus(status.value)}
              className={`transition-colors duration-200 ${
                selectedStatus === status.value
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
        {isLoading ? <OrderSkeleton/> : <Table>
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
              <TableHead>Buyurtma berilgan vaqt</TableHead>

              <TableHead>Holati</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.results?.map((order) => (
              <TableRow key={order.id} className="cursor-pointer">
                <TableCell
                  onClick={() => {
                    push(`orders/info?id=${order.id}`);
                  }}
                >
                  {order.order_id}
                </TableCell>

                <TableCell
                  onClick={() => {
                    push(`orders/info?id=${order.id}`);
                  }}
                >
                  {order.iiko_order_id}
                </TableCell>

                <TableCell
                  onClick={() => {
                    push(`orders/info?id=${order.id}`);
                  }}
                >
                  {order.user}
                </TableCell>
                <TableCell
                  onClick={() => {
                    push(`orders/info?id=${order.id}`);
                  }}
                >
                  {order.phone_number}
                </TableCell>
                <TableCell
                  onClick={() => {
                    push(`orders/info?id=${order.id}`);
                  }}
                >
                  <div className="flex items-center space-x-2">
                    {order.price && (
                      <Badge
                        variant="secondary"
                        className="text-green-600 bg-green-100"
                      >
                        {splitToHundreds(order.discount_price)} so&apos;m
                      </Badge>
                    )}
                    {order.promocode && (
                      <span className="text-sm text-muted-foreground line-through">
                        {splitToHundreds(order.price)} so&apos;m
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell
                  onClick={() => {
                    push(`orders/info?id=${order.id}`);
                  }}
                >
                  {order.products_count}
                </TableCell>
                <TableCell>
                  {order.promocode ? (
                    <Link
                      href={`/promocodes/info?id=${order.promocode?.id}`}
                      className="flex items-center text-blue-500 hover:text-blue-700"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />{" "}
                      {order.promocode?.name_uz}
                    </Link>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell
                  onClick={() => {
                    push(`orders/info?id=${order.id}`);
                  }}
                >
                  {order.time
                    ? new Date(order.time).toLocaleString()
                    : "Iloji boricha tez"}
                </TableCell>
                <TableCell>
                  {order.delivery == "DELIVER"
                    ? "Yetkazib berish"
                    : "Olib ketish"}
                </TableCell>
                <TableCell>{String(order.order_time)}</TableCell>

                <TableCell
                  onClick={() => {
                    push(`orders/info?id=${order.id}`);
                  }}
                >
                  <Badge
                    variant="outline"
                    className={
                      statuses.find((status) => status.value === order.status)
                        ?.color
                    }
                  >
                    {statuses.find((s) => s.value === order.status)?.name}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div>
          {orders?.count} ta buyurtmalardan {indexOfFirstOrder + 1} dan{" "}
          {Math.min(indexOfLastOrder)} gacha
        </div>
        <div className="flex space-x-2 items-center">
          <Button
            variant="outline"
            onClick={() => {
              paginate(currentPage - 1);
            }}
            disabled={currentPage === 1}
            className="w-10 h-10 p-0"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          {buttons.map((button, index) =>
            button === "..." ? (
              <span key={index} style={{ margin: "0 5px" }}>
                ...
              </span>
            ) : (
              <Button
                key={index}
                onClick={() => {
                  handlePageChange(button as number);
                }}
                disabled={button === currentPage}
                className={button === currentPage ? "" : "border"}
                variant={button === currentPage ? "default" : "ghost"}
              >
                {button}
              </Button>
            )
          )}
          <Button
            variant="outline"
            onClick={() => {
              paginate(currentPage + 1);
            }}
            // disabled={currentPage === totalPages}
            className="w-10 h-10 p-0"
          >
            <ChevronRightIcon className="w-4 h-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

const fetchOrders = async (page: number, status: string, search: string): Promise<PaginatedOrderResponse> => {
  const { data } = await request.get(`orders/pagination?page=${page}&status=${status}&q=${search}`);
  return data;
};

function OrderSkeleton() {
  return (
    <div className="space-y-4">
      {/* <Skeleton className="h-10 w-1/4" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" /> */}
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
  //   from: undefined,
  //   to: undefined,
  // });
   // const startDate = dateRange?.from instanceof Date && !isNaN(dateRange.from.getTime())
  // ? format(dateRange.from, "yyyy-MM-dd")
  // : 'Invalid Date';
  // const endDate = dateRange?.to instanceof Date && !isNaN(dateRange.to.getTime())
  // ? format(dateRange.to, "yyyy-MM-dd")
  // : 'Invalid Date';
  const {
    data: orders,
    isLoading,
    // error,
  } = useQuery<PaginatedOrderResponse>({
    queryKey: ["orders", currentPage, selectedStatus, searchTerm],
    queryFn: () => fetchOrders(currentPage, selectedStatus, searchTerm),
    refetchInterval: 3000,
    refetchOnWindowFocus: true,
  });
  useEffect(() => {
    if (orders?.current_page) {
      queryClient.prefetchQuery({
        queryKey: ["orders", currentPage + 1, selectedStatus, searchTerm],
        queryFn: () => fetchOrders(currentPage + 1, selectedStatus, searchTerm), // Ensure the function returns the promise
      });
    }
  }, [orders, currentPage, selectedStatus, searchTerm]);

  return (
    <Layout page="orders">
      {
      // error ? (
      //   <Alert variant="destructive">
      //     <AlertTitle>Error</AlertTitle>
      //     <AlertDescription>
      //       {error instanceof Error
      //         ? error.message
      //         : "An error occurred while fetching orders."}
      //     </AlertDescription>
      //   </Alert>
      // ) :
      //  orders ? (
        <OrderList
          orders={orders as PaginatedOrderResponse}
          setCurrentPage={setCurrentPage}
          setSelectedStatus={setSelectedStatus}
          selectedStatus={selectedStatus}
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
          // setDateRange={setDateRange}
          // dateRange={dateRange}
          currentPage={currentPage}
          isLoading={isLoading}
        />
      // ) : null
      }
    </Layout>
  );
}

