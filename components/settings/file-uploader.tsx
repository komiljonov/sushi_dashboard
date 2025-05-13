"use client";

import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { UploadCloud, Loader2 } from "lucide-react";
import Image from "next/image";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface FileUploaderProps {
  label?: string;
  accept?: string;
  onSuccess: (fileId: string) => void;
  className?: string;
}

// Fake API call – replace with your real upload logic
async function uploadFile(file: File): Promise<{ fileId: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");

  return res.json(); // expects { fileId: string }
}

export function FileUploader({
  label = "Faylni yuklang",
  accept = "*",
  onSuccess,
  className,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: uploadFile,
    onSuccess: (data) => {
      onSuccess(data.fileId);
    },
  });

  const handleClick = () => inputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }

    mutate(file); // Upload immediately
  };

  return (
    <div className={cn("", className)}>
      <Label>{label}</Label>

      <Input
        type="file"
        accept={accept}
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <Button
        type="button"
        variant="outline"
        onClick={handleClick}
        disabled={isPending}
        className="flex gap-2 items-center w-full input"
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin w-4 h-4" /> Yuklanmoqda...
          </>
        ) : (
          <>
            <UploadCloud className="w-4 h-4" /> Fayl tanlash
          </>
        )}
      </Button>

      {fileName && (
        <p className="text-sm text-muted-foreground">
          Tanlangan fayl: <strong>{fileName}</strong>
        </p>
      )}

      {previewUrl && (
        <Image
          src={previewUrl}
          alt="Preview"
          className="mt-2 max-w-xs rounded border"
        />
      )}
    </div>
  );
}
