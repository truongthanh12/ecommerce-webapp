import { Box, styled } from "@mui/material";
import CategoryMenuItem from "./CategoryMenuItem";
import { ReactNode, memo } from "react";
import MegaMenu from "./MegaMenu";
import { INavigation } from "@/app/models/Navigation";

// styled component
type TypeProps = {
  theme?: any;
  position?: "absolute" | "relative" | "fixed";
  open: boolean;
  children?: ReactNode;
  navigations?: INavigation[];
};
const Wrapper = styled(Box)(({ theme, position, open }: TypeProps) => ({
  left: 0,
  zIndex: 98,
  right: "auto",
  borderRadius: 4,
  padding: "0.5rem 0px",
  transformOrigin: "top",
  boxShadow: theme.shadows[2],
  position: position = 'absolute',
  transition: "all 250ms ease-in-out",
  transform: open ? "scaleY(1)" : "scaleY(0)",
  backgroundColor: theme.palette.background.paper,
  top: position === "absolute" ? "calc(100% + 0.7rem)" : "0.5rem",
}));

// ==============================================================

const CategoryMenuCard: React.FC<TypeProps> = ({ open, position, navigations }) => {
  return (
    <Wrapper open={open} position={position}>
      {(navigations || []).map((item) => {
        return (
          <CategoryMenuItem
            key={item.id}
            href={item.href}
            icon={item.icon}
            title={item.title}
            caret={item?.menuData}
          >
            <MegaMenu data={item?.menuData} />
          </CategoryMenuItem>
        );
      })}
    </Wrapper>
  );
};

export default memo(CategoryMenuCard);
