import { styled } from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import { FlexBox } from "@/components/flex-box";
import React from "react";

// styled components
interface StyleProps {
  children: React.ReactNode;
  open?: boolean;
}
const StyledFlexBox = styled(({ children, open, ...rest }: StyleProps) => (
  <FlexBox {...rest}>{children}</FlexBox>
))(({ open, theme }) => ({
  alignItems: "center",
  justifyContent: "space-between",
  ".caretIcon": {
    transition: "transform 250ms ease-in-out",
    ...(theme.direction === "rtl"
      ? {
          transform: open ? "rotate(90deg)" : "rotate(180deg)",
        }
      : {
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
        }),
  },
}));

// =================================================================
interface Props {
  sx?: any;
  open?: boolean;
  children: React.ReactNode;
  showIcon?: boolean;
  px?: number;
  py?: number;
  color?: string;
}
const AccordionHeader = ({
  sx,
  open,
  children,
  showIcon = true,
  ...others
}: Props) => {
  return (
    <StyledFlexBox open={open} sx={sx} {...others}>
      {children}
      {showIcon && <ChevronRight className="caretIcon" fontSize="small" />}
    </StyledFlexBox>
  );
};

export default React.memo(AccordionHeader);
