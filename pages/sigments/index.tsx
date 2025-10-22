import { Layout } from "@/components/Layout";
import SigmentsModal from "@/components/sigments/sigments-modal";
import SigmentsTable from "@/components/sigments/sigments-table";
import { fetchSigments } from "@/lib/actions/sigments.action";
import { ISigment } from "@/lib/types/sigments.types";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Sigments = () => {
  const {data: sigments} = useQuery<ISigment[]>({
    queryKey: ['sigments'],
    queryFn: fetchSigments,
  })
  return (
    <Layout page="sigments">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold mb-5">Sigmentlar</h1>
          <SigmentsModal />
        </div>
        <SigmentsTable sigments={sigments} onDelete={() => {}} />
      </div>
    </Layout>
  );
};

export default Sigments;
