import { Layout } from "@/components/Layout";
import React, { useEffect } from "react";
import { useCrumb } from "@/lib/context/crumb-provider";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { request } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IUser } from "@/lib/types";

interface Ifeedback {
  id: string;
  name: string;
  users_count: number;
  link: string;
  not_ordered_users_count: number;
  ordered_users_count: number;
  comment: string;
  user: IUser;
  service: Iservice;
}

interface Iservice {
  id: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  users_count: number;
  link: string;
  name_uz: string;
  name_ru: string;
}

export function Index() {
  const fetchFeedbacks = async (): Promise<Ifeedback[]> => {
    const { data } = await request.get("feedbacks/");
    return data;
  };

  const {
    data: feedbacks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["feedbacks"],
    queryFn: fetchFeedbacks,
    refetchInterval: 10000,
  });
  console.log(feedbacks);

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>Xato</AlertTitle>
        <AlertDescription>
          Ma'lumotlarni yuklashda xatolik yuz berdi. Iltimos, qaytadan urinib
          ko'ring.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Izohlar</h1>

      <div className="p-4 rounded-xl bg-white space-y-4">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F5F5F5] border-none">
              <TableHead className="rounded-l-[10px]">T/R</TableHead>
              <TableHead>Foydalanuvchi ismi</TableHead>
              <TableHead>Xizmat</TableHead>
              <TableHead>Izoh</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-[200px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                  </TableRow>
                ))
              : feedbacks?.map((feedback, index) => (
                  <TableRow key={feedback.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{feedback?.user?.name}</TableCell>
                    <TableCell>{feedback?.service?.name_uz}</TableCell>
                    <TableCell className="max-w-[500px]">{feedback?.comment}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
      // open={deleteConfirmation.isOpen}
      // onOpenChange={(isOpen) =>
      //   setDeleteConfirmation({ isOpen, feedbackId: null })
      // }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Haqiqatan ham bu referal havolasini o&apos;chirmoqchimisiz?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bu amalni qaytarib bo&apos;lmaydi. Bu referal havolasini butunlay
              o&apos;chiradi va u bilan bog&apos;liq barcha ma&apos;lumotlarni
              olib tashlaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              // onClick={handleConfirmDelete}
            >
              O&apos;chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function Page() {
  const { setCrumb } = useCrumb();

  useEffect(() => {
    setCrumb([{ label: "Promokodlar", path: "/promocodes" }]);
  }, [setCrumb]);
  return (
    <Layout page={"feedbacks"}>
      <Index />
    </Layout>
  );
}
