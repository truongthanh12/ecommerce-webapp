"use client";
import { Box } from "@mui/material";
import { H3 } from "@/components/Typography";
import BrandForm from "@/page-sections/admin/brands/Form";

// =============================================================================
export default function CreateBrand() {
  return (
    <Box py={4}>
      <H3 mb={2}>Create New Brand</H3>

      <BrandForm />
    </Box>
  );
}
