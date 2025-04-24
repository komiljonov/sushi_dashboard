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
    parent: string | null;
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
            data.parent = parent;
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
                    <DialogTitle>Kategoriya yaratish</DialogTitle>
                    <DialogDescription>
                        {parent
                            ? `Yangi pastki kategoriya yarating`
                            : 'Yangi yuqori darajadagi kategoriya yarating'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(_handleSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name_uz">Nomi (UZ)</Label>
                        <Input
                            id="name_uz"
                            className="w-full input border-gray-300"
                            {...register('name_uz', { required: "Name (UZ) is required" })}
                        />
                        {errors.name_uz && <p className="text-sm text-red-500">{errors.name_uz.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name_ru">Nomi (RU)</Label>
                        <Input
                            id="name_ru"
                            className="w-full input border-gray-300"
                            {...register('name_ru', { required: "Name (RU) is required" })}
                        />
                        {errors.name_ru && <p className="text-sm text-red-500">{errors.name_ru.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content_type">Kontent turi</Label>
                        <Controller
                            control={control}
                            name="content_type"
                            rules={{ required: "Content type is required" }}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger id="content_type" className="w-full input h-[44px]">
                                        <SelectValue placeholder="Kontent turini tanlang" />
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
                    <Button type="submit" className="w-full button" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Yaratilmoqda...' : 'Kategoriya yaratish'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}