"use client";
import { styled } from "@mui/material";
import clsx from "clsx";
import { usePathname } from "next/navigation";
// styled component
const StyledLink = styled("a")(({ theme, active_route }: TypeNavLink) => ({
  position: "relative",
  transition: "color 150ms ease-in-out",
  color: active_route === "active" ? theme.palette.primary.main : "inherit",
  "&:hover": {
    color: `${theme.palette.primary.main} !important`,
  },
}));
type TypeNavLink = {
  href: string;
  children: React.ReactNode;
  style?: any;
  className?: string;
  active_route?: string | "active";
  theme?: any;
};
const NavLink: React.FC<TypeNavLink> = ({
  href,
  children,
  style,
  className,
  ...props
}) => {
  const pathname = usePathname();

  const checkRouteMatch = () => {
    if (href === "/") return pathname === href;
    return pathname.includes(href);
  };
  // active route
  const currentRoute = checkRouteMatch();

  return (
    <StyledLink
      href={href}
      style={style}
      className={clsx(className)}
      active_route={currentRoute ? "active" : ""}
      {...props}
    >
      {children}
    </StyledLink>
  );
};
export default NavLink;
