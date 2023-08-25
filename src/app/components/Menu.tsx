import { Menu } from "@mui/material";
import React, { Children, cloneElement, Fragment, useState } from "react";

// ===============================================================

// ===============================================================
type TypeMenu = {
  open?: boolean;
  handler: React.ReactElement;
  children: React.ReactNode;
  direction?: "left" | "right";
  shouldCloseOnItemClick?: boolean;
  sx?: any;
};
const MenuList: React.FC<TypeMenu> = ({
  open,
  handler,
  children,
  direction = "left",
  shouldCloseOnItemClick = true,
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleMenuItemClick = (customOnClick: () => void) => () => {
    if (customOnClick) customOnClick();
    if (shouldCloseOnItemClick) handleClose();
  };

  return (
    <Fragment>
      {handler &&
        cloneElement(handler, {
          onClick: handler.props.onClick || handleClick,
        })}
      <Menu
        anchorEl={anchorEl}
        onClose={handleClose}
        open={open !== undefined ? open : !!anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: direction || "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: direction || "left",
        }}
        {...props}
      >
        {Children.map(children, (child) =>
          cloneElement(child as React.ReactElement, {
            onClick: handleMenuItemClick(
              (child as React.ReactElement).props.onClick
            ),
          })
        )}
      </Menu>
    </Fragment>
  );
};
export default React.memo(MenuList);
