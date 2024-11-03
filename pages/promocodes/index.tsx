"use client"

import { useState } from "react"
// import { Button } from "@/components/ui/Button"
// import { Dialog } from "@/components/ui/dialog"
import { useMutation, useQuery } from "@tanstack/react-query"
import { request } from "@/lib/api"
// import { PromocodeForm } from "@/components/promocode/Form"
import { PromocodeTable } from "@/components/promocode/Table"
import { DeleteDialog } from "@/components/promocode/DeleteDialog"
import { IPromocode } from "@/lib/types"
import { Layout } from "@/components/Layout"
import { queryClient } from "@/lib/query"
import { fetchPromocodes } from "@/lib/fetchers"














// const createPromocode = async (promocode: Omit<IPromocode, "id">) => {


//   const { end_date } = promocode;

//   // Format end_date if it's a Date object, otherwise keep it as-is
//   const formattedEndDate = end_date instanceof Date
//     ? `${end_date.getFullYear()}-${String(end_date.getMonth() + 1).padStart(2, '0')}-${String(end_date.getDate()).padStart(2, '0')}`
//     : undefined;

//   // Construct request payload conditionally
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const payload: any = { ...promocode };
//   if (formattedEndDate !== undefined) {
//     payload.end_date = formattedEndDate;
//   }


//   await request.post('promocodes/', payload);

// }


const deletePromocode = async (id: string) => {
  await request.delete(`promocodes/${id}/`);
}

export function Promocodes() {
  const { data: promocodes } = useQuery({
    queryKey: ['promocodes'],
    queryFn: fetchPromocodes
  });

  // const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [promocodeToDelete, setPromocodeToDelete] = useState<IPromocode | null>(null);

  // const mutation = useMutation({
  //   mutationFn: createPromocode,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ['promocodes'] }),
  // });

  const deleteMutation = useMutation({
    mutationFn: deletePromocode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promocodes'] });
      setIsDeleteDialogOpen(false);
    },
  });

  // const handleCreatePromocode = (data: Omit<IPromocode, "id">) => {
  //   mutation.mutate(data);
  //   setIsCreateDialogOpen(false);
  // }

  const handleDeletePromocode = () => {
    if (promocodeToDelete) {
      deleteMutation.mutate(promocodeToDelete.id);
    }
  }

  return (
    <div className="container mx-auto py-10 text-black">
      <h1 className="text-2xl font-bold mb-5">Promokodlar</h1>
      {/* <div className="flex justify-end mb-5"> */}
      {/* <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Promokod qo&apos;shish</Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Promocode qo&apos;shish</DialogTitle>
            </DialogHeader>
            <PromocodeForm
              onSubmit={handleCreatePromocode}
              defaultValues={{ name_uz: "", name_ru: "", code: "", measurement: "ABSOLUTE", amount: 0, count: 0, end_date: null, min_amount: 0, max_amount: 0, is_limited: false, is_max_limited: false } as IPromocode}
            />
          </DialogContent>
        </Dialog> */}
      {/* </div> */}
      <PromocodeTable promocodes={promocodes} onDelete={(promo) => {
        setPromocodeToDelete(promo);
        setIsDeleteDialogOpen(true);
      }} />
      {/* <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}> */}
        <DeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          promocode={promocodeToDelete}
          onDelete={handleDeletePromocode}
        />
      {/* </Dialog> */}
    </div>
  )
}



export default function Page() {
  return <Layout page="promocodes">
    <Promocodes />
  </Layout>
}