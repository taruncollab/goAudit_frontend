import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import "../App.css";
import Appbar from "../components/Appbar";
import { useEffect, useState } from "react";
import style from "./layout.module.scss";
import { Navigate } from "react-router-dom";

const Layout = ({ children }) => {
  const [open, setOpen] = useState(
    localStorage.getItem("drawerOpen") === "true" ? true : false
  );

  useEffect(() => {
    localStorage.setItem("drawerOpen", open);
  }, [open]);

  let auth = { userToken: false };

  if (localStorage.getItem("userToken")) {
    auth = { userToken: true };
  }

  return (
    <>
      {auth.userToken ? (
        <Box className={style.flex}>
          <CssBaseline />

          <Appbar />

          <Box component="main" className={style.main}>
            {children}
          </Box>
        </Box>
      ) : (
        <Navigate to={"/login"} />
      )}
    </>
  );
};

export default Layout;
