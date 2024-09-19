'use client'

import { Layout } from '@/components/Layout'
import type { NextPage } from 'next'
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog"
import { IUser } from '@/lib/types'
import { request } from '@/lib/api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Skeleton } from "@/components/ui/Skeleton"
import { MoreVertical } from 'lucide-react'

interface CreateUserData {
    first_name: string;
    last_name: string;
    username: string;
    password: string;
    password_repeat: string;
}

const fetchUsers = async (): Promise<IUser[]> => {
    const { data } = await request.get('users/');
    return data;
}

const UserTable = ({ users }: { users: IUser[] }) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Ismi</TableHead>
                <TableHead>Familyasi</TableHead>
                <TableHead>Username</TableHead>
                {/* <TableHead>Actions</TableHead> */}
            </TableRow>
        </TableHeader>
        <TableBody>
            {users.map((user) => (
                <TableRow key={user.id}>
                    <TableCell>{user.first_name}</TableCell>
                    <TableCell>{user.last_name}</TableCell>
                    <TableCell>{user.username}</TableCell>

                    <TableCell>
                        <UpdateUserDialog user={user} />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
)

const CreateUserDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<CreateUserData>();
    const queryClient = useQueryClient();

    const onSubmit = async (data: CreateUserData) => {
        try {
            await request.post('users/', data);
            queryClient.invalidateQueries({
                queryKey: ['users']
            });
            setIsOpen(false);
            reset();
        } catch (error) {
            console.error('Error creating user:', error);
        }
    }

    const password = watch("password");

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

const UpdateUserDialog = ({ user }: { user: IUser }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<CreateUserData>({
        defaultValues: {
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username
        }
    });
    const queryClient = useQueryClient();

    const onSubmit = async (data: CreateUserData) => {
        try {
            await request.put(`users/${user.id}/`, data);
            queryClient.invalidateQueries({
                queryKey: ['users']
            });
            setIsOpen(false);
            reset();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }

    const onDelete = async () => {
        try {
            await request.delete(`users/${user.id}/`);
            queryClient.invalidateQueries({
                queryKey: ['users']
            });
            setIsOpen(false);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }

    const password = watch("password")

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

const Users: NextPage = () => {
    const { data: users = [], isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: fetchUsers,
    });

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Foydalanuvchilar</h1>
                <CreateUserDialog />
            </div>
            <UserTable users={users} />
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
    return <Layout page={'users'}>
        <Users />
    </Layout>;
}

export default Page;