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
import MoreProducts from "@/page-sections/more-products";
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
import { fetchUsers } from "@/redux/features/authSlice";
import { fetchBrands } from "@/redux/features/brandSlice";

export default function Home() {
  const dispatch: any = useAppDispatch();
  const { categories } = useSelector((state: any) => state.categories);
  const mainCarouselData = useSelector((state: any) => state.banners.banners);
  const { products } = useSelector((state: any) => state.products);
  const { brands } = useSelector((state: any) => state.brands);

  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
      dispatch(fetchCategories(true));
      dispatch(fetchBanners(true));
      dispatch(fetchBrands(true));
      dispatch(fetchProducts(true));
      dispatch(fetchParentCategories());
      dispatch(fetchUsers({ isVendor: true }));
    }
    return () => {
      isCancelled = true;
    };
  }, [dispatch]);

  return (
    <>
      <SEO title="Taphoa Homepage" />
      <HeroBanner carouselData={mainCarouselData} />
      <FlashDeal products={products} />
      <TopCategories categories={categories} />
      <BannerAds />
      <Discount products={products} />
      <Featured products={products} brands={brands} />
      <NewArrival products={products} />
      <MoreProducts products={products} />
      <Services serviceList={serviceList} />
    </>
  );
}
