import React, { useState } from 'react'
import { useForm, Controller, ControllerRenderProps } from 'react-hook-form'
import { Button } from "@/components/ui/Button"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Minus, Trash2 } from "lucide-react"

type Product = {
    id: number;
    name: string;
    price: number;
}

type OrderItem = Product & {
    quantity: number;
}

type FormData = {
    user: string;
    phone: string;
    comment: string;
    promocode: string;
    deliveryMethod: 'pickup' | 'delivery';
    filial: string;
    asap: boolean;
    deliveryTime?: string;
}

const products: Product[] = [
    { id: 1, name: "Product 1", price: 10 },
    { id: 2, name: "Product 2", price: 20 },
    { id: 3, name: "Product 3", price: 30 },
]

function DeliveryMap() {
    return (
        <div className="h-40 bg-gray-100 flex items-center justify-center rounded-md">
            Map Component Placeholder
        </div>
    )
}

function FilialSelect(props: ControllerRenderProps<FormData, "filial">) {
    return (
        <Select {...props}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select filial" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="filial1">Filial 1</SelectItem>
                <SelectItem value="filial2">Filial 2</SelectItem>
                <SelectItem value="filial3">Filial 3</SelectItem>
            </SelectContent>
        </Select>
    )
}

function AddItemModal({ isOpen, setIsOpen, addItem }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void; addItem: (product: Product) => void }) {
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null)

    const handleAddItem = () => {
        if (selectedProductId !== null) {
            const selectedProduct = products.find(p => p.id === selectedProductId)
            if (selectedProduct) {
                addItem(selectedProduct)
                setIsOpen(false)
            }
        }
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Add Product</AlertDialogTitle>
                    <AlertDialogDescription>
                        Select a product to add to your order.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-4 py-4">
                    <Select onValueChange={(value) => setSelectedProductId(Number(value))}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                            {products.map((product) => (
                                <SelectItem key={product.id} value={product.id.toString()}>
                                    {product.name} - ${product.price}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <AlertDialogFooter>
                    <Button onClick={() => setIsOpen(false)} variant="outline">Cancel</Button>
                    <Button onClick={handleAddItem}>Add</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export function CreateOrderButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isAddItemOpen, setIsAddItemOpen] = useState(false);

    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

    const { register, control, handleSubmit, watch } = useForm<FormData>();
    const deliveryMethod = watch('deliveryMethod');
    const asap = watch('asap');

    const onSubmit = (data: FormData) => {
        console.log('Order submitted', { ...data, orderItems });
        setIsOpen(false);
    }

    const addItem = (product: Product) => {
        setOrderItems([...orderItems, { ...product, quantity: 1 }]);
    }

    const updateItemQuantity = (index: number, change: number) => {
        const newItems = [...orderItems];
        newItems[index].quantity = Math.max(1, newItems[index].quantity + change);
        setOrderItems(newItems);
    }

    const removeItem = (index: number) => {
        setOrderItems(orderItems.filter((_, i) => i !== index));
    }

    const calculateTotal = () => {
        return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    const calculateDiscount = () => {
        // This is a placeholder. In a real app, you'd calculate based on the actual promocode logic
        const promocode = watch('promocode');
        return promocode ? calculateTotal() * 0.1 : 0;
    }

    const deliveryPrice = deliveryMethod === 'delivery' ? 5 : 0 // Placeholder delivery price

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="default">Create Order</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[700px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Create New Order</AlertDialogTitle>
                </AlertDialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="user">User</Label>
                            <Input id="user" {...register('user', { required: true })} placeholder="Enter user name" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" {...register('phone', { required: true })} placeholder="Enter phone number" />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="comment">Comment</Label>
                            <Textarea id="comment" {...register('comment')} placeholder="Enter comment" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="promocode">Promocode</Label>
                            <Controller
                                name="promocode"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select promocode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="null">No promocode</SelectItem>
                                            <SelectItem value="PROMO10">PROMO10</SelectItem>
                                            <SelectItem value="PROMO20">PROMO20</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Delivery Method</Label>
                            <Controller
                                name="deliveryMethod"
                                control={control}
                                defaultValue="pickup"
                                render={({ field }) => (
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex space-x-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="pickup" id="pickup" />
                                            <Label htmlFor="pickup">Pickup</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="delivery" id="delivery" />
                                            <Label htmlFor="delivery">Delivery</Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                        </div>
                    </div>
                    {deliveryMethod === 'delivery' && (
                        <div className="space-y-2">
                            <Label>Delivery Location</Label>
                            <DeliveryMap />
                        </div>
                    )}
                    {deliveryMethod === 'pickup' && (
                        <div className="space-y-2">
                            <Label>Select Filial</Label>
                            <Controller
                                name="filial"
                                control={control}
                                render={({ field }) => <FilialSelect {...field} />}
                            />
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label>Delivery Schedule</Label>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="asap"
                                {...register('asap')}
                            />
                            <Label htmlFor="asap">As fast as possible</Label>
                        </div>
                        {!asap && (
                            <Input
                                type="time"
                                {...register('deliveryTime')}
                            />
                        )}
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {orderItems.map((item, index) => (
                                <div key={index} className="flex items-center space-x-2 mb-2">
                                    <span className="flex-grow">{item.name}</span>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => updateItemQuantity(index, -1)}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span>{item.quantity}</span>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => updateItemQuantity(index, 1)}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeItem(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={() => setIsAddItemOpen(true)} className="w-full mt-2">
                                <Plus className="h-4 w-4 mr-2" /> Add Item
                            </Button>
                        </CardContent>
                    </Card>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                        {watch('promocode') && (
                            <div className="flex justify-between text-green-600">
                                <span>Discount:</span>
                                <span>-${calculateDiscount().toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span>Delivery:</span>
                            <span>${deliveryPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                            <span>Total:</span>
                            <div className="flex items-center space-x-2">
                                <Badge variant="secondary" className="text-green-600 bg-green-100">
                                    ${(calculateTotal() - calculateDiscount() + deliveryPrice).toFixed(2)}
                                </Badge>
                                {watch('promocode') && (
                                    <span className="text-sm text-muted-foreground line-through">
                                        ${calculateTotal().toFixed(2)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <Button type="button" onClick={() => setIsOpen(false)} variant="outline">Cancel</Button>
                        <Button type="submit">Create Order</Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
            <AddItemModal isOpen={isAddItemOpen} setIsOpen={setIsAddItemOpen} addItem={addItem} />
        </AlertDialog>
    )
}