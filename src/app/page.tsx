"use client";
import SEO from "@/components/SEO";
import { brands, categories, mainCarouselData, products, serviceList } from "@/data/data";
import FlashDeal from "@/page-sections/flash-deal";
import HeroBanner from "@/page-sections/hero-banner";
import TopCategories from "@/page-sections/top-categories";
import Featured from "@/page-sections/featured";
import NewArrival from "@/page-sections/new-arrival";
import Discount from "@/page-sections/discount";
import BannerAds from "@/page-sections/banner";
import MoreProducts from "./page-sections/more-products";
import Services from "./page-sections/services";

export default function Home() {
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
