"use client";
import { Box, Button } from "@mui/material";
import { H3 } from "@/components/Typography";
import VoucherForm from "@/page-sections/vendor/vouchers/Form";
import { doc, getDoc } from "firebase/firestore";
import db from "@/firebase";
import { useEffect, useState } from "react";
import { FlexBox } from "@/app/components/flex-box";
import { ArrowBack } from "@mui/icons-material";
import Link from "next/link";

// =============================================================================
interface TypeProps {
  params: { id: string };
}
async function getVoucherId(id = "") {
  try {
    const voucherDocRef = doc(db, "vouchers", id);
    const voucherDocSnapshot = await getDoc(voucherDocRef);

    if (voucherDocSnapshot.exists()) {
      const voucherData = voucherDocSnapshot.data();
      return voucherData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching brand:", error);
    return null;
  }
}

export default function EditVoucher({ params }: TypeProps) {
  const { id } = params;
  const [voucher, setVoucher] = useState<any>({});

  useEffect(() => {
    // Define an async function
    async function fetchData() {
      const voucher = await getVoucherId(params.id);
      setVoucher(voucher || {});
    }
    // Call the async function
    fetchData();
  }, [params.id]);

  return (
    <Box py={4}>
      <FlexBox mb={2} gap={2} justifyContent="space-between" flexWrap="wrap">
        <H3 mb={2}>Edit voucher "{voucher?.title}"</H3>
        <Link href="/vendor/vouchers">
          <Button
            color="info"
            variant="contained"
            startIcon={<ArrowBack />}
            sx={{
              minHeight: 44,
            }}
          >
            Back
          </Button>
        </Link>
      </FlexBox>

      <VoucherForm id={id} voucher={voucher} />
    </Box>
  );
}
