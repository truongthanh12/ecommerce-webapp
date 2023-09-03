"use client";
import Link from "next/link";
import {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { Box, MenuItem, TextField, styled, useTheme } from "@mui/material";
import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import TouchRipple from "@mui/material/ButtonBase";
import MenuList from "@/components/Menu";
import { FlexBox } from "@/components/flex-box";
import { SearchOutlinedIcon, SearchResultCard } from "./styled";
import { useSelector } from "react-redux";
import { ICategory } from "@/app/models/Category";

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
  const [_, startTransition] = useTransition();
  const [category, setCategory] = useState("*");
  const [resultList, setResultList] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState("All Categories");

  const { categories } = useSelector((state: any) => state.categories);
  // HANDLE CHANGE THE CATEGORY
  type TypeCateProps = {
    name: string;
    id: string;
  };
  const handleCategoryChange = (cat: TypeCateProps) => () => {
    setCategory(cat.id);
    setCategoryTitle(cat.name);
  };

  // FETCH PRODUCTS VIA API
  type TypeSearchTextProps = {
    searchText: string;
    category: string;
  };
  const getProducts = async ({ searchText, category }: TypeSearchTextProps) => {
    // const data = await api.searchProducts(searchText, category);
    setResultList([]);
  };
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      const value = e.target?.value;
      if (!value) setResultList([]);
      else if (value && category !== "*")
        getProducts({ searchText: value, category });
      else getProducts({ searchText: value, category: "" });
    });
  };
  const handleDocumentClick = () => setResultList([]);
  
  useEffect(() => {
    if (!window) return;
    window.addEventListener("click", handleDocumentClick);
    return () => window.removeEventListener("click", handleDocumentClick);
  }, []);

  const categoriesData = useMemo(() => {
    return categories.filter((item: ICategory) => item.type === "categories");
  }, [categories]);
  
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
      {categoriesData.map((item: ICategory) => (
        <MenuItem key={item.id} onClick={handleCategoryChange(item)}>
          {item.name}
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

      {resultList.length > 0 && (
        <SearchResultCard elevation={2}>
          {resultList.map((item) => (
            <Link href={`/product/search/${item}`} key={item} passHref>
              <MenuItem key={item}>{item}</MenuItem>
            </Link>
          ))}
        </SearchResultCard>
      )}
    </Box>
  );
};

export default SearchInputWithCategory;
