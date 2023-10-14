import { Box } from "@mui/material";
import { H3 } from "@/components/Typography";
import React from "react";
import { IProducts } from "@/models/Product";

// ======================================================
const ProductDescription = ({ product }: { product: Partial<IProducts> }) => {
  const { description, brands } = product || {};
  return (
    <Box>
      <H3 mb={2}>Specification:</H3>
      <Box>
        Brand: {brands} <br />
        <div dangerouslySetInnerHTML={{ __html: description?.replace(/(?:\r\n|\r|\n)/g, "<br />") || "" }} />
      </Box>
    </Box>
  );
};
export default React.memo(ProductDescription);
