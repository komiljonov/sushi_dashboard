import { useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableCell, TableRow, TableHead } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, ChevronRight, Plus, MoreVertical } from 'lucide-react';

import { request } from '@/lib/api'
import { Layout } from '@/components/Layout';

interface ICategory {
    id: number;
    name_uz: string;
    name_ru: string
    name_us: string;
    products_count: number;

}


const fetchCategories = async (): Promise<ICategory[]> => {
    const { data } = await request.get('categories');
    return data;
}


export function Categories() {
    const { data: categories = [], error, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const totalPages = Math.ceil(categories.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);

    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    const handleRowClick = useCallback((category: any, event: any) => {
        if (window?.getSelection()?.toString()) {
            return;
        }
        if (
            event.target.type === 'checkbox' ||
            event.target.tagName === 'LABEL' ||
            event.target.closest('label')
        ) {
            return;
        }
        console.log('Row clicked:', category);
    }, []);

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Categories</h1>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create
                </Button>
            </div>

            <div className="border rounded-md">
                {isLoading ? (
                    <SkeletonTable />
                ) : (
                    <CategoryTable
                        categories={currentCategories}
                        handleRowClick={handleRowClick}
                    />
                )}
            </div>

            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, categories.length)} of {categories.length}
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
        </div>
    );
}

// Separated Table component
function CategoryTable({ categories, handleRowClick }: {
    categories: ICategory[],
    handleRowClick: (category: any, event: any) => void
}) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-12">
                        <Checkbox id="select-all" />
                    </TableHead>
                    <TableHead>O'zbekcha tilidagi nomi</TableHead>
                    <TableHead>Rus tilidagi nomi</TableHead>
                    <TableHead>Ingliz tilidagi nomi</TableHead>
                    <TableHead>Mahsulotlar soni</TableHead>
                    <TableHead className="w-12"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {categories.map((category: ICategory, index: number) => (
                    <TableRow key={index} onClick={(event: any) => handleRowClick(category, event)} className="cursor-pointer">
                        <TableCell>
                            <Checkbox id={`select-${index}`} indeterminate={true} />
                        </TableCell>
                        <TableCell className="font-medium">{category.name_uz}</TableCell>
                        <TableCell>{category.name_ru}</TableCell>
                        <TableCell>{category.name_us}</TableCell>
                        <TableCell>{category.products_count}</TableCell>
                        <TableCell>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

// Skeleton component for loading state
function SkeletonTable() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-12">
                        <Skeleton className="h-5 w-5" />
                    </TableHead>
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
                            <Skeleton className="h-5 w-5" />
                        </TableCell>
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
    );
}




export default function Page() {
    return <Layout page='categories'>
        <Categories />
    </Layout>
}