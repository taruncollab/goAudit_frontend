import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { useEffect, useRef, useState } from "react";
import logo from "../assets/audit_logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import style from "./appbar.module.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import TopicOutlinedIcon from "@mui/icons-material/TopicOutlined";
import CompareOutlinedIcon from "@mui/icons-material/CompareOutlined";
import dashboardWhite from "../assets/white/dashboardWhite.png";
import companyWhite from "../assets/white/companyWhite.png";
import locationWhite from "../assets/white/locationWhite.png";
import questionWhite from "../assets/white/questionWhite.png";
import userWhite from "../assets/white/userWhite.png";
import formWhite from "../assets/white/formWhite.png";
import formRecordWhite from "../assets/white/formRecordWhite.png";
import compareWhite from "../assets/white/compareWhite.png";
import dashboardBlack from "../assets/black/dashboardBlack.png";
import companyBlack from "../assets/black/companyBlack.png";
import locationBlack from "../assets/black/locationBlack.png";
import questionBlack from "../assets/black/questionBlack.png";
import userBlack from "../assets/black/userBlack.png";
import formBlack from "../assets/black/formBlack.png";
import formRecordBlack from "../assets/black/formRecordBlack.png";
import compareBlack from "../assets/black/compareBlack.png";
import categoryBlack from "../assets/black/category_black.png";
import categoryWhite from "../assets/white/category_White.png";

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

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const getMenuItemClass = (path) =>
    location.pathname === path || location.pathname.includes(path)
      ? style.active
      : style.menus;

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
          {/* <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton> */}
        </DrawerHeader>
        <List sx={{ mt: 8, position: "fixed" }}>
          {/* <Divider /> */}
          <ListItem
            className={location.pathname == "/" ? style.active : style.menus}
          >
            <ListItemButton
              onClick={() => {
                navigate("/");
                handleDrawerClose();
              }}
            >
              <ListItemIcon>
                <img
                  src={
                    location.pathname == "/" ? dashboardWhite : dashboardBlack
                  }
                  alt="dashboard"
                  className={style.icons}
                />
                {/* <HomeOutlinedIcon
                  className={
                    location.pathname == "/" ? style.activeIcon : style.menuIcon
                  }
                /> */}
              </ListItemIcon>
              <ListItemText primary={"Dashboard"} />
            </ListItemButton>
          </ListItem>
          <ListItem
            className={
              location.pathname == "/company" ? style.active : style.menus
            }
          >
            <ListItemButton
              onClick={() => {
                navigate("/company");
                handleDrawerClose();
              }}
            >
              <ListItemIcon>
                <img
                  src={
                    location.pathname == "/company"
                      ? companyWhite
                      : companyBlack
                  }
                  alt="company"
                  className={style.icons}
                />
              </ListItemIcon>
              <ListItemText primary={"Company"} />
            </ListItemButton>
          </ListItem>

          <ListItem
            className={
              location.pathname == "/location" ? style.active : style.menus
            }
          >
            <ListItemButton
              onClick={() => {
                navigate("/location");
                handleDrawerClose();
              }}
            >
              <ListItemIcon>
                <img
                  src={
                    location.pathname == "/location"
                      ? locationWhite
                      : locationBlack
                  }
                  alt="location"
                  className={style.icons}
                />
              </ListItemIcon>
              <ListItemText primary={"Location"} />
            </ListItemButton>
          </ListItem>

          <ListItem
            className={
              location.pathname == "/category" ? style.active : style.menus
            }
          >
            <ListItemButton
              onClick={() => {
                navigate("/category");
                handleDrawerClose();
              }}
            >
              <ListItemIcon>
                <img
                  src={
                    location.pathname == "/category"
                      ? categoryWhite
                      : categoryBlack
                  }
                  alt="category"
                  className={style.icons}
                />
              </ListItemIcon>
              <ListItemText primary={"Category"} />
            </ListItemButton>
          </ListItem>

          <ListItem
            className={
              location?.pathname == "/question" ||
              location?.pathname?.includes("questionform") ||
              location?.pathname?.includes("questiondetails")
                ? style.active
                : style.menus
            }
          >
            <ListItemButton
              onClick={() => {
                navigate("/question");
                handleDrawerClose();
              }}
            >
              <ListItemIcon>
                <img
                  src={
                    location?.pathname == "/question" ||
                    location?.pathname?.includes("questionform") ||
                    location?.pathname?.includes("questiondetails")
                      ? questionWhite
                      : questionBlack
                  }
                  alt="question"
                  className={style.icons}
                />
              </ListItemIcon>
              <ListItemText primary={"Add Question"} />
            </ListItemButton>
          </ListItem>
          <ListItem
            className={
              location.pathname == "/showforms" ||
              location.pathname.includes("fillform")
                ? style.active
                : style.menus
            }
          >
            <ListItemButton
              onClick={() => {
                navigate("/showforms");
                handleDrawerClose();
              }}
            >
              <ListItemIcon>
                <img
                  src={
                    location.pathname == "/showforms" ||
                    location.pathname.includes("fillform")
                      ? formWhite
                      : formBlack
                  }
                  alt="forms"
                  className={style.icons}
                />
              </ListItemIcon>
              <ListItemText primary={"Fill Form"} />
            </ListItemButton>
          </ListItem>
          <ListItem
            className={
              location.pathname == "/formrecords" ||
              location.pathname.includes("formdetails")
                ? style.active
                : style.menus
            }
          >
            <ListItemButton
              onClick={() => {
                navigate("/formrecords");
                handleDrawerClose();
              }}
            >
              <ListItemIcon>
                <img
                  src={
                    location.pathname == "/formrecords" ||
                    location.pathname.includes("formdetails")
                      ? formRecordWhite
                      : formRecordBlack
                  }
                  alt="formrecords"
                  className={style.icons}
                />
                {/* <TopicOutlinedIcon
                  className={
                    location.pathname == "/formrecords" ||
                    location.pathname.includes("formdetails")
                      ? style.activeIcon
                      : style.menuIcon
                  }
                /> */}
              </ListItemIcon>
              <ListItemText primary={"Form Records"} />
            </ListItemButton>
          </ListItem>
          <ListItem
            className={
              location.pathname == "/comparescore" ? style.active : style.menus
            }
          >
            <ListItemButton
              onClick={() => {
                navigate("/comparescore");
                handleDrawerClose();
              }}
            >
              <ListItemIcon>
                <img
                  src={
                    location.pathname == "/comparescore"
                      ? compareWhite
                      : compareBlack
                  }
                  alt="compare"
                  className={style.icons}
                />
                {/* <CompareOutlinedIcon
                  className={
                    location.pathname == "/comparescore"
                      ? style.activeIcon
                      : style.menuIcon
                  }
                /> */}
              </ListItemIcon>
              <ListItemText primary={"Compare Scores"} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
      </Main>
    </Box>
  );
}
