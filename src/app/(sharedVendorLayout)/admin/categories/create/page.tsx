"use client";
import { Box } from "@mui/material";
import { H3 } from "@/components/Typography";
import CategoryForm from "@/page-sections/admin/categories/Form";

// =============================================================================
export default function CreateBrand() {
  return (
    <Box py={4}>
      <H3 mb={2}>Create New Brand</H3>

      <CategoryForm />
    </Box>
  );
}
