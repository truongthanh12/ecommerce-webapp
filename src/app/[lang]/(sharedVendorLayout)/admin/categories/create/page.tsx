"use client";
import { Box } from "@mui/material";
import { H3 } from "@/components/Typography";
import CategoryForm from "@/page-sections/admin/categories/Form";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchParentCategories } from "@/redux/features/categorySlice";

// =============================================================================
export default function CreateCategories() {
  const dispatch: any = useDispatch();
  useEffect(() => {
    dispatch(fetchParentCategories());
  }, [dispatch]);

  return (
    <Box py={4}>
      <H3 mb={2}>Create New Category</H3>

      <CategoryForm />
    </Box>
  );
}
