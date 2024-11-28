"use client";

import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginatedUserResponse } from "@/lib/types";
import {
  CheckCircle,
  XCircle,
  ExternalLink,
  ShoppingCart,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { request } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient } from "@/lib/query";
import { Input } from "@/components/ui/Input";

function UsersTable({
  users,
  setCurrentPage,
  currentPage,
  setFilterUser,
  setSearchUser
}: {
  users: PaginatedUserResponse;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setFilterUser: Dispatch<SetStateAction<string>>;
  setSearchUser: Dispatch<SetStateAction<string>>;
  currentPage: number;
}) {
  const { push } = useRouter();
  const itemsPerPage = 10;
  const totalPages = Math.ceil(users?.count / itemsPerPage);
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = (currentPage - 1) * itemsPerPage;
  const [filterValue, setFilterValue] = useState<string>("all")
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
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
    if (page >= 1 && page <= users?.count) {
      setCurrentPage(page);
    }
  };
const filterUser = users?.results?.filter(item=> item?.has_order )
console.log(filterUser);

  return (
    <div>
      <div className="py-3 flex gap-3">
        <Input type="text" className="max-w-[400px]" onChange={(e)=>setSearchUser(e.target.value)} placeholder="Foydalanuvchini ismi yoki raqami orqali qidirish..."/>
        <Button variant={filterValue === "all" ? "default" : "ghost"} className={filterValue === "all" ? "" : "border"} onClick={()=>{
          setFilterValue("all")
          setFilterUser("")
        }}>Hammasi</Button>
        <Button variant={filterValue === "yes" ? "default" : "ghost"} className={filterValue === "yes" ? "" : "border"} onClick={()=>{
          setFilterValue("yes")
          setFilterUser("1")
        }}>Buyurtmasi bor</Button>
        <Button variant={filterValue === "no" ? "default" : "ghost"} className={filterValue === "no" ? "" : "border"} onClick={()=>{
          setFilterValue("no")
          setFilterUser("0")
        }}>Buyurtmasi yo'q</Button>
      </div>
      <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ismi</TableHead>
            <TableHead>Telefon raqami</TableHead>
            <TableHead>Buyurtmasi bormi</TableHead>
            <TableHead>Tili</TableHead>
            <TableHead>Telegram</TableHead>
            <TableHead>Hozirgi buyurtmasi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.results?.map((user) => (
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
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
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
                  className="flex items-center text-blue-500 hover:text-blue-700"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Ochish
                </Link>
              </TableCell>
              <TableCell>
                {user.current_order && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add logic to open current order info
                      console.log(`Open current order for user ${user.id}`);
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Buyurtmani ochish
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex space-x-2 items-center p-2">
        <div className="mt-4 w-full flex justify-between items-center">
          <div>
            {users?.count} ta foydalanuvchilar {indexOfFirstUser + 1} dan{" "}
            {Math.min(indexOfLastUser)} gacha
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
            {buttons.map((button, index) =>
              button === "..." ? (
                <span key={index} style={{ margin: "0 5px" }}>
                  ...
                </span>
              ) : (
                <Button
                  key={index}
                  onClick={() => handlePageChange(button as number)}
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
              onClick={() => paginate(currentPage + 1)}
              // disabled={currentPage === totalPages}
              className="w-10 h-10 p-0"
            >
              <ChevronRightIcon className="w-4 h-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      </div>
     
    </div>
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

const fetchUsers = async (page: number, search: string, filter: string): Promise<PaginatedUserResponse> => {
  const { data } = await request.get(`users/pagination?page=${page}&q=${search}&has_order=${filter}`);
  return data;
};

export default function UsersListPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterUser, setFilterUser] = useState<string>("")
  const [searchUser, setSearchUser] = useState<string>("")
  const { data: users, isLoading } = useQuery({
    queryKey: ["users", currentPage],
    queryFn: () => fetchUsers(currentPage, searchUser, filterUser),
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (users?.current_page) {
      queryClient.prefetchQuery({
        queryKey: ["users", currentPage + 1],
        queryFn: () => fetchUsers(currentPage + 1, searchUser, filterUser), // Ensure the function returns the promise
      });
    }
  }, [users, currentPage, filterUser, searchUser]);

  console.log(users);

  return (
    <Layout page="users">
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-5">
          Foydalanuvchilar ro&apos;yxati
        </h1>
        {isLoading ? (
          <UsersTableSkeleton />
        ) : users ? (
          <UsersTable
            users={users}
            setCurrentPage={setCurrentPage}
            setFilterUser={setFilterUser}
            setSearchUser={setSearchUser}
            currentPage={currentPage}
          />
        ) : null}
      </div>
    </Layout>
  );
}
