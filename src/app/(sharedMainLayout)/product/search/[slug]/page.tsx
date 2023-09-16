"use client";
import React from "react";
import ProductsSearch from "@/page-sections/products";

interface PageProps {
  searchParams: { [key: string]: string | undefined };
}

export default function ProductSearchResult({ searchParams }: PageProps) {
  return <ProductsSearch searchParams={searchParams} />;
}
