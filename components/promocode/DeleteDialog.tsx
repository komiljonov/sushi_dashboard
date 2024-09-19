import { Button } from "@/components/ui/Button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog"
import { IPromocode } from "@/lib/types"
import { AlertTriangle } from "lucide-react";

interface DeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    promocode: IPromocode | null;
    onDelete: () => void;
}

export function DeleteDialog({ open, onOpenChange, onDelete }: DeleteDialogProps) {

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>


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
                        onOpenChange(false);
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