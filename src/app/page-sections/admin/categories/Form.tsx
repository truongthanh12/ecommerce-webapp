import React, { Suspense, useEffect, useState } from "react";
import {
  Button,
  Card,
  Grid,
  MenuItem,
  Select,
  TextField,
  styled,
} from "@mui/material";
import DropZone from "@/components/DropZone";
import { FlexBox } from "@/components/flex-box";
import Image from "@/components/Image";
import { UploadImageBox, StyledClear } from "../styles";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "@/redux/features/messageSlice";
import { getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storageRef } from "@/firebase";
import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/navigation";
import {
  addCategoryAsync,
  categoryDataForm,
  updateCategoryAsync,
} from "@/redux/features/categorySlice";
import { CategoryIcon } from "@/common";
import Car from "@/app/components/icons/Car";

// ================================================================

export const ErrorMessage = styled("span")(() => ({
  display: "flex",
  justifyContent: "center",
  color: "red",
  marginBottom: "6px",
  width: "100%",
}));
const schema = yup.object().shape({
  Name: yup.string().required(),
  Type: yup.string().required(),
  Parent: yup.string().required(),
});

const CategoryForm = ({
  id = "",
  category,
}: {
  id?: string;
  category?: any;
}) => {
  const [files, setFiles] = useState<any>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [valueSeclect, setValueSelected] = useState("");
  const dispatch: any = useDispatch();
  const { error } = useSelector((state: any) => state.categories);
  const { status } = useSelector((state: any) => state.statusAdmin);
  const { parentCategories } = useSelector((state: any) => state.categories);
  const router = useRouter();

  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, isValid },
  } = useForm<any>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (category) {
      reset({
        Name: category.name,
        Type: category.type,
        Icon: category.icon,
        Parent: !isEmpty(category.parent)
          ? category.parent
          : "Choose category's parent",
      });
      setValueSelected(category.parent);
    }
  }, [reset, category]);

  // HANDLE UPDATE NEW IMAGE VIA DROP ZONE
  const handleChangeDropZone = (files: any) => {
    files.forEach((file: any) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFiles(files);
  };

  // HANDLE DELETE UPLOAD IMAGE
  const handleFileDelete = (file: any) => () => {
    setFiles((files: any) =>
      files.filter((item: any) => item.name !== file.name)
    );
  };

  const handleCategoryForm = async (value: {
    Name: string;
    Type: string;
    Icon: string;
    Parent: string;
  }) => {
    const { Name, Type, Icon, Parent } = value;
    if (files[0]?.name) {
      const uploadTask = uploadBytesResumable(
        storageRef(`categories/${files[0]?.name}`),
        files[0]
      );

      uploadTask.on(
        "state_changed",
        () => {
          dispatch(
            setMessage({
              message: "Waiting for loading....",
              type: "success",
            })
          );
        },
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url: string) => {
            const data = {
              name: Name || category?.name,
              type: Type || category?.type,
              image: url || category?.image,
              icon: Icon || category?.icon,
              parent: Parent || category?.parent,
            };
            if (status === "create") {
              dispatch(addCategoryAsync(categoryDataForm(data)));
            }
            if (status === "edit") {
              dispatch(
                updateCategoryAsync({
                  updatedCategory: categoryDataForm(data),
                  id,
                })
              );
            }
            if (error) {
              setErrorMessage("An error occurred! Please try again.");
              dispatch(
                setMessage({
                  message: "An error occurred! Please try again.",
                  type: "error",
                })
              );
              return;
            }
            reset();
            handleFileDelete(files);
            router.push("/admin/categories");
            dispatch(
              setMessage({
                message:
                  status === "create"
                    ? "Add new category successfully!."
                    : "Update category successfully!.",
                type: "success",
              })
            );
          });
        }
      );
      return;
    }
    const data = {
      name: Name || category?.name,
      type: Type || category?.type,
      icon: Icon || category?.icon || "",
      parent: Parent || category?.parent,
    };
    if (status === "create") {
      dispatch(addCategoryAsync(categoryDataForm(data)));
    }
    if (status === "edit") {
      dispatch(
        updateCategoryAsync({ updatedCategory: categoryDataForm(data), id })
      );
    }
    if (error) {
      setErrorMessage("An error occurred! Please try again.");
      dispatch(
        setMessage({
          message: "An error occurred! Please try again.",
          type: "error",
        })
      );
      return;
    }
    reset();
    handleFileDelete(files);
    router.push("/admin/categories");
    dispatch(
      setMessage({
        message:
          status === "create"
            ? "Add new category successfully!."
            : "Update category successfully!.",
        type: "success",
      })
    );
  };

  return (
    <Card
      sx={{
        p: 6,
      }}
    >
      <Suspense fallback="Loading...">
        <form onSubmit={handleSubmit(handleCategoryForm)}>
          <Grid container spacing={3}>
            <Grid item sm={6} xs={12}>
              <Controller
                name="Name"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    fullWidth
                    type="name"
                    variant="outlined"
                    label="name"
                    placeholder="Categories...."
                    onChange={onChange}
                    helperText={!!error ? error.message : ""}
                    error={!!error?.message}
                    value={value || ""}
                    autoFocus={status === "create"}
                  />
                )}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <Controller
                name="Parent"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    fullWidth
                    size="small"
                    onChange={onChange}
                    value={value || ""}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    style={{ display: "flex" }}
                  >
                    <MenuItem value="">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <>
                          <Car fontSize="small" />
                        </>
                        <em style={{ marginLeft: 12 }}>Choose category</em>
                      </div>
                    </MenuItem>
                    {parentCategories.map(
                      (
                        item: { title: string; icon: string },
                        index: number
                      ) => {
                        return (
                          <MenuItem key={index} value={item.title}>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              {item.icon && <>{CategoryIcon[item.icon]}</>}
                              <span style={{ marginLeft: 12 }}>
                                {item.title}
                              </span>
                            </div>
                          </MenuItem>
                        );
                      }
                    )}
                  </Select>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="Type"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Type"
                    placeholder="type..."
                    onChange={onChange}
                    helperText={!!error ? error.message : ""}
                    error={!!error?.message}
                    value={value || ""}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="Icon"
                control={control}
                render={({
                  field: { onChange, value },
                }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Icon..."
                    placeholder="Icon..."
                    onChange={onChange}
                    value={value || ""}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <DropZone
                title="Drop & drag category image"
                onChange={handleChangeDropZone}
                imageSize=""
              />

              <FlexBox flexDirection="row" mt={2} flexWrap="wrap" gap={1}>
                {files.map((file: any, index: number) => {
                  return (
                    <UploadImageBox size="medium" key={index}>
                      <Image alt="Image uploaded" src={file.preview} width="100%" />
                      <StyledClear onClick={handleFileDelete(file)} />
                    </UploadImageBox>
                  );
                })}
                {isEmpty(files) && category?.image && (
                  <UploadImageBox size="medium">
                    <Image alt="Image uploaded" src={category?.image} width="100%" />
                  </UploadImageBox>
                )}
              </FlexBox>
            </Grid>

            {isDirty && isValid && errorMessage && (
              <ErrorMessage>{errorMessage}</ErrorMessage>
            )}

            <Grid item xs={12}>
              <Button
                disabled={
                  (status === "create" && (!isDirty || !isValid)) ||
                  (status === "edit" &&
                    isEmpty(files) &&
                    (!isDirty || !isValid) &&
                    !valueSeclect)
                }
                variant="contained"
                color="info"
                type="submit"
              >
                Save category
              </Button>
            </Grid>
          </Grid>
        </form>
      </Suspense>
    </Card>
  );
};

export default React.memo(CategoryForm);
