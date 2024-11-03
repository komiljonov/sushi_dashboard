'use client'

import { useCallback, useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { CreditCard, DollarSign, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import Link from 'next/link'
import Image from 'next/image'
import { IPayment } from '@/lib/types'
import { request } from "@/lib/api"
import { useQuery } from '@tanstack/react-query'
import { Layout } from '@/components/Layout'
import { splitToHundreds } from '@/lib/utils'
import { format } from 'date-fns'

const ProviderIcon = ({ provider }: { provider: IPayment['provider'] }) => {
    switch (provider) {
        case 'payme':
            return <Avatar><Image src="/images/payme.png" alt="Payme" width={40} height={40} /></Avatar>
        case 'click':
            return <Avatar><Image src="/images/click.png" alt="Click" width={40} height={40} /></Avatar>
        case 'cash':
            return <DollarSign className="h-6 w-6" />
        default:
            return <CreditCard className="h-6 w-6" />
    }
}

const fetchPayments = async (): Promise<IPayment[]> => {
    const { data } = await request.get('payments')
    return data
}

interface Filter {
    user: string;
    provider: string;
    startDate: string;
    endDate: string;
}

function FilterSection({ filters, setFilters }: {
    filters: Filter,
    setFilters: React.Dispatch<React.SetStateAction<Filter>>
}) {
    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Filterlash</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                        <Label htmlFor="user-filter">Foydalanuvchi</Label>
                        <Input
                            id="user-filter"
                            value={filters.user}
                            onChange={(e) => setFilters({ ...filters, user: e.target.value })}
                            placeholder="Filter by user"
                        />
                    </div>
                    <div>
                        <Label htmlFor="provider-filter">Manba</Label>
                        <Select value={filters.provider} onValueChange={(value) => setFilters({ ...filters, provider: value })}>
                            <SelectTrigger id="provider-filter">
                                <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Hammasi</SelectItem>
                                <SelectItem value="PAYME">Payme</SelectItem>
                                <SelectItem value="CLICK">Click</SelectItem>
                                <SelectItem value="CASH">Naqt</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="start-date">Oraliq boshlanishi</Label>
                        <Input
                            id="start-date"
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="end-date">Oraliq tugashi</Label>
                        <Input
                            id="end-date"
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function EnhancedPaymentListing() {
    const [filteredPayments, setFilteredPayments] = useState<IPayment[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const [sortColumn, setSortColumn] = useState<keyof IPayment | ''>('');

    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [filters, setFilters] = useState<Filter>({
        user: '',
        provider: 'all',
        startDate: '',
        endDate: ''
    });

    const { data: payments, isLoading, error } = useQuery<IPayment[], Error>({
        queryKey: ['payments'],
        queryFn: fetchPayments,
    });

    const handleSort = useCallback((column: keyof IPayment) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }, [sortColumn, sortDirection]);

    useEffect(() => {
        if (payments) {
            let result = payments
            if (filters.user) {
                result = result.filter(payment =>
                    payment.user.name.toLowerCase().includes(filters.user.toLowerCase()) || payment.user.number.toLowerCase().includes(filters.user.toLowerCase())
                )
            }
            if (filters.provider !== 'all') {
                result = result.filter(payment => payment.provider === filters.provider)
            }
            if (filters.startDate) {
                result = result.filter(payment => new Date(payment.created_at) >= new Date(filters.startDate))
            }
            if (filters.endDate) {
                result = result.filter(payment => new Date(payment.created_at) <= new Date(filters.endDate))
            }
            setFilteredPayments(result)
            setCurrentPage(1)
        }
    }, [payments, filters]);

    useEffect(() => {
        if (sortColumn) {
            handleSort(sortColumn)
        }
    }, [handleSort, sortColumn]);

    const itemsPerPage = 20;

    const sortedPayments = [...filteredPayments].sort((a, b) => {
        if (!sortColumn) return 0
        if (a[sortColumn]! < b[sortColumn]!) return sortDirection === 'asc' ? -1 : 1
        if (a[sortColumn]! > b[sortColumn]!) return sortDirection === 'asc' ? 1 : -1
        return 0
    });

    const paginatedPayments = sortedPayments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(sortedPayments.length / itemsPerPage);

    if (isLoading) {
        return (
            <Card>
                <CardContent>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Hatolik</AlertTitle>
                <AlertDescription>
                    An error occurred while fetching payments: {error.message}
                </AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Buyurtmalar</h1>

            <FilterSection filters={filters} setFilters={setFilters} />

            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="cursor-pointer" onClick={() => handleSort('user')}>Foydalanuvchi</TableHead>
                                <TableHead className="cursor-pointer" onClick={() => handleSort('provider')}>Manba</TableHead>
                                <TableHead className="cursor-pointer" onClick={() => handleSort('order')}>Buyurtma</TableHead>
                                <TableHead className="cursor-pointer" onClick={() => handleSort('created_at')}>Vaqti</TableHead>
                                <TableHead className="cursor-pointer" onClick={() => handleSort('amount')}>Miqdori</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedPayments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <Avatar>
                                                <AvatarFallback>{payment.user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{payment.user.name}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <ProviderIcon provider={payment.provider} />
                                            <span className="capitalize">{payment.provider && {
                                                "CASH": "Naqd",
                                                "PAYME": "Payme",
                                                "CLICK": "Click"
                                            }[payment?.provider]}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {payment.order && (
                                            <Link href={`/orders/info?id=${payment.order_id}`} className="hover:underline">
                                                <Badge variant="outline">#{payment.order}</Badge>
                                            </Link>
                                        )}
                                    </TableCell>
                                    <TableCell>{format(new Date(payment.created_at), 'yyyy-MM-dd HH:mm:ss')}</TableCell>
                                    <TableCell>{splitToHundreds(payment.amount / 100)} so&apos;m</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="flex items-center justify-between space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Oldingi
                        </Button>
                        <div className="text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Keyingi
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function Page() {
    return (
        <Layout page="payments">
            <EnhancedPaymentListing />
        </Layout>
    )
}