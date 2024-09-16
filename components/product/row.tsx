import { Button } from '@/components/ui/Button';
import { TableCell, TableRow } from '@/components/ui/table';
import { MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { IProduct } from "@/lib/types"
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/query';
import { DeleteModalComponent } from './delete';
import { request } from '@/lib/api';




const deleteProduct = async (product: IProduct): Promise<void> => {
    await request.delete(`products/${product.id}`);
}



export default function ProductInfo({ product }: { product: IProduct }) {


    const [open, setOpen] = useState(false);

    const router = useRouter();



    const mutation = useMutation({
        mutationFn: (data: IProduct) => {
            return deleteProduct(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products', product.category] });
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
                pathname: '/products/info',
                query: {
                    ...router.query, id: product.id
                },
            }, undefined, { shallow: true });
        }
        else {
            window.open(`/products/info?id=${product.id}`)
        }

    }, [product, router]);



    const onDelete = () => {
        mutation.mutate(product);
    }



    return (<>
        <TableRow
            key={product.id}

            className="cursor-pointer"
        >


            <TableCell className="font-medium" onClick={event => handleRowClick(event)}>{product.name_uz}</TableCell>
            <TableCell onClick={event => handleRowClick(event)}>{product.name_ru}</TableCell>
            <TableCell onClick={event => handleRowClick(event)}>{product.price}</TableCell>

            <TableCell>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Harakatlar</DropdownMenuLabel>

                        <DropdownMenuItem onClick={event => handleRowClick(event)} >
                            <span>O&apos;zgartirish</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={event => handleRowClick(event, true)}>
                            <span>Yangi oynada ochish</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />



                        <DropdownMenuItem className="text-red-600" onClick={() => { setOpen(true) }} >
                            <span>O&apos;chirish</span>
                        </DropdownMenuItem>



                    </DropdownMenuContent>
                </DropdownMenu>

            </TableCell>
        </TableRow>
        <DeleteModalComponent open={open} setOpen={setOpen} onDelete={onDelete} />

    </>)
}