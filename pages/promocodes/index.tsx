"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { request } from "@/lib/api"
import { PromocodeForm } from "@/components/promocode/Form"
import { PromocodeTable } from "@/components/promocode/Table"
import { DeleteDialog } from "@/components/promocode/DeleteDialog"
import { IPromocode } from "@/lib/types"
import { Layout } from "@/components/Layout"

const fetchPromocodes = async (): Promise<IPromocode[]> => {
  const { data } = await request.get('promocodes/');
  return data;
}

const createPromocode = async (promocode: Omit<IPromocode, "id">) => {
  await request.post('promocodes/', promocode);
}

const deletePromocode = async (id: string) => {
  await request.delete(`promocodes/${id}/`);
}

export function Promocodes() {
  const queryClient = useQueryClient();
  const { data: promocodes = [] } = useQuery({
    queryKey: ['promocodes'],
    queryFn: fetchPromocodes
  });

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [promocodeToDelete, setPromocodeToDelete] = useState<IPromocode | null>(null);

  const mutation = useMutation({
    mutationFn: createPromocode,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['promocodes'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePromocode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promocodes'] });
      setIsDeleteDialogOpen(false);
    },
  });

  const handleCreatePromocode = (data: Omit<IPromocode, "id">) => {
    mutation.mutate(data);
    setIsCreateDialogOpen(false);
  }

  const handleDeletePromocode = () => {
    if (promocodeToDelete) {
      deleteMutation.mutate(promocodeToDelete.id);
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Promokodlar</h1>
      <div className="flex justify-end mb-5">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Promokod qo&apos;shish</Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Create New Promocode</DialogTitle>
            </DialogHeader>
            <PromocodeForm
              onSubmit={handleCreatePromocode}
              defaultValues={{ name: "", code: "", measurement: "ABSOLUTE", amount: 0, count: 0, endDate: null, minAmount: 0, maxAmount: 0 }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <PromocodeTable promocodes={promocodes} onDelete={(promo) => {
        setPromocodeToDelete(promo);
        setIsDeleteDialogOpen(true);
      }} />
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          promocode={promocodeToDelete}
          onDelete={handleDeletePromocode}
        />
      </Dialog>
    </div>
  )
}



export default function Page() {
  return <Layout page="promocodes">
    <Promocodes />
  </Layout>
}