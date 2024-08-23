import { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import { Grid, Card, Typography, Box, Button, Stack } from "@mui/material";
import LiveLocations from "./LiveLocations";
import locationCSS from "./location.module.scss";
import DeletedLocation from "./DeletedLocation";
import { useDispatch, useSelector } from "react-redux";
import FormDrawer from "../../components/Drawer/FormDrawer";
import {
  addLocation,
  getLocations,
  updateLocationbyid,
} from "../../apis/locationSlice";
import { toast } from "react-toastify";
import { getCompanies } from "../../apis/companySlice";
import { debounce } from "lodash";
import Swal from "sweetalert2";
import {
  AddLocationAlt as AddLocationAltIcon,
  WhereToVote as WhereToVoteIcon,
  FmdBad as FmdBadIcon,
} from "@mui/icons-material";

// ==============================|| DASHBOARD DEFAULT ||============================== //
const Location = () => {
  const [showLive, setShowLive] = useState(true);
  const [formDrawer, setFormDrawer] = useState([false, null]);
  const [orgOptions, setOrgOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);

  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.authData);

  //Search-------------------------------------

  const fetchOptions = useCallback(
    debounce(async (query) => {
      try {
        let response;
        // Fetch all companies if inputValue is empty, otherwise fetch based on search query

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

          setOrgOptions(searchData);
        }
      } catch (error) {
        toast.error("Error fetching options:", error);
      }
    }, 1000),
    [dispatch]
  );

  useEffect(() => {
    if (inputValue !== undefined) {
      fetchOptions(inputValue);
    }
  }, [inputValue, fetchOptions]);

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  //Submit-------------------------------------

  const submitFun = async (values) => {
    if (formDrawer[1] !== null) {
      const res = await dispatch(
        updateLocationbyid({ ...values, compId: selectedValue })
      );
      if (res.type.includes("fulfilled")) {
        setFormDrawer([false, null]);
        Swal.fire({
          title: "Success",
          text: res.payload.message,
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } else {
      const res = await dispatch(
        addLocation({ ...values, compId: selectedValue, createdBy: auth?._id })
      );
      if (res.type.includes("fulfilled")) {
        setFormDrawer([false, null]);
        dispatch(getLocations({}));
        Swal.fire({
          title: "Success",
          text: res.payload.message,
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    }
  };

  const inputForm = [
    {
      title: "Select or Search Company",
      name: "compId",
      type: "select",
      options: orgOptions,
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
      validate: Yup.string().min(2).required("Location Code is required"),
      add: true,
      edit: true,
    },
    {
      title: "Full Address",
      name: "address",
      type: "text",
      multiline: true,
      validate: Yup.string().min(2).required("Address is required"),
      add: true,
      edit: true,
    },
    {
      title: "Postcode/Zipcode",
      name: "postCode",
      type: "number",
      add: true,
      validate: Yup.string().min(2).required("Postcode is required"),
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
                    <WhereToVoteIcon sx={{ mr: 1 }} /> Locations
                  </Button>
                  <Button
                    className={` ${
                      showLive ? locationCSS.tabs : locationCSS.activeTabs
                    }`}
                    onClick={() => setShowLive(false)}
                  >
                    <FmdBadIcon sx={{ mr: 1 }} /> Deleted / Archived
                  </Button>
                </Stack>
                <Box>
                  <Button
                    variant="contained"
                    className={`me-4 ${locationCSS.addBtn}`}
                    onClick={() => setFormDrawer([true, null])}
                  >
                    <AddLocationAltIcon sx={{ mr: 1 }} /> Add
                  </Button>
                </Box>
              </Grid>

              {showLive ? (
                <LiveLocations
                  setSelectedValue={setSelectedValue}
                  selectedValue={selectedValue}
                  form={inputForm}
                />
              ) : (
                <DeletedLocation />
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Dynamic Form */}
      <FormDrawer
        anchor="right"
        title="Add Location"
        editTitle="Edit Location"
        form={inputForm}
        submitFun={submitFun}
        open={formDrawer}
        setOpen={setFormDrawer}
        setInputValue={setInputValue}
        inputValue={inputValue}
        handleInputChange={handleInputChange}
        setSelectedValue={setSelectedValue}
        selectedValue={selectedValue}
      />
    </>
  );
};

export default Location;
