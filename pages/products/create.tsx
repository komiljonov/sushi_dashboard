'use client';


// import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

import { request } from '@/lib/api';
import { Layout } from '@/components/Layout';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { UploadField } from '@/components/ui/file_upload';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { FormattedInput } from '@/components/ui/formattedInput';
import { IFile } from '@/lib/types';




const getCategoryIdFromUrl = (): string | null => {
    if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        const queryParams = new URLSearchParams(url.search)
        const id = queryParams.get('category')
        return id
    }
    return null
}



interface IFormInput {
    name_uz: string;
    name_ru: string;
    price: number;
    image: string;
    category: string;
}

const createProduct = async (create_data: IFormInput) => {
    const { data } = await request.post('products', create_data);
    return data;
}

function Products() {

    const { push } = useRouter();

    const methods = useForm<IFormInput>();
    const { register, handleSubmit, setValue } = methods;
    const [fileUploading, setFileUploading] = useState<boolean>(false);

    const [categoryId] = useState(getCategoryIdFromUrl);
    const [preview, setPreview] = useState<string>();

    useEffect(() => {
        if (categoryId) {
            setValue('category', categoryId);
        }
    }, [categoryId, setValue]);


    const onFileUpload = (file: IFile) => {
        console.log(file);
        setValue('image', file.id);
        setPreview(file.file);
    }

    const mutation = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            push(`/products?category=${categoryId}`);
        },
        onError: (error) => {
            console.error('Error creating category:', error);
        }
    });

    const handleCreateProduct = (data: IFormInput) => {
        mutation.mutate(data);
    }

    return (
        <div className="w-full p-6">
            <h1 className="text-2xl font-bold mb-6">Mahsulot qo&apos;shish</h1>
            <form onSubmit={handleSubmit(handleCreateProduct)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="name_uz">Nomi (O'z)</Label>
                        <Input
                            id="name_uz"

                            {...register("name_uz", { required: true })}
                            placeholder="Mahsulot nomini o'zbek tilida kiriting..."
                        />
                    </div>
                    <div>
                        <Label htmlFor="name_ru">Nomi (Ru)</Label>
                        <Input
                            id="name_ru"
                            {...register("name_ru", { required: true })}
                            placeholder="Mahsulot nomini rus tilida kiriting..."
                        />
                    </div>
                </div>

                <FormProvider {...methods}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormattedInput
                            id="caption_uz"
                            label="Tavsif (O'z)"
                            placeholder="Mahsulot tavsifini o'zbek tilida kiriting..."
                        />
                        <FormattedInput
                            id="caption_ru"
                            label="Tavsif (Ru)"
                            placeholder="Mahsulot tavsifini rus tilida kiriting..."
                        />
                    </div>
                </FormProvider>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <UploadField onFileUpload={onFileUpload} setFileUploading={setFileUploading}  preview={preview} />
                    <div>
                        <Label htmlFor="price">Narx</Label>
                        <Input
                            id="price"
                            type="number"
                             className="no-spinner"
                            {...register("price", { required: true, valueAsNumber: true })}
                            placeholder="Mahsulot narxini kiriting"
                        />
                    </div>

                </div>

                <Button type="submit" disabled={fileUploading} >Submit</Button>
            </form>
        </div>
    );
}







export default function Page() {
    return (
        <Layout page='categories'>
            <Products />
        </Layout>
    )
}