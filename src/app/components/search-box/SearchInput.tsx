import Link from "next/link";
import { ChangeEvent, useEffect, useRef, useState, useTransition } from "react";
import { Box, Button, MenuItem, TextField } from "@mui/material";
import { SearchOutlinedIcon, SearchResultCard } from "./styled";
import { useParams } from "next/navigation";

const SearchInput = () => {
  const params = useParams();
  const parentRef = useRef<HTMLInputElement>();
  const [_, startTransition] = useTransition();
  const [resultList, setResultList] = useState<string[]>([]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      const value = e.target?.value;
      if (!value) setResultList([]);
    });
  };

  const handleDocumentClick = () => setResultList([]);
  useEffect(() => {
    if (!window) return;
    window.addEventListener("click", handleDocumentClick);
    return () => window.removeEventListener("click", handleDocumentClick);
  }, []);

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
          endAdornment: (
            <Button
              color="primary"
              disableElevation
              variant="contained"
              sx={{
                px: "3rem",
                height: "100%",
                borderRadius: "0 300px 300px 0",
              }}
            >
              Search
            </Button>
          ),
          startAdornment: <SearchOutlinedIcon fontSize="small" />,
        }}
      />

      {resultList.length > 0 && (
        <SearchResultCard elevation={2}>
          {resultList.map((item) => (
            <Link
              href={`/${params.lang}/product/search/${item}`}
              key={item}
              passHref
            >
              <MenuItem key={item}>{item}</MenuItem>
            </Link>
          ))}
        </SearchResultCard>
      )}
    </Box>
  );
};
export default SearchInput;
