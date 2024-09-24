'use client'

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
import { IPayment } from '@/lib/types';
import { request } from "@/lib/api";
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { splitToHundreds } from '@/lib/utils';



const ProviderIcon = ({ provider }: { provider: IPayment['provider'] }) => {
    switch (provider) {
        case 'payme':
            return <Avatar><Image src={"/images/payme.png"} alt="Payme" width={40} height={40} /></Avatar>
        case 'click':
            return <Avatar><Image src={"/images/click.png"} alt="Payme" width={40} height={40} /></Avatar>
        case 'cash':
            return <DollarSign className="h-6 w-6" />
        default:
            return <CreditCard className="h-6 w-6" />
    }
}



const fetchPayments = async (): Promise<IPayment[]> => {
    const { data } = await request.get('payments');
    return data;
}




function EnhancedPaymentListing() {
    const [filteredPayments, setFilteredPayments] = useState<IPayment[]>([]);
    const [currentPage, setCurrentPage] = useState(1)
    const [sortColumn, setSortColumn] = useState<keyof IPayment | ''>('')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [filters, setFilters] = useState({
        user: '',
        provider: 'all',
        startDate: '',
        endDate: ''
    });



    const { data: payments = [] } = useQuery({
        queryKey: ['payments'],
        queryFn: fetchPayments,

    });


    useEffect(() => {
        console.log(payments);
        setFilteredPayments(payments);
        handleSort(sortColumn as keyof IPayment);
    }, [payments]);


    const itemsPerPage = 5

    const handleSort = (column: keyof IPayment) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(column)
            setSortDirection('asc');
        }
    }

    const handleFilter = () => {
        let result = payments
        if (filters.user) {
            result = result.filter(payment =>
                payment.user.name.toLowerCase().includes(filters.user.toLowerCase())
            )
        }
        if (filters.provider) {
            result = result.filter(payment => payment.provider === filters.provider)
        }
        if (filters.startDate) {
            result = result.filter(payment => new Date(payment.created_at) >= new Date(filters.startDate))
        }
        if (filters.endDate) {
            result = result.filter(payment => new Date(payment.created_at) <= new Date(filters.endDate))
        }
        setFilteredPayments(result);
        setCurrentPage(1)
    }

    const sortedPayments = [...filteredPayments].sort((a, b) => {
        if (!sortColumn) return 0
        if ((a[sortColumn] as string) < (b[sortColumn] as string)) return sortDirection === 'asc' ? -1 : 1
        if ((a[sortColumn] as string) > (b[sortColumn] as string)) return sortDirection === 'asc' ? 1 : -1
        return 0
    })

    console.log("sortedPayments", sortedPayments);

    const paginatedPayments = sortedPayments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const totalPages = Math.ceil(sortedPayments.length / itemsPerPage)

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Payment Listing</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <Label htmlFor="user-filter">User</Label>
                            <Input
                                id="user-filter"
                                value={filters.user}
                                onChange={(e) => setFilters({ ...filters, user: e.target.value })}
                                placeholder="Filter by user"
                            />
                        </div>
                        <div>
                            <Label htmlFor="provider-filter">Provider</Label>
                            <Select
                                value={filters.provider}
                                onValueChange={(value) => setFilters({ ...filters, provider: value })}
                            >
                                <SelectTrigger id="provider-filter">
                                    <SelectValue placeholder="Select provider" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Hammasi</SelectItem>
                                    <SelectItem value="payme">Payme</SelectItem>
                                    <SelectItem value="click">Click</SelectItem>
                                    <SelectItem value="cash">Naqt</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="start-date">Start Date</Label>
                            <Input
                                id="start-date"
                                type="date"
                                value={filters.startDate}
                                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="end-date">End Date</Label>
                            <Input
                                id="end-date"
                                type="date"
                                value={filters.endDate}
                                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            />
                        </div>
                    </div>
                    <Button onClick={handleFilter}>Apply Filters</Button>
                </div>
                <Table className="mt-4">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="cursor-pointer" onClick={() => handleSort('user')}>User</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort('provider')}>Provider</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort('order')}>Order</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort('created_at')}>Time</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort('amount')}>Amount</TableHead>
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
                                        <span className="capitalize">{payment.provider}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {payment.order && <Link href={`/orders/info?id=${payment?.order?.id}`} className="hover:underline">
                                        <Badge variant="outline">#{payment?.order?.order_id}</Badge>
                                    </Link>}
                                </TableCell>
                                <TableCell>{payment.created_at}</TableCell>
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
                        <ChevronLeft className="h-4 w-4" />
                        Previous
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
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}



export default function Page() {
    return <Layout page="payments">
        <EnhancedPaymentListing />
    </Layout>
}