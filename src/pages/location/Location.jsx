import { useState } from "react";
import * as Yup from "yup";
import {
  Grid,
  Card,
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  Stack,
} from "@mui/material";
import LiveLocations from "./LiveLocations";
import locationCSS from "./location.module.scss";
import DeletedLocation from "./DeletedLocation";
import { useDispatch, useSelector } from "react-redux";
import FormDrawer from "../../components/Drawer/FormDrawer";
import { addLocation, updateLocationbyid } from "../../apis/locationSlice";
import { toast } from "react-toastify";

// ==============================|| DASHBOARD DEFAULT ||============================== //
const Location = () => {
  const [value, setValue] = useState(0);
  const [showLive, setShowLive] = useState(true);
  const [formDrawer, setFormDrawer] = useState([false, null]);

  const dispatch = useDispatch();
  const { comp } = useSelector((state) => state.companyData);
  const { auth } = useSelector((state) => state.authData);

  const submitFun = async (values) => {
    if (formDrawer[1] !== null) {
      const res = await dispatch(updateLocationbyid(values));
      if (res.type.includes("fulfilled")) {
        setFormDrawer([false, null])
        toast.success("Location Data Updated successfully")
      }
    } else {
      const res = await dispatch(addLocation({...values, createdBy: auth._id}));
      if (res.type.includes("fulfilled")) {
        setFormDrawer([false, null])
        toast.success("Location added successfully")
      }
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const inputForm = [
    {
      title: "Select Company",
      name: "compId",
      type: "select",
      options: comp,
      add: true,
      edit: true,
    },
    {
      title: "Location Name",
      name: "locName",
      type: "text",
      validate: Yup.string().min(2).required("Location Name is required"),
      required: true,
      add: true,
      edit: true,
    },
    {
      title: "Location Code",
      name: "locationCode",
      type: "number",
      add: true,
      edit: true,
    },
    {
      title: "Full Address",
      name: "address",
      type: "text",
      multiline: true,
      add: true,
      edit: true,
    },
    {
      title: "Postcode/Zipcode",
      name: "postCode",
      type: "number",
      add: true,
      edit: true,
    },
    {
      title: "To Email",
      name: "toMail",
      type: "email",
      validate: Yup.string().email(),
      add: true,
      edit: true,
    },
    {
      title: "Cc Email",
      name: "ccMail",
      type: "email",
      validate: Yup.string().email(),
      add: true,
      edit: true,
    },
  ];

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Box>
            <Typography className={locationCSS.title}>LOCATION</Typography>
          </Box>
          <Card className={locationCSS.card}>
            <Box className={locationCSS.tab}>
              <Grid container justifyContent={"space-between"}>
                <Stack direction={"row"} className="ms-4 mt-2">
                  <Button
                    className={` ${
                      showLive ? locationCSS.activeTabs : locationCSS.tabs
                    }`}
                    onClick={() => setShowLive(true)}
                  >
                    Locations
                  </Button>
                  <Button
                    className={` ${
                      showLive ? locationCSS.tabs : locationCSS.activeTabs
                    }`}
                    onClick={() => setShowLive(false)}
                  >
                    Deleted / Archived
                  </Button>
                </Stack>
                <Box>
                  <Button
                    variant="contained"
                    className={`me-4 ${locationCSS.addBtn}`}
                    onClick={() => setFormDrawer([true, null])}
                  >
                    Add
                  </Button>
                </Box>
              </Grid>

              {showLive ? <LiveLocations /> : <DeletedLocation />}
            </Box>
          </Card>
        </Grid>
      </Grid>

      <FormDrawer
        anchor="right"
        title="Add Location"
        editTitle="Edit Location"
        form={inputForm}
        submitFun={submitFun}
        open={formDrawer}
        setOpen={setFormDrawer}
      />
    </>
  );
};

export default Location;
