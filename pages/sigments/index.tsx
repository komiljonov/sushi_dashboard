import { Layout } from "@/components/Layout";
import SigmentsAddModal from "@/components/sigments/sigments-add-modal";
import SigmentsTable from "@/components/sigments/sigments-table";
import { fetchSigments } from "@/lib/actions/sigments.action";
import { ISigment } from "@/lib/types/sigments.types";
import { useQuery } from "@tanstack/react-query";

const Sigments = () => {
  const { data: sigments } = useQuery<ISigment[]>({
    queryKey: ["sigments"],
    queryFn: fetchSigments,
  });

  return (
    <Layout page="sigments">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold mb-5">Sigmentlar</h1>
          <SigmentsAddModal />
        </div>

        <SigmentsTable sigments={sigments} />
      </div>
    </Layout>
  );
};

export default Sigments;
