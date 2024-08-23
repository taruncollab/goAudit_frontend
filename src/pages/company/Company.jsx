import { useState } from "react";
import { Grid, Card, Typography, Box, Stack, Button } from "@mui/material";
import companyCSS from "./company.module.scss";
import LiveCompanies from "./LiveCompanies";
import DeletedCompanies from "./DeletedCompanies";
import FormDrawer from "../../components/Drawer/FormDrawer";
import * as Yup from "yup";
import {
  addCompany,
  getCompanies,
  updateCompanybyid,
} from "../../apis/companySlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  CorporateFare as CorporateFareIcon,
  Delete as DeleteIcon,
  DomainAdd as DomainAddIcon,
} from "@mui/icons-material";

// ==============================|| Company Screen || DEFAULT ||============================== //

const Company = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.authData);

  //State Zone--------------------------
  const [showLive, setShowLive] = useState(true);
  const [upload, setUpload] = useState(null);
  const [base64, setBase64] = useState(null);
  const [formDrawer, setFormDrawer] = useState([false, null]);

  //Effect Zone--------------------------

  const inputForm = [
    {
      title: "Upload Logo",
      name: "compLogo",
      type: "file",
      shrink: true,
      add: true,
      edit: true,
    },
    {
      title: "Company / Department",
      name: "name",
      type: "text",
      validate: Yup.string().min(2).required("Name is required"),
      required: true,
      add: true,
      edit: true,
    },
    {
      title: "Short Name",
      name: "shortName",
      type: "text",
      validate: Yup.string().min(2),
      add: true,
      edit: true,
    },
  ];

  //Function Zone--------------------------

  const handleSelectedFile = (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result;

      setUpload(file.name);

      setBase64(base64String);
    };

    reader.onerror = (error) => {
      console.error("Error uploading file:", error);
    };
  };

  //Submit--------------------------
  const submitFun = async (values) => {
    if (formDrawer[1] !== null) {
      const res = await dispatch(updateCompanybyid(values));

      if (res.type.includes("fulfilled")) {
        setFormDrawer([false, null]);
        toast.success("Company Data updated successfully");
      }
    } else {
      const res = await dispatch(
        addCompany({ ...values, createdBy: auth._id, compLogo: base64 })
      );
      if (res.type.includes("fulfilled")) {
        setFormDrawer([false, null]);
        setUpload(null);
        setBase64(null);
        toast.success("Company added successfully");
        dispatch(getCompanies({}));
      }
    }
  };

  const resetFormData = () => {
    setUpload(null);
    setBase64(null);
    setFormDrawer([true, null]);
  };
  const closeForm = () => {
    setUpload(null);
    setBase64(null);
    setFormDrawer([false, null]);
  };

  return (
    <>
      <Grid container className={companyCSS.main}>
        <Grid item xs={12}>
          <Box>
            <Typography className={companyCSS.title}>COMPANY</Typography>
          </Box>
          <Card className={companyCSS.card}>
            <Box className={companyCSS.tab}>
              <Stack
                direction={"row"}
                ml={4}
                mt={2}
                justifyContent={"space-between"}
              >
                <Grid>
                  <Button
                    className={` ${
                      showLive ? companyCSS.activeTabs : companyCSS.tabs
                    }`}
                    onClick={() => setShowLive(true)}
                  >
                    <CorporateFareIcon sx={{ mr: 1 }} /> All Companies
                  </Button>

                  <Button
                    className={` ${
                      showLive ? companyCSS.tabs : companyCSS.activeTabs
                    }`}
                    onClick={() => setShowLive(false)}
                  >
                    <DeleteIcon sx={{ mr: 1 }} /> Deleted / Archived
                  </Button>
                </Grid>

                <Grid mr={3}>
                  <Button
                    className={companyCSS.activeTabs}
                    onClick={() => setFormDrawer([true, null])}
                  >
                    <DomainAddIcon sx={{ mr: 1 }} /> Add
                  </Button>
                </Grid>
              </Stack>

              {showLive ? <LiveCompanies /> : <DeletedCompanies />}
            </Box>
          </Card>
        </Grid>
      </Grid>

      <FormDrawer
        anchor="right"
        title="ADD COMPANY"
        editTitle="EDIT COMPANY"
        form={inputForm}
        upload={upload}
        setUpload={setUpload}
        setBase64={setBase64}
        base64={base64}
        uploadFun={handleSelectedFile}
        submitFun={submitFun}
        open={formDrawer}
        setOpen={setFormDrawer}
        resetFormData={resetFormData}
        closeForm={closeForm}
      />
    </>
  );
};

export default Company;
