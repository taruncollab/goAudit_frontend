import {
  Autocomplete,
  Button,
  Card,
  CardActions,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from "@mui/material/Checkbox";
import { getFormbyLocId } from "../../apis/formSlice";
import compareCSS from "./compare.module.scss";
import moment from "moment";
import { getCompanies } from "../../apis/companySlice";
import { getLocationbyCompid } from "../../apis/locationSlice";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import debounce from "lodash.debounce";
import { toast } from "react-toastify";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import scoreImage from "/img/Score.jpg";
import Swal from "sweetalert2";
import Chart from "./Chart";

const CompareScore = () => {
  const dispatch = useDispatch();

  const [values, setValues] = useState({
    compId: "",
    locId: "",
    records: [],
  });

  const [selectedRecords, setSelectedRecords] = useState([]);
  const [showSelected, setShowSelected] = useState(false);
  const [visible, setVisible] = useState(false);
  const [compSearchInput, setCompSearchInput] = useState("");
  const [compOptions, setCompOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);

  // Company Search-------------------------------------

  const fetchOptions = useCallback(
    debounce(async (query) => {
      try {
        let response;

        if (query?.length === 0) {
          response = await dispatch(getCompanies({}));
        } else {
          response = await dispatch(getCompanies({ search: query }));
        }

        if (response?.type?.includes("fulfilled")) {
          const searchData = response?.payload?.data?.map((item) => ({
            label: item?.name,
            value: item?._id,
          }));

          setCompOptions(searchData);
        }
      } catch (error) {
        toast.error("Error fetching options:", error);
      }
    }, 1000),
    [dispatch]
  );

  useEffect(() => {
    if (compSearchInput !== undefined) {
      fetchOptions(compSearchInput);
    }
  }, [compSearchInput, fetchOptions]);

  // Location Search-------------------------------------

  const fetchLocationOptions = useCallback(
    debounce(async (query) => {
      try {
        let response = await dispatch(getLocationbyCompid({ id: query }));

        if (response?.type?.includes("fulfilled")) {
          if (response?.payload?.data?.length > 0) {
            const locationData = response?.payload?.data?.map((item) => ({
              label: item?.locName,
              value: item?._id,
            }));

            setLocationOptions(locationData);
          } else if (response?.payload?.data?.length == 0) {
            setLocationOptions([]);
            toast.warning("No Location Found");
          }
        }
      } catch (error) {
        toast.error("Error fetching options:", error);
      }
    }, 1000),
    [dispatch, values?.compId?.value]
  );

  useEffect(() => {
    if (values?.compId?.value !== undefined) {
      fetchLocationOptions(values?.compId?.value);
    }
  }, [values?.compId?.value, fetchLocationOptions]);

  //----------------------------------------------------

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  //Get Records====================================

  const getRecords = async (event) => {
    event.preventDefault();

    const res = await dispatch(getFormbyLocId(values.locId?.value));

    if (res?.type?.includes("fulfilled")) {
      if (res?.payload?.data.length > 0) {
        setValues((prevValues) => ({
          ...prevValues,
          records: res?.payload?.data,
        }));
        setVisible(true);
      } else if (res?.payload?.data?.length == 0) {
        Swal.fire({
          title: "No Data Found",
          icon: "warning",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    }
  };

  const handleCheckboxChange = (record) => {
    setSelectedRecords((prevSelected) => {
      if (prevSelected?.includes(record)) {
        prevSelected?.splice(prevSelected.indexOf(record), 1);
        setShowSelected(false);
      } else {
        prevSelected?.push(record);
        setShowSelected(false);
      }
      return [...prevSelected];
    });
  };

  const handleCompare = () => {
    if (selectedRecords?.length < 1) {
      Swal.fire({
        title: "No Records Selected",
        icon: "warning",
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
    setShowSelected(true);
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };
  return (
    <>
      <Card
        sx={{
          bgcolor: "white",
          p: 2,
          borderRadius: "10px",
          marginTop: { xs: 3, md: 2 },
          marginRight: { xs: 0, md: 2 },
        }}
      >
        <Grid container alignItems={"flex-end"} spacing={2}>
          <Grid item xs={12} container justifyContent={"space-between"}>
            <Typography className={compareCSS.title}>
              <img
                src="/img/compare logo.jpg"
                alt="logo"
                style={{ width: 35 }}
              />{" "}
              COMPARE SCORES
            </Typography>
          </Grid>

          <Grid item xs={12} md={5}>
            <Stack spacing={1} ml={{ xs: 2, md: 2 }} mr={{ xs: 2, md: 1 }}>
              <Autocomplete
                id="compId"
                name="compId"
                options={compOptions}
                getOptionLabel={(option) => option?.label || ""}
                value={values?.compId || null}
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: "compId",
                      value: newValue || "",
                    },
                  });
                }}
                inputValue={compSearchInput}
                onInputChange={(event, newInputValue) => {
                  setCompSearchInput(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Company"
                    size="small"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <Stack spacing={1} ml={{ xs: 2, md: 1 }} mr={{ xs: 2, md: 2 }}>
              <Autocomplete
                id="locId"
                name="locId"
                options={locationOptions}
                getOptionLabel={(option) => option?.label || ""}
                value={values?.locId || null}
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: "locId",
                      value: newValue || "",
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Location"
                    size="small"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Stack>
          </Grid>

          <Grid item mt={2} mr={3} mb={0.6} ml={{ xs: 2, md: 2 }}>
            <Button className={compareCSS.findBtn} onClick={getRecords}>
              <ContentPasteSearchIcon sx={{ mr: 1 }} /> Find
            </Button>
          </Grid>

          {visible && values?.records != 0 && (
            <Grid container justifyContent={"flex-start"} pt={2} pl={4}>
              <Button
                variant="outlined"
                color="warning"
                onClick={handleCompare}
              >
                <CompareArrowsIcon sx={{ mr: 1 }} /> Compare
              </Button>
            </Grid>
          )}

          <Grid
            container
            spacing={2}
            ml={2}
            mr={13}
            mt={3}
            sx={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {values &&
              values?.records?.map((r, i) => {
                const dateField = r?.dateField;
                const formattedDate = dateField
                  ? moment(dateField).format("DD-MM-YYYY")
                  : "";
                const formattedTime = dateField
                  ? moment(dateField).format("HH:mm:ss")
                  : "";
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                    <Card
                      sx={{
                        borderRadius: "15px",
                        boxShadow: 5,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        overflow: "hidden",
                      }}
                    >
                      <CardMedia
                        component="img"
                        alt="Card image"
                        height="140"
                        image={scoreImage}
                        sx={{
                          borderTopLeftRadius: "15px",
                          borderTopRightRadius: "15px",
                          objectFit: "contain",
                          opacity: 0.9,
                        }}
                      />
                      <CardContent
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          padding: 1,
                          height: "100%",
                          boxSizing: "border-box",
                        }}
                      >
                        <Grid container spacing={1} alignItems="center">
                          <Grid
                            item
                            xs={12}
                            md={2}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Checkbox
                              checked={selectedRecords?.includes(r)}
                              onChange={() => handleCheckboxChange(r)}
                              aria-label="label"
                              color="warning"
                            />
                          </Grid>

                          <Grid item xs={12} md={10}>
                            <Typography
                              variant="body2"
                              sx={{ marginBottom: 1 }}
                            >
                              Date: {formattedDate}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ marginBottom: 1 }}
                            >
                              Time: {formattedTime}
                            </Typography>
                            <Typography variant="h7" component="div">
                              Score:{" "}
                              <span
                                style={{
                                  color: "rgb(218 73 58)",
                                  fontSize: "20px",
                                }}
                              >
                                {r?.score}
                              </span>
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>

          {values?.records?.length == 0 && (
            <>
              <Grid item xs={12} display="flex" justifyContent="center" mt={2}>
                <img src="/img/compare1.jpg" alt="compare" />
              </Grid>
            </>
          )}
        </Grid>

        {showSelected && selectedRecords?.length > 0 && (
          <>
            <Chart
              open={showSelected && selectedRecords?.length > 0}
              handleClose={() => setShowSelected(false)}
              selectedRecords={selectedRecords}
              formatTime={formatTime}
            />
          </>
        )}
      </Card>
    </>
  );
};

export default CompareScore;
