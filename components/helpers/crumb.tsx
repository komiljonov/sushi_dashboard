import React from "react";
import Link from "next/link";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useCrumb } from "@/lib/context/crumb-provider";

export const Crumb: React.FC = () => {
  const { crumb } = useCrumb();

  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        {crumb.map((item, index) => {
          const isLast = index === crumb.length - 1;
          return isLast ? (
            <span key={index} className="text-xs sm:text-sm">
              {item.label}
            </span>
          ) : (
            <Link
              key={index}
              href={item.path}
              style={{ textDecoration: "none" }}
              className="text-xs sm:text-sm">
              {item.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </div>
  );
};
