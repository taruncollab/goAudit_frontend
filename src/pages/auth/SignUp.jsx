import {
  Grid,
  TextField,
  Box,
  Button,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { Formik } from "formik";
import { signUp } from "../../apis/authSlice";
import style from "./signup.module.scss";
import bg from "../../assets/auth_bg.png";
import { toast } from "react-toastify";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <>
      <Grid container justifyContent={"center"} alignItems={"center"} className={style.mainContainer}>
        <Grid xs={12} md={6} className={style.imageContainer}>
          <img src={bg} alt="background" className={style.image} />
          <h1 className={style.head}>
            Hello, <br /> Welcome
          </h1>
        </Grid>
        <Grid xs={12} md={6}>
          <Grid item xs={8} md={8}>
            <Grid container justifyContent="center" className="mb-4">
              <h1 className={style.title}>Sign Up | Register</h1>
            </Grid>
            <Formik
              initialValues={{
                name: "",
                email: "",
                phone: "",
                submit: null,
              }}
              validationSchema={Yup.object().shape({
                name: Yup.string().max(255).required("Name is required"),
                email: Yup.string()
                  .email("Must be a valid email")
                  .max(255)
                  .required("Email is required"),
                phone: Yup.string().max(10).required("Phone is required"),
              })}
              onSubmit={async (values) => {
                const res = await dispatch(signUp(values));
                if (res.type.includes("fulfilled")) {
                  toast.success("Registration successful ")
                  navigate('/login')
                } else {
                  toast.warning(res.payload.response.data.message);
                }
              }}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                touched,
                values,
              }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <InputLabel>Name</InputLabel>
                  {/* <FormControl fullWidth variant="outlined"> */}
                    <TextField
                      error={Boolean(touched.name && errors.name)}
                      fullWidth
                      helperText={touched.name && errors.name}
                      // label="Name"
                      margin="normal"
                      name="name"
                      className={style.input}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      value={values.name}
                      size="small"
                      variant="outlined"
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          marginTop: "-15px",
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
                  {/* </FormControl> */}

                  <InputLabel>Email Address</InputLabel>
                  {/* <FormControl fullWidth variant="outlined"> */}
                    <TextField
                      error={Boolean(touched.email && errors.email)}
                      fullWidth
                      helperText={touched.email && errors.email}
                      // label="Email Address"
                      margin="normal"
                      name="email"
                      className={style.input}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="email"
                      value={values.email}
                      size="small"
                      variant="outlined"
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          marginTop: "-15px",
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
                  {/* </FormControl> */}

                  <InputLabel>Phone Number</InputLabel>
                  {/* <FormControl fullWidth variant="outlined"> */}
                    <TextField
                      error={Boolean(touched.phone && errors.phone)}
                      fullWidth
                      helperText={touched.phone && errors.phone}
                      // label="Phone Number"
                      margin="normal"
                      name="phone"
                      className={style.input}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="number"
                      value={values.phone}
                      size="small"
                      variant="outlined"
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          marginTop: "-15px",
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
                  {/* </FormControl> */}

                  {errors.submit && (
                    <Box mt={3}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Box>
                  )}
                  <Box mt={1}>
                    {/* <Grid container justifyContent="center" className="mt-1">
                      <p className={style.note}>
                        <Checkbox /> Keep Me Logged In
                      </p>
                    </Grid> */}
                    <Button
                      color="primary"
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      sx={{ textTransform: "none", mt: 2 }}
                      className={style.submit}
                    >
                      Sign Up
                    </Button>

                    <Grid container justifyContent="center" className="mt-3">
                      <p className={style.note}>
                        Already have an Account? <Link to={'/login'} className={style.link}>Login</Link>
                      </p>
                    </Grid>
                  </Box>
                </form>
              )}
            </Formik>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default SignUp;
