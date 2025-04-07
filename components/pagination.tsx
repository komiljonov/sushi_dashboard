import React, { Dispatch, SetStateAction } from "react";
import { Pagination, PaginationItem, Stack, useMediaQuery } from "@mui/material";

const CustomPagination = ({ totalPages = 9, setPage, page }: { totalPages?: number, setPage: Dispatch<SetStateAction<number>>, page: number }) => {

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const isMobile = useMediaQuery("(max-width:769px)");

  return (
    <Stack spacing={2} alignItems={isMobile ? "center" : "flex-end"}>
      <Pagination
        count={totalPages} // Dynamic total pages
        page={page} // Controlled pagination state
        onChange={handleChange} // Handles page change
        shape="rounded"
        variant="outlined"
        color="primary"
        renderItem={(item) => <PaginationItem {...item} />}
      />
    </Stack>
  );
};

export default CustomPagination;
