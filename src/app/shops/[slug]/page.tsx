import { Container } from "@mui/material";
import ProductsSearch from "@/page-sections/products";
import { Suspense } from "react";

// ============================================================

interface PageProps {
  params: { slug: string };
}
export default function ShopDetails({ params }: PageProps) {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <Container
        sx={{
          mt: 4,
          mb: 6,
        }}
      >
        <ProductsSearch params={params} type="shop" />
      </Container>
    </Suspense>
  );
}
