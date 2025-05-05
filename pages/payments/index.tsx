"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CardContent} from "@/components/ui/Card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { IPayment, PaginatedPaymentResponse } from "@/lib/types";
import { request } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { splitToHundreds } from "@/lib/utils";
import { format } from "date-fns";
import { RxArrowTopRight } from "react-icons/rx";

export const ProviderIcon = ({ provider }: { provider: IPayment["provider"] }) => {
  switch (provider) {
    case "PAYME":
      return (
        <Image
          src="/images/payme.svg"
          alt="Payme"
          className="object-contain max-h-[30px]"
          width={80}
          height={30}
        />
      );
    case "CLICK":
      return (
        <Image
          src="/images/click.svg"
          alt="Click"
          className="object-contain max-h-[30px]"
          width={80}
          height={30}
        />
      );
    case "CASH":
      return (
        <div className="flex items-center gap-1 text-md">
          <Image
            src="/images/cash.svg"
            alt="Cash"
            className="object-contain max-h-[30px] max-w-[30px]"
            width={80}
            height={30}
          />
          Naqd
        </div>
      );
    default:
      return <CreditCard className="h-4 w-4" />;
  }
};

const fetchPayments = async (
  page: number,
  type: string,
  q: string
): Promise<PaginatedPaymentResponse> => {
  const { data } = await request.get(
    `payments/paginated?page=${page}&provider=${type}&search=${q}`
  );
  return data;
};

interface Filter {
  user: string;
  provider: string;
  startDate: string;
  endDate: string;
}

function FilterSection({
  filters,
  setFilters,
}: {
  filters: Filter;
  setFilters: React.Dispatch<React.SetStateAction<Filter>>;
}) {
  return (
    <div className="mb-6">
        <div className="flex justify-between w-full gap-4">
          <div className="relative"> 
          <Search className="w-5 h-5 absolute top-3 left-3 text-[#A3A3A3]"/>
          <Input
              id="user-filter"
              value={filters.user}
              onChange={(e) => setFilters({ ...filters, user: e.target.value })}
              placeholder="Foydalanuvchini izlash..."
              className="!h-[36px] min-w-[400px] pl-10 input"
            />
          </div>
          <div>
            {/* <Label htmlFor="provider-filter">Manba</Label> */}
            <Select
              value={filters.provider}
              onValueChange={(value) =>
                setFilters({ ...filters, provider: value })
              }
            >
              <SelectTrigger id="provider-filter" className="input border !h-[36px] min-w-[166px]">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Hammasi</SelectItem>
                <SelectItem value="PAYME">Payme</SelectItem>
                <SelectItem value="CLICK">Click</SelectItem>
                <SelectItem value="CASH">Naqd</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* <div>
            <Label htmlFor="start-date">Oraliq boshlanishi</Label>
            <Input
              id="start-date"
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="end-date">Oraliq tugashi</Label>
            <Input
              id="end-date"
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
            />
          </div> */}
        </div>
    </div>
  );
}

function EnhancedPaymentListing() {
  // const [sortColumn, setSortColumn] = useState<keyof IPayment | "">("");

  const [filters, setFilters] = useState<Filter>({
    user: "",
    provider: "all",
    startDate: "",
    endDate: "",
  });
  const [paymentData, setPaymentData] = useState<IPayment[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Query hook with dynamic query key based on filters and page
  const { data: payments, isFetching } = useQuery<PaginatedPaymentResponse>({
    queryKey: ["users", page, filters?.provider, filters?.user],
    queryFn: () =>
      fetchPayments(
        page,
        filters?.provider === "all" ? "" : filters?.provider,
        filters?.user
      ),
    // Refetch when filters or page change
  });

  useEffect(() => {
    // Reset payment data when filters or page changes
    if (payments?.results) {
      if (page === 1) {
        setPaymentData(payments.results); // Reset on new search
      } else {
        setPaymentData((prev) => [...prev, ...payments.results]);
      }
      setHasNextPage(!!payments.next);
    }
  }, [payments, page]);

  const loadMorePaymentsData = useCallback(() => {
    if (!hasNextPage || isFetching) return;
    setPage((prevPage) => prevPage + 1);
  }, [hasNextPage, isFetching]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePaymentsData();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loadMorePaymentsData]);

  // Reset page to 1 and refetch when filters change
  useEffect(() => {
    setPage(1); // Reset page to 1 on filter change
  }, [filters]); // Dependencies will trigger this when any filter changes

  // if (isLoading) {
  //   return (
  //     <Card>
  //       <CardContent>
  //         <div className="space-y-4">
  //           {[...Array(5)].map((_, i) => (
  //             <div key={i} className="flex items-center space-x-4">
  //               <Skeleton className="h-12 w-12 rounded-full" />
  //               <div className="space-y-2">
  //                 <Skeleton className="h-4 w-[250px]" />
  //                 <Skeleton className="h-4 w-[200px]" />
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  // if (error) {
  //   return (
  //     <Alert variant="destructive">
  //       <AlertCircle className="h-4 w-4" />
  //       <AlertTitle>Hatolik</AlertTitle>
  //       <AlertDescription>
  //         An error occurred while fetching payments: {error.message}
  //       </AlertDescription>
  //     </Alert>
  //   );
  // }

  return (
    <div className="mx-auto">
      <h1 className="text-2xl font-bold mb-6">To&apos;lovlar</h1>


      <div className="bg-white rounded-xl">
        <CardContent className="!p-4">
      <FilterSection filters={filters} setFilters={setFilters} />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  // onClick={() => handleSort("user")}
                >
                  Foydalanuvchi
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  // onClick={() => handleSort("provider")}
                >
                  To'lov usuli
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  // onClick={() => handleSort("order")}
                >
                  Buyurtma raqami
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  // onClick={() => handleSort("created_at")}
                >
                  Vaqti
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  // onClick={() => handleSort("amount")}
                >
                  To'lov miqdori
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentData?.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {payment?.user?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Link
                          href={`/users/info?id=${payment?.user?.id}`}
                          className="font-medium"
                        >
                          {payment?.user?.name}
                        </Link>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <ProviderIcon provider={payment.provider} />
                    </div>
                  </TableCell>
                  <TableCell>
                    {payment.order && (
                      <Link
                        href={`/orders/info?id=${payment.order_id}`}
                        className="hover:underline text-blue-400 flex items-center space-x-1 font-medium"
                      >
                        <span>#{payment.order}</span>
                        <RxArrowTopRight  className="h-4 w-4" />
                      </Link>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(
                      new Date(payment.created_at),
                      "dd.MM.yyyy HH:mm"
                    )}
                  </TableCell>
                  <TableCell>
                    {splitToHundreds(payment.amount / 100)} so&apos;m
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </div>
      <div ref={observerRef} className="h-10 w-full" />
    </div>
  );
}

export default function Page() {
  return (
    <Layout page="payments">
      <EnhancedPaymentListing />
    </Layout>
  );
}
