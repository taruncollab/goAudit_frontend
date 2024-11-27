import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import {
  Autocomplete,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import drawerStyle from "./drawer.module.scss";
import * as Yup from "yup";
import { Formik } from "formik";
import AddIcon from "@mui/icons-material/Add";
import { getInitialValues, getValidationSchema } from "../../common/common";
import close from "../../assets/close.png";

export default function FormDrawer(props) {
  const {
    anchor,
    open,
    setOpen,
    title,
    editTitle,
    form,
    uploadFun,
    submitFun,
    setUpload,
    setBase64,
    base64,
    setInputValue,
    inputValue,
    handleInputChange,
    setSelectedValue,
    selectedValue,
    loading,
    locSelectedValue,
    setLocSelectedValue,
    handleLocInputChange,
    locInputValue,
    setLocInputValue,
  } = props;

  const handleImageRemove = () => {
    setUpload(null);
    setBase64(null);
  };

  //Dynamic Form--------------------------------

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
          onSubmit={(values) => {
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
                {form &&
                  form?.map((data) => {
                    if (!data?.add || !data?.edit) {
                      return null;
                    }

                    const checkData =
                      touched?.[data.name] && errors?.[data.name];

                    if (data?.type === "select") {
                      return (
                        <FormControl fullWidth sx={{ mt: 2 }} key={data?.name}>
                          <InputLabel
                            style={{ marginTop: "-8px", color: "#5F5F5F" }}
                          >
                            {data?.title}
                          </InputLabel>
                          {data?.name == "compId" ? (
                            <Autocomplete
                              name={data?.name}
                              options={data?.options}
                              multiple={data?.mutiple || false}
                              filterSelectedOptions
                              getOptionLabel={(option) => option?.label}
                              value={selectedValue}
                              onChange={(event, newValue) => {
                                setSelectedValue(newValue);
                              }}
                              inputValue={inputValue}
                              onInputChange={handleInputChange}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  // onChange={(e) =>
                                  //   setInputValue(e.target.value)
                                  // }
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <>{params.InputProps.endAdornment}</>
                                    ),
                                  }}
                                />
                              )}
                            />
                          ) : (
                            <Autocomplete
                              name={data?.name}
                              options={data?.options}
                              multiple={data?.mutiple || false}
                              filterSelectedOptions
                              getOptionLabel={(option) => option?.label}
                              value={locSelectedValue}
                              onChange={(event, newValue) => {
                                setLocSelectedValue(newValue);
                              }}
                              inputValue={locInputValue}
                              onInputChange={handleLocInputChange}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  // onChange={(e) =>
                                  //   setLocInputValue(e.target.value)
                                  // }
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <>{params.InputProps.endAdornment}</>
                                    ),
                                  }}
                                />
                              )}
                            />
                          )}

                          {checkData && (
                            <FormHelperText error>
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
                          key={data?.name}
                        >
                          <FormLabel>{data?.title}</FormLabel>
                          <RadioGroup
                            row
                            name={data?.name}
                            value={values?.[data.name]}
                            onChange={handleChange}
                          >
                            {data?.options?.map((opt) => (
                              <FormControlLabel
                                key={opt?.value}
                                value={opt?.value}
                                control={<Radio />}
                                label={opt?.title}
                              />
                            ))}
                          </RadioGroup>
                        </FormControl>
                      );
                    } else if (data?.type === "file") {
                      return (
                        <Box key={data?.name} sx={{ mt: 2 }}>
                          {base64 || values?.compLogo ? (
                            <div
                              className="mt-4 mb-4 ms-1"
                              onClick={handleImageRemove}
                            >
                              <div className={drawerStyle.imgCover}>
                                <img
                                  src={base64 || values?.compLogo}
                                  alt="Uploaded"
                                  className="my-4 mb-3"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className={`d-flex flex-column mt-2 ms-1`}>
                              <span className={`mb-2 ${drawerStyle.imgTit}`}>
                                Upload Logo
                              </span>

                              <Button
                                variant="contained"
                                size="large"
                                component="label"
                                sx={{ textTransform: "none" }}
                                className={`mb-1 ${drawerStyle.addBtn}`}
                                fullWidth
                              >
                                <div
                                  className={`${drawerStyle.btnInner} d-flex flex-column justify-content-center align-items-center`}
                                >
                                  <AddIcon className={drawerStyle.icon} />
                                  <span
                                    className={`mt-3 ${drawerStyle.btnText}`}
                                  >
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
                                <span style={{ color: "#B20000" }}>
                                  NOTE :{" "}
                                </span>
                                PNG, JPG file formats are allowed
                              </span>
                            </div>
                          )}
                        </Box>
                      );
                    } else {
                      return (
                        <FormControl
                          fullWidth
                          error={Boolean(checkData)}
                          sx={{ mt: 2 }}
                          key={data?.name}
                        >
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
                              shrink: data?.shrink,
                              style: data?.shrink
                                ? undefined
                                : { fontSize: 14, color: "#535353" },
                            }}
                          />
                          {checkData && (
                            <FormHelperText error>
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
              <Box sx={{ height: "5rem" }}></Box>
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
                  type="button"
                  className={drawerStyle.clearBtn}
                  sx={{ textTransform: "none" }}
                  onClick={() => {
                    resetForm();
                    setOpen([true, null]);
                  }}
                >
                  Clear
                </Button>

                {loading && loading ? (
                  <>
                    <Button
                      fullWidth
                      disableElevation
                      className={drawerStyle.submitBtn}
                      sx={{ textTransform: "none" }}
                    >
                      <CircularProgress /> Submitting...
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      fullWidth
                      disableElevation
                      disabled={isSubmitting}
                      type="submit"
                      className={drawerStyle.submitBtn}
                      sx={{ textTransform: "none" }}
                    >
                      Submit
                    </Button>
                  </>
                )}
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
