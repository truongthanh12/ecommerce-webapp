import { Box, styled } from "@mui/material";
import CategoryMenuItem from "./CategoryMenuItem";
import { ReactNode, memo } from "react";
import MegaMenu from "./MegaMenu";

// styled component
type TypeProps = {
  theme?: any;
  position?: "absolute" | "relative" | "fixed";
  open: boolean;
  children?: ReactNode;
  navigations?: any;
  categories?: any;
};
const Wrapper = styled(Box)(({ theme, position, open }: TypeProps) => ({
  left: 0,
  zIndex: 98,
  right: "auto",
  borderRadius: 4,
  padding: "0.5rem 0px",
  transformOrigin: "top",
  boxShadow: theme.shadows[2],
  position: (position = "absolute"),
  transition: "all 250ms ease-in-out",
  transform: open ? "scaleY(1)" : "scaleY(0)",
  backgroundColor: theme.palette.background.paper,
  top: position === "absolute" ? "calc(100% + 0.7rem)" : "0.5rem",
}));

// ==============================================================

const CategoryMenuCard: React.FC<TypeProps> = ({
  open,
  position,
  navigations,
  categories,
}) => {
  return (
    <Wrapper open={open} position={position}>
      {(navigations || []).map(
        (item: { title: string; icon: string }, index: number) => {
          const filteredItems = categories.filter(
            (category: any) => category.parent === item.title
          );
          const isCaret = filteredItems.length > 0;

          return (
            <CategoryMenuItem
              caret={isCaret}
              key={item.title + index}
              icon={item.icon}
              href="/"
              title={item.title}
            >
              <MegaMenu data={filteredItems} parent={item.title} />
            </CategoryMenuItem>
          );
        }
      )}
    </Wrapper>
  );
};

export default memo(CategoryMenuCard);
