import React, { useRef, useState, useEffect } from "react";
import { UploadCloud, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { request } from "@/lib/api";

interface UploadedFile {
  file: File;
  progress: number;
  uploaded: boolean;
  response?: {
    id: string;
    url?: string;
  };
}

interface FileUploaderProps {
  value?: string; // uploaded file ID
  onChange?: (fileId?: string) => void;
}

export function FileUploader({ value, onChange }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFile, setUploadingFile] = useState<UploadedFile | null>(null);

  useEffect(() => {
    if (!value) {
      setUploadingFile(null);
    }
  }, [value]);

  const triggerInput = () => fileInputRef.current?.click();

  const createFormData = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return formData;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so onChange fires next time even if same file chosen
    e.target.value = "";

    const newFile: UploadedFile = { file, progress: 0, uploaded: false };
    setUploadingFile(newFile);
    onChange?.(undefined);

    try {
      const res = await request.post("/files/upload", createFormData(file), {
        onUploadProgress: (event) => {
          const progress = Math.round((event.loaded * 100) / (event.total || 1));
          setUploadingFile((prev) => (prev ? { ...prev, progress } : null));
        },
      });

      const finalFile: UploadedFile = {
        ...newFile,
        progress: 100,
        uploaded: true,
        response: res.data,
      };

      setUploadingFile(finalFile);
      onChange?.(res.data.id);
    } catch (error) {
      console.error("Upload failed", error);
      setUploadingFile(null);
      onChange?.(undefined);
    }
  };

  return (
    <div
      className="border rounded-xl p-6 text-center cursor-pointer bg-[#FAFAFA] hover:bg-muted/50 transition"
      onClick={triggerInput}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      {uploadingFile ? (
        <div className="space-y-2">
          <div className="text-sm truncate">{uploadingFile.file.name}</div>

          {/* Show progress only if upload is not complete */}
          {uploadingFile.progress < 100 && (
            <Progress value={uploadingFile.progress} />
          )}

          {/* Show uploaded message once upload is done */}
          {uploadingFile.uploaded && (
            <div className="text-green-600 text-sm flex items-center justify-center gap-1 mt-1">
              <CheckCircle size={16} />
              <span>Fayl yuklandi</span>
            </div>
          )}
        </div>
      ) : value ? (
        <div className="text-sm text-center text-green-600 flex items-center justify-center gap-1">
          <CheckCircle size={20} />
          <span>Fayl yuklandi</span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <UploadCloud size={32} className="text-[#038AFF]" />
          <span className="text-md font-medium text-[#0F0F0F]">
            Faylni olib keling yoki bu yerga bosing
          </span>
        </div>
      )}
    </div>
  );
}
