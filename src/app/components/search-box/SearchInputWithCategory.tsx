"use client";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import { Box, MenuItem, TextField, styled, useTheme } from "@mui/material";
import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import TouchRipple from "@mui/material/ButtonBase";
import MenuList from "@/components/Menu";
import { FlexBox } from "@/components/flex-box";
import { SearchOutlinedIcon } from "./styled";
import { useSelector } from "react-redux";
import { CategoryIcon } from "@/common";
import { usePathname, useRouter } from "next/navigation";
import debounce from "lodash/debounce";
import { objectToQueryString } from "@/app/utils/lib";

const DropDownHandler = styled(FlexBox)(
  ({ theme }: { component: any; theme?: any }) => ({
    whiteSpace: "pre",
    borderTopRightRadius: 300,
    borderBottomRightRadius: 300,
    borderLeft: `1px solid ${theme.palette.text.disabled}`,
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  })
);
const SearchInputWithCategory = () => {
  const parentRef = useRef<HTMLInputElement>();
  const { breakpoints } = useTheme();
  const [categoryTitle, setCategoryTitle] = useState("All Categories");
  const [query, setQuery] = useState("");
  const router = useRouter();

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const defaultQuerySearch = params.get("query");

  const { parentCategories } = useSelector((state: any) => state.categories);
  // HANDLE CHANGE THE CATEGORY
  type TypeCateProps = {
    title: string;
    icon?: string;
  };
  const handleCategoryChange = (cat: TypeCateProps) => () => {
    setCategoryTitle(cat.title);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target?.value;
    if (value.length > 40) {
      e.preventDefault(); // Prevent further input
      return;
    }

    setQuery(value);
    if (!value) {
      const searchParams: any = {};
      for (const [key, value] of params.entries()) {
        searchParams[key] = value;
      }
      let updatedQuery = { ...searchParams };
      delete updatedQuery.query;
      router.push(`/product/search/products?${objectToQueryString(updatedQuery)}`);
    }
  };

  const handleKeyPress = useCallback(
    debounce((e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
      e.preventDefault();
        const searchParams: any = {};
        for (const [key, value] of params.entries()) {
          searchParams[key] = value;
        }

        const updatedQuery = {
          ...searchParams,
          query: query,
        };

        // Serialize the updated query object into a query string
        router.push(`/product/search/products?${objectToQueryString(updatedQuery)}`);
      }
    }, 400),
    [query]
  );

  // CATEGORY MENU DROPDOWN
  const categoryDropdown = (
    <MenuList
      direction="left"
      sx={{
        zIndex: breakpoints.down("md") ? 99999 : 1502,
      }}
      handler={
        <DropDownHandler
          px={3}
          gap={0.5}
          height="100%"
          color="grey.700"
          bgcolor="grey.100"
          alignItems="center"
          component={TouchRipple}
        >
          {categoryTitle}
          <KeyboardArrowDownOutlined fontSize="small" color="inherit" />
        </DropDownHandler>
      }
    >
      {parentCategories.map((item: TypeCateProps) => (
        <MenuItem key={item.title} onClick={handleCategoryChange(item)}>
          {item.icon && <>{CategoryIcon[item.icon]}</>}
          <span style={{ marginLeft: 12 }}>{item.title}</span>
        </MenuItem>
      ))}
    </MenuList>
  );
  return (
    <Box
      position="relative"
      flex="1 1 0"
      maxWidth="670px"
      mx="auto"
      {...{
        ref: parentRef,
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Searching for..."
        onChange={handleSearch}
        onKeyDown={handleKeyPress}
        defaultValue={defaultQuerySearch}
        InputProps={{
          sx: {
            height: 44,
            paddingRight: 0,
            borderRadius: 300,
            color: "grey.700",
            overflow: "hidden",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.main",
            },
          },
          endAdornment: categoryDropdown,
          startAdornment: <SearchOutlinedIcon fontSize="small" />,
        }}
      />

      {/* {resultList.length > 0 && (
        <SearchResultCard elevation={2}>
          {resultList.map((item) => (
            <Link href={`/product/search/${item}`} key={item} passHref>
              <MenuItem key={item}>{item}</MenuItem>
            </Link>
          ))}
        </SearchResultCard>
      )} */}
    </Box>
  );
};

export default SearchInputWithCategory;
