import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Post } from "./posts-table";

interface Props {
  open: boolean;
  onClose: () => void;
  post: Post | null;
  onConfirm: () => void;
  loading?: boolean;
}

export default function PostDeleteModal({ open, onClose, post, onConfirm, loading }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Postni o‘chirish</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mb-4">
          Rostdan ham <strong>{post?.title}</strong> postini o‘chirmoqchimisiz?
        </p>
        <Button
          className="w-full bg-red-600 hover:bg-red-700"
          onClick={onConfirm}
          disabled={loading}
        >
          Ha, o‘chirish
        </Button>
      </DialogContent>
    </Dialog>
  );
}
