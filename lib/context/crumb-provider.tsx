import React, { createContext, useContext, ReactNode, useState } from "react";

interface CrumbContextType {
  crumb: { label: string; path: string }[];
  setCrumb: (crumb: { label: string; path: string }[]) => void;
}

const CrumbContext = createContext<CrumbContextType | undefined>(
  undefined
);

export const useCrumb = (): CrumbContextType => {
  const context = useContext(CrumbContext);
  if (!context) {
    throw new Error("useCrumb must be used within a CrumbProvider");
  }
  return context;
};

interface CrumbProviderProps {
  children: ReactNode;
}

export const CrumbProvider: React.FC<CrumbProviderProps> = ({
  children,
}) => {
  const [crumb, setCrumb] = useState<
    { label: string; path: string }[]
  >([]);

  return (
    <CrumbContext.Provider
      value={{
        crumb,
        setCrumb,
      }}
    >
      {children}
    </CrumbContext.Provider>
  );
};
