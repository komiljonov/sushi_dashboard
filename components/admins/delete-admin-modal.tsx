"use client";
import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const DeleteConfirmationDialog = ({
  onConfirm,
  isOpen,
  setIsOpen,
}: {
  onConfirm: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => (
  <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogContent className="bg-white">
      <DialogHeader>
        <DialogTitle>
          Aniq bu foydalanuvchini o&apos;chirmoqchimisiz?
        </DialogTitle>
        <DialogDescription>
          Bu foydalanuvchini o&apos;chirgandan so&apos;ng qaytarib
          bo&apos;lmaydi
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button onClick={() => setIsOpen(false)}>Bekor qilish</Button>
        <Button
          variant="destructive"
          onClick={() => {
            onConfirm();
            setIsOpen(false);
          }}
        >
          O&apos;chirish
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default DeleteConfirmationDialog;
