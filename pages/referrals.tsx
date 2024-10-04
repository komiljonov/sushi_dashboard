'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { Copy, Trash2 } from "lucide-react"
import { Layout } from '@/components/Layout'
import { request } from "@/lib/api"
import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '@/lib/query'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface IReferral {
  id: string
  name: string
  users_count: number
  link: string
}

const fetchReferrals = async (): Promise<IReferral[]> => {
  const { data } = await request.get('referrals')
  return data
}

const createReferral = async (name: string) => {
  const { data } = await request.post("referrals", { name })
  return data
}

const deleteReferral = async (id: string) => {
  const { data } = await request.delete(`referrals/${id}`)
  return data
}

function ReferralLinksCRUD() {
  const [newReferralName, setNewReferralName] = useState('')
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; referralId: string | null }>({
    isOpen: false,
    referralId: null,
  })

  const { data: referrals = [] } = useQuery({
    queryKey: ["referrals"],
    queryFn: fetchReferrals,
    refetchInterval: 10000
  })

  const createMutation = useMutation({
    mutationFn: createReferral,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referrals'] })
      toast({
        title: "Muvaffaqiyat",
        description: "Referal havolasi muvaffaqiyatli yaratildi.",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteReferral,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referrals'] })
      toast({
        title: "Muvaffaqiyat",
        description: "Referal havolasi muvaffaqiyatli o'chirildi.",
      })
    },
  })

  const handleCreateReferral = (e: React.FormEvent) => {
    e.preventDefault()
    if (newReferralName.trim() === '') {
      toast({
        title: "Xato",
        description: "Iltimos, referal havolasi uchun nom kiriting.",
        variant: "destructive",
      })
      return
    }
    createMutation.mutate(newReferralName)
    setNewReferralName('')
  }

  const handleCopyLink = (referral: IReferral) => {
    navigator.clipboard.writeText(referral.link).then(() => {
      toast({
        title: "Nusxalandi!",
        description: "Referal havolasi vaqtinchalik xotiraga nusxalandi.",
      })
    }).catch(() => {
      toast({
        title: "Xato",
        description: "Referal havolasini nusxalashda xatolik yuz berdi.",
        variant: "destructive",
      })
    })
  }

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmation({ isOpen: true, referralId: id })
  }

  const handleConfirmDelete = () => {
    if (deleteConfirmation.referralId) {
      deleteMutation.mutate(deleteConfirmation.referralId)
    }
    setDeleteConfirmation({ isOpen: false, referralId: null })
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Referal Havolalarini Boshqarish</h1>

      <form onSubmit={handleCreateReferral} className="space-y-4">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Referal havolasi nomini kiriting"
            value={newReferralName}
            onChange={(e) => setNewReferralName(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">Havola Yaratish</Button>
        </div>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nomi</TableHead>
            <TableHead>Foydalanuvchilar Soni</TableHead>
            <TableHead>Amallar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {referrals.map((referral) => (
            <TableRow key={referral.id}>
              <TableCell>{referral.name}</TableCell>
              <TableCell>{referral.users_count}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopyLink(referral)}
                    title="Referal havolasini nusxalash"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteClick(referral.id)}
                    title="Referal havolasini o&apos;chirish"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={deleteConfirmation.isOpen} onOpenChange={(isOpen) => setDeleteConfirmation({ isOpen, referralId: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Haqiqatan ham bu referal havolasini o&apos;chirmoqchimisiz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu amalni qaytarib bo&apos;lmaydi. Bu referal havolasini butunlay o&apos;chiradi va u bilan bog&apos;liq barcha ma&apos;lumotlarni olib tashlaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction className='bg-destructive hover:bg-destructive/90' onClick={handleConfirmDelete}>O&apos;chirish</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function Page() {
  return <Layout page='referrals'>
    <ReferralLinksCRUD />
  </Layout>
}