import React, { ReactElement, cloneElement, useEffect, useState } from "react";
import clsx from "clsx";
import { Box, Drawer, styled } from "@mui/material";
import Scrollbar from "@/components/Scrollbar";

// styled component
const Wrapper = styled(Box)({
  "& .handle": {
    cursor: "pointer",
  },
});

// ================================================================
interface TypeProps {
  position?: "top" | "right" | "bottom" | "left" | undefined;
  open?: boolean;
  width?: number;
  handle: ReactElement;
  children: React.ReactNode;
}
const Sidenav = ({
  position = "left",
  open = false,
  width = 280,
  handle,
  children,
}: TypeProps) => {
  const [sidenavOpen, setSidenavOpen] = useState(open);
  const handleToggleSidenav = () => setSidenavOpen(!sidenavOpen);
  useEffect(() => setSidenavOpen(open), [open]);

  return (
    <Wrapper>
      <Drawer
        anchor={position}
        open={sidenavOpen}
        onClose={handleToggleSidenav}
        SlideProps={{
          style: {
            width,
          },
        }}
        sx={{
          zIndex: 15001,
        }}
      >
        <Scrollbar>
          <>{children}</>
        </Scrollbar>
      </Drawer>

      {handle &&
        cloneElement(handle, {
          onClick: handleToggleSidenav,
          className: clsx(handle.props?.className, "handle"),
        })}
    </Wrapper>
  );
};

export default React.memo(Sidenav);
