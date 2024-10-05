'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

import { request } from '@/lib/api';
import { Layout } from '@/components/Layout';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { UploadField } from '@/components/ui/file_upload';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedInput } from '@/components/ui/formattedInput';
import { IFile, IProduct } from '@/lib/types';
import { useMutation, useQuery } from '@tanstack/react-query';




const getProductIdFromUrl = (): string | null => {
    if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        const queryParams = new URLSearchParams(url.search)
        const id = queryParams.get('id')
        return id
    }
    return null
}

const fetchProductData = async (id: string): Promise<IProduct> => {
    const { data } = await request.get(`products/${id}`)
    return data;
}



const editProduct = async (new_data: IProduct) => {
    const { data } = await request.patch(`products/${new_data.id}`, {
        name_uz: new_data.name_uz,
        name_ru: new_data.name_ru,
        caption_uz: new_data.caption_uz,
        caption_ru: new_data.caption_ru,
        price: new_data.price,
        image: new_data.image
    })
    return data;
}







function Products() {


    const methods = useForm<IProduct>();
    const { register, handleSubmit, setValue, reset } = methods;
    const [fileUploading, setFileUploading] = useState<boolean>(false);
    const [productId] = useState(getProductIdFromUrl);

    const [image, setImage] = useState<string | null>();


    useEffect(() => {
        if (productId) {
            setValue('category', productId);
        }
    }, [productId, setValue]);

    const { data: product, isSuccess } = useQuery({
        queryKey: ["product", productId],
        queryFn: () => {
            if (productId != null) {
                return fetchProductData(productId);
            }
            return Promise.reject(new Error("Product ID is null"));
        },
        enabled: productId !== null
    });




    const mutation = useMutation({
        mutationFn: (data: IProduct) => {
            if (productId !== null) {
                return editProduct(data);
            }
            return Promise.reject(new Error('Category ID is null'));
        }
    });



    useEffect(() => {
        if (isSuccess) {
            reset({
                id: product.id,
                name_uz: product.name_uz,
                name_ru: product.name_ru,
                caption_uz: product.caption_uz,
                caption_ru: product.caption_ru,
                price: product.price,
                image: (product.image as IFile)?.id
            });
            setImage((product.image as IFile)?.file);
        }
    }, [isSuccess, reset, product]);


    const handleCreateProduct = (product_data: IProduct) => {
        mutation.mutate(product_data);
    }

    const onFileUpload = (file: IFile) => {
        setValue('image', file.id);
        setImage(file.file);
    }



    return (
        <div className="w-full max-w-4xl p-6">
            <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
            <form onSubmit={handleSubmit(handleCreateProduct)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="name_uz">Name (Uzbek)</Label>
                        <Input
                            id="name_uz"

                            {...register("name_uz", { required: true })}
                            placeholder="Mahsulotning o'zbek tilidagi nomini kiriting."
                        />
                    </div>
                    <div>
                        <Label htmlFor="name_ru">Name (Russian)</Label>
                        <Input
                            id="name_ru"
                            {...register("name_ru", { required: true })}
                            placeholder="Mahsulotni rus tilidagi nomini kiriting."
                        />
                    </div>

                </div>

                <FormProvider {...methods}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormattedInput
                            id="caption_uz"
                            label="Tavsif"
                            placeholder="Mahsulotni ma'lumotlarini kiriting"
                        />
                        <FormattedInput
                            id="caption_ru"
                            label="Tavsif rus tilida"
                            placeholder="Mahsulotni rus tilidagi ma'lumotini kiriting"
                        />
                    </div>
                </FormProvider>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <UploadField onFileUpload={onFileUpload} setFileUploading={setFileUploading} preview={image || ''} />
                    <div>
                        <Label htmlFor="price">Narxi</Label>
                        <Input
                            id="price"
                            type="number"
                            {...register("price", { required: true, valueAsNumber: true })}
                            placeholder="Mahsulot narxini kiriting."
                        />
                    </div>

                </div>


                <Button type="submit" disabled={fileUploading || mutation.status == 'pending'} >Saqlash</Button>
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