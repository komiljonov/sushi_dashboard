// pages/index.tsx
import { Layout } from '@/components/Layout';
import type { NextPage } from 'next'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { IUser } from '@/lib/types';


interface CreateUserData {
    name: string;
    email: string;
}


const onCreateUser = (data: CreateUserData) => {
    console.log(data);
}




const users: IUser[] = [
    {
        id: 1,
        name: "Shukurulloh",
        email: "kosdfsdf",
        active: true
    }
]


const Users: NextPage = () => {

    const [isOpen, setIsOpen] = useState(false)
    const { register, handleSubmit, reset } = useForm<CreateUserData>()

    const onSubmit = (data: CreateUserData) => {
        onCreateUser(data)
        setIsOpen(false)
        reset()
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Users</h1>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button>Add New User</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New User</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" {...register("name", { required: true })} />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" {...register("email", { required: true })} />
                            </div>
                            <Button type="submit">Create User</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Switch
                                    checked={user.active}
                                    onCheckedChange={(checked) => onUpdateUserStatus(user.id, checked)}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}


const Page = () => {
    return <Layout page={'users'}>
        <Users />
    </Layout>
}

export default Page;