"use client";
import React, { Fragment, useEffect, useState } from "react";
import { Avatar, Badge, Box, Button, Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import * as yup from "yup";
import UploadButton from "./UploadButton";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/hooks";
import { setMessage } from "@/redux/features/messageSlice";
import { H4 } from "@/app/components/Typography";
import YoutubeFilled from "@/app/components/icons/YoutubeFilled";
import FacebookFilled from "@/app/components/icons/FacebookFilled";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase";
import { updateUserAsync, updateUserData } from "@/redux/features/authSlice";
import { currency } from "@/app/utils/lib";
import { RootState } from "@/redux/store";
// upload button

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const accountSchema = yup.object().shape({
  address: yup.string().required("Address is required"),
  phoneNumber: yup
    .string()
    .required("Phone is required")
    .length(10, "Phone must be exactly 10 characters")
    .matches(phoneRegExp, "Phone number is not valid"),
  displayName: yup.string().required("Name is required"),
  email: yup.string().email("Invalid Email").required("Email is required"),
  shipping: yup.string().required("Shipping fee is required"),
});
interface FormValues {
  displayName: string;
  phoneNumber: number;
  email: string;
  facebook: string;
  youtube: string;
  address: string;
  description: string;
  shipping: string;
}

const AccountSettingForm = () => {
  const { handleSubmit, control, reset } = useForm<any>({
    resolver: yupResolver(accountSchema),
    mode: "onSubmit",
  });
  const [avatarFile, setAvatarFile] = useState<any>();
  const [coverFile, setCoverFile] = useState<any>();

  const [avatarPreview, setPreviewAvatar] = useState("");
  const [coverPreview, setPreviewCover] = useState("");
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  const dispatch: any = useAppDispatch();
  useEffect(() => {
    if (user) {
      reset({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber,
        facebook: user.facebook,
        youtube: user.youtube,
        shipping: user.shipping,
        pictureCover: user.pictureCover,
        address: user.address,
        description: user.description,
      });
    }
  }, [reset, user]);

  const handleChangeAvatar = (e: any) => {
    const selectedImage: string = e.target.files[0];
    setAvatarFile(selectedImage);
    setPreviewAvatar(URL.createObjectURL(e.target.files[0]));
  };
  const handleChangeCover = (e: any) => {
    const selectedImage: string = e.target.files[0];
    setCoverFile(selectedImage);
    setPreviewCover(URL.createObjectURL(e.target.files[0]));
  };

  const handleFormSubmit = async (value: Partial<FormValues>) => {
    const {
      displayName,
      phoneNumber,
      email,
      description,
      address,
      shipping,
      facebook,
      youtube,
    } = value || {};

    const avatarStorageRef = ref(storage, `sellers/${avatarFile?.name}`);
    const coverStorageRef = ref(storage, `sellers/${coverFile?.name}`);

    let uploadAvatar: any = null;
    let uploadCover: any = null;
    if (avatarFile?.name) {
      uploadAvatar = uploadBytes(avatarStorageRef, avatarFile);
    }
    if (coverFile?.name) {
      uploadCover = uploadBytes(coverStorageRef, coverFile);
    }

    try {
      const [avatarSnapshot, coverSnapshot] = await Promise.all([
        uploadAvatar,
        uploadCover,
      ]);

      let avatarUrl: any = null;
      let coverUrl: any = null;
      if (avatarFile?.name) {
        avatarUrl = await getDownloadURL(avatarSnapshot.ref);
      }
      if (coverFile?.name) {
        coverUrl = await getDownloadURL(coverSnapshot.ref);
      }

      const data = {
        displayName: displayName || user.displayName || "",
        phoneNumber: phoneNumber || user.phoneNumber || "",
        email: email || user.email || "",
        address: address || user.address || "",
        photoURL: avatarUrl || user.photoURL || "",
        description: description || user.description || "",
        pictureCover: coverUrl || user.pictureCover || "",
        shipping: shipping || user.shipping || "",
        youtube: youtube || user.youtube || "",
        facebook: facebook || user.facebook || "",
      };

      const resultAction = await dispatch(
        updateUserAsync({
          updateUser: updateUserData(data, true),
          id: user?.docId,
        })
      );

      if (updateUserAsync.rejected.match(resultAction)) {
        const errorPayload = resultAction.payload;
        dispatch(
          setMessage({
            message: `User cannot update: ${errorPayload}`,
            type: "error",
          })
        );
      } else {
        dispatch(
          setMessage({
            message: "User update successfully",
            type: "success",
          })
        );
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <Fragment>
      <Box
        mb={3}
        height="173px"
        overflow="hidden"
        borderRadius="10px"
        position="relative"
        style={{
          background: `url(${
            coverPreview ||
            user.pictureCover ||
            "/assets/images/banners/banner-10.png"
          }) center/cover`,
        }}
      >
        <Box position="absolute" bottom={20} left={24}>
          <Badge
            overlap="circular"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            badgeContent={
              <UploadButton
                onChange={handleChangeAvatar}
                id="profile-image"
                style={{
                  bgcolor: "grey.300",
                }}
              />
            }
          >
            <Avatar
              src={avatarPreview || user.photoURL}
              sx={{
                width: 80,
                height: 80,
                border: "4px solid",
                borderColor: "grey.100",
              }}
            />
          </Badge>
        </Box>

        <Box position="absolute" top={20} right={20}>
          <UploadButton onChange={handleChangeCover} id="cover-image" />
        </Box>
      </Box>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Box mb={4}>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <Controller
                name="displayName"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    fullWidth
                    type="name"
                    variant="outlined"
                    label="Name"
                    placeholder="Name..."
                    onChange={onChange}
                    helperText={!!error ? error.message : ""}
                    error={!!error?.message}
                    value={value || ""}
                  />
                )}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <Controller
                name="phoneNumber"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    fullWidth
                    type="phone"
                    variant="outlined"
                    label="Phone"
                    placeholder="Phone..."
                    onChange={onChange}
                    helperText={!!error ? error.message : ""}
                    error={!!error?.message}
                    value={value || ""}
                  />
                )}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <Controller
                name="email"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    fullWidth
                    type="email"
                    variant="outlined"
                    label="Email"
                    placeholder="Email..."
                    onChange={onChange}
                    helperText={!!error ? error.message : ""}
                    error={!!error?.message}
                    value={value || ""}
                  />
                )}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <Controller
                name="address"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    fullWidth
                    type="address"
                    variant="outlined"
                    label="Address"
                    placeholder="Address..."
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
                name="description"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    fullWidth
                    type="description"
                    variant="outlined"
                    label="Description"
                    placeholder="Description..."
                    onChange={onChange}
                    helperText={!!error ? error.message : ""}
                    error={!!error?.message}
                    value={value || ""}
                    multiline
                    rows={3}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <H4>Social Links</H4>
            </Grid>
            <Grid item md={6} xs={12}>
              <Controller
                name="facebook"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Facebook"
                    placeholder="https://facebook.com"
                    onChange={onChange}
                    value={value || ""}
                    InputProps={{
                      startAdornment: (
                        <FacebookFilled
                          color="info"
                          sx={{
                            mr: 1,
                          }}
                        />
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Controller
                name="youtube"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Youtube"
                    placeholder="https://youtube.com"
                    onChange={onChange}
                    value={value || ""}
                    InputProps={{
                      startAdornment: (
                        <YoutubeFilled
                          color="info"
                          sx={{
                            mr: 1,
                          }}
                        />
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <H4>Shipping fee & vat</H4>
            </Grid>
            <Grid item md={6} xs={12}>
              <Controller
                name="shipping"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    label={`Shipping fee ${
                      value ? currency(value || 0) + "đ" : ""
                    }`}
                    placeholder="30.000đ"
                    onChange={onChange}
                    helperText={!!error ? error.message : ""}
                    error={!!error?.message}
                    value={value || ""}
                  />
                )}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Controller
                name="vat"
                control={control}
                defaultValue="8%"
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="VAT"
                    placeholder="8%"
                    onChange={onChange}
                    value={value || ""}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="info"
          disabled={isLoading}
        >
          Save Changes
        </Button>
      </form>
    </Fragment>
  );
};

export default React.memo(AccountSettingForm);
