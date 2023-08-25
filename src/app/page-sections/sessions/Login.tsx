import React, { useCallback, useState } from "react";
import { Button, Card, Box, styled } from "@mui/material";
import Link from "next/link";
// import * as yup from "yup";
import { H1, H6 } from "@/components/Typography";
import TextFieldInput from "@/components/TextField";
import SocialButtons from "./SocialButtons";
import EyeToggleButton from "./EyeToggleButton";
import { FlexBox, FlexRowCenter } from "@/components/flex-box";
import Image from "next/image";
const fbStyle = {
  background: "#3B5998",
  color: "white",
};
const googleStyle = {
  background: "#4285F4",
  color: "white",
};
type TypeWrapper = {
  children: React.ReactNode;
  passwordVisibility: boolean;
  elevation?: number;
};
export const Wrapper = styled(
  ({ children, passwordVisibility, ...rest }: TypeWrapper) => (
    <Card {...rest}>{children}</Card>
  )
)(({ theme, passwordVisibility }) => ({
  width: 500,
  padding: "2rem 3rem",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
  ".passwordEye": {
    color: passwordVisibility
      ? theme.palette.grey[600]
      : theme.palette.grey[400],
  },
  ".facebookButton": {
    marginBottom: 10,
    ...fbStyle,
    "&:hover": fbStyle,
  },
  ".googleButton": {
    ...googleStyle,
    "&:hover": googleStyle,
  },
  ".agreement": {
    marginTop: 12,
    marginBottom: 24,
  },
}));
const Login = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisibility((visible) => !visible);
  }, []);
  const handleFormSubmit = async (values: any) => {
    console.log(values);
  };

  return (
    <Wrapper elevation={3} passwordVisibility={passwordVisibility}>
      <form onSubmit={handleFormSubmit}>
        <div className="relative">
          <Image
            width={90}
            height={80}
            alt="hello"
            src="/assets/images/logo2.png"
            style={{ margin: "auto", display: "block" }}
          />
        </div>
        <H1 textAlign="center" mt={1} mb={4} fontSize={16}>
          Welcome To TapHoa
        </H1>

        <TextFieldInput
          mb={1.5}
          fullWidth
          name="email"
          size="small"
          type="email"
          variant="outlined"
          // value={values.email}
          // onChange={handleChange}
          label="Email or Phone Number"
          placeholder="exmple@mail.com"
          // error={!!touched.email && !!errors.email}
          // helperText={touched.email && errors.email}
        />

        <TextFieldInput
          mb={2}
          fullWidth
          size="small"
          name="password"
          label="Password"
          autoComplete="on"
          variant="outlined"
          // onChange={handleChange}
          // value={values.password}
          placeholder="*********"
          type={passwordVisibility ? "text" : "password"}
          // error={!!touched.password && !!errors.password}
          // helperText={touched.password && errors.password}
          InputProps={{
            endAdornment: (
              <EyeToggleButton
                show={passwordVisibility}
                click={togglePasswordVisibility}
              />
            ),
          }}
        />

        <Button
          fullWidth
          type="submit"
          color="primary"
          variant="contained"
          sx={{
            height: 44,
          }}
        >
          Login
        </Button>
      </form>

      <SocialButtons />

      <FlexRowCenter mt="1.25rem">
        <Box>Don&apos;t have account?</Box>
        <H6 ml={1} borderBottom="1px solid" borderColor="grey.900">
          <Link href="/signup" passHref legacyBehavior>
            Sign Up
          </Link>
        </H6>
      </FlexRowCenter>

      <FlexBox
        justifyContent="center"
        bgcolor="grey.200"
        borderRadius="4px"
        py={2.5}
        mt="1.25rem"
      >
        Forgot your password?
        <H6 ml={1} borderBottom="1px solid" borderColor="grey.900">
          <Link href="/reset-password" passHref legacyBehavior>
            Reset It
          </Link>
        </H6>
      </FlexBox>
    </Wrapper>
  );
};
// const initialValues = {
//   email: "",
//   password: "",
// };
// const formSchema = yup.object().shape({
//   password: yup.string().required("Password is required"),
//   email: yup.string().email("invalid email").required("Email is required"),
// });
export default React.memo(Login);
