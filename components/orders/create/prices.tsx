
import React from 'react'
import { calculate_discount, splitToHundreds } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from '@/components/ui/skeleton'
import { useFormContext } from 'react-hook-form'
import { CreateOrderForm } from './types'
import { DeliveryPrice, IPromocode } from '@/lib/types'







export default function TotalPrices({ _deliveryPrice, deliveryPriceLoading, promocodes }: { _deliveryPrice?: DeliveryPrice, deliveryPriceLoading: boolean, promocodes?: IPromocode[] }) {


    const { watch } = useFormContext<CreateOrderForm>();
    const deliveryMethod = watch('delivery');
    const orderItems = watch("items");







    const deliveryPrice = deliveryMethod === 'DELIVER' ? (_deliveryPrice?.cost || 0) : 0;


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


    return (
        <div className="space-y-2">
            <div className="flex justify-between border-b-2 border-dashed pb-1">
                <span>Mahsulotlar:</span>
                <span>{splitToHundreds(calculateTotal()) || 0} so'm</span>
            </div>

            {watch('promocode') && (
                <div className="flex justify-between text-green-600 border-b-2 border-dashed pb-1">
                    <span>Chegirma:</span>
                    <span>-{splitToHundreds(calculateDiscount()) || 0} so'm</span>
                </div>
            )}

            {deliveryMethod == "DELIVER" && (
                <div className="flex justify-between border-b-2 border-dashed pb-1">
                    <span>Yetkazib berish:</span>
                    {deliveryPriceLoading ? (
                        <Skeleton className="h-6 w-20" />
                    ) : (
                        <span>{(splitToHundreds(_deliveryPrice?.cost) || 0) ?? "Hisoblanmoqda..."}</span>
                    )}
                </div>
            )}

            <div className="flex justify-between font-bold border-b-2 border-dashed pb-1">
                <span>Jami:</span>
                <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-green-600 bg-green-100">
                        {/* {calculateTotal()} | {calculateDiscount()} | {deliveryPrice} */}
                        {/* | {(calculateTotal() - calculateDiscount() + deliveryPrice)} | */}
                        {splitToHundreds(calculateTotal() - calculateDiscount() + deliveryPrice) || 0} so'm
                    </Badge>
                    {watch('promocode') && (
                        <span className="text-sm text-muted-foreground line-through">
                            {splitToHundreds(calculateTotal())} so'm
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}