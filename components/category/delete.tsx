'use client'

import React from 'react';
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle } from 'lucide-react';



export function DeleteModalComponent({ open, setOpen, onDelete }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, onDelete: () => void }) {

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      {/* <DialogTrigger asChild> */}
      {/* <Button variant="destructive">Delete Item</Button> */}
      {/* </DialogTrigger> */}

      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Kategoriyani o&apos;chirmoqchimisiz?
          </DialogTitle>
          <DialogDescription>
            Kategoriya o&apos;chirilgandan so&apos;ng uni qaytarib bo&apos;lmaydi.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="secondary" onClick={() => {
            setOpen(false);
          }}>
            Bekor qilish
          </Button>
          <Button type="button" variant="destructive" onClick={() => {
            onDelete();
          }}>
            O&apos;chirish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}