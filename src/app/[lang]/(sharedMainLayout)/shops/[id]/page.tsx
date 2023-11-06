"use client";
import ProductsSearch from "@/page-sections/products";
import Chats from "@/components/floating-button";
import { Suspense, useEffect, useState } from "react";
import { Container } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import db from "@/firebase";
import {} from "react";
import { fetchProducts } from "@/redux/features/productSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useSelector } from "react-redux";
import BackdropLoading from "@/components/backdrop"
import { RootState } from "@/redux/store";

// ============================================================

interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}
async function getShopById(id = "") {
  try {
    const categoryDocRef = doc(db, "users", id);
    const categoryDocSnapshot = await getDoc(categoryDocRef);

    if (categoryDocSnapshot.exists()) {
      const categoryData = categoryDocSnapshot.data();
      return categoryData;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}
export default function ShopDetails({ params, searchParams }: PageProps) {
  const [shop, setShop] = useState({});
  const dispatch: any = useAppDispatch();
  const { products } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    async function fetchData() {
      dispatch(fetchProducts({ userId: params.id }));

      const shop = await getShopById(params.id);
      setShop(shop || {});
    }

    fetchData();
  }, [params.id, dispatch]);

  return (
    <Suspense fallback={<BackdropLoading />}>
      <Container
        sx={{
          mt: 4,
          mb: 6,
        }}
      >
        <ProductsSearch
          searchParams={searchParams}
          shopData={shop}
          type="shop"
          productsByUser={products}
        />
        <Chats />
      </Container>
    </Suspense>
  );
}
