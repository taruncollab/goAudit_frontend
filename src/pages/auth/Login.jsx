import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Stack,
  Button,
  Box,
  FormControl,
  Checkbox,
  InputLabel,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getOtp, logIn } from "../../apis/authSlice";
import style from "./login.module.scss";
import bg from "../../assets/auth_bg.png";
import logo from "../../assets/audit_logo.png";
import gurl from "../../assets/gurl.png";
import OTPInput from "react-otp-input";
import "./checkbox.css";
import { toast } from "react-toastify";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    otp: "",
    keepLoggedIn: false,
  });
  const [otp, setOtp] = useState("");
  const [isOtp, setIsOtp] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOtp = async (e) => {
    e.preventDefault();
    // setIsOtp(true);

    const res = await dispatch(getOtp({ email: data.email }));
    if (res.type.includes("fulfilled")) {
      toast.success("OTP sent successfully ");
      setIsOtp(true);
    } else {
      toast.warning(res.payload.response.data.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData({ ...data, [name]: value });
  };

  const handleCheckboxChange = (event) => {
    setData((prevData) => ({
      ...prevData,
      keepLoggedIn: event.target.checked,
    }));
  };

  //Handle Submit-------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await dispatch(logIn({ ...data, otp: otp }));

    if (res.type.includes("fulfilled")) {
      navigate("/");
      toast.success(res.payload.response?.data?.message);
    } else {
      toast.warning(res.payload.response?.data?.message);
    }
  };

  return (
    <>
      <Grid
        container
        justifyContent={"center"}
        alignItems={"center"}
        className={style.mainContainer}
      >
        <Grid xs={12} md={6} className={style.imageContainer}>
          <img src={bg} alt="background" className={style.image} />
          <img className={style.headImg} src={gurl} alt="login" />
        </Grid>
        <Grid xs={12} md={6}>
          <Grid item xs={8} md={8}>
            <Grid container justifyContent="center" mb={3}>
              <img src={logo} alt="Go audit" className={style.logo} />
            </Grid>
            <Grid mb={3} container justifyContent="center">
              <h1 className={style.title}>{!isOtp ? "Login" : "Enter OTP"}</h1>
            </Grid>
            <Grid item xs={12}>
              <form>
                {!isOtp ? (
                  <>
                    <InputLabel>Email Address</InputLabel>
                    <TextField
                      fullWidth
                      margin="normal"
                      name="email"
                      className={style.input}
                      onChange={handleChange}
                      type="email"
                      value={data?.email || ""}
                      size="small"
                      variant="outlined"
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          marginTop: "-10px",
                          backgroundColor: "#E2DFDF",
                          border: "none",
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                        },
                      }}
                      InputLabelProps={{
                        style: {
                          color: "#878787",
                        },
                      }}
                    />
                  </>
                ) : (
                  <div className={`${style.otp} mb-4`}>
                    <OTPInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={4}
                      separator={<span>-</span>}
                      renderInput={(props) => (
                        <input
                          {...props}
                          autoFocus
                          style={{
                            width: "3rem",
                            height: "3rem",
                            margin:
                              "0 0.5rem" /* Adjusted margin for input spacing */,
                            background: "#E2DFDF",
                            border: "1px solid #069CCE",
                            borderRadius: "5px",
                            textAlign: "center",
                            fontSize: "1.5rem",
                          }}
                        />
                      )}
                    />
                  </div>
                )}

                <Box mt={1}>
                  {!isOtp ? (
                    <Grid container justifyContent="center" mt={3}>
                      {/* ============================checkbox================================================== */}
                      <div className="checkbox-wrapper-12 me-3">
                        <div className="cbx">
                          <input
                            id="cbx-12"
                            type="checkbox"
                            checked={data.keepLoggedIn}
                            onChange={handleCheckboxChange}
                          />
                          <label htmlFor="cbx-12"></label>
                          <svg
                            width="15"
                            height="14"
                            viewBox="0 0 15 14"
                            fill="none"
                          >
                            <path d="M2 8.36364L6.23077 12L13 2" />
                          </svg>
                        </div>
                        {/* Gooey */}
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                          <defs>
                            <filter id="goo-12">
                              <feGaussianBlur
                                in="SourceGraphic"
                                stdDeviation="4"
                                result="blur"
                              />
                              <feColorMatrix
                                in="blur"
                                mode="matrix"
                                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7"
                                result="goo-12"
                              />
                              <feBlend in="SourceGraphic" in2="goo-12" />
                            </filter>
                          </defs>
                        </svg>
                      </div>
                      {/* =============================================================================================== */}
                      <p className={style.note}>
                        {/* <Checkbox />  */}
                        Keep Me Logged In
                      </p>
                    </Grid>
                  ) : (
                    <></>
                  )}

                  <Button
                    color="primary"
                    fullWidth
                    size="large"
                    type="submit"
                    className={style.submit}
                    variant="contained"
                    // sx={{ textTransform: "none", mt: 2 }}
                    onClick={isOtp ? handleSubmit : handleOtp}
                  >
                    {!isOtp ? "Get OTP" : "Log In"}
                  </Button>

                  {!isOtp ? (
                    <Grid container justifyContent="center" className="mt-3">
                      <p className={style.note}>
                        Don't have an Account?
                        <Link to={"/signup"} className={style.link}>
                          Signup
                        </Link>
                      </p>
                    </Grid>
                  ) : (
                    <></>
                  )}
                </Box>
              </form>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
