import React, { useState, useCallback } from 'react'
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Loader2 } from "lucide-react"
import Image from 'next/image'

interface UploadFieldProps {
    onFileUpload: (fileId: string) => void // Modify this to handle API response
    setFileUploading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function UploadField({ onFileUpload, setFileUploading }: UploadFieldProps) {
    const [fileName, setFileName] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [preview, setPreview] = useState<string | null>(null);


    

    const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {

            const formData = new FormData();
            formData.append('file', file);

            setLoading(true);
            setFileUploading(true);

            await new Promise(resolve => setTimeout(resolve, 2000))


            try {
                const response = await fetch('http://127.0.0.1:8000/api/files/upload', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    onFileUpload(data.id);
                    setPreview(data.file);
                    setFileName(data.filename);
                } else {
                    console.error("Failed to upload file");
                }
            } catch (error) {
                console.error("Error uploading file:", error);
            } finally {
                setLoading(false);
                setFileUploading(false);
            }
        }
    }, [onFileUpload, setFileUploading]);

    return (
        <div className="grid w-full  items-center gap-1.5">
            <Label htmlFor="picture">Product Image</Label>
            <Input id="picture" type="file" onChange={handleFileChange} disabled={loading} />
            {loading && (
                <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading...</span>
                </div>
            )}
            {fileName && <p className="text-sm text-gray-500">File: {fileName}</p>}
            {preview && (
                <div className="mt-2">
                    <Image src={preview} alt="File preview" width={300} height={300} className="max-w-full h-auto rounded-md" />
                </div>
            )}
        </div>
    );
}