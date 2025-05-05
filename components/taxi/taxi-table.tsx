"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CardContent } from "@/components/ui/Card";
import { PaginatedTaxi } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { splitToHundreds } from "@/lib/utils";
import { fetchTaxiList } from "@/lib/fetchers";
import { queryClient } from "@/lib/query";
import CustomPagination from "../pagination";

export default function TaxiTable() {
  // const [sortColumn, setSortColumn] = useState<keyof IPayment | "">("");
  const [page, setPage] = useState(1);

  const { data: taxi } = useQuery<PaginatedTaxi>({
    queryKey: ["taxi", page],
    queryFn: () => fetchTaxiList(page),
  });

  useEffect(() => {
    if (taxi?.next) {
      queryClient.prefetchQuery({
        queryKey: ["taxi", page + 1],
        queryFn: () => fetchTaxiList(page),
      });
    }
  }, [page, taxi]);

  const status = {
    finished: "Yakunlangan",
    driver_assigned: "Haydovchi biriktirildi",
    new_order: "Yangi buyurtma",
    car_at_place: "Oshxonaga yetib keldi",
    aborted: "Bekor qilingan",
  };

  return (
    <div className="mx-auto w-full">
      <div className="bg-white rounded-xl">
        <CardContent className="!p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  // onClick={() => handleSort("user")}
                >
                  Mashina sifatlari
                </TableHead>
                <TableHead className="cursor-pointer">Mashina raqami</TableHead>
                <TableHead className="cursor-pointer">
                  Haydovchi raqami
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  // onClick={() => handleSort("created_at")}
                >
                  Narxi
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  // onClick={() => handleSort("amount")}
                >
                  Holati
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxi?.results?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <p className="text-center text-lg text-gray-600 font-medium">Taksilar mavjud emas!</p>
                  </TableCell>
                </TableRow>
              ) : (
                taxi?.results?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {item?.car_mark} {item?.car_model} {item?.car_color}
                    </TableCell>
                    <TableCell>{item?.car_number}</TableCell>
                    <TableCell>{item?.driver_phone_number}</TableCell>
                    <TableCell>
                      {splitToHundreds(item.total_sum)} so&apos;m
                    </TableCell>
                    <TableCell>
                      {status[item?.state_kind as keyof typeof status]}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <CustomPagination
            totalPages={Math.ceil((taxi?.count ?? 0) / (taxi?.page_size ?? 0))}
            page={page}
            setPage={setPage}
          />
        </CardContent>
      </div>
    </div>
  );
}
