"use client";
import { Suspense, useEffect, useState } from "react";
import { Box, Container, styled, Tab, Tabs } from "@mui/material";
import ProductIntro from "@/components/products/ProductIntro";
import ProductReview from "@/components/products/ProductReview";
import RelatedProducts from "@/components/products/RelatedProducts";
import ProductDescription from "@/components/products/ProductDescription";
import { collection, getDocs, query, where } from "firebase/firestore";
import db from "@/firebase";
import { H2 } from "@/app/components/Typography";

// styled component
const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 0,
  marginTop: 80,
  marginBottom: 24,
  borderBottom: `1px solid ${theme.palette.text.disabled}`,
  "& .inner-tab": {
    minHeight: 40,
    fontWeight: 600,
    textTransform: "capitalize",
  },
}));

// ===============================================================

interface ProductDetailProps {
  params: { productId: string };
  searchParams: { [key: string]: string | undefined };
}
async function getProductBySlug(productSlug = "") {
  try {
    const productsCollection = collection(db, "products");
    const q = query(productsCollection, where("slug", "==", productSlug));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Assuming that there's only one product with a given slug
      const productDoc = querySnapshot.docs[0];
      const productData = { ...productDoc.data(), id: productDoc.id };

      return productData;
    } else {
      // Handle the case where no product matches the slug
      return null;
    }
  } catch (error) {
    // Handle any errors here
    console.error("Error fetching product:", error);
    return null;
  }
}
export default function ProductDetails({
  params,
  searchParams,
}: ProductDetailProps) {
  const [selectedOption, setSelectedOption] = useState(0);
  const handleOptionClick = (_: any, value: any) => setSelectedOption(value);
  const [product, setProduct] = useState({});

  useEffect(() => {
    // Define an async function
    async function fetchData() {
      const product = await getProductBySlug(params.productId);
      setProduct(product || {});
    }

    // Call the async function
    fetchData();
  }, [params.productId]);

  return (
    <Container
      sx={{
        my: 4,
      }}
    >
      <Suspense fallback="Loading...">
        {/* PRODUCT DETAILS INFO AREA */}
        {product ? (
          <ProductIntro searchParams={searchParams} product={product} />
        ) : (
          <H2>Loading...</H2>
        )}
        {/* PRODUCT DESCRIPTION AND REVIEW */}
        <StyledTabs
          textColor="primary"
          value={selectedOption}
          indicatorColor="primary"
          onChange={handleOptionClick}
        >
          <Tab className="inner-tab" label="Description" />
          <Tab className="inner-tab" label="Review (3)" />
        </StyledTabs>

        <Box mb={6}>
          {selectedOption === 0 && <ProductDescription product={product} />}
          {selectedOption === 1 && <ProductReview />}
        </Box>

        {/* {relatedProducts && <RelatedProducts products={relatedProducts} />} */}
      </Suspense>
    </Container>
  );
}
