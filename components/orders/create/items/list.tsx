'use client'

import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Plus, Minus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card"
import { CreateOrderForm } from '../types'

export default function OrderItems({ setIsAddItemOpen }: { setIsAddItemOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const { control, watch, setValue, formState: { errors } } = useFormContext<CreateOrderForm>();

    const { remove } = useFieldArray({
        control,
        name: "items",
        rules: {
            minLength: 1,
            validate: (value) => {
                return value.length > 0 || "At least one item is required"
            }
        }
    });

    const orderItems = watch("items");

    return (
        <Card>
            <CardHeader>
                <CardTitle>Buyurtma elementlari {orderItems.length}</CardTitle>
            </CardHeader>
            <CardContent>
                {orderItems.map((field, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                        <span className="flex-grow">{field._product.name_uz}</span>
                        <div className="flex items-center space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                disabled={field.quantity === 1}
                                onClick={() => setValue(`items.${index}.quantity`, field.quantity - 1)}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span>{field.quantity}</span>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => setValue(`items.${index}.quantity`, field.quantity + 1)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => remove(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => setIsAddItemOpen(true)} className="w-full mt-2">
                    <Plus className="h-4 w-4 mr-2" /> Mahsulot qo'shish
                </Button>
            </CardContent>
            <CardFooter>
                {errors.items && (
                    <p className="text-sm text-red-500 mt-1">
                        {errors.items.message || "Mahsulotlar bo'sh"}
                    </p>
                )}
                {/* {errors.items && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {errors.items.message || "At least one item is required"}
                        </AlertDescription>
                    </Alert>
                )} */}
            </CardFooter>
        </Card>
    )
}