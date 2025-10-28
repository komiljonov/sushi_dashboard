"use client";

import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/Button";
// import { Dialog } from "@/components/ui/dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "@/lib/api";
// import { PromocodeForm } from "@/components/promocode/Form";
import { PromocodeTable } from "@/components/promocode/Table";
import { DeleteDialog } from "@/components/promocode/DeleteDialog";
import { IPromocode } from "@/lib/types";
import { Layout } from "@/components/Layout";
import { queryClient } from "@/lib/query";
import { fetchPromocodesType } from "@/lib/fetchers";
import CustomTabs from "@/components/custom-tabs";
import { useCrumb } from "@/lib/context/crumb-provider";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { useRouter } from "next/router";

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
};

export function Promocodes() {
  const [selectedTab, setSelectedTab] = useState("active");
  const { data: promocodes } = useQuery({
    queryKey: ["promocodes", selectedTab],
    queryFn: () => fetchPromocodesType(selectedTab),
  });
  const router = useRouter();

  // const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [promocodeToDelete, setPromocodeToDelete] = useState<IPromocode | null>(
    null
  );

  // const mutation = useMutation({
  //   mutationFn: createPromocode,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ['promocodes'] }),
  // });

  const deleteMutation = useMutation({
    mutationFn: deletePromocode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promocodes"] });
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
  };

  return (
    <div className="mx-auto text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Promokodlar</h1>

        <Button
          className="button"
          onClick={() => router.push("/promocodes/create")}
        >
          <Plus className="mr-2 w-4 h-4" /> Promokod qo'shish
        </Button>
      </div>

      <CustomTabs
        triggers={[
          { title: "Faol", value: "active" },
          { title: "Faol emas", value: "inactive" },
        ]}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        storageKey="promocodes"
      />
      <div className="bg-white p-4 rounded-xl mt-4">
        <PromocodeTable
          promocodes={promocodes}
          onDelete={(promo) => {
            setPromocodeToDelete(promo);
            setIsDeleteDialogOpen(true);
          }}
        />
      </div>
      {/* <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      ></Dialog> */}
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        promocode={promocodeToDelete}
        onDelete={handleDeletePromocode}
      />
    </div>
  );
}

export default function Page() {
  const { setCrumb } = useCrumb();

  useEffect(() => {
    setCrumb([{ label: "Promokodlar", path: "/promocodes" }]);
  }, [setCrumb]);
  return (
    <Layout page={"promocodes"}>
      <Promocodes />
    </Layout>
  );
}
