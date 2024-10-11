'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { splitToHundreds } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { FixedSizeList as List } from 'react-window'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import debounce from 'lodash.debounce'
import { Skeleton } from '@/components/ui/skeleton'
import { CreateOrderForm, OrderItem } from '../types'
import { IProduct } from '@/lib/types'

// Add Item Modal Component
export default function AddItemModal({ isOpen, setIsOpen, products }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void; products?: IProduct[] }) {
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const { control } = useFormContext<CreateOrderForm>();

    const { append } = useFieldArray({
        control,
        name: "items",
        rules: {
            minLength: 1, validate: (value) => {
                return value.length > 0 || "At least one item is required"
            }
        }
    });

    const filteredProducts = useMemo(() => {
        return products?.filter(product =>
            product.name_uz.toLowerCase().includes(searchTerm.toLowerCase())
        ) ?? []
    }, [products, searchTerm]);

    const handleAddItem = () => {
        if (selectedProductId !== null) {
            const selectedProduct = products?.find(p => p.id === selectedProductId)
            if (selectedProduct) {
                setIsOpen(false)
                setQuantity(1)
                setSearchTerm('')

                const new_item: OrderItem = {
                    product: selectedProduct.id,
                    _product: selectedProduct,
                    quantity: quantity
                }

                append(new_item)
            }
        }
    }

    const debouncedSearch = useMemo(
        () => debounce((value: string) => setSearchTerm(value), 300),
        []
    )

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(e.target.value);
    }, [debouncedSearch]);

    const ProductItem = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
        const product = filteredProducts[index]
        return (
            <div
                style={style}
                className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedProductId === product.id ? 'bg-blue-100' : ''}`}
                onClick={() => setSelectedProductId(product.id)}
            >
                {product.name_uz} - {splitToHundreds(product.price)} so'm
            </div>
        )
    }, [filteredProducts, selectedProductId]);

    return (
        <>
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Mahsulot qo&apos;shish</AlertDialogTitle>
                        <AlertDialogDescription>
                            Buyurtmaga mahsulot va miqdorini qo&apos;shing.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="grid gap-4 py-4">
                        <Input
                            placeholder="Mahsulot nomini qidirish"
                            onChange={handleSearchChange}
                        />

                        {!products ? (
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                        ) : (
                            <div className="h-64 border rounded">
                                {filteredProducts.length > 0 ? (
                                    <List
                                        height={256}
                                        itemCount={filteredProducts.length}
                                        itemSize={35}
                                        width="100%"
                                    >
                                        {ProductItem}
                                    </List>
                                ) : (
                                    <div className="p-4 text-center text-gray-500">
                                        Mahsulot topilmadi.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center space-x-2">
                            <Label htmlFor="quantity">Miqdor:</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="no-spinner"
                            />
                        </div>
                    </div>

                    <AlertDialogFooter>
                        <Button onClick={() => setIsOpen(false)} variant="outline">Bekor qilish</Button>
                        <Button onClick={handleAddItem}>Qo&apos;shish</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
