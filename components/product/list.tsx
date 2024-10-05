'use client'

import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/Button'
import { Table, TableHeader, TableBody, TableCell, TableRow, TableHead } from '@/components/ui/table'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import ProductInfo from '@/components/product/row'
// import Link from "next/link"
import { ICategoryWithStats, IProduct } from '@/lib/types'
import { CategoryProductModal } from '@/components/category/productSelection'

export function Products({ category }: { category?: ICategoryWithStats }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const products = category ? category.products : []

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const totalPages = Math.ceil(products.length / itemsPerPage)

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentCategories = products.slice(indexOfFirstItem, indexOfLastItem)

    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages))
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1))

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Mahsulotlar</h1>
                <div className="space-x-2">
                    {/* <Link href={`/products/create?category=${category?.id}`}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Mahsulot qo&apos;shish
                        </Button>
                    </Link> */}
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Mavjud mahsulotlarni qo&apos;shish
                    </Button>
                </div>
            </div>

            <div className="border rounded-md">
                {!category ? (
                    <SkeletonTable />
                ) : (
                    <CategoryTable products={currentCategories} />
                )}
            </div>

            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                    Mahsulotlar {products.length} dan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, products.length)}
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={prevPage}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next</span>
                    </Button>
                </div>
            </div>

            {category && (
                <CategoryProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    categoryId={category.id}
                />
            )}
        </div>
    )
}

interface ProductsTableProps {
    products: IProduct[]
}

function CategoryTable({ products }: ProductsTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>O&apos;zbekcha tilidagi nomi</TableHead>
                    <TableHead>Rus tilidagi nomi</TableHead>
                    <TableHead>Narxi</TableHead>
                    <TableHead className="w-12"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map(product => (
                    <ProductInfo key={product.id} product={product} />
                ))}
            </TableBody>
        </Table>
    )
}

function SkeletonTable() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        <Skeleton className="h-5 w-32" />
                    </TableHead>
                    <TableHead>
                        <Skeleton className="h-5 w-32" />
                    </TableHead>
                    <TableHead>
                        <Skeleton className="h-5 w-32" />
                    </TableHead>
                    <TableHead>
                        <Skeleton className="h-5 w-20" />
                    </TableHead>
                    <TableHead className="w-12"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array(4).fill(null).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell>
                            <Skeleton className="h-5 w-32" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-5 w-32" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-5 w-32" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-5 w-20" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-5 w-5" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}