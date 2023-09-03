"use client";
import { Box } from "@mui/material";
import { H3 } from "@/components/Typography";
import BrandForm from "@/page-sections/admin/brands/Form";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import db from "@/firebase";
import { useEffect, useState } from "react";

// =============================================================================
interface TypeProps {
  params: { id: string };
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
  const { id } = params;
  const [brand, setBrand] = useState<any>({});

  useEffect(() => {
    // Define an async function
    async function fetchData() {
      const brand = await getBrandById(params.id);
      setBrand(brand || {});
    }
    // Call the async function
    fetchData();
  }, [params.id]);

  return (
    <Box py={4}>
      <H3 mb={2}>Edit brand "{brand?.name}"</H3>

      <BrandForm id={id} brand={brand} />
    </Box>
  );
}
