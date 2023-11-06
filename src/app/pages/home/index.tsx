"use client";
import SEO from "@/components/SEO";
import { serviceList } from "@/data/data";
import FlashDeal from "@/page-sections/flash-deal";
import HeroBanner from "@/page-sections/hero-banner";
import TopCategories from "@/page-sections/top-categories";
import Featured from "@/page-sections/featured";
import NewArrival from "@/page-sections/new-arrival";
import Discount from "@/page-sections/discount";
import BannerAds from "@/page-sections/banner";
import Services from "@/page-sections/services";
import { useEffect } from "react";
import {
  fetchCategories,
  fetchParentCategories,
} from "@/redux/features/categorySlice";
import { useAppDispatch } from "@/redux/hooks";
import { useSelector } from "react-redux";
import { fetchBanners } from "@/redux/features/bannerSlice";
import { fetchProducts } from "@/redux/features/productSlice";
import { fetchUsers, getWishlistByUserId } from "@/redux/features/authSlice";
import { fetchBrands } from "@/redux/features/brandSlice";
import { RootState } from "@/redux/store";
import { Ilang } from "@/app/models/Lang";

export default function HomePage({
  dictionary,
  lang,
}: {
  dictionary: Ilang;
  lang: "en" | "vi";
}) {
  const dispatch: any = useAppDispatch();
  const { categories } = useSelector((state: RootState) => state.categories);
  const mainCarouselData = useSelector(
    (state: RootState) => state.banners.banners
  );
  const { products } = useSelector((state: RootState) => state.products);
  const { brands } = useSelector((state: RootState) => state.brands);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
      dispatch(fetchCategories(true));
      dispatch(fetchBanners(true));
      dispatch(fetchBrands(true));
      dispatch(fetchProducts({ isFetchByUser: true }));
      dispatch(fetchParentCategories());
      dispatch(fetchUsers({ isVendor: true }));
    }
    return () => {
      isCancelled = true;
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(getWishlistByUserId(user.docId));
  }, [dispatch, user.docId]);

  return (
    <>
      <SEO title="Taphoa Homepage" />
      <HeroBanner carouselData={mainCarouselData} />
      <FlashDeal dictionary={dictionary} products={products} />
      <TopCategories dictionary={dictionary} categories={categories} />
      <BannerAds />
      <Discount dictionary={dictionary} products={products} />
      <Featured dictionary={dictionary} products={products} brands={brands} />
      <NewArrival dictionary={dictionary} products={products} />
      <Services dictionary={dictionary} serviceList={serviceList[lang]} />
    </>
  );
}
