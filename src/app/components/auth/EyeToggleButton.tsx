import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FC, memo } from "react";

// ===============================================================
type TypeProps = {
  show: boolean;
  click: () => void;
};
const EyeToggleButton: FC<TypeProps> = ({ show, click }) => {
  return (
    <IconButton size="small" type="button" onClick={click}>
      {show ? (
        <Visibility className="passwordEye" fontSize="small" />
      ) : (
        <VisibilityOff className="passwordEye" fontSize="small" />
      )}
    </IconButton>
  );
};
export default memo(EyeToggleButton);
