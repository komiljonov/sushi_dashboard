import { useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableCell, TableRow, TableHead } from '@/components/ui/table';

import { Checkbox } from '@/components/ui/checkbox';

import { ChevronLeft, ChevronRight, MoreVertical, Plus } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { request } from '@/lib/api';
import { Layout } from '@/components/Layout';
import { CheckedState } from '@radix-ui/react-checkbox';

interface ICategory {
    id: number;
    name_uz: string;
    name_ru: string;
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
    const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set());
    const itemsPerPage = 4;
    const totalPages = Math.ceil(categories.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);

    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    const handleRowClick = useCallback((category: ICategory, event: React.MouseEvent) => {
        if (window?.getSelection()?.toString()) return;
        if (event.target instanceof HTMLButtonElement || event.target instanceof HTMLInputElement) return;
        console.log('Row clicked:', category);
    }, []);

    const handleCheckboxChange = (id: number) => {

        console.log(id);
        setSelectedCategories(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            return newSelected;
        });
    };

    const handleSelectAllChange = (state: CheckedState) => {
        if (state == 'indeterminate') {
            setSelectedCategories(new Set());
        }
        else {
            if (state) {

                setSelectedCategories(new Set(categories.map(c => c.id)));
            } else {
                setSelectedCategories(new Set());
            }
        }
    };

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
                        selectedCategories={selectedCategories}
                        onCheckboxChange={handleCheckboxChange}
                        onSelectAllChange={handleSelectAllChange}
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
interface CategoryTableProps {
    categories: ICategory[];
    handleRowClick: (category: ICategory, event: React.MouseEvent) => void;
    selectedCategories: Set<number>;
    onCheckboxChange: (id: number) => void;
    onSelectAllChange: (state: CheckedState) => void
}

function CategoryTable({ categories, handleRowClick, selectedCategories, onCheckboxChange, onSelectAllChange }: CategoryTableProps) {
    const isAllSelected = categories.length > 0 && categories.every(category => selectedCategories.has(category.id));

    console.log(
        categories.length > 0, selectedCategories.size > 0, !isAllSelected
    )

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-12">
                        <Checkbox
                            checked={selectedCategories.size > 0 || isAllSelected}
                            indeterminate={categories.length > 0 && selectedCategories.size > 0 && !isAllSelected}
                            onCheckedChange={onSelectAllChange}

                        />
                    </TableHead>
                    <TableHead>O'zbekcha tilidagi nomi</TableHead>
                    <TableHead>Rus tilidagi nomi</TableHead>
                    <TableHead>Ingliz tilidagi nomi</TableHead>
                    <TableHead>Mahsulotlar soni</TableHead>
                    <TableHead className="w-12"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {categories.map(category => (
                    <TableRow
                        key={category.id}
                        onClick={event => handleRowClick(category, event)}
                        className="cursor-pointer"
                    >
                        <TableCell>
                            <Checkbox
                                checked={selectedCategories.has(category.id)}
                                onCheckedChange={(state: CheckedState) => onCheckboxChange(category.id)}
                            />
                        </TableCell>
                        <TableCell className="font-medium">{category.name_uz}</TableCell>
                        <TableCell>{category.name_ru}</TableCell>
                        <TableCell>{category.name_us}</TableCell>
                        <TableCell>{category.products_count}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem>
                                        <span>Edit</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <span>Duplicate</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <span>Open in New Tab</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                        <span>Delete</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
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