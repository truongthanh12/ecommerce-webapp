"use client";
import { Box, Button } from "@mui/material";
import { H3 } from "@/components/Typography";
import BrandForm from "@/page-sections/admin/brands/Form";
import { doc, getDoc } from "firebase/firestore";
import db from "@/firebase";
import { useEffect, useState } from "react";
import { FlexBox } from "@/components/flex-box";
import Link from "next/link";
import { ArrowBack } from "@mui/icons-material";

// =============================================================================
interface TypeProps {
  params: { id: string; lang: string };
}
async function getBrandById(id = "") {
  try {
    const brandDocRef = doc(db, "brands", id);
    const brandDocSnapshot = await getDoc(brandDocRef);

    if (brandDocSnapshot.exists()) {
      const brandData = brandDocSnapshot.data();
      return brandData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching brand:", error);
    return null;
  }
}

export default function Editbrand({ params }: TypeProps) {
  const { id, lang } = params;
  const [brand, setBrand] = useState<any>({});

  useEffect(() => {
    // Define an async function
    async function fetchData() {
      const brand = await getBrandById(id);
      setBrand(brand || {});
    }
    // Call the async function
    fetchData();
  }, [id]);

  return (
    <Box py={4}>
      <FlexBox mb={2} gap={2} justifyContent="space-between" flexWrap="wrap">
        <H3 mb={2}>Edit brand "{brand?.name}"</H3>
        <Link href={`/${lang}/admin/brands`}>
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

      <BrandForm id={id} brand={brand} />
    </Box>
  );
}
