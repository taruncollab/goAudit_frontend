import {
  Button,
  Card,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from "@mui/material/Checkbox";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Rectangle,
} from "recharts";
import { getFormbyLocId } from "../../apis/formSlice";
import compareCSS from "./compare.module.scss";
import moment from "moment";
import { getAllCompanies } from "../../apis/companySlice";
import { getAllLocations } from "../../apis/locationSlice";

const CompareScore = () => {
  const { comp } = useSelector((state) => state.companyData);
  const { location } = useSelector((state) => state.locationData);
  const dispatch = useDispatch();

  const [values, setValues] = useState({
    compId: "",
    locId: "",
    records: [],
  });
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [showSelected, setShowSelected] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const callApi = () => {
      dispatch(getAllCompanies());
      dispatch(getAllLocations());
    }
    callApi();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const getRecords = async (event) => {
    event.preventDefault();

    const res = await dispatch(getFormbyLocId(values.locId));

    if (res?.payload?.data) {
      setValues((prevValues) => ({
        ...prevValues,
        records: res.payload.data,
      }));
      setVisible(true);
    }
  };

  const handleCheckboxChange = (record) => {
    setSelectedRecords((prevSelected) => {
      if (prevSelected.includes(record)) {
        prevSelected.splice(prevSelected.indexOf(record), 1);
        setShowSelected(false);
      } else {
        prevSelected.push(record);
        setShowSelected(false);
      }
      return [...prevSelected];
    });
  };

  const handleCompare = () => {
    setShowSelected(true);
  };

  const formatTime = (dateStr) => {
    // Parse the date string and return only the time part
    const date = new Date(dateStr);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };
  return (
    <>
      <Grid container alignItems={"flex-end"} spacing={2}>
        <Grid item xs={12} container justifyContent={"space-between"}>
          <Typography className={compareCSS.title}>COMPARE SCORES</Typography>
        </Grid>

        <Grid item xs={12} md={5}>
          <Stack spacing={1} ml={{ xs: 2, md: 2 }} mr={{ xs: 2, md: 1 }}>
            <InputLabel htmlFor="compId">Company</InputLabel>
            <Select
              id="compId"
              name="compId"
              value={values?.compId}
              size="small"
              fullWidth
              onChange={handleChange}
              placeholder="Select Organization"
            >
              {comp &&
                comp.map((c, index) => {
                  return (
                    <MenuItem key={index} value={c?._id}>
                      {c?.name}
                    </MenuItem>
                  );
                })}
            </Select>
          </Stack>
        </Grid>
        <Grid item xs={12} md={5}>
          <Stack spacing={1} ml={{ xs: 2, md: 1 }} mr={{ xs: 2, md: 2 }}>
            <InputLabel htmlFor="locId">Location</InputLabel>
            <Select
              id="locId"
              name="locId"
              value={values?.locId}
              size="small"
              fullWidth
              onChange={handleChange}
              placeholder="Select Location"
            >
              {location &&
                location
                  ?.filter((l) => values?.compId === l?.compId)
                  .map((l, index) => (
                    <MenuItem key={index} value={l?._id}>
                      {l?.locName}
                    </MenuItem>
                  ))}
            </Select>
          </Stack>
        </Grid>

        <Grid item mt={2} mr={3} mb={0.6} ml={{ xs: 2, md: 2 }}>
          <Button className={compareCSS.findBtn} onClick={getRecords}>
            Find
          </Button>
        </Grid>
      </Grid>

      {values &&
        values.records.map((r, i) => {
          const dateField = r?.dateField;
          const formattedDate = dateField
            ? moment(dateField).format("DD-MM-YYYY")
            : "";
          const formattedTime = dateField
            ? moment(dateField).format("HH:mm:ss")
            : "";
          return (
            <>
              <Grid ml={2} mr={13} mt={3} key={i}>
                <Card key={i}>
                  <Grid container p={1}>
                    <Grid item xs={12} md={12}>
                      <Grid
                        container
                        alignItems={"center"}
                        item
                        xs={12}
                        md={12}
                      >
                        <Grid
                          item
                          xs={12}
                          md={10}
                          justifyContent={"left"}
                          alignItems={"center"}
                        >
                          <Grid container alignItems={"center"}>
                            <Grid item xs={12} md={1}>
                              <Checkbox
                                checked={selectedRecords.includes(r)}
                                onChange={() => handleCheckboxChange(r)}
                                aria-label="label"
                              />
                            </Grid>
                            <Grid container item xs={6} md={11}>
                              <Grid item xs={12} md={3}>
                                <span className={compareCSS.dateTimeKey}>
                                  Date:{" "}
                                </span>
                                {formattedDate}
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <span className={compareCSS.dateTimeKey}>
                                  Time:{" "}
                                </span>
                                {formattedTime}
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item md={2} container justifyContent={"flex-end"}>
                          <Typography
                            variant="h5"
                            component="div"
                            className={compareCSS.score}
                          >
                            Score: {r?.score}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </>
          );
        })}

      {visible && values.records != 0 ? (
        <Grid container justifyContent={"flex-end"} pt={2} pr={13} pb={2}>
          <Button variant="contained" color="warning" onClick={handleCompare}>
            Compare
          </Button>
        </Grid>
      ) : (
        <></>
      )}

      {showSelected && selectedRecords.length > 0 && (
        <Grid item ml={2} mt={2}>
          <Typography variant="h6" className={compareCSS.score} mt={2}>
            Selected Records:
          </Typography>
          <Grid item ml={0} mt={3}>
            <BarChart
              width={500}
              height={300}
              data={selectedRecords}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dateField" tickFormatter={formatTime} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="score"
                fill="#B6083550"
                activeBar={<Rectangle fill="#2D9CDB50" stroke="B60835" />}
              />
            </BarChart>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default CompareScore;
