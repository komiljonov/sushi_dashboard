'use client'

import { Layout } from '@/components/Layout'
import type { NextPage } from 'next'
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { IAdmin } from '@/lib/types'
import { request } from '@/lib/api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Skeleton } from "@/components/ui/skeleton"
import { MoreVertical } from 'lucide-react'
import { queryClient } from '@/lib/query'
import React from 'react'


interface CreateAdminData {
    first_name: string;
    last_name: string;
    username: string;
    password: string;
    password_repeat: string;

    // role: string;
    // filial: string;
}

const fetchAdmins = async (): Promise<IAdmin[]> => {
    const { data } = await request.get('admins/');
    return data;
}




const AdminsTable = ({ admins }: { admins: IAdmin[] }) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Ismi</TableHead>
                <TableHead>Familyasi</TableHead>
                <TableHead>Username</TableHead>
                {/* <TableHead>Lavozim</TableHead> */}
            </TableRow>
        </TableHeader>
        <TableBody>
            {admins.map((admin) => (
                <TableRow key={admin.id}>
                    <TableCell>{admin.first_name}</TableCell>
                    <TableCell>{admin.last_name}</TableCell>
                    <TableCell>{admin.username}</TableCell>
                    {/* <TableCell>{admin.role}</TableCell> */}


                    <TableCell>
                        <UpdateAdminDialog admin={admin} />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
)

const CreateAdminDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<CreateAdminData>();
    const password = watch("password");


    const onSubmit = async (data: CreateAdminData) => {
        try {
            await request.post('admins/', data);
            queryClient.invalidateQueries({
                queryKey: ['admins']
            });
            setIsOpen(false);
            reset();
        } catch (error) {
            console.error('Error creating user:', error);
        }
    }
















    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>Foydalanuvchi qo&apos;shish</Button>
            </DialogTrigger>
            <DialogContent className='bg-white'>
                <DialogHeader>
                    <DialogTitle>Foydalanuvchi qo&apos;shish</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className='flex space-x-6'>
                        <div className='w-[50%]'>
                            <Label htmlFor="first_name">Ism</Label>
                            <Input id="first_name" {...register("first_name", { required: "Ism kiritish shart" })} />
                            {errors.first_name && (
                                <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
                            )}
                        </div>
                        <div className='w-[50%]'>
                            <Label htmlFor="last_name">Familya</Label>
                            <Input id="last_name"  {...register("last_name", { required: "Familya kiritish shart" })} />
                            {errors.last_name && (
                                <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
                            )}
                        </div>
                    </div>


                    <div>
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" {...register("username", { required: "Username kiritish shart" })} />
                        {errors.username && (
                            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                        )}
                    </div>







                    <div>
                        <Label htmlFor="password">Parol</Label>
                        <Input id="password" type="password" {...register("password", { required: "Parol kiritish shart" })} />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="password_repeat">Parolni takrorlang</Label>
                        <Input
                            id="password_repeat"
                            type="password"
                            {...register("password_repeat", {
                                required: "Parolni takrorlash shart",
                                validate: value => value === password || "Parollar mos kelmadi"
                            })}
                        />
                        {errors.password_repeat && (
                            <p className="text-red-500 text-sm mt-1">{errors.password_repeat.message}</p>
                        )}
                    </div>


                    <Button type="submit">Qo&apos;shish</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

const DeleteConfirmationDialog = ({ onConfirm, isOpen, setIsOpen }: { onConfirm: () => void, isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='bg-white'>
            <DialogHeader>
                <DialogTitle>Aniq bu foydalanuvchini o&apos;chirmoqchimisiz?</DialogTitle>
                <DialogDescription>
                    Bu foydalanuvchini o&apos;chirgandan so&apos;ng qaytarib bo&apos;lmaydi
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button onClick={() => setIsOpen(false)}>Bekor qilish</Button>
                <Button variant="destructive" onClick={() => {
                    onConfirm();
                    setIsOpen(false);
                }}>O&apos;chirish</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

const UpdateAdminDialog = ({ admin }: { admin: IAdmin }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<CreateAdminData>();


    useEffect(() => {
        reset({
            first_name: admin.first_name,
            last_name: admin.last_name,
            username: admin.username
        })
    }, [admin, reset]);

    const updateAdminMutation = useMutation({
        mutationFn: (data: CreateAdminData) => request.put(`admins/${admin.id}/`, data),
        onSuccess: () => {
            // queryClient.invalidateQueries({
            //     queryKey: ['admins'],
            // });

            queryClient.refetchQueries({ queryKey: ['admins'] });
            setIsOpen(false);
            reset();
        },
        onError: (error) => {
            console.error('Error updating user:', error);
        }
    });

    const deleteAdminMutation = useMutation({
        mutationFn: () => request.delete(`admins/${admin.id}/`),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['admins'],
            });
            setIsOpen(false);
        },
        onError: (error) => {
            console.error('Error deleting user:', error);
        }
    });

    const onSubmit = (data: CreateAdminData) => {
        updateAdminMutation.mutate(data);
    };

    const onDelete = () => {
        deleteAdminMutation.mutate();
    };

    const password = watch("password");


    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className='bg-white'>
                    <DialogHeader>
                        <DialogTitle>Update User</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        <div className='flex space-x-6'>
                            <div className='w-[50%]'>
                                <Label htmlFor="first_name">Ism</Label>
                                <Input id="first_name" {...register("first_name", { required: "Ism kiritish shart" })} />
                                {errors.first_name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
                                )}
                            </div>
                            <div className='w-[50%]'>
                                <Label htmlFor="last_name">Familya</Label>
                                <Input id="last_name"  {...register("last_name", { required: "Familya kiritish shart" })} />
                                {errors.last_name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
                                )}
                            </div>
                        </div>


                        <div>
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" {...register("username", { required: "Username kiritish shart" })} />
                            {errors.username && (
                                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                            )}
                        </div>




                        <div>
                            <Label htmlFor="password">Parol</Label>
                            <Input id="password" type="password" {...register("password")} />
                        </div>
                        <div>
                            <Label htmlFor="password_repeat">Parolni takrorlang</Label>
                            <Input
                                id="password_repeat"
                                type="password"
                                {...register("password_repeat", {
                                    validate: value => !password || value === password || "Parollar mos kelmadi"
                                })}
                            />
                            {errors.password_repeat && (
                                <p className="text-red-500 text-sm mt-1">{errors.password_repeat.message}</p>
                            )}
                        </div>
                        <div className="flex justify-between">
                            <Button type="submit">Saqlash</Button>
                            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>O&apos;chirish</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
            <DeleteConfirmationDialog
                onConfirm={onDelete}
                isOpen={isDeleteDialogOpen}
                setIsOpen={setIsDeleteDialogOpen}
            />
        </>
    )
}

const Admins: NextPage = () => {
    const { data: admins, isLoading } = useQuery({
        queryKey: ["admins"],
        queryFn: fetchAdmins,
    });

    if (isLoading || !admins) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Foydalanuvchilar</h1>
                <CreateAdminDialog />
            </div>
            <AdminsTable admins={admins} />
        </div>
    );
}

const LoadingSkeleton = () => (
    <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                    <Skeleton className="h-12 w-1/2" />
                    <Skeleton className="h-12 w-1/2" />
                </div>
            ))}
        </div>
    </div>
);

const Page = () => {
    return <Layout page={'admins'}>
        <Admins />
    </Layout>;
}

export default Page;