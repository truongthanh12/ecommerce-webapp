"use client";
import { Box } from "@mui/material";
import { H3 } from "@/components/Typography";
import BannerForm from "@/page-sections/admin/banners/Form";

// =============================================================================
export default function CreateBanner() {
  return (
    <Box py={4}>
      <H3 mb={2}>Create New Banner</H3>

      <BannerForm />
    </Box>
  );
}
