
import Card from "@/components/Card";
import { H3 } from "@/components/Typography";
import { Box } from "@mui/material";
import AccountSettingForm from "@/page-sections/vendor/account-setting"
// =============================================================================

export default function AccountSetting() {
  return (
    <Box py={4}>
      <H3 mb={2}>Account Setting</H3>

      <Card
        sx={{
          p: 4,
        }}
      >
        <AccountSettingForm />
      </Card>
    </Box>
  );
}
