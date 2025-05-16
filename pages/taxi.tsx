import { Layout } from "@/components/Layout";
import CallTaxiModal from "@/components/taxi/taxi-modal";
import TaxiTable from "@/components/taxi/taxi-table";
import { useCrumb } from "@/lib/context/crumb-provider";
import React, { useEffect } from "react";

const Taxi = () => {
  const { setCrumb } = useCrumb();

  useEffect(() => {
    setCrumb([{ label: "Taksilar tarixi", path: "/taxi" }]);
  }, [setCrumb]);
  return (
    <Layout page="taxi">
      <div className="flex flex-col gap-6 w-full">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-2xl font-bold">Taksilar tarixi</h1>
          <CallTaxiModal />{" "}
        </div>
        <TaxiTable />
      </div>
    </Layout>
  );
};

export default Taxi;
