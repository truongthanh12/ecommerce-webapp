import { Box, styled } from "@mui/material";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import CategoryMenuCard from "./CategoryMenuCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchNaviagtions } from "@/redux/features/navigationSlice";
// Define the styled component type
type TypeProps = {
  children: ReactNode;
  open?: boolean;
};

// styled component
const Wrapper = styled(Box)(({ open }: TypeProps) => ({
  cursor: "pointer",
  position: "relative",
  "& .dropdown-icon": {
    transition: "all 250ms ease-in-out",
    transform: `rotate(${open ? "90deg" : "0deg"})`,
  },
}));

// ===========================================================

const CategoryMenu: React.FC<TypeProps> = ({
  open: isOpen = false,
  children,
}) => {
  const [open, setOpen] = useState<boolean>(isOpen);
  const popoverRef = useRef<boolean>(open);
  popoverRef.current = open;

  const { navigations } = useSelector((state: any) => state.navigations);
  const dispatch: any = useDispatch();

  const toggleMenu = (e: MouseEvent) => {
    e.stopPropagation();
    if (!isOpen) setOpen((open) => !open);
  };

  const handleDocumentClick = useCallback(() => {
    if (popoverRef.current && !isOpen) setOpen(false);
  }, [isOpen]);

  useEffect(() => {
    dispatch(fetchNaviagtions());
  }, []);

  useEffect(() => {
    if (!window) return;
    window.addEventListener("click", handleDocumentClick);
    return () => window.removeEventListener("click", handleDocumentClick);
  }, [handleDocumentClick]);

  return (
    <Wrapper open={open}>
      {React.cloneElement(children as React.ReactElement, {
        open,
        onClick: toggleMenu,
        className: `${(children as React.ReactElement).props.className}`,
      })}

      <CategoryMenuCard navigations={navigations} open={open} />
    </Wrapper>
  );
};
export default React.memo(CategoryMenu);
