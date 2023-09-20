import { Box, TextField } from "@mui/material";
import { Small } from "./Typography";
import { FC, memo } from "react";
type TypeTextField = {
  label: string;
  InputProps: any;
  mb: number;
  mr: number;
  fullWidth: boolean;
  name: string;
  size: string;
  type: string;
  variant: string;
  value: any;
  onChange: any;
  onBlur: any;
  placeholder: string;
  autoComplete: string;
  autoFocus: boolean;
  ref: any;
  helperText: string;
  error: boolean;
};


const TextFieldInput: FC<Partial<TypeTextField>> = ({ label, InputProps, ...props }) => {
  const boxProps: { [key: string]: any } = {};
  const textFieldProps: { [key: string]: any } = {};
  for (const key in props) {
    if (spacePropList.includes(key)) {
      boxProps[key] = props[key as keyof typeof props];
    } else {
      textFieldProps[key] = props[key as keyof typeof props];
    }
  }

  return (
    <Box {...boxProps}>
      {label && (
        <Small
          display="block"
          mb={1}
          textAlign="left"
          fontWeight="600"
          color="grey.700"
        >
          {label}
        </Small>
      )}

      <TextField
        InputProps={{
          ...InputProps,
          style: {
            ...InputProps?.style,
            height: 44,
          },
        }}
        {...textFieldProps}
      />
    </Box>
  );
};
const spacePropList = [
  "m",
  "mt",
  "mr",
  "mb",
  "ml",
  "mx",
  "my",
  "p",
  "pt",
  "pr",
  "pb",
  "pl",
  "px",
  "py",
  "margin",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "marginX",
  "marginY",
  "padding",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "paddingX",
  "paddingY",
];
export default memo(TextFieldInput);
