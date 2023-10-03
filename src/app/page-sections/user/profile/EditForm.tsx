"use client";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { CameraEnhance } from "@mui/icons-material";
import { Avatar, Box, Button, Grid, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Card from "@/components/Card";
import { FlexBox } from "@/components/flex-box";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch } from "@/redux/hooks";
import { updateUserAsync, updateUserData } from "@/redux/features/authSlice";
import { setMessage } from "@/redux/features/messageSlice";
import { useSelector } from "react-redux";
import { getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storageRef } from "@/firebase";
import { RootState } from "@/redux/store";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const schema = yup.object().shape({
  phoneNumber: yup
    .string()
    .length(10, "Phone must be exactly 10 characters")
    .matches(phoneRegExp, "Phone number is not valid"),
  email: yup.string().email("invalid email"),
  birthDate: yup.date(),
});
interface FormValues {
  displayName: string;
  phoneNumber: number;
  email: string;
  photoURL: string;
  birthDate: any;
  address: string;
}

const EditForm = () => {
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const [file, setFile] = useState<any>(null);
  const [imagePreview, setPreview] = useState("");
  const dispatch: any = useAppDispatch();

  const { handleSubmit, control, reset } = useForm<any>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (user) {
      reset({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        birthDate: new Date(user.birthDate.seconds * 1000 || ""),
        phoneNumber: user.phoneNumber,
        address: user.address,
      });
    }
  }, [reset, user]);

  const handleChangeFiles = (e: any) => {
    setFile(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleFormSubmit = async (value: Partial<FormValues>) => {
    const { displayName, phoneNumber, email, birthDate, address } = value || {};
    const date = birthDate ? new Date(birthDate || "") : birthDate || "";

    if (file) {
      const uploadTask = uploadBytesResumable(
        storageRef(`avatars/${file.name}`),
        file
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
          getDownloadURL(uploadTask.snapshot.ref).then(async (url: string) => {
            const data = {
              displayName: displayName || user.displayName || "",
              phoneNumber: phoneNumber || user.phoneNumber || "",
              email: email || user.email || "",
              photoURL: url || user.photoURL || "",
              birthDate: date || user.birthDate || "",
              address: address || user.address || "",
            };

            const resultAction = await dispatch(
              updateUserAsync({
                updateUser: updateUserData(data, false, user),
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
          });
        }
      );
      return;
    }
    const data = {
      displayName: displayName || user.displayName || "",
      phoneNumber: phoneNumber || user.phoneNumber || "",
      email: email || user.email || "",
      photoURL: user.photoURL || "",
      birthDate: date || user.birthDate || "",
      address: address || user.address || "",
    };

    const resultAction = await dispatch(
      updateUserAsync({
        updateUser: updateUserData(data, false, user),
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
  };

  return (
    <Card sx={{ p: 3 }}>
      <FlexBox alignItems="flex-end" mb={3}>
        <Avatar
          src={imagePreview || user.photoURL}
          sx={{
            height: 88,
            width: 88,
          }}
        />

        <Box ml={-2.5}>
          <label htmlFor="profile-image">
            <Button
              component="span"
              color="secondary"
              sx={{
                p: "8px",
                height: "auto",
                bgcolor: "grey.300",
                borderRadius: "50%",
              }}
            >
              <CameraEnhance fontSize="small" />
            </Button>
          </label>
        </Box>

        <Box display="none">
          <input
            onChange={handleChangeFiles}
            id="profile-image"
            accept="image/*"
            type="file"
          />
        </Box>
      </FlexBox>

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
                    size="small"
                    type="name"
                    variant="outlined"
                    label="Display Name"
                    placeholder="Name..."
                    onChange={onChange}
                    helperText={!!error ? error.message : ""}
                    error={!!error?.message}
                    value={value || ""}
                    autoFocus
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
                    size="small"
                    type="phone"
                    variant="outlined"
                    label="Phone"
                    placeholder="09902358235"
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
                    size="small"
                    type="email"
                    variant="outlined"
                    label="Email"
                    placeholder="example@gmail.com"
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
                name="birthDate"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Birth Date"
                      maxDate={new Date()}
                      {...field}
                      openTo={"day"}
                      views={["year", "month", "day"]}
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="address"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    fullWidth
                    size="small"
                    type="address"
                    variant="outlined"
                    label="Address"
                    placeholder="Address...."
                    onChange={onChange}
                    helperText={!!error ? error.message : ""}
                    error={!!error?.message}
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
          color="primary"
          disabled={isLoading}
        >
          Save Changes
        </Button>
      </form>
    </Card>
  );
};

export default EditForm;
