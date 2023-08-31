"use client";
import NextImage from "next/image";
import { styled, bgcolor, compose, spacing, borderRadius } from "@mui/system";
import React from "react";

type TypeLazyImage = {
  borderRadius?: string;
  width?: any;
  height?: number;
  alt?: string;
  src?: string;
  layout?: string;
  objectFit?: string;
  mx?: string;
  loading?: "eager" | "lazy" | undefined
  style?: any
};
const LazyImage: React.FC<Partial<TypeLazyImage>> = styled(
  ({ borderRadius, ...rest }: TypeLazyImage) => (
    <NextImage src={""} alt={""} {...rest} />
  )
)(compose(spacing, borderRadius, bgcolor));
export default React.memo(LazyImage);
