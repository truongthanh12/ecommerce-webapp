import Link from "next/link";
import UserDashboardHeader from "@/components/header/UserDashboardHeader";
import CustomerDashboardNavigation from "@/components/layouts/customer-dashboard/Navigations";
import { Fragment } from "react";
import { Button } from "@mui/material";
import { Person } from "@mui/icons-material";
import EditForm from "@/app/page-sections/user/profile/EditForm";
// ===========================================================

const ProfileEditor = () => {
  // SECTION TITLE HEADER LINK
  const HEADER_LINK = (
    <Link href="/profile" passHref>
      <Button
        color="primary"
        sx={{
          px: 4,
          bgcolor: "primary.light",
        }}
      >
        Back to Profile
      </Button>
    </Link>
  );

  return (
    <Fragment>
      <UserDashboardHeader
        icon={Person}
        title="Edit Profile"
        button={HEADER_LINK}
        navigation={<CustomerDashboardNavigation />}
      />
      <EditForm />
    </Fragment>
  );
};

export default ProfileEditor;
