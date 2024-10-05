import { Button } from '@/components/ui/Button';
import { TableCell, TableRow } from '@/components/ui/table';
import { MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { ICategory } from "@/lib/types"
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/query';
import { DeleteModalComponent } from './delete';
import { request } from '@/lib/api';
import React from 'react';




const deleteCategory = async (category: ICategory): Promise<void> => {
    await request.delete(`categories/${category.id}`);
}



export default function CategoryInfo({ category }: { category: ICategory }) {


    const [open, setOpen] = useState(false);

    const router = useRouter();



    const mutation = useMutation({
        mutationFn: (data: ICategory) => {

            return deleteCategory(data);

        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });

        },
        onError: (error) => {
            console.log('Error creating category: ', error);
        }
    });




    const handleRowClick = useCallback((event: React.MouseEvent, new_tab: boolean = false) => {
        if (window?.getSelection()?.toString()) return;
        if (event.target instanceof HTMLButtonElement || event.target instanceof HTMLInputElement) return;

        if (!new_tab) {
            router.push({
                pathname: '/categories/info',
                query: {
                    ...router.query, id: category.id
                },
            }, undefined, { shallow: true });
        }
        else {
            window.open(`/categories/info?id=${category.id}`)
        }

    }, [category, router]);



    const onDelete = () => {
        mutation.mutate(category);
    }



    return (<>
        <TableRow
            key={category.id}

            className="cursor-pointer"
        >


            <TableCell className="font-medium" onClick={event => handleRowClick(event)}>{category.name_uz}</TableCell>
            <TableCell onClick={event => handleRowClick(event)}>{category.name_ru}</TableCell>
            <TableCell onClick={event => handleRowClick(event)}>{category.products_count}</TableCell>
            <TableCell onClick={event => handleRowClick(event)}>{category.today_visits}</TableCell>

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

                        <DropdownMenuItem onClick={event => handleRowClick(event)} >
                            <span>Edit</span>
                        </DropdownMenuItem>

                        {/* <DropdownMenuItem>
                            <span>Duplicate</span>
                        </DropdownMenuItem> */}

                        <DropdownMenuItem onClick={event => handleRowClick(event, true)}>
                            <span>Open in New Tab</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />



                        <DropdownMenuItem className="text-red-600" onClick={() => { setOpen(true) }} >
                            <span>Delete</span>
                        </DropdownMenuItem>



                    </DropdownMenuContent>
                </DropdownMenu>

            </TableCell>
        </TableRow>
        <DeleteModalComponent open={open} setOpen={setOpen} onDelete={onDelete} />

    </>)
}