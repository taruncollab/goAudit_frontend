import { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import { Grid, Card, Typography, Box, Button, Stack } from "@mui/material";
import LiveUsers from "./LiveUsers";
import userCSS from "./users.module.scss";
import DeletedUsers from "./DeletedUsers";
import { useDispatch, useSelector } from "react-redux";
import FormDrawer from "../../components/Drawer/FormDrawer";
import { getLocations, updateLocationbyid } from "../../apis/locationSlice";
import { toast } from "react-toastify";
import { getCompanies } from "../../apis/companySlice";
import { debounce } from "lodash";
import Swal from "sweetalert2";
import {
  AddLocationAlt as AddLocationAltIcon,
  WhereToVote as WhereToVoteIcon,
  FmdBad as FmdBadIcon,
} from "@mui/icons-material";
import { createUser, updateUser } from "../../apis/authSlice";

// ==============================|| DASHBOARD DEFAULT ||============================== //
const Users = () => {
  const [showLive, setShowLive] = useState(true);
  const [formDrawer, setFormDrawer] = useState([false, null]);
  const [orgOptions, setOrgOptions] = useState([]);
  const [locOptions, setLocOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState([]);
  const [locSelectedValue, setLocSelectedValue] = useState([]);
  const [locInputValue, setLocInputValue] = useState("");

  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.authData);
  const { locationLoading } = useSelector((state) => state.locationData);

  const fetchOptions = useCallback(
    debounce(async (query) => {
      try {
        let response = await dispatch(getCompanies({ search: query }));

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

  const handleLocInputChange = (event, newInputValue) => {
    setLocInputValue(newInputValue);
  };

  const fetchLocOptions = useCallback(
    debounce(async (query) => {
      try {
        let response = await dispatch(getLocations({ search: query }));

        if (response?.type?.includes("fulfilled")) {
          const searchData = response?.payload?.data?.map((item) => ({
            label: item?.locName,
            value: item?._id,
          }));

          setLocOptions(searchData);
        }
      } catch (error) {
        toast.error("Error fetching options:", error);
      }
    }, 1000),
    [dispatch]
  );

  useEffect(() => {
    if (locInputValue !== undefined) {
      fetchLocOptions(locInputValue);
    }
  }, [locInputValue, fetchLocOptions]);

  //Submit-------------------------------------

  const submitFun = async (values) => {
    if (formDrawer[1] !== null) {
      const res = await dispatch(
        updateUser({
          ...values,
          compId: selectedValue,
          locId: locSelectedValue,
        })
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
        createUser({
          ...values,
          compId: selectedValue,
          locId: locSelectedValue,
          createdBy: auth?._id,
        })
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
      mutiple: true,
    },
    {
      title: "Select or Search Location",
      name: "locId",
      type: "select",
      options: locOptions,
      add: true,
      edit: true,
      mutiple: true,
    },
    {
      title: "Name",
      name: "name",
      type: "text",
      validate: Yup.string().min(2).required("Location Name is required"),
      required: true,
      add: true,
      edit: true,
    },
    {
      title: "Email",
      name: "email",
      type: "email",
      validate: Yup.string().min(2).required("Location Code is required"),
      add: true,
      edit: true,
    },
    {
      title: "Phone",
      name: "phone",
      type: "number",
      validate: Yup.string().min(2).required("Location Code is required"),
      add: true,
      edit: true,
    },
  ];

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Box>
            <Typography className={userCSS.title}>USERS</Typography>
          </Box>
          <Card className={userCSS.card}>
            <Box className={userCSS.tab}>
              <Grid container justifyContent={"space-between"}>
                <Stack direction={"row"} className="ms-4 mt-2">
                  <Button
                    className={` ${
                      showLive ? userCSS.activeTabs : userCSS.tabs
                    }`}
                    onClick={() => setShowLive(true)}
                  >
                    <WhereToVoteIcon sx={{ mr: 1 }} /> Users
                  </Button>
                  <Button
                    className={` ${
                      showLive ? userCSS.tabs : userCSS.activeTabs
                    }`}
                    onClick={() => setShowLive(false)}
                  >
                    <FmdBadIcon sx={{ mr: 1 }} /> Deleted / Archived
                  </Button>
                </Stack>
                <Box>
                  <Button
                    variant="contained"
                    className={`me-4 ${userCSS.addBtn}`}
                    onClick={() => setFormDrawer([true, null])}
                  >
                    <AddLocationAltIcon sx={{ mr: 1 }} /> Add
                  </Button>
                </Box>
              </Grid>

              {showLive ? (
                <LiveUsers
                  setSelectedValue={setSelectedValue}
                  selectedValue={selectedValue}
                  locSelectedValue={locSelectedValue}
                  setLocSelectedValue={setLocSelectedValue}
                  form={inputForm}
                />
              ) : (
                <DeletedUsers />
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Dynamic Form */}
      <FormDrawer
        anchor="right"
        title="Add User"
        editTitle="Edit User"
        form={inputForm}
        submitFun={submitFun}
        open={formDrawer}
        setOpen={setFormDrawer}
        setInputValue={setInputValue}
        inputValue={inputValue}
        handleInputChange={handleInputChange}
        setSelectedValue={setSelectedValue}
        selectedValue={selectedValue}
        loading={locationLoading}
        locSelectedValue={locSelectedValue}
        setLocSelectedValue={setLocSelectedValue}
        handleLocInputChange={handleLocInputChange}
        locInputValue={locInputValue}
        setLocInputValue={setLocInputValue}
      />
    </>
  );
};

export default Users;
