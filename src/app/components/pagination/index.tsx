import React, { useMemo } from "react";
import { FlexBetween } from "../flex-box";
import { Span } from "../Typography";
import { Pagination } from "@mui/material";
import { IProducts } from "@/models/Product";
import { formatNumberWithThousandSeparators } from "@/utils/lib";
import useCustomRouter from "@/hooks/usePushRouter";

interface PageProps {
  products: IProducts[];
  totalProducts: number;
  startProductNumber: number;
  searchParams: { [key: string]: string | undefined };
}
const PaginationItem = ({
  products,
  totalProducts,
  startProductNumber,
  searchParams,
}: PageProps) => {
  const { pushRouter } = useCustomRouter();

  const currentPage = useMemo(
    () => Number(searchParams.page) || 1,
    [searchParams.page]
  );

  const pageStartNumber = useMemo(() => {
    return startProductNumber + (currentPage > 1 ? (currentPage - 1) * 10 : 0);
  }, [currentPage, startProductNumber]);

  const pageEndNumber = useMemo(() => {
    return products.length + (currentPage > 1 ? (currentPage - 1) * 10 : 0);
  }, [products, currentPage]);

  const hasPagination = useMemo(() => totalProducts / 10 > 1, [totalProducts]);
  const handleChange = (page: number) => {
    pushRouter(`?page=${page}`);
  };

  return (
    <FlexBetween flexWrap="wrap" mt={4}>
      <Span color="grey.600">
        Showing {pageStartNumber}-
        {pageEndNumber > totalProducts ? products.length : pageEndNumber} of{" "}
        {formatNumberWithThousandSeparators(totalProducts)} Products
      </Span>
      {hasPagination && (
        <Pagination
          count={Math.round(totalProducts / 10)}
          variant="outlined"
          color="primary"
          defaultPage={Number(searchParams.page) || 1}
          onChange={(_, page) => {
            handleChange(page);
          }}
        />
      )}
    </FlexBetween>
  );
};

export default React.memo(PaginationItem);
