import { useEffect, useState } from "react";
import {
  IconButton,
  Box,
  Grid,
  Stack,
  TextField,
  Chip,
  Pagination,
} from "@mui/material";
import { DataGrid, GridDeleteIcon } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import categoryCss from "./category.module.scss";
import FormDrawer from "../../components/Drawer/FormDrawer";
import Swal from "sweetalert2";
import useHandleDelete from "../../common/DeleteFunction";
import LoadingTable from "../../common/loadingTable";
import {
  Category as CategoryIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

import {
  deleteCategorybyid,
  getCategories,
  updateCategorybyid,
} from "../../apis/categorySlice";

const LiveCategory = (props) => {
  const { form } = props;
  const dispatch = useDispatch();

  const { auth } = useSelector((state) => state.authData);
  const { category, totalPages, loading } = useSelector(
    (state) => state.categoryData
  );

  //State Zone---------------------

  const [formDrawer, setFormDrawer] = useState([false, null]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  //Effect Zone---------------------

  useEffect(() => {
    dispatch(
      getCategories({ page: currentPage, limit: 5, search: searchTerm })
    );
  }, [dispatch, currentPage, searchTerm]);

  //---For Pagination-----

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  //Handle Delete===================
  const handleDelete = useHandleDelete(deleteCategorybyid, "Category");

  //Edit-------------------------------------
  const handleEdit = (id) => {
    const data = category?.find((e) => e._id == id);
    setFormDrawer([true, data]);
  };

  //Submit-------------------------------------
  const submitFun = async (values) => {
    if (formDrawer[1] !== null) {
      const res = await dispatch(updateCategorybyid(values));

      if (res.type.includes("fulfilled")) {
        setFormDrawer([false, null]);
        Swal.fire({
          title: "Success",
          text: res.payload.message,
          icon: "success",
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    }
  };

  const searchData = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const columns = [
    {
      field: "action",
      headerName: <b> ACTION </b>,
      sortable: false,
      headerAlign: "center",
      headerClassName: categoryCss.headers,
      align: "center",
      disableColumnMenu: true,
      width: 150,
      renderCell: (params) => (
        <>
          <Stack
            gap={1}
            direction={"row"}
            justifyContent={"center"}
            height={"100%"}
            alignItems={"center"}
          >
            <IconButton
              size="small"
              onClick={() => handleEdit(params?.row?._id)}
              className={categoryCss.editBtnBG}
            >
              <EditIcon className={categoryCss.editBtn} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => {
                handleDelete({ id: params?.row?._id, dId: auth?._id });
              }}
              className={categoryCss.deleteBtnBG}
            >
              <GridDeleteIcon className={categoryCss.deleteBtn} />
            </IconButton>
          </Stack>
        </>
      ),
    },

    {
      field: "name",
      headerName: (
        <b>
          <span>Category Name</span>
        </b>
      ),
      headerAlign: "center",
      headerClassName: categoryCss.headers,
      disableColumnMenu: true,
      sortable: false,
      align: "left",
      width: 270,
      renderCell: (params) => {
        return (
          <Chip
            label={params?.row?.name || "No Category Name"}
            variant="outlined"
            sx={{ borderColor: "#0672BC", color: "#0672BC" }}
            icon={<CategoryIcon />}
          />
        );
      },
    },
  ];

  return (
    <>
      <Grid item md={4} xs={5} ml={4} mt={2} mr={3}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search Category"
          onChange={searchData}
          className={categoryCss.searchBar}
          InputProps={{
            disableUnderline: true,
            sx: {
              border: "none",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            },
          }}
        />
      </Grid>

      <Grid item md={12} xs={11} ml={4} mt={3} mr={3}>
        {loading ? (
          <LoadingTable />
        ) : category && category?.length > 0 ? (
          <DataGrid
            rows={category}
            columns={columns}
            className={categoryCss.mainGrid}
            autoHeight
            autoWidth
            pagination={false}
            sx={{
              margin: 0,
              "& .MuiDataGrid-root": {
                padding: 0,
              },
              "& .MuiDataGrid-filler": {
                backgroundColor: "#1182C574",
              },
            }}
            getRowId={(e) => e?._id}
            disableRowSelectionOnClick
          />
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <img src="/img/No data.gif" alt="No data available" height="200" />
          </Box>
        )}
      </Grid>

      <Box className="mt-3 mb-3">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#0672bc",
            },
            "& .MuiPaginationItem-page.Mui-selected": {
              backgroundColor: "#0672bc",
              color: "white",
            },
            "& .MuiPaginationItem-page:hover": {
              backgroundColor: "#0672bc",
              color: "black",
            },
          }}
        />
      </Box>

      <FormDrawer
        anchor="right"
        title="Add Category"
        editTitle="Edit Category"
        form={form}
        submitFun={submitFun}
        open={formDrawer}
        setOpen={setFormDrawer}
      />
    </>
  );
};

export default LiveCategory;
