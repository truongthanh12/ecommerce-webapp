"use client";
import { Box, Button } from "@mui/material";
import { H3 } from "@/components/Typography";
import BannerForm from "@/page-sections/admin/banners/Form";
import { doc, getDoc } from "firebase/firestore";
import db from "@/firebase";
import { useEffect, useState } from "react";
import { FlexBox } from "@/components/flex-box";
import { ArrowBack } from "@mui/icons-material";
import Link from "next/link";

// =============================================================================
interface TypeProps {
  params: { id: string; lang: string };
}
async function getBannerId(id = "") {
  try {
    const bannerDocRef = doc(db, "hero-banners", id);
    const bannerDocSnapshot = await getDoc(bannerDocRef);

    if (bannerDocSnapshot.exists()) {
      const bannerData = bannerDocSnapshot.data();
      return bannerData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching brand:", error);
    return null;
  }
}

export default function EditBanner({ params }: TypeProps) {
  const { id, lang } = params;
  const [banner, setBanner] = useState<any>({});

  useEffect(() => {
    // Define an async function
    async function fetchData() {
      const banner = await getBannerId(id);
      setBanner(banner || {});
    }
    // Call the async function
    fetchData();
  }, [id]);

  return (
    <Box py={4}>
      <FlexBox mb={2} gap={2} justifyContent="space-between" flexWrap="wrap">
        <H3 mb={2}>Edit banner "{banner?.title}"</H3>
        <Link href={`/${lang}/admin/banners`}>
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

      <BannerForm id={id} banner={banner} />
    </Box>
  );
}
