import useCustomRouter from "@/hooks/usePushRouter";
import { MenuItem, TextField } from "@mui/material";
import isEmpty from "lodash/isEmpty";
import React, { useCallback, useMemo } from "react";

type PageProps = {
  data: any;
  isSelect: boolean;
  name: string;
  value: string | number | any[];
  isMultiple: boolean;
  onChange: any;
  label: string;
  error: any;
  type: "text" | "number";
  autoFocus: boolean;
  multiline: boolean;
  rows: number;
  disabled: boolean;
};

const FieldItem = ({
  data,
  isSelect,
  name,
  value,
  isMultiple = false,
  onChange,
  label,
  error,
  type = "text",
  autoFocus = false,
  multiline = false,
  rows = 3,
  disabled,
}: Partial<PageProps>) => {
  const { pushRouter } = useCustomRouter();

  const renderInfo = useMemo(() => {
    const map: any = {
      categories: {
        link: "/admin/categories",
      },
      brands: {
        link: "/admin/brands",
      },
      sizes: {
        link: "/admin/sizes",
      },
      colors: {
        link: "/admin/colors",
      },
      types: {
        link: "/admin/types",
      },
    };

    return map[data || "categories"];
  }, [data]);

  const handleAddNowClick = useCallback(() => {
    if (renderInfo) {
      pushRouter(renderInfo?.link);
      return;
    }
  }, [renderInfo]);

  return (
    <TextField
      select={isSelect}
      type={type}
      fullWidth
      color="info"
      value={value}
      placeholder={name}
      onChange={onChange}
      label={label}
      SelectProps={{
        multiple: isMultiple || false,
      }}
      helperText={!!error ? error.message : ""}
      error={!!error?.message}
      autoFocus={autoFocus}
      multiline={multiline}
      rows={rows}
      disabled={disabled}
    >
      {isSelect ? (
        !isEmpty(data) ? (
          data?.map((item: any) => (
            <MenuItem key={item?.id || item} value={item?.name || item}>
              {item?.name || item || ""}
            </MenuItem>
          ))
        ) : (
          <MenuItem onClick={handleAddNowClick}>
            {renderInfo ? "Add now" : "Add image list now"}
          </MenuItem>
        )
      ) : (
        ""
      )}
    </TextField>
  );
};

export default React.memo(FieldItem);
