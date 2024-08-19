import { Drawer, List, Stack, Toolbar } from "@mui/material";
import SidebarItem from "./SidebarItem";
import SidebarItemCollapse from "./SidebarItemCollapse";
import sizeConfigs from "../../../config/Size";
import colorConfigs from "../../../config/Colors";
import appRoutes from "../../../routes/AppRoute";
import { ImageComponent } from "../ImageComponent";
import { assets } from "../../../assets";

const Sidebar = () => {

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sizeConfigs.sidebar.width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: sizeConfigs.sidebar.width,
          boxSizing: "border-box",
          borderRight: "0px",
          backgroundColor: colorConfigs.sidebar.bg,
          color: colorConfigs.sidebar.color,
        },
      }}
    >
      <List disablePadding>
        <Toolbar sx={{ marginTop: "20px", marginBottom: "20px" }}>
          <Stack sx={{ width: "100%" }} direction="row" justifyContent="center">
            <ImageComponent urlImage={assets.images.logoBlanco} typeImage="topbar" name={"logo"} objectFit="scale-down"/>
          </Stack>
        </Toolbar>
        {appRoutes.map((route, index) =>
          route.sidebarProps ? (
            route.child ? (
              <SidebarItemCollapse item={route} key={index} />
            ) : (
              <SidebarItem item={route} key={index} />
            )
          ) : null
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
