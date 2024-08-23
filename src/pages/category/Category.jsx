import { useState } from "react";
import * as Yup from "yup";
import { Grid, Card, Typography, Box, Button, Stack } from "@mui/material";
import categoryCss from "./category.module.scss";
import DeletedLocation from "./DeletedCategory";
import { useDispatch, useSelector } from "react-redux";
import FormDrawer from "../../components/Drawer/FormDrawer";
import Swal from "sweetalert2";
import LiveCategory from "./LiveCategory";
import {
  addCategory,
  getCategories,
  updateCategorybyid,
} from "../../apis/categorySlice";
import {
  Category as CategoryIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const Category = () => {
  const [showLive, setShowLive] = useState(true);
  const [formDrawer, setFormDrawer] = useState([false, null]);
  const [inputValue, setInputValue] = useState("");

  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.authData);

  //Search-------------------------------------

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  //Submit----Add & Update---------------------------------

  const submitFun = async (values) => {
    if (formDrawer[1] !== null) {
      const res = await dispatch(updateCategorybyid(values));
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
        addCategory({ ...values, createdBy: auth?._id })
      );
      if (res.type.includes("fulfilled")) {
        setFormDrawer([false, null]);
        dispatch(getCategories({}));
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
      title: "Category Name",
      name: "name",
      type: "text",
      validate: Yup.string().min(2).required("Category Name is required"),
      required: true,
      add: true,
      edit: true,
    },
  ];

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Box>
            <Typography className={categoryCss.title}>Category</Typography>
          </Box>
          <Card className={categoryCss.card}>
            <Box className={categoryCss.tab}>
              <Grid container justifyContent={"space-between"}>
                <Stack direction={"row"} className="ms-4 mt-2">
                  <Button
                    className={` ${
                      showLive ? categoryCss.activeTabs : categoryCss.tabs
                    }`}
                    onClick={() => setShowLive(true)}
                  >
                    <CategoryIcon sx={{ mr: 1 }} /> Category
                  </Button>
                  <Button
                    className={` ${
                      showLive ? categoryCss.tabs : categoryCss.activeTabs
                    }`}
                    onClick={() => setShowLive(false)}
                  >
                    <DeleteIcon sx={{ mr: 1 }} /> Deleted / Archived
                  </Button>
                </Stack>
                <Box>
                  <Button
                    variant="contained"
                    className={`me-4 ${categoryCss.addBtn}`}
                    onClick={() => setFormDrawer([true, null])}
                  >
                    <CategoryIcon sx={{ mr: 1 }} /> Add
                  </Button>
                </Box>
              </Grid>

              {showLive ? (
                <LiveCategory form={inputForm} />
              ) : (
                <DeletedLocation />
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      <FormDrawer
        anchor="right"
        title="Add Category"
        editTitle="Edit Category"
        form={inputForm}
        submitFun={submitFun}
        open={formDrawer}
        setOpen={setFormDrawer}
        setInputValue={setInputValue}
        inputValue={inputValue}
        handleInputChange={handleInputChange}
      />
    </>
  );
};

export default Category;
