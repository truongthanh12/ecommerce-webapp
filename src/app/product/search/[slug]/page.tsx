"use client";
import React from "react";
import ProductsSearch from "@/page-sections/products";

interface PageProps {
  params: { slug: string };
}
export default function ProductSearchResult({ params }: PageProps) {
  return <ProductsSearch params={params} />;
}
