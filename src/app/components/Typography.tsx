"use client";
import { Box, styled } from "@mui/material";
import clsx from "clsx";
import React from "react";
type TypePropsTypo = {
  children: React.ReactNode;
  className: string;
  ellipsis: any;
  textTransform: string;
  textAlign: "left" | "right" | "center";
  mt: number | string;
  mb: number;
  ml: number;
  mr: number;
  pt: number;
  pb: number;
  pl: number | string;
  py: number;
  px: number;
  fontSize: number | string;
  borderBottom: string;
  borderColor: string;
  display: string;
  fontWeight: string | number;
  color: string;
  lineHeight: number | string;
  flex: string;
  textTransformStyle: string;
  whiteSpace: any;
  overflow: any;
  textOverflow: any;
  maxWidth: string;
  mx: string | number;
  my: number;
  p: number;
  title: string;
  sx: any
};

type TypeProp = {
  textTransformStyle?: any;
  whiteSpace?: any;
  overflow?: any;
  textOverflow?: any;
  ellipsis?: any;
};
const StyledBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "textTransformStyle",
})<TypeProp>(({ textTransformStyle, ellipsis }) => ({
  textTransform: textTransformStyle || "none",
  whiteSpace: ellipsis ? "nowrap" : "normal",
  overflow: ellipsis ? "hidden" : "visible",
  textOverflow: ellipsis ? "ellipsis" : "clip",
}));

// ============================================

export const H1: React.FC<Partial<TypePropsTypo>> = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}) => {
  return (
    <StyledBox
      textTransformStyle={textTransform}
      ellipsis={ellipsis ? 1 : undefined}
      className={clsx({
        [className || ""]: true,
      })}
      component="h1"
      mb={0}
      mt={0}
      fontSize="30px"
      fontWeight="700"
      lineHeight="1.5"
      {...props}
    >
      {children}
    </StyledBox>
  );
};

export const H2: React.FC<Partial<TypePropsTypo>> = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}) => {
  return (
    <StyledBox
      textTransformStyle={textTransform}
      ellipsis={ellipsis ? 1 : undefined}
      className={clsx({
        [className || ""]: true,
      })}
      component="h2"
      mb={0}
      mt={0}
      fontSize="25px"
      fontWeight="700"
      lineHeight="1.5"
      {...props}
    >
      {children}
    </StyledBox>
  );
};
export const H3: React.FC<Partial<TypePropsTypo>> = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}) => {
  return (
    <StyledBox
      mb={0}
      mt={0}
      component="h3"
      fontSize="20px"
      fontWeight="700"
      lineHeight="1.5"
      ellipsis={ellipsis ? 1 : undefined}
      textTransformStyle={textTransform}
      className={clsx({
        [className || ""]: true,
      })}
      {...props}
    >
      {children}
    </StyledBox>
  );
};
export const H4: React.FC<Partial<TypePropsTypo>> = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}) => {
  return (
    <StyledBox
      mb={0}
      mt={0}
      component="h4"
      fontSize="17px"
      fontWeight="600"
      lineHeight="1.5"
      ellipsis={ellipsis ? 1 : undefined}
      textTransformStyle={textTransform}
      className={clsx({
        [className || ""]: true,
      })}
      {...props}
    >
      {children}
    </StyledBox>
  );
};
export const H5: React.FC<Partial<TypePropsTypo>> = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}) => {
  return (
    <StyledBox
      textTransformStyle={textTransform}
      ellipsis={ellipsis ? 1 : undefined}
      className={clsx({
        [className || ""]: true,
      })}
      component="h5"
      mb={0}
      mt={0}
      fontSize="16px"
      fontWeight="600"
      lineHeight="1.5"
      {...props}
    >
      {children}
    </StyledBox>
  );
};
export const H6: React.FC<Partial<TypePropsTypo>> = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}) => {
  return (
    <StyledBox
      textTransformStyle={textTransform}
      ellipsis={ellipsis ? 1 : undefined}
      className={clsx({
        [className || ""]: true,
      })}
      component="h6"
      mb={0}
      mt={0}
      fontSize="14px"
      fontWeight="600"
      lineHeight="1.5"
      {...props}
    >
      {children}
    </StyledBox>
  );
};
export const Paragraph: React.FC<Partial<TypePropsTypo>> = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}) => {
  return (
    <StyledBox
      textTransformStyle={textTransform}
      ellipsis={ellipsis ? 1 : undefined}
      className={clsx({
        [className || ""]: true,
      })}
      component="p"
      mb={0}
      mt={0}
      fontSize="14px"
      {...props}
    >
      {children}
    </StyledBox>
  );
};
export const Small: React.FC<Partial<TypePropsTypo>> = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}) => {
  return (
    <StyledBox
      textTransformStyle={textTransform}
      ellipsis={ellipsis ? 1 : undefined}
      className={clsx({
        [className || ""]: true,
      })}
      component="small"
      fontSize="12px"
      lineHeight="1.5"
      {...props}
    >
      {children}
    </StyledBox>
  );
};
export const Span: React.FC<Partial<TypePropsTypo>> = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}) => {
  return (
    <StyledBox
      textTransformStyle={textTransform}
      ellipsis={ellipsis ? 1 : undefined}
      className={clsx({
        [className || ""]: true,
      })}
      component="span"
      lineHeight="1.5"
      {...props}
    >
      {children}
    </StyledBox>
  );
};
export const Tiny: React.FC<Partial<TypePropsTypo>> = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}) => {
  return (
    <StyledBox
      textTransformStyle={textTransform}
      ellipsis={ellipsis ? 1 : undefined}
      className={clsx({
        [className || ""]: true,
      })}
      component="small"
      fontSize="10px"
      lineHeight="1.5"
      {...props}
    >
      {children}
    </StyledBox>
  );
};
