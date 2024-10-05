'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { request } from '@/lib/api'
import { useToast } from "@/hooks/use-toast"
import { IProduct } from '@/lib/types'

interface CategoryProductModalProps {
    isOpen: boolean
    onClose: () => void
    categoryId: string
}

export function CategoryProductModal({ isOpen, onClose, categoryId }: CategoryProductModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: products, isLoading } = useQuery<IProduct[]>({
        queryKey: ['products', searchTerm],
        queryFn: async () => {
            const { data } = await request.get(`products?notincategory=1&search=${searchTerm}&category=${categoryId}`);
            return data;
        },
    });


    const query = useQuery<{ data: string[] }>({
        queryKey: ["selected_products", categoryId],
        queryFn: async () => {
            const { data } = await request.get(`/categories/${categoryId}/products`);
            return data;
        },
    });

    useEffect(() => {
        if (query.data) {
            setSelectedProducts(query.data.data);
        }
    }, [query.data]);


    const addProductsMutation = useMutation({
        mutationFn: (productIds: string[]) =>
            request.post(`categories/${categoryId}/products`, { products: productIds }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['category', categoryId] });
            toast({
                title: 'Products added successfully'
            });
            onClose();
        },
        onError: (error) => {
            console.error('Error adding products to category:', error);
            toast({
                title: 'Error adding products',
                variant: 'destructive'
            });
        }
    });

    const handleProductSelect = (productId: string) => {
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    }

    const handleAddProducts = () => {
        addProductsMutation.mutate(selectedProducts);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Products to Category</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                        {isLoading ? (
                            <div>Loading...</div>
                        ) : (
                            products?.map((product) => (
                                <div key={product.id} className="flex items-center space-x-2 py-2">
                                    <Checkbox
                                        id={product.id}
                                        checked={selectedProducts.includes(product.id)}
                                        onCheckedChange={() => handleProductSelect(product.id)}
                                    />
                                    <label htmlFor={product.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {product.name_uz}
                                    </label>
                                </div>
                            ))
                        )}
                    </ScrollArea>
                </div>
                <DialogFooter>
                    <Button onClick={handleAddProducts} disabled={addProductsMutation.isPending}>
                        {addProductsMutation.isPending ? 'Adding...' : 'Add Selected Products'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}