"use client";

import { Layout } from "@/components/Layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IUser, PaginatedUserResponse } from "@/lib/types";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { request } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/Input";
import { RxArrowTopRight } from "react-icons/rx";
import { Search } from "lucide-react";

function UsersTable() {
  const { push } = useRouter();

  const [userData, setUserData] = useState<IUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const { data: monitoring, isFetching } = useQuery<PaginatedUserResponse>({
    queryKey: ["users", page, searchTerm],
    queryFn: () => fetchUsers(page, searchTerm, ""),
  });

  useEffect(() => {
    if (monitoring?.results) {
      if (page === 1) {
        setUserData(monitoring.results); // Reset on new search
      } else {
        setUserData((prev) => [...prev, ...monitoring.results]);
      }
      setHasNextPage(!!monitoring.next);
    }
  }, [monitoring, page]);

  const loadMoreMonitoringData = useCallback(() => {
    if (!hasNextPage || isFetching) return;
    setPage((prevPage) => prevPage + 1);
  }, [hasNextPage, isFetching]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreMonitoringData();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loadMoreMonitoringData]);

  return (
    <div>
      <div className="py-3 flex gap-3 relative">
        <Search className="w-5 h-5 absolute top-5 left-3 text-[#A3A3A3]"/>
        <Input
          type="text"
          className="max-w-[400px] !h-[36px] pl-10"
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setUserData([]); // Clear previous data
            setPage(1); // Reset page to 1
          }}
          placeholder="Foydalanuvchini ismi yoki raqami orqali qidirish..."
        />
      </div>
      <div className="">
        {isFetching && userData.length === 0 ? (
          <UsersTableSkeleton />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ismi va familiyasi</TableHead>
                <TableHead>Telefon raqami</TableHead>
                <TableHead>Buyurtma</TableHead>
                <TableHead>Tili</TableHead>
                <TableHead>Telegram</TableHead>
                {/* <TableHead>Hozirgi buyurtmasi</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {userData?.map((user) => (
                <TableRow
                  key={user.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    push(`/users/info?id=${user.id}`);
                  }}
                >
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.number}</TableCell>
                  <TableCell>
                    {user.has_order ? (
                      <div className=" text-green-500 flex items-center gap-2">
                        <span>Ko'rish</span>
                        <RxArrowTopRight className="h-5 w-5" />
                      </div>
                    ) : (
                      <span className="text-red-500">Mavjud emas</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.lang == "uz" ? "O'zbek tili" : "Rus tili"}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`https://t.me/${user.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
                    >
                      Ochish
                      <RxArrowTopRight className="h-4 w-4 mr-1" />
                    </Link>
                  </TableCell>
                  {/* <TableCell>
                    {user.current_order && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log(`Open current order for user ${user.id}`);
                        }}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Buyurtmani ochish
                      </Button>
                    )}
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <div ref={observerRef} className="h-10 w-full" />
    </div>
  );
}

function UsersTableSkeleton() {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ismi</TableHead>
            <TableHead>Telefon raqami</TableHead>
            <TableHead>Buyurtma berganmi</TableHead>
            <TableHead>Tili</TableHead>
            <TableHead>Telegram</TableHead>
            <TableHead>Hozirgi buyurtmasi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-5 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-24" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}

const fetchUsers = async (
  page: number,
  search: string,
  filter: string
): Promise<PaginatedUserResponse> => {
  const { data } = await request.get(
    `users/pagination?page=${page}&search=${search}&has_order=${filter}`
  );
  return data;
};

export default function UsersListPage() {
  return (
    <Layout page="users">
      <div className="mx-auto">
        <h1 className="text-2xl font-bold mb-5">
          Foydalanuvchilar ro&apos;yxati
        </h1>
        <div className="bg-white p-4 rounded-xl">
          <UsersTable />
        </div>
      </div>
    </Layout>
  );
}
