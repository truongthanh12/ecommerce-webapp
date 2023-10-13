"use client";
import { Box, Button } from "@mui/material";
import { H3 } from "@/components/Typography";
import ProductForm from "@/page-sections/vendor/products/Form";
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
async function getProductById(id = "") {
  try {
    const productDocRef = doc(db, "products", id);
    const productDocSnapshot = await getDoc(productDocRef);

    if (productDocSnapshot.exists()) {
      const productData = productDocSnapshot.data();
      return productData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default function EditProduct({ params }: TypeProps) {
  const { id } = params;
  const [product, setProduct] = useState<any>({});

  useEffect(() => {
    // Define an async function
    async function fetchData() {
      const productData = await getProductById(params.id);
      setProduct(productData || {});
    }
    // Call the async function
    fetchData();
  }, [params.id]);

  return (
    <Box py={4}>
      <FlexBox mb={2} gap={2} justifyContent="space-between" flexWrap="wrap">
        <H3 mb={2}>Edit product ID "{id}"</H3>
        <Link href="/vendor/products">
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

      <ProductForm id={id} product={product} />
    </Box>
  );
}
