"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Box, Container, styled, Tab, Tabs } from "@mui/material";
import ProductIntro from "@/components/products/ProductIntro";
import ProductReview from "@/components/products/ProductReview";
import ProductDescription from "@/components/products/ProductDescription";
import { collection, getDocs, query, where } from "firebase/firestore";
import db from "@/firebase";
import { H2 } from "@/components/Typography";
import BackdropLoading from "@/components/backdrop";
import { getCommentsByProductId } from "@/redux/features/productSlice";
import RelatedProducts from "@/components/products/RelatedProducts";
import { useSelector } from "react-redux";
import { IProducts } from "@/app/models/Product";
import { RootState } from "@/redux/store";

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
      const productDoc = querySnapshot.docs[0];
      const productData = { ...productDoc.data(), id: productDoc.id };

      return productData;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}
export default function ProductDetails({
  params,
  searchParams,
}: ProductDetailProps) {
  const [selectedOption, setSelectedOption] = useState(0);
  const handleOptionClick = (_: any, value: any) => setSelectedOption(value);
  const [product, setProduct] = useState<any>({});
  const [comments, setComments] = useState<any>();
  const { products } = useSelector((state: RootState) => state.products);

  const relatedProducts = useMemo(() => {
    if (product?.tags && Array.isArray(product?.tags)) {
      const lowerCaseTags = product.tags.map((tag: string) =>
        tag.toLowerCase()
      );

      return products.filter((prod: IProducts) =>
        prod?.tags?.some(
          (tag) =>
            lowerCaseTags.includes(tag.toLowerCase()) && prod.id !== product.id
        )
      );
    }
    return [];
  }, [products, product?.tags, product?.id]);

  useEffect(() => {
    // Define an async function
    async function fetchData() {
      const product = await getProductBySlug(params.productId);
      setProduct(product || {});
    }

    // Call the async function
    fetchData();
  }, [params.productId]);

  useEffect(() => {
    if (product.id) {
      getCommentsByProductId(product.id)
        .then((res: any) => {
          setComments(res);
        })
        .catch((error) => {
          throw error;
        });
    }
  }, [product.id]);

  // if (product.id) {
  return (
    <Suspense fallback={<BackdropLoading />}>
      <Container
        sx={{
          my: 4,
        }}
      >
        {/* PRODUCT DETAILS INFO AREA */}
        {product ? (
          <ProductIntro
            comments={comments}
            searchParams={searchParams}
            product={product}
          />
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
          <Tab
            className="inner-tab"
            label={`Review ${
              comments?.length ? `(${comments?.length})` : "(0)"
            }`}
          />
        </StyledTabs>

        <Box mb={6}>
          {selectedOption === 0 && <ProductDescription product={product} />}
          {selectedOption === 1 && <ProductReview productId={product.id} />}
        </Box>

        {relatedProducts.length ? (
          <RelatedProducts products={relatedProducts} />
        ) : (
          ""
        )}
      </Container>
    </Suspense>
  );
}
