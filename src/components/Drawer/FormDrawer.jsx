import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { useEffect, useState } from "react";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import drawerStyle from "./drawer.module.scss";
import * as Yup from "yup";
import { Formik } from "formik";
import { Close } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { getInitialValues, getValidationSchema } from "../../common/common";
import close from "../../assets/close.png";
import { getAllCompanies } from "../../apis/companySlice";

export default function FormDrawer(props) {
  const {
    anchor,
    open,
    setOpen,
    title,
    editTitle,
    form,
    // options,
    formField,
    setFormField,
    uploadFun,
    submitFun,
    upload,
    setUpload,
    setBase64,
    base64,
    resetFormData,
    closeForm,
  } = props;

  const dispatch = useDispatch();

useEffect(() => {
  const callAPI = async() => {
      const res = await dispatch(getAllCompanies());
  }
  callAPI();
}, []);


  const list = (anchor) => (
    <Box
      sx={{
        width: anchor === "top" || anchor === "bottom" ? "auto" : 350,
        mx: 2,
      }}
    >
      <Box fullWidth className={drawerStyle.mainBox}>
        <Typography className={drawerStyle.head}>
          {open[1] === null ? title : editTitle}
        </Typography>
        <Grid>
          <img
            src={close}
            alt="close"
            className={drawerStyle.closeIcon}
            onClick={() => {
              setOpen([false, null]);
              setBase64 && setBase64(null);
            }}
          />
        </Grid>
      </Box>
      <Grid>
        <Formik
          initialValues={open[1] == null ? getInitialValues(form) : open[1]}
          enableReinitialize={true}
          validationSchema={getValidationSchema(Yup, form)}
          onSubmit={(
            values,
            { setErrors, setStatus, setSubmitting, setValues }
          ) => {
            submitFun(values);
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
            resetForm,
          }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Box>
                {form?.map((data) => {
                  if (!data?.add) {
                    return null;
                  }
                  if (!data?.edit) {
                    return null;
                  }

                  if (data?.type === "select") {
                    const checkData =
                      touched?.[data.name] && errors?.[data.name];
                    return (
                      <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel style={{marginTop: '-8px', color:"#5F5F5F"}}>{data?.title}</InputLabel>
                        <Select
                          size="small"
                          name={data?.name}
                          value={values?.[data.name] || ""}
                          onChange={handleChange}
                          input={<OutlinedInput label={data?.title} />}
                        >
                          {/* <MenuItem value="">None</MenuItem> */}
                          {data?.options?.map((opt) => {
                            return (
                              <MenuItem value={opt?._id}>{opt?.name}</MenuItem>
                            );
                          })}
                        </Select>
                        {checkData && (
                          <FormHelperText
                            error
                            id="standard-weight-helper-text-email-login"
                          >
                            {errors?.[data.name]}
                          </FormHelperText>
                        )}
                      </FormControl>
                    );
                  } else if (data?.type === "radio") {
                    return (
                      <FormControl
                        fullWidth
                        sx={{ marginLeft: ".8rem", mt: 2 }}
                      >
                        <FormLabel>{data?.title}</FormLabel>
                        <RadioGroup
                          row
                          name={data?.name}
                          value={values?.[data.name]}
                          onChange={handleChange}
                        >
                          {data?.options?.map((opt) => {
                            return (
                              <FormControlLabel
                                value={opt?.value}
                                control={<Radio />}
                                label={opt?.title}
                              />
                            );
                          })}
                        </RadioGroup>
                      </FormControl>
                    );
                  } else if (data?.type === "file") {
                    return (
                      <>
                        {base64 ? (
                          <div
                            className="mt-4 mb-4 ms-1"
                            onClick={() => {
                              setUpload(null);
                              setBase64(null);
                            }}
                          >
                            <div className={drawerStyle.imgCover}>
                              <img src={base64} className="my-4" />
                          {/* <img src={values?.compLogo ? values?.compLogo : base64} className="my-4" /> */}
                            </div>
                          </div>
                        ) : (
                          <div className={`d-flex flex-column mt-2 ms-1`}>
                            <span className={`mb-2 ${drawerStyle.imgTit}`}>
                              Upload Logo
                            </span>
                            <Button
                              variant="contained"
                              type="submit"
                              size="large"
                              component="label"
                              sx={{ textTransform: "none"}}
                              className={`mb-1 ${drawerStyle.addBtn}`}
                              fullWidth
                            >
                              <div
                                className={`${drawerStyle.btnInner} d-flex flex-column justify-content-center align-items-center`}
                              >
                                <AddIcon className={drawerStyle.icon} />
                                <span className={`mt-3 ${drawerStyle.btnText}`}>
                                  Upload
                                </span>
                              </div>
                              <input
                                accept=".png, .jpg"
                                type="file"
                                name={data?.name}
                                onChange={uploadFun}
                                hidden
                              />
                            </Button>
                            <span className={drawerStyle.note}>
                              <span style={{color:'#B20000'}}>NOTE : </span>PNG,JPG File format are allowed
                            </span>
                          </div>
                        )}
                      </>
                    );
                  } else {
                    const checkData =
                      touched?.[data.name] && errors?.[data.name];
                    return (
                      <FormControl
                        fullWidth
                        error={Boolean(checkData)}
                        sx={{ mt: 2 }}
                      >
                        {data?.shrink ? (
                          <TextField
                            label={`${data?.title} ${
                              data?.required ? "*" : ""
                            }`}
                            size="small"
                            name={data?.name}
                            value={values?.[data.name] ?? ""}
                            type={data?.type}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        ) : (
                          <TextField
                            label={`${data?.title} ${
                              data?.required ? "*" : ""
                            }`}
                            size="small"
                            name={data?.name}
                            value={values?.[data.name] ?? ""}
                            type={data?.type}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            InputLabelProps={{style: {fontSize: 14, color: "#535353"}}}
                          />
                        )}
                        {checkData && (
                          <FormHelperText
                            error
                            id="standard-weight-helper-text-email-login"
                          >
                            {errors?.[data.name]}
                          </FormHelperText>
                        )}
                      </FormControl>
                    );
                  }
                })}

                {errors.submit && (
                  <Box sx={{ mt: 3 }}>
                    <FormHelperText error>{errors.submit}</FormHelperText>
                  </Box>
                )}
              </Box>
              <Box
                sx={{
                  height: "5rem",
                }}
              ></Box>
              <Box
                sx={{
                  mt: 2,
                  width: 350,
                  position: "fixed",
                  bottom: 0,
                  py: 2,
                  backgroundColor: "white",
                  zIndex: 100,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Button
                  fullWidth
                  disableElevation
                  disabled={isSubmitting}
                  // size="small"
                  type="button"
                  className={drawerStyle.clearBtn}
                  sx={{ textTransform: "none"}}
                  onClick={() => {
                    resetForm();
                    setOpen([true, null]);
                  }}
                  >
                  Clear
                </Button>
                <Button
                  fullWidth
                  disableElevation
                  disabled={isSubmitting}
                  // size="small"
                  type="submit"
                  className={drawerStyle.submitBtn}
                  sx={{ textTransform: "none"}}
                >
                  Submit
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Grid>
    </Box>
  );

  return (
    <div>
      <Drawer anchor={anchor} open={open[0]}>
        {list(anchor)}
      </Drawer>
    </div>
  );
}
