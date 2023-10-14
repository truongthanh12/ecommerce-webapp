"use client";
import Link from "next/link";
import { ArrowRight } from "@mui/icons-material";
import { H2 } from "./Typography";
import { FlexBetween, FlexBox } from "./flex-box";
import React from "react";
import { useParams } from "next/navigation";

// ===================================================
interface TypeProps {
  title: string;
  seeMoreLink: string;
  icon?: React.JSX.Element | string;
  length?: number;
}
const CategorySectionHeader = ({
  title,
  seeMoreLink,
  icon = "",
  length = 0,
}: TypeProps) => {
  const params = useParams();
  return (
    <FlexBetween mb={3}>
      <FlexBox alignItems="center" gap={1}>
        {icon && <FlexBox alignItems="center">{icon}</FlexBox>}
        <H2 fontWeight="bold" lineHeight="1">
          {title}
        </H2>
      </FlexBox>

      {seeMoreLink && (length || 0) > 4 ? (
        <Link href={"/" + params.lang + seeMoreLink}>
          <FlexBox alignItems="center" color="grey.600">
            View all
            <ArrowRight fontSize="small" color="inherit" />
          </FlexBox>
        </Link>
      ) : (
        ""
      )}
    </FlexBetween>
  );
};
export default React.memo(CategorySectionHeader);
