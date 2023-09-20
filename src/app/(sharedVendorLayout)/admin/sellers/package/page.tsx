"use client";
import { FlexBetween } from "@/components/flex-box";
import GoldPackageIcon from "@/components/icons/GoldPackageIcon";
import PremiumPackageIcon from "@/components/icons/PremiumPackageIcon";
import SilverPackageIcon from "@/components/icons/SilverPackageIcon";
import { H3 } from "@/components/Typography";
import PackageCard from "@/page-sections/admin/users/PackageCard";
import { Box, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/hooks";
import { updateUserAsync, updateUserData } from "@/redux/features/authSlice";
import { setMessage } from "@/redux/features/messageSlice";

const packageList = [
  {
    id: 1,
    price: 1249000,
    packageName: "Premium",
    Icon: PremiumPackageIcon,
    features: [
      "Product Upload Limit: 50",
      "Commission: 5%",
      "Package Duration: 30 days",
      "Vouchers: 10K, 20k, 30K / product",
    ],
  },
  {
    id: 2,
    price: 849000,
    packageName: "Gold",
    Icon: GoldPackageIcon,
    features: [
      "Product Upload Limit: 30",
      "Commission: 5%",
      "Package Duration: 30 days",
      "Vouchers: 10K, 20k / product",
    ],
  },
  {
    id: 3,
    price: 599000,
    packageName: "Silver",
    Icon: SilverPackageIcon,
    features: [
      "Product Upload Limit: 20",
      "Commission: 5%",
      "Package Duration: 30 days",
      "Vouchers: 10K / product",
    ],
  },
];

export default function SellerPackage() {
  const { user } = useSelector((state: any) => state.auth);
  const dispatch: any = useAppDispatch();

  const handleSubmitForm = async (values: {
    price: number;
    packageName: string;
  }) => {
    const { price, packageName } = values;
    const data = { wallet: Number(-price), userType: packageName };
    if (user.userType !== packageName) {
      if(user.userType === "Premium") {
        dispatch(
          setMessage({
            message: `You've reached the highest package.`,
            type: "error",
          })
        );
        return
      }

      if(user.userType === "Gold" && packageName === "Silver") {
        dispatch(
          setMessage({
            message: `You've reached the Gold Package.`,
            type: "error",
          })
        );
        return
      }
      
      if (user.wallet < price) {
        dispatch(
          setMessage({
            message: "There is not enough money in the wallet...",
            type: "error",
          })
        );
      } else {
        const resultAction = await dispatch(
          updateUserAsync({
            updateUser: updateUserData(data, true, user, true),
            id: user?.docId,
          })
        );

        if (updateUserAsync.rejected.match(resultAction)) {
          const errorPayload = resultAction.payload;
          dispatch(
            setMessage({
              message: `User cannot buy package: ${errorPayload}`,
              type: "error",
            })
          );
        } else {
          dispatch(
            setMessage({
              message: "User buy package successfully",
              type: "success",
            })
          );
        }
      }
    } else {
      dispatch(
        setMessage({
          message: `You're in ${packageName} Package...`,
          type: "error",
        })
      );
    }
  };

  return (
    <Box py={4}>
      <FlexBetween mb={2}>
        <H3>Seller Packages</H3>
      </FlexBetween>

      <Grid container spacing={2}>
        {packageList.map((item) => (
          <Grid item xl={4} md={6} xs={12} key={item.id}>
            <PackageCard
              onClickPackage={() => handleSubmitForm(item)}
              listItem={item}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
