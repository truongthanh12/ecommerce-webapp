"use client"
import Link from "next/link";
import { ArrowRight } from "@mui/icons-material";
import { H2 } from "./Typography";
import { FlexBetween, FlexBox } from "./flex-box";
import React from "react";

// ===================================================
interface TypeProps {
  title: string;
  seeMoreLink: string;
  icon: React.JSX.Element;
}
const CategorySectionHeader = ({ title, seeMoreLink, icon }: TypeProps) => {
  return (
    <FlexBetween mb={3}>
      <FlexBox alignItems="center" gap={1}>
        {icon && <FlexBox alignItems="center">{icon}</FlexBox>}
        <H2 fontWeight="bold" lineHeight="1">
          {title}
        </H2>
      </FlexBox>

      {seeMoreLink && (
        <Link href={seeMoreLink}>
          <FlexBox alignItems="center" color="grey.600">
            View all
            <ArrowRight fontSize="small" color="inherit" />
          </FlexBox>
        </Link>
      )}
    </FlexBetween>
  );
};
export default React.memo(CategorySectionHeader);