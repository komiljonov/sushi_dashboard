import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { CarFront, CreditCard, Phone } from "lucide-react";
import Link from "next/link";
import { IOrder, ITaxi } from "@/lib/types";
import dynamic from "next/dynamic";

// Importing the MapWithRoute component dynamically to avoid SSR issues with Leaflet
const TaxiLocation = dynamic(() => import("./taxi-location"), {
  ssr: false,
});

export function TaxiInfoCard({ order }: { order: IOrder | null | undefined }) {

  const taxi = order?.taxi as ITaxi;
  if (!order) {
    return (
      <Card className="md:col-span-2 border-none shadow-none rounded-2xl">
        <CardHeader>
          <CardTitle>Taksi ma&apos;lumoti</CardTitle>
          <CardDescription>Buyurtma uchun taksi ma&apos;lumoti</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Taksi ma&apos;lumoti mavjud emas</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="md:col-span-2 border-none shadow-none rounded-2xl">
      <div className="grid grid-cols-2 gap-2 pt-6">
      <CardContent className="space-y-6">
      <div>
        <CardTitle className="text-lg">Taksi haqida ma’lumot</CardTitle>
        <CardDescription>Buyurtma uchun taksi ma&apos;lumoti</CardDescription>
      </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[#A3A3A3]">
            <CarFront className="h-4 w-4" />
            <Label className="text-md font-normal">Avtomobil:</Label>
          </div>
          <span className="font-medium">
            {taxi.mark} {taxi.car_model}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-md space-x-2 text-[#A3A3A3]">
            <span>#</span>
            <Label>Rangi</Label>
          </div>
          <span className="font-medium">{taxi?.car_color}</span>
        </div>
        <div className="flex items-center  justify-between space-x-2 text-md w-full">
          <div className="flex items-center text-md  text-[#A3A3A3]">
            <Label># Avtomobil raqami</Label>
          </div>
          <span className="font-medium">{taxi.car_number}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-md gap-2 text-[#A3A3A3]">
            <CreditCard className="h-4 w-4" />
            <Label>Yetkazib berish narxi</Label>
          </div>
          <span className="font-medium text-orange-500">
            {taxi.total_sum.toFixed(2)} so&apos;m
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-md gap-2 text-[#A3A3A3]">
            <Phone className="h-4 w-4" />
            <Label>Haydovchi telefon raqami:</Label>
          </div>
          <Link
            href={`tel:+${taxi.driver_phone_number}`}
          >
            +{taxi.driver_phone_number}
          </Link>
        </div>
      </CardContent>
        <CardContent>
            <TaxiLocation order={order}/>
        </CardContent>
      </div>
    </Card>
  );
}
