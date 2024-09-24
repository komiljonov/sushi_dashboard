import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableCell, TableRow, TableHead } from '@/components/ui/table';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { request } from '@/lib/api';
import { Layout } from '@/components/Layout';
import CreateCategoryModal from '@/components/category/create';
import { ICategory } from '@/lib/types';
import CategoryInfo from '@/components/category/row';

const fetchCategories = async (): Promise<ICategory[]> => {
    const { data } = await request.get('categories');
    return data;
}

export function Categories() {

    const { data: categories = [], isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(categories.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);

    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Kategoriyalar</h1>
                <CreateCategoryModal>
                    <Button >
                        <Plus className="mr-2 h-4 w-4" /> Kategoriya qo&apos;shish
                    </Button>
                </CreateCategoryModal>

            </div>
            <div className="border rounded-md">
                {isLoading ? (
                    <SkeletonTable />
                ) : (
                    <CategoryTable
                        categories={currentCategories}
                    />
                )}
            </div>
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                    Kategoriyalar  {categories.length} dan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, categories.length)}
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={prevPage}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Oldingi</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Keyingo</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}

interface CategoryTableProps {
    categories: ICategory[];
}

function CategoryTable({ categories }: CategoryTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>O&apos;zbekcha tilidagi nomi</TableHead>
                    <TableHead>Rus tilidagi nomi</TableHead>
                    <TableHead>Mahsulotlar soni</TableHead>
                    <TableHead className="w-12"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {categories.map(category => (
                    <CategoryInfo key={category.id} category={category} />
                ))}
            </TableBody>
        </Table>
    );
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
    );
}

export default function Page() {
    return <Layout page='categories'>
        <Categories />
    </Layout>
}