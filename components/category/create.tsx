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
import { useForm, Controller } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { request } from '@/lib/api'
import { queryClient } from '@/lib/query'
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "../ui/select"
import { ICategory } from "@/lib/types"


interface IFormInput {
    name_uz: string
    name_ru: string
    content_type: string
    parent?: string
}

const createCategory = async (create_data: IFormInput) => {
    const { data } = await request.post('categories', create_data)
    return data
}

interface CreateCategoryModalProps {
    children: React.ReactNode;
    parent: ICategory | null;
}

export default function CreateCategoryModal({ children, parent }: CreateCategoryModalProps) {
    const [open, setOpen] = useState(false)
    const { register, handleSubmit, formState: { errors }, reset, control } = useForm<IFormInput>()

    const mutation = useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            reset()
            setOpen(false)
        },
        onError: (error) => {
            console.error('Error creating category:', error)
        }
    })

    const _handleSubmit = (data: IFormInput) => {
        if (parent) {
            data.parent = parent.id;
        }
        mutation.mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Create Category</DialogTitle>
                    <DialogDescription>
                        {parent
                            ? `Create a new subcategory under ${parent.name_uz}`
                            : 'Create a new top-level category'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(_handleSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name_uz">Name (UZ)</Label>
                        <Input
                            id="name_uz"
                            className="w-full border-gray-300"
                            {...register('name_uz', { required: "Name (UZ) is required" })}
                        />
                        {errors.name_uz && <p className="text-sm text-red-500">{errors.name_uz.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name_ru">Name (RU)</Label>
                        <Input
                            id="name_ru"
                            className="w-full border-gray-300"
                            {...register('name_ru', { required: "Name (RU) is required" })}
                        />
                        {errors.name_ru && <p className="text-sm text-red-500">{errors.name_ru.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content_type">Content Type</Label>
                        <Controller
                            control={control}
                            name="content_type"
                            rules={{ required: "Content type is required" }}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger id="content_type" className="w-full">
                                        <SelectValue placeholder="Select content type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CATEGORY">Kategoriya</SelectItem>
                                        <SelectItem value="PRODUCT">Mahsulot</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.content_type && <p className="text-sm text-red-500">{errors.content_type.message}</p>}
                    </div>
                    <Button type="submit" className="w-full" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Creating...' : 'Create Category'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}