"use client";

import { Layout } from "@/components/Layout";
import type { NextPage } from "next";
import { useEffect,  } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { request } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

import { IAdmin } from "@/lib/types";
import { useCrumb } from "@/lib/context/crumb-provider";
import AddAdminModal from "@/components/admins/add-admin-modal";
import UpdateAdminModal from "@/components/admins/edit-admin-modal";



const fetchAdmins = async (): Promise<IAdmin[]> => {
  const { data } = await request.get("admins/");
  return data;
};

const AdminsTable = ({ admins }: { admins: IAdmin[] }) => (
  <div className="p-4 rounded-2xl bg-white">
    <Table>
      <TableHeader>
        <TableRow className="border-none h-[50px] bg-[#F5F5F5]">
          <TableHead className="rounded-l-xl ">Ismi</TableHead>
          <TableHead>Familyasi</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Lavozim</TableHead>
          <TableHead className="rounded-r-xl"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {admins?.map((admin) => (
          <TableRow key={admin.id}>
            <TableCell className="rounded-l-xl ">{admin.first_name}</TableCell>
            <TableCell>{admin.last_name}</TableCell>
            <TableCell>{admin.username}</TableCell>
            <TableCell>{admin.role}</TableCell>
            <TableCell className="rounded-r-xl">
              <UpdateAdminModal admin={admin} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);




const Admins: NextPage = () => {
  const { data: admins, isLoading } = useQuery({
    queryKey: ["admins"],
    queryFn: fetchAdmins,
  });

  if (isLoading || !admins) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Xodimlar</h1>
        <AddAdminModal />
      </div>
      <AdminsTable admins={admins} />
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="mx-auto">
    <div className="flex justify-between items-center mb-6">
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-10 w-40" />
    </div>
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="h-12 w-1/4" />
          <Skeleton className="h-12 w-1/4" />
          <Skeleton className="h-12 w-1/4" />
          <Skeleton className="h-12 w-1/4" />
        </div>
      ))}
    </div>
  </div>
);

const Page = () => {
  const { setCrumb } = useCrumb();

  useEffect(() => {
    setCrumb([{ label: "Xodimlar", path: "/admins" }]);
  }, [setCrumb]);
  return (
    <Layout page={"admins"}>
      <Admins />
    </Layout>
  );
};

export default Page;
