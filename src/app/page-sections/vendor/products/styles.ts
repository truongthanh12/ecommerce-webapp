import { styled } from "@mui/material";
import * as yup from "yup";

export const ErrorMessage = styled("span")(() => ({
  display: "flex",
  justifyContent: "center",
  color: "red",
  marginBottom: "6px",
  width: "100%",
}));
export const schema = yup.object().shape({
  title: yup.string().max(255).required("Title is required"),
  stock: yup.number().max(1000).required("Stock is required"),
  categories: yup.string().required("categories is required"),
  colors: yup.array().required("Color is required"),
  price: yup.number().required("Price is required"),
  type: yup.string().required("Type is required"),
  indexOfImages: yup.number().required("Orders of image list is required"),
});
