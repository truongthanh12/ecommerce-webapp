import NextImage from "next/legacy/image";
import { styled, bgcolor, compose, spacing, borderRadius } from "@mui/system";
import React from "react";
import { StaticImageData } from "next/image";

type TypeLazyImage = {
  borderRadius?: string;
  width?: any;
  height?: number;
  alt?: string;
  src?: string | StaticImageData;
  layout?: "fixed" | "fill" | "intrinsic" | "responsive" | undefined;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down" | undefined;
  mx?: string;
  loading?: "eager" | "lazy" | undefined;
  style?: any;
  sizes?: string;
};

const LazyImage: React.FC<Partial<TypeLazyImage>> = styled(
  ({ borderRadius, ...rest }: TypeLazyImage) => (
    <NextImage src={""} alt={""} {...rest} />
  )
)(compose(spacing, borderRadius, bgcolor));

export default React.memo(LazyImage);
