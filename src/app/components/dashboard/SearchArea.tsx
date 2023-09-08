import { Add } from "@mui/icons-material";
import { Button, useMediaQuery } from "@mui/material";
import { FlexBox } from "@/components/flex-box";
import SearchInput from "@/components/SearchInput";
import React from "react";

// ===============================================================
type TypeProps = {
  searchPlaceholder: string;
  buttonText?: string;
  handleBtnClick?: any;
  handleSearch: any;
};
const SearchArea = ({
  searchPlaceholder = "Search Product...",
  buttonText,
  handleBtnClick,
  handleSearch,
}: TypeProps) => {
  const downSM = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));

  return (
    <FlexBox mb={2} gap={2} justifyContent="space-between" flexWrap="wrap">
      <SearchInput placeholder={searchPlaceholder} onChange={handleSearch} />
      {buttonText && (
        <Button
          color="info"
          fullWidth={downSM}
          variant="contained"
          startIcon={<Add />}
          onClick={handleBtnClick}
          sx={{
            minHeight: 44,
          }}
        >
          {buttonText}
        </Button>
      )}
    </FlexBox>
  );
};

export default React.memo(SearchArea);
