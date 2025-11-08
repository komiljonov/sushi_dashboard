import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
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

import { ISigment } from "@/lib/types/sigments.types";
import { deleteSigment } from "@/lib/actions/sigments.action";
import { queryClient } from "@/lib/query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/Button";
import SigmentsUpdateModal from "./sigments-update-modal";

interface SigmentsTableProps {
  sigments?: ISigment[];
}

const SigmentsTable = ({ sigments }: SigmentsTableProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSigment, setSelectedSigment] = useState<ISigment | null>(null);
  const { toast } = useToast();

  const { mutate } = useMutation({
    mutationFn: deleteSigment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sigments"] });
      toast({
        title: "Sigment o'chirildi.",
        description: "Sigment muvaffaqiyatli o'chirildi.",
      });
      setShowDeleteDialog(false);
      setSelectedSigment(null);
    },
    onError: () => {
      toast({
        title: "Sigment o'chirishda xato.",
        description: "Sigmentni o'chirishda xato yuz berdi.",
      });
    },
  });

  const handleOpenDeleteDialog = (sigment: ISigment) => {
    setSelectedSigment(sigment);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedSigment) {
      mutate(selectedSigment.id);
    }
  };

  return (
    <>
      <div className="p-4 rounded-2xl bg-white">
        <Table>
          <TableHeader>
            <TableRow className="border-none h-[50px] bg-[#F5F5F5]">
              <TableHead>Nomi</TableHead>
              <TableHead>Oxirgi nechi kun</TableHead>
              <TableHead>Foydalanuvchilar diapazoni</TableHead>
              <TableHead>Soni</TableHead>
              <TableHead>Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sigments === undefined
              ? [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[60px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[40px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-10 w-[180px]" />
                    </TableCell>
                  </TableRow>
                ))
              : sigments.map((sigment) => (
                  <TableRow key={sigment.id}>
                    <TableCell>{sigment.name}</TableCell>
                    <TableCell>{sigment.day}</TableCell>
                    <TableCell>
                      {sigment.min_orders} - {sigment.max_orders}
                    </TableCell>
                    <TableCell>{sigment.users_count}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <SigmentsUpdateModal sigment={sigment} />
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleOpenDeleteDialog(sigment)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={(isOpen) => setShowDeleteDialog(isOpen)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Haqiqatan ham bu sigmentni o&apos;chirmoqchimisiz?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bu amalni qaytarib bo&apos;lmaydi. Bu sigmentni butunlay
              o&apos;chiradi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedSigment(null)}>
              Bekor qilish
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleConfirmDelete}
            >
              O&apos;chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SigmentsTable;
