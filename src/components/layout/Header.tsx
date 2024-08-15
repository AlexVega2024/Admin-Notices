import "../../styles/Header.css";
import { Box, Toolbar } from "@mui/material";
import Topbar from "../common/TopBar";
import sizeConfigs from "../../config/Size";
import Sidebar from "../common/SideBar/Sidebar";
import colorConfigs from "../../config/Colors";
import { Outlet } from "react-router-dom";

const Header = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Topbar />
      <Box
        component="nav"
        sx={{
          width: sizeConfigs.sidebar.width,
          flexShrink: 0,
        }}
      >
        <Sidebar />
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${sizeConfigs.sidebar.width})`,
          minHeight: "100vh",
          backgroundColor: colorConfigs.mainBg,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Header;
