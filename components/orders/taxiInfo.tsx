import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Label } from "@/components/ui/Label"
import { Badge } from "@/components/ui/badge"
import { Car, Phone } from "lucide-react"
import Link from "next/link"
import { ITaxi } from "@/lib/types"


export function TaxiInfoCard({ taxi }: { taxi: ITaxi | null | undefined }) {
    if (!taxi) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Taksi ma&apos;lumoti</CardTitle>
                    <CardDescription>Buyurtma uchun taksi ma&apos;lumoti</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Taksi ma&apos;lumoti mavjud emas</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Taksi ma&apos;lumoti</CardTitle>
                <CardDescription>Buyurtma uchun taksi ma&apos;lumoti</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Car className="h-4 w-4" />
                    <Label>Avtomobil:</Label>
                    <span>{taxi.mark} {taxi.car_model}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Label>Rang:</Label>
                    <Badge variant="outline">
                        {taxi.car_color}
                    </Badge>
                </div>
                <div className="flex items-center space-x-2">
                    <Label>Raqam:</Label>
                    <span>{taxi.car_number}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Label>Narx:</Label>
                    <Badge variant="secondary" className="text-green-600 bg-green-100">
                        {taxi.total_sum.toFixed(2)} so&apos;m
                    </Badge>
                </div>
                <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <Label>Haydovchi telefon raqami:</Label>
                    <Link href={`tel:${taxi.driver_phone_number}`} className="text-blue-500 hover:text-blue-700">
                        {taxi.driver_phone_number}
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}