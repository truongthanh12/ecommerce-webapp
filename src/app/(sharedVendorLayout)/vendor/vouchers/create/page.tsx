"use client";
import { Box } from "@mui/material";
import { H3 } from "@/components/Typography";
import VoucherForm from "@/page-sections/vendor/vouchers/Form";

// =============================================================================
export default function CreateVoucher() {
  return (
    <Box py={4}>
      <H3 mb={2}>Create New Voucher</H3>

      <VoucherForm />
    </Box>
  );
}
