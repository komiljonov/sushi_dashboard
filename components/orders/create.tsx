'use client'

import React, { useState, useMemo } from 'react'
import { useForm, Controller, useFieldArray, FormProvider, useFormContext } from 'react-hook-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Check, ChevronsUpDown, Plus, Minus, Trash2, AlertCircle } from "lucide-react"
import { calculate_discount, cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { FixedSizeList as List } from 'react-window'
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
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
// import { request } from '@/lib/api'
import { IPromocode, IUser } from '@/lib/types'
import { fetchFilials, fetchProducts, fetchPromocodes, fetchUsers, getDeliveryPrice } from '@/lib/fetchers'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { addHours, format } from 'date-fns'
import debounce from 'lodash.debounce'
import { CreateOrder } from '@/lib/mutators'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CreateOrderForm, OrderItem } from './types'



// Location Picker Component
const LocationPicker = ({ location }: { location: { loc_latitude: number, loc_longitude: number } }) => {
    const position = { lat: location.loc_latitude, lng: location.loc_longitude };
    return <Marker position={position} />
}

// Delivery Map Component
function DeliveryMap() {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries: ['places']
    });

    const { control } = useFormContext<CreateOrderForm>();
    const [mapCenter] = useState({ lat: 41.2995, lng: 69.2401 });

    const bounds = useMemo(() => ({
        north: 45.0,
        south: 37.0,
        east: 72.0,
        west: 55.0,
    }), []);

    // const mapStyles = [
    // {
    //     featureType: "poi.business",
    //     stylers: [{ visibility: "off" }]
    // },
    // {
    //     featureType: "poi",
    //     stylers: [{ visibility: "off" }]
    // }
    // ];

    return (
        <div className="h-80 bg-gray-100 flex flex-col items-center justify-center rounded-md">
            {isLoaded ? (
                <>
                    <p className="text-sm text-gray-700 mb-2">Select a location by clicking on the map</p>
                    <Controller
                        name="location.latitude"
                        control={control}
                        render={({ field: latitude }) => (
                            <Controller
                                name="location.longitude"
                                control={control}
                                render={({ field: longitude }) => (
                                    <GoogleMap
                                        center={mapCenter}
                                        zoom={13}
                                        onClick={(e: google.maps.MapMouseEvent) => {
                                            latitude.onChange(e.latLng?.lat());
                                            longitude.onChange(e.latLng?.lng());
                                        }}
                                        mapContainerStyle={{ height: '100%', width: '100%' }}
                                        options={{
                                            restriction: {
                                                latLngBounds: bounds,
                                                strictBounds: true,
                                            },
                                            // styles: mapStyles,
                                        }}
                                    >
                                        <LocationPicker location={{ loc_longitude: longitude.value, loc_latitude: latitude.value }} />
                                    </GoogleMap>
                                )}
                            />
                        )}
                    />
                    <p className="text-xs text-gray-500 mt-2">Click on the map to select a delivery location</p>
                </>
            ) : (
                <Skeleton className="w-full h-full" />
            )}
        </div>
    );
}

