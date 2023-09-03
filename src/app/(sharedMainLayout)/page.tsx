"use client";
import SEO from "@/components/SEO";
import { brands, serviceList } from "@/data/data";
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
import { fetchCategories } from "@/redux/features/categorySlice";
import { useAppDispatch } from "@/redux/hooks";
import { useSelector } from "react-redux";
import { fetchBanners } from "@/redux/features/bannerSlice";
import { fetchProducts } from "@/redux/features/productSlice";

export default function Home() {
  const dispatch: any = useAppDispatch();
  const { categories } = useSelector((state: any) => state.categories);
  const mainCarouselData = useSelector((state: any) => state.banners.banners);
  const { products } = useSelector((state: any) => state.products);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBanners());
    dispatch(fetchProducts());
  }, []);

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
