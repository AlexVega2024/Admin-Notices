import { Alert, AlertTitle, Stack } from "@mui/material";
import React from "react";

type AlertProps = {
  severity?: "success" | "error" | "info";
  title?: string;
  description?: string;
};

const AlertComponent = ({ severity, title, description }: AlertProps) => {
  return (
    <Stack sx={{ width: "100%", height: "180px" }} spacing={2}>
      <Alert severity={severity}>
        <AlertTitle>{title}</AlertTitle>
        {description}
      </Alert>
    </Stack>
  );
};

export default AlertComponent;
