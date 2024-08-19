import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
} from "@mui/material";
import sizeConfigs from "../../config/Size";
import colorConfigs from "../../config/Colors";
import { Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Topbar = () => {

  const navigate = useNavigate();

  const HandleLogout = () => {
    sessionStorage.removeItem("token");
    // Redirigir al usuario a la página de inicio de sesión
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${sizeConfigs.sidebar.width})`,
        ml: sizeConfigs.sidebar.width,
        boxShadow: "unset",
        backgroundColor: colorConfigs.topbar.bg,
        color: colorConfigs.topbar.color,
      }}
    >
      <Toolbar>
        <Box sx={{ width: "100%" }}>
          <Typography variant="h6">Administrador de Noticias</Typography>
        </Box>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={HandleLogout}
            startIcon={<Logout />}
          >
            Cerrar sesión
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
