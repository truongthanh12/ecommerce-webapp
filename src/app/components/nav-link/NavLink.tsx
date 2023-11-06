import { styled } from "@mui/material";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const StyledLink = styled(Link)<{ active_route?: string }>(
  ({ theme, active_route }) => ({
    position: "relative",
    transition: "color 150ms ease-in-out",
    color: active_route === "active" ? theme.palette.primary.main : "inherit",
    "&:hover": {
      color: `${theme.palette.primary.main} !important`,
    },
  })
);

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
};

const NavLink: React.FC<NavLinkProps> = ({
  href,
  children,
  style,
  className,
}) => {
  const pathname = usePathname();
  const currentRoute = useMemo(() => {
    if (href === "/en/") {
      return pathname === "/en";
    }

    const newPath = href.replace("/vi", "");
    return pathname === newPath;
  }, [pathname, href]);

  return (
    <StyledLink
      href={href}
      style={style}
      className={clsx(className)}
      active_route={currentRoute ? "active" : undefined}
    >
      {children}
    </StyledLink>
  );
};

export default NavLink;
