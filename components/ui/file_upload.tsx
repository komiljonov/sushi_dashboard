import React, { useState, useCallback } from 'react'
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Loader2 } from "lucide-react"
import Image from 'next/image'
import { IFile } from '@/lib/types'
import { useMutation } from '@tanstack/react-query';  // useMutation for handling side-effects
import { request } from "@/lib/api";  // Axios instance

interface UploadFieldProps {
    onFileUpload: (file: IFile) => void; // Handle API response
    setFileUploading: React.Dispatch<React.SetStateAction<boolean>>;
    preview?: string;
}

export function UploadField({ onFileUpload, setFileUploading, preview }: UploadFieldProps) {
    const [fileName, setFileName] = useState<string | null>(null);

    // useMutation to handle the file upload
    const mutation = useMutation(
        {
            mutationFn: async (file: File) => {
                const formData = new FormData();
                formData.append('file', file);

                return request.post('/files/upload', formData);  // Axios POST request with form data
            },
            onMutate: () => {
                setFileUploading(true);  // Set file uploading state when mutation starts
            },
            onSuccess: (response) => {
                const data = response.data;  // Axios response structure
                setFileUploading(false);
                onFileUpload(data);
                setFileName(data.filename);
            },
            onError: (error) => {
                console.error("Error uploading file:", error);
                setFileUploading(false);
            },
            onSettled: () => {
                setFileUploading(false);  // Reset file uploading state when mutation is settled
            },
        }
    );




    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            mutation.mutate(file);  // Trigger mutation with the selected file
        }
    }, [mutation]);

    return (
        <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="picture">Product Image</Label>
            <Input id="picture" type="file" onChange={handleFileChange} disabled={mutation.status == "pending"} />
            {mutation.status == "pending" && (
                <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading...</span>
                </div>
            )}
            {fileName && <p className="text-sm text-gray-500">File: {fileName}</p>}
            {preview && (
                <div className="mt-2">
                    <Image src={preview || ''} alt="File preview" width={150} height={150} className="max-w-full h-auto rounded-md" />
                </div>
            )}
        </div>
    );
}