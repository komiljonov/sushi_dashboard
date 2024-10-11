'use client'

import React, { useState } from 'react'
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
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
import { Skeleton } from '@/components/ui/skeleton'
import { useFormContext } from 'react-hook-form'
import { CreateOrderForm } from './types'
import { IUser } from '@/lib/types'



export default function UserSelect({ users }: { users?: IUser[] }) {
    const [open, setOpen] = useState(false);


    const { watch, setValue } = useFormContext<CreateOrderForm>();


    return (
        <div className="space-y-2">
            <Label htmlFor="user">Foydalanuvchi</Label>
            {!users ? (
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
    )
}