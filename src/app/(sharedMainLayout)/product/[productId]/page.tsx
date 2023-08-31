"use client";
import { useState } from "react";
import { Box, Container, styled, Tab, Tabs } from "@mui/material";
import { H2 } from "@/components/Typography";
import ProductIntro from "@/components/products/ProductIntro";
import ProductReview from "@/components/products/ProductReview";
import RelatedProducts from "@/components/products/RelatedProducts";
import ProductDescription from "@/components/products/ProductDescription";
import { IProducts } from "@/app/models/Product";

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
  // relatedProducts: IProducts[];
  // product: IProducts;
}
export default function ProductDetails({
  params,
  // relatedProducts,
  // product = {
  //   title: "",
  // },
}: ProductDetailProps) {
  const [selectedOption, setSelectedOption] = useState(0);
  const handleOptionClick = (_: any, value: any) => setSelectedOption(value);
  console.log(params.productId);
  // Show a loading state when the fallback is rendered
  // if (router.fallback) {
  //   return <h1>Loading...</h1>;
  // }
  return (
    <Container
      sx={{
        my: 4,
      }}
    >
      {/* PRODUCT DETAILS INFO AREA */}
      {/* {product ? <ProductIntro /> : <H2>Loading...</H2>} */}
      <ProductIntro />
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
        {selectedOption === 0 && <ProductDescription />}
        {selectedOption === 1 && <ProductReview />}
      </Box>

      {/* {relatedProducts && <RelatedProducts products={relatedProducts} />} */}
    </Container>
  );
}
