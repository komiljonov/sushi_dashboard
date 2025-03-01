
'use client'

import React, { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { CreateOrderForm } from './types'
import { generateTimeOptions } from '@/lib/utils'




export default function DeliveryTime() {

    const { setValue, control } = useFormContext<CreateOrderForm>();


    const [showCustomInput, setShowCustomInput] = useState(false)
    const [customHours, setCustomHours] = useState('')
    const [customMinutes, setCustomMinutes] = useState('')



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
    )
}