"use client"

import { Layout } from "@/components/Layout"
import { Button } from "@/components/ui/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IUser } from "@/lib/types"
import { CheckCircle, XCircle, ExternalLink, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { request } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { Skeleton } from "@/components/ui/skeleton"

function UsersTable({ users }: { users: IUser[] }) {
    const { push } = useRouter()
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const totalPages = Math.ceil(users.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentUsers = users.slice(startIndex, endIndex)

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Has Order</TableHead>
                        <TableHead>Language</TableHead>
                        <TableHead>Telegram</TableHead>
                        <TableHead>Current Order</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentUsers.map((user) => (
                        <TableRow
                            key={user.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => {
                                push(`/users/info?id=${user.id}`)
                            }}
                        >
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.number}</TableCell>
                            <TableCell>
                                {user.has_order ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-500" />
                                )}
                            </TableCell>
                            <TableCell>{user.lang == "uz" ? "O'zbek tili" : "Rus tili"}</TableCell>
                            <TableCell>
                                <Link
                                    href={`https://t.me/${user.username}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center text-blue-500 hover:text-blue-700"
                                >
                                    <ExternalLink className="h-4 w-4 mr-1" />
                                    Open
                                </Link>
                            </TableCell>
                            <TableCell>
                                {user.current_order && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            // Add logic to open current order info
                                            console.log(`Open current order for user ${user.id}`)
                                        }}
                                    >
                                        <ShoppingCart className="h-4 w-4 mr-1" />
                                        View Order
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>
                <div className="text-sm font-medium">
                    Page {currentPage} of {totalPages}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

function UsersTableSkeleton() {
    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Has Order</TableHead>
                        <TableHead>Language</TableHead>
                        <TableHead>Telegram</TableHead>
                        <TableHead>Current Order</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(5)].map((_, index) => (
                        <TableRow key={index}>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-5 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-24" />
            </div>
        </div>
    )
}

const fetchUsers = async (): Promise<IUser[]> => {
    const { data } = await request.get('users/')
    return data
}

export default function UsersListPage() {
    const { data: users, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
        refetchInterval: 60000
    })

    return (
        <Layout page="users">
            <div className="container mx-auto py-10">
                <h1 className="text-2xl font-bold mb-5">Users List</h1>
                {isLoading ? (
                    <UsersTableSkeleton />
                ) : users ? (
                    <UsersTable users={users} />
                ) : null}
            </div>
        </Layout>
    )
}