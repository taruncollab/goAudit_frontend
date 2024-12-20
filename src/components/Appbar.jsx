import {
  AppBar,
  Badge,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";
import style from "./appbar.module.scss";
import logo from "../assets/audit_logo.png";
import notification from "../assets/notification_icon.png";
import user1 from "../assets/user-1.png";
import ArrowDropDownCircleOutlinedIcon from "@mui/icons-material/ArrowDropDownCircleOutlined";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import menu from "../assets/menu.png";
import SearchIcon from "@mui/icons-material/Search";

const Appbar = () => {
  const { auth } = useSelector((state) => state.authData);

  // const [open, setOpen] = useState(
  //   localStorage.getItem("drawerOpen") === "true" ? true : false
  // );
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // useEffect(() => {
  //   localStorage.setItem("drawerOpen", open);
  // }, [open]);

  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <AppBar
        position="fixed"
        open={open}
        style={{ backgroundColor: "#fff", boxShadow: "none" }}
      >
        <Toolbar>
          <div className={style.appbar}>
            <div className={style.appbar_left}>
              <div>
                <img
                  src={logo}
                  alt="audit"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/")}
                />
              </div>
              <IconButton
                className={style.menu}
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                edge="start"
              >
                <img src={menu} alt="menu" />
                {/* <MenuIcon style={{ marginLeft: "1.5rem", color: "#000" }} /> */}
              </IconButton>
            </div>
            <div className={style.appbar_right}>
              <Button
                variant="contained"
                aria-controls={openMenu ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openMenu ? "true" : undefined}
                onClick={handleClick}
                className={style.profile}
                sx={{ textTransform: "none" }}
              >
                <img src={user1} alt="user" style={{ borderRadius: "50%" }} />
                <div className={style.btnText}>
                  <span className={style.btnTextName}>{auth?.name}</span>
                  <span className={style.btnTextRole}>
                    {auth?.role == "U" ? "User" : "Admin"}
                  </span>
                </div>
                <ArrowDropDownCircleOutlinedIcon className={style.arrow} />
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                sx={{
                  "& .MuiMenu-paper": {
                    backgroundColor: "#f0f0f0",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  },
                  "& .MuiMenuItem-root": {
                    fontSize: "14px",
                    color: "#333",
                    "&:hover": {
                      backgroundColor: "#e0e0e0",
                    },
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    localStorage.removeItem("userToken");
                    navigate("/login");
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <Sidebar open={open} setOpen={setOpen} />
    </>
  );
};

export default Appbar;
