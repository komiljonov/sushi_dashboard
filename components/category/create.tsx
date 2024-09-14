"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
// import { createCategory } from "./api/category" // Update the import path accordingly
import { request } from '@/lib/api';
import { queryClient } from '@/lib/query';


interface IFormInput {
    name_uz: string;
    name_ru: string;
}



const createCategory = async (create_data: IFormInput) => {
    const { data } = await request.post('categories', create_data);
    return data;
}

export default function CreateCategoryModal({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<IFormInput>();

    // Use mutation hook for creating a category
    const mutation = useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            // Invalidate and refetch the 'categories' query
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            reset();
            setOpen(false);
        },
        onError: (error) => {
            // Handle error (optional)
            console.error('Error creating category:', error);
        }
    });

    const _handleSubmit = (data: IFormInput) => {
        mutation.mutate(data); // Trigger mutation
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {/* <Button variant="outline">Create Category</Button> */}
                {children}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Create Category</DialogTitle>
                </DialogHeader>
                <DialogDescription>Create Category Dialog</DialogDescription>
                <form onSubmit={handleSubmit(_handleSubmit)} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name_uz" className="text-right">
                            Name (UZ)
                        </Label>
                        <Input id="name_uz" className="col-span-3 border-gray-950" {...register('name_uz', { required: "Name (UZ) is required" })} />
                        {errors.name_uz && <p className="text-sm text-red-500">{errors.name_uz.message}</p>}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name_ru" className="text-right">
                            Name (RU)
                        </Label>
                        <Input id="name_ru" className="col-span-3 border-gray-950" {...register('name_ru', { required: "Name (RU) is required" })} />
                        {errors.name_ru && <p className="text-sm text-red-500">{errors.name_ru.message}</p>}
                    </div>
                    <Button type="submit" className="ml-auto" disabled={mutation.isPending}>
                        {mutation ? 'Creating...' : 'Create'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
