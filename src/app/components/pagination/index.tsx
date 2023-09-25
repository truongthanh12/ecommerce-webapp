import React from "react";
import { FlexBetween } from "../flex-box";
import { Span } from "../Typography";
import { Pagination } from "@mui/material";
import { IProducts } from "@/app/models/Product";
import {
  formatNumberWithThousandSeparators,
  objectToQueryString,
} from "@/app/utils/lib";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";

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
  const router = useRouter();

  const handleChange = (page: number) => {
    let updatedQuery: any = { ...searchParams };

    if (page) {
      updatedQuery.page = page;
    } else {
      delete updatedQuery.brand;
    }

    const debouncedFunction = debounce(() => {
      router.push(`?${objectToQueryString(updatedQuery)}`);
    }, 200);

    debouncedFunction();
  };

  return (
    <FlexBetween flexWrap="wrap" mt={4}>
      <Span color="grey.600">
        Showing {startProductNumber}-{products.length} of{" "}
        {formatNumberWithThousandSeparators(totalProducts)} Products
      </Span>
      <Pagination
        count={10}
        variant="outlined"
        color="primary"
        onChange={(_, page) => {
          handleChange(page);
        }}
      />
    </FlexBetween>
  );
};

export default React.memo(PaginationItem);
