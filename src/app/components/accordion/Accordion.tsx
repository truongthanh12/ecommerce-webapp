import { styled } from "@mui/material";
import React, {
  Children,
  cloneElement,
  useEffect,
  useRef,
  useState,
} from "react";
interface WrapperProps {
  open: boolean;
  parentHeight: number;
  headerHeight: number;
}
// styled component
const Wrapper = styled("div")(({ open, parentHeight, headerHeight }:WrapperProps) => ({
  cursor: "pointer",
  overflow: "hidden",
  transition: "height 250ms ease-in-out",
  height: open ? parentHeight : headerHeight,
}));

// ==============================================================
interface TypeProps {
  expanded: boolean;
  children: React.ReactNode;
}
const Accordion = ({ expanded = false, children }: TypeProps) => {
  const ref = useRef(null);
  const [open, setOpen] = useState(expanded);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [parentHeight, setParentHeight] = useState(0);
  const toggle = () => setOpen(!open);

  useEffect(() => {
    let parent: any = ref.current;
    if (parent) {
      setHeaderHeight(parent.children[0].scrollHeight);
      setParentHeight(parent.scrollHeight);
    }
  }, []);
  const modifiedChildren = Children.map(children, (child, ind) => {
    if (ind === 0)
      return cloneElement(child as React.ReactElement, {
        open,
        onClick: toggle,
      });
    else return child;
  });
  return (
    <Wrapper
      ref={ref}
      open={open}
      headerHeight={headerHeight}
      parentHeight={parentHeight}
    >
      {modifiedChildren}
    </Wrapper>
  );
};
export default React.memo(Accordion);
