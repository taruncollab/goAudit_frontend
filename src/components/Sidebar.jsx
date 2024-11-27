import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import logo from "../assets/audit_logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import style from "./appbar.module.scss";
import { SidebarArray } from "../common/utils";
import { useSelector } from "react-redux";

const drawerWidth = 250;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function Sidebar(props) {
  const { open, setOpen } = props;
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const { auth } = useSelector((state) => state.authData);

  const handleDrawerClose = () => {
    setOpen(false);
  };

  let filteredSidebarArray = SidebarArray.filter((item) =>
    item.role.includes(auth.role)
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        onClose={handleDrawerClose}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            zIndex: theme.zIndex.appBar - 1,
          },
        }}
        variant="temporary"
        // variant="persistent"
        anchor="left"
        open={open}
        ModalProps={{ disableScrollLock: true }}
      >
        <DrawerHeader style={{ position: "fixed" }}>
          <div>
            <img src={logo} alt="audit" className="ms-4" />
          </div>
        </DrawerHeader>
        <List sx={{ mt: 8, position: "fixed" }}>
          {filteredSidebarArray &&
            filteredSidebarArray.map((item, index) => (
              <ListItem
                key={index}
                className={
                  location.pathname.includes(item.link)
                    ? style.active
                    : style.menus
                }
              >
                <ListItemButton
                  onClick={() => {
                    navigate(item.link);
                    handleDrawerClose();
                  }}
                >
                  <ListItemIcon>
                    <img
                      src={
                        location.pathname == item.link
                          ? item.whiteIcon
                          : item.blackIcon
                      }
                      alt="dashboard"
                      className={style.icons}
                    />
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
      </Main>
    </Box>
  );
}
