"use client";
import { Box, Button } from "@mui/material";
import { H3 } from "@/components/Typography";
import CategoryForm from "@/page-sections/admin/categories/Form";
import { doc, getDoc } from "firebase/firestore";
import db from "@/firebase";
import { useEffect, useState } from "react";
import { FlexBox } from "@/app/components/flex-box";
import Link from "next/link";
import { ArrowBack } from "@mui/icons-material";

// =============================================================================
interface TypeProps {
  params: { id: string };
}
async function getCateId(id = "") {
  try {
    const categoryDocRef = doc(db, "categories", id);
    const categoryDocSnapshot = await getDoc(categoryDocRef);

    if (categoryDocSnapshot.exists()) {
      const categoryData = categoryDocSnapshot.data();
      return categoryData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching brand:", error);
    return null;
  }
}

export default function EditCategory({ params }: TypeProps) {
  const { id } = params;
  const [category, setCategory] = useState<any>({});

  useEffect(() => {
    // Define an async function
    async function fetchData() {
      const category = await getCateId(params.id);
      setCategory(category || {});
    }
    // Call the async function
    fetchData();
  }, [params.id]);

  return (
    <Box py={4}>
      <FlexBox mb={2} gap={2} justifyContent="space-between" flexWrap="wrap">
        <H3 mb={2}>Edit category "{category?.name}"</H3>
        <Link href="/admin/categories">
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
      
      <CategoryForm id={id} category={category} />
    </Box>
  );
}