// Filial Select Component
function FilialSelect({ filial, setFilial }: { filial: string; setFilial: (filial: string) => void }) {

    const { data: filials, isLoading, error } = useQuery({
        queryKey: ["filials"],
        queryFn: fetchFilials,
    })

    if (isLoading) {
        return <Skeleton className="w-full h-10 rounded-md" />
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Failed to load filials. Please try again later.
                </AlertDescription>
            </Alert>
        )
    }

    return (
        <Select value={filial} onValueChange={setFilial}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Filialni tanlang" />
            </SelectTrigger>
            <SelectContent>
                {filials?.map((filial) => (
                    <SelectItem key={filial.id} value={filial.id}>
                        {filial.name_uz}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

// Promocode Select Component
function PromocodeSelect({ value, onChange, promocodes }: { value?: string; onChange: (value: string) => void; promocodes: IPromocode[] }) {
    return (
        <Select value={value} onValueChange={(val) => {
            onChange(val == "null" ? "" : val)
        }} >
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Promokodni tanlang" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="null" >Promokodni tanlang</SelectItem>
                {
                    promocodes.map((promocode) => (
                        <SelectItem key={promocode.id} value={promocode.id}>{promocode.name}</SelectItem>
                    ))
                }
            </SelectContent>
        </Select>
    )
}

// Add Item Modal Component
function AddItemModal({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) {
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')

    const { control } = useFormContext<CreateOrderForm>()

    const { append } = useFieldArray({
        control,
        name: "items",
        rules: { minLength: 1 }
    })

    const { data: products = [], isLoading: productsLoading } = useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts
    })

    const filteredProducts = useMemo(() => {
        return products.filter(product =>
            product.name_uz.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [products, searchTerm])

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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(e.target.value)
    }

    const ProductItem = ({ index, style }: { index: number; style: React.CSSProperties }) => {
        const product = filteredProducts[index]
        return (
            <div
                style={style}
                className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedProductId === product.id ? 'bg-blue-100' : ''}`}
                onClick={() => setSelectedProductId(product.id)}
            >
                {product.name_uz} - ${product.price}
            </div>
        )
    }

    return (
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

                    {productsLoading ? (
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
                            <List
                                height={256}
                                itemCount={filteredProducts.length}
                                itemSize={35}
                                width="100%"
                            >
                                {ProductItem}
                            </List>
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
                        />
                    </div>
                </div>

                <AlertDialogFooter>
                    <Button onClick={() => setIsOpen(false)} variant="outline">Bekor qilish</Button>
                    <Button onClick={handleAddItem}>Qo&apos;shish</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
// Order Items Component
function OrderItems({ setIsAddItemOpen }: { setIsAddItemOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const { control, watch, setValue } = useFormContext<CreateOrderForm>();

    const { remove } = useFieldArray({
        control,
        name: "items"
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
                                disabled={field.quantity == 1}
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
                    <Plus className="h-4 w-4 mr-2" /> Element qo&apos;shish
                </Button>
            </CardContent>
        </Card>
    )
}

// Main Order Component
export default function CreateOrderButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isAddItemOpen, setIsAddItemOpen] = useState(false);
    const [open, setOpen] = useState(false);

    const [showCustomInput, setShowCustomInput] = useState(false)
    const [customHours, setCustomHours] = useState('')
    const [customMinutes, setCustomMinutes] = useState('')


    const methods = useForm<CreateOrderForm>({
        defaultValues: {
            delivery: 'PICKUP',
            time: null,
            items: []
        }
    });

    const { register, control, handleSubmit, watch, setValue, reset, formState: { errors } } = methods;

    const deliveryMethod = watch('delivery');
    const orderItems = watch("items");

    const { data: users, isLoading: usersLoading } = useQuery<IUser[]>(
        {
            queryKey: ['users'],
            queryFn: fetchUsers,
        }
    );

    console.log(users);

    const { data: promocodes, isLoading: promocodesLoading } = useQuery({
        queryKey: ["promocodes"],
        queryFn: fetchPromocodes
    });

    const createOrderMutation = useMutation({
        mutationFn: CreateOrder,
        onSuccess: (data) => {
            console.log(data);
            reset();
        },
        onError: (e) => {

            console.log(e);
            alert("Error occured");
        }
    })

    const onSubmit = (data: CreateOrderForm) => {
        console.log('Buyurtma yuborildi', { ...data, orderItems });
        createOrderMutation.mutate(data);
        setIsOpen(false);
    }

    const calculateTotal = () => {
        return orderItems.reduce((total, item) => total + item._product.price * item.quantity, 0);
    }

    const calculateDiscount = () => {
        const promocodeId = watch('promocode');

        if (!promocodes) {
            return 0;
        }

        const promocode = promocodes.find((promocode) => promocode.id == promocodeId);

        if (!promocode) {
            return 0;
        }

        return calculate_discount(promocode, calculateTotal());
    }



    const { data: _deliveryPrice, isLoading: deliveryPriceLoading } = useQuery({
        queryKey: ["deliveryPrice", watch("location.latitude"), watch("location.longitude")],
        queryFn: () => getDeliveryPrice({ latitude: watch("location.latitude"), longitude: watch("location.longitude") }),
        enabled: !!watch('location')
    });

    const deliveryPrice = deliveryMethod === 'DELIVERY' ? (_deliveryPrice?.cost || 0) : 0;

    const generateTimeOptions = () => {
        const now = new Date();
        const options: { value: string | null; label: string; }[] = [{
            value: null,
            label: "Iloji boricha tez"
        }];
        for (let i = 0; i < 5; i++) {
            const time = addHours(now, i + .5);
            options.push({
                value: format(time, 'HH:mm'),
                label: format(time, 'h:mm a')
            });
        }
        return options;
    };

    const validateTimeInput = (value: string, max: number) => {
        const numValue = parseInt(value, 10)
        if (isNaN(numValue) || numValue < 0 || numValue > max) {
            return ''
        }
        return value
    }


    const handleCustomTimeChange = (hours: string, minutes: string) => {
        const formattedHours = hours.padStart(2, '0')
        const formattedMinutes = minutes.padStart(2, '0')
        const customTime = `${formattedHours}:${formattedMinutes}`
        setValue('time', customTime)
    }

    const timeOptions = generateTimeOptions();

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="default">Buyurtma yaratish</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <AlertDialogHeader>
                    <AlertDialogTitle>Yangi buyurtma yaratish</AlertDialogTitle>
                </AlertDialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <FormProvider {...methods}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="user">Foydalanuvchi</Label>
                                {usersLoading ? (
                                    <Skeleton className="h-10 w-full" />
                                ) : (
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={open}
                                                className="w-full justify-between"
                                            >
                                                {watch("user") == "anonym" ? "Anony foydalanuvchi" : (watch('user') ? users?.find((user) => user.id === watch('user'))?.name : "Foydalanuvchini tanlang...")}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[300px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Foydalanuvchilarni qidirish..." />
                                                <CommandList>
                                                    <CommandEmpty>Foydalanuvchi topilmadi.</CommandEmpty>
                                                    <CommandGroup>
                                                        <CommandItem
                                                            onSelect={() => {
                                                                setValue('user', "anonym");
                                                                setValue('phone', '');
                                                                setOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    watch('user') === 'anonym' ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            Anonym foydalanuvchi
                                                        </CommandItem>
                                                        {users && users?.map((user) => (
                                                            <CommandItem
                                                                key={user.id}
                                                                onSelect={() => {
                                                                    setValue('user', user.id);
                                                                    setValue('phone', user.number);
                                                                    setOpen(false);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        watch('user') === user.id ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {user.name} ({user.number})
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Telefon raqam</Label>
                                <Input id="phone" {...register('phone', { required: true })} placeholder="Telefon raqamni kiriting" />
                                {errors.phone && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.phone.message as string}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="comment">Izoh</Label>
                                <Textarea id="comment" maxLength={1023} {...register('comment')} placeholder="Izoh kiriting" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="promocode">Promokod</Label>
                                {promocodesLoading ? (
                                    <Skeleton className="h-10 w-full" />
                                ) : (
                                    <Controller
                                        name="promocode"
                                        control={control}
                                        render={({ field }) => (
                                            <PromocodeSelect value={field.value} onChange={field.onChange} promocodes={promocodes!} />
                                        )}
                                    />
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Yetkazib berish usuli</Label>
                                <Controller
                                    name="delivery"
                                    control={control}
                                    defaultValue="PICKUP"
                                    render={({ field }) => (
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex space-x-4"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="PICKUP" id="pickup" />
                                                <Label htmlFor="pickup">Olib ketish</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="DELIVERY" id="delivery" />
                                                <Label htmlFor="delivery">Yetkazib berish</Label>
                                            </div>
                                        </RadioGroup>
                                    )}
                                />
                            </div>
                        </div>

                        {deliveryMethod === 'DELIVERY' && (
                            <div className="space-y-2">
                                <Label>Yetkazib berish joyi</Label>
                                <DeliveryMap />
                                <p>{_deliveryPrice?.address ?? "Yuklanmoqda"}</p>
                            </div>
                        )}

                        {deliveryMethod === 'PICKUP' && (
                            <div className="space-y-2">
                                <Label>Filialni tanlang</Label>
                                <Controller
                                    name="filial"
                                    control={control}
                                    render={({ field }) => <FilialSelect filial={field.value} setFilial={(filial) => { field.onChange(filial) }} />}
                                />
                            </div>
                        )}

                        {/* <div className="space-y-2">
                            <Label>Yetkazib berish vaqti</Label>
                            <Controller
                                name="time"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex gap-2">
                                        {timeOptions.map((option) => (
                                            <Button
                                                key={option.value}
                                                className={`bg-white border-2 border-black text-black ${field.value === option.value ? "bg-black text-white" : ""}`}
                                                type="button"
                                                onClick={() => field.onChange(option.value)}
                                            >
                                                {option.label}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            />
                        </div> */}

                        <div className="space-y-2">
                            <Label>Yetkazib berish vaqti</Label>
                            <Controller
                                name="time"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex flex-wrap gap-2">
                                        {timeOptions.map((option) => (
                                            <Button
                                                key={option.value}
                                                className={`bg-white border-2 border-black text-black ${field.value === option.value && !showCustomInput ? "bg-black text-white" : ""
                                                    }`}
                                                type="button"
                                                onClick={() => {
                                                    field.onChange(option.value)
                                                    setShowCustomInput(false)
                                                }}
                                            >
                                                {option.label}
                                            </Button>
                                        ))}
                                        <Button
                                            className={`bg-white border-2 border-black text-black ${showCustomInput ? "bg-black text-white" : ""
                                                }`}
                                            type="button"
                                            onClick={() => {
                                                setShowCustomInput(true)
                                                field.onChange(customHours && customMinutes ? `${customHours}:${customMinutes}` : 'custom')
                                            }}
                                        >
                                            Boshqa vaqt
                                        </Button>
                                    </div>
                                )}
                            />
                            {showCustomInput && (
                                <div className="mt-2 flex items-center gap-2">
                                    <Input
                                        type="text"
                                        value={customHours}
                                        onChange={(e) => {
                                            const validatedHours = validateTimeInput(e.target.value, 23)
                                            setCustomHours(validatedHours)
                                            handleCustomTimeChange(validatedHours, customMinutes)
                                        }}
                                        placeholder="00"
                                        className="w-16 text-center"
                                        maxLength={2}
                                    />
                                    <span className="text-xl">:</span>
                                    <Input
                                        type="text"
                                        value={customMinutes}
                                        onChange={(e) => {
                                            const validatedMinutes = validateTimeInput(e.target.value, 59)
                                            setCustomMinutes(validatedMinutes)
                                            handleCustomTimeChange(customHours, validatedMinutes)
                                        }}
                                        placeholder="00"
                                        className="w-16 text-center"
                                        maxLength={2}
                                    />
                                </div>
                            )}
                        </div>

                        <OrderItems setIsAddItemOpen={setIsAddItemOpen} />

                        <AddItemModal isOpen={isAddItemOpen} setIsOpen={setIsAddItemOpen} />

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Jami:</span>
                                <span>{calculateTotal().toFixed(2)} so'm</span>
                            </div>

                            {watch('promocode') && (
                                <div className="flex justify-between text-green-600">
                                    <span>Chegirma:</span>
                                    <span>-{calculateDiscount().toFixed(2)} so'm</span>
                                </div>
                            )}

                            {deliveryMethod == "DELIVERY" && (
                                <div className="flex justify-between">
                                    <span>Yetkazib berish:</span>
                                    {deliveryPriceLoading ? (
                                        <Skeleton className="h-6 w-20" />
                                    ) : (
                                        <span>{_deliveryPrice?.cost ?? "Hisoblanmoqda..."}</span>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-between font-bold">
                                <span>Jami:</span>
                                <div className="flex items-center space-x-2">
                                    <Badge variant="secondary" className="text-green-600 bg-green-100">
                                        {/* {calculateTotal()} | {calculateDiscount()} | {deliveryPrice} */}
                                        {/* | {(calculateTotal() - calculateDiscount() + deliveryPrice)} | */}
                                        {(calculateTotal() - calculateDiscount() + deliveryPrice).toFixed(2)} so'm
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
                            <Button type="button" onClick={() => setIsOpen(false)} variant="outline">Bekor qilish</Button>
                            <Button type="submit">Buyurtma yaratish</Button>
                        </AlertDialogFooter>
                    </FormProvider>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    )
}