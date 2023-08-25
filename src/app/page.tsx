"use client";
import SEO from "./components/SEO";
import { mainCarouselData, products } from "./data/data";
import FlashDeal from "./page-sections/flash-deal";
import HeroBanner from "./page-sections/hero-banner";

export default function Home() {
  return (
    <>
      <SEO title="Taphoa Homepage" />
      <HeroBanner carouselData={mainCarouselData} />
      <FlashDeal products={products} />
    </>
  );
}
