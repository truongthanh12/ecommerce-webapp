"use client"
import { Rating } from "@mui/material";
import { compose, spacing, styled, typography } from "@mui/system";
import React from "react";

const ProductRating = styled(Rating)(compose(spacing, typography));

export default React.memo(ProductRating);
