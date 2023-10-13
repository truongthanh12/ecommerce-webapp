"use client";
import { Box } from "@mui/material";
import { H3 } from "@/components/Typography";
import ProductForm from "@/page-sections/vendor/products/Form";

// =============================================================================
export default function CreateProduct() {
  return (
    <Box py={4}>
      <H3 mb={2}>Create New Product</H3>

      <ProductForm />
    </Box>
  );
}
