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
import {
  Edit as EditIcon,
  CorporateFare as CorporateFareIcon,
} from "@mui/icons-material";
import {
  deleteLocationbyid,
  getLocations,
  updateLocationbyid,
} from "../../apis/locationSlice";
import locationCSS from "./users.module.scss";
import FormDrawer from "../../components/Drawer/FormDrawer";
import Swal from "sweetalert2";
import useHandleDelete from "../../common/DeleteFunction";
import LoadingTable from "../../common/loadingTable";
import { getUsers, updateUser } from "../../apis/authSlice";

const LiveUsers = (props) => {
  const {
    setSelectedValue,
    selectedValue,
    form,
    locSelectedValue,
    setLocSelectedValue,
  } = props;
  const dispatch = useDispatch();

  const { auth, users } = useSelector((state) => state.authData);
  const { totalPages, locationLoading } = useSelector(
    (state) => state.locationData
  );

  //State Zone---------------------

  const [formDrawer, setFormDrawer] = useState([false, null]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  //Effect Zone---------------------

  useEffect(() => {
    dispatch(getUsers({ page: currentPage, limit: 5, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  //---For Pagination-----

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  //Handle Delete===================
  const handleDelete = useHandleDelete(deleteLocationbyid, "Location");

  //Edit-------------------------------------
  const handleEdit = (id) => {
    let data = users?.find((e) => e._id == id);

    data = {
      ...data,
      compId: data.compId,
      locId: data.locId,
    };

    setSelectedValue(data?.compId);
    setLocSelectedValue(data?.locId);
    setFormDrawer([true, data]);
  };

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
        setSelectedValue(null);
        setFormDrawer([false, null]);
        Swal.fire({
          title: "Success",
          text: res.payload.message,
          icon: "success",
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        dispatch(getLocations({}));
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
      headerClassName: locationCSS.headers,
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
              onClick={() => handleEdit(params.row._id)}
              className={locationCSS.editBtnBG}
            >
              <EditIcon className={locationCSS.editBtn} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => {
                handleDelete({ id: params?.row?._id, dId: auth?._id });
              }}
              className={locationCSS.deleteBtnBG}
            >
              <GridDeleteIcon className={locationCSS.deleteBtn} />
            </IconButton>
          </Stack>
        </>
      ),
    },

    {
      field: "compId",
      headerName: (
        <b>
          <span>
            COMPANY/
            <br />
            DEPARTMENT
          </span>
        </b>
      ),
      headerAlign: "center",
      headerClassName: locationCSS.headers,
      disableColumnMenu: true,
      sortable: false,
      align: "left",
      width: 270,
      renderCell: (params) => {
        // Ensure the renderCell function returns the JSX
        return params?.row?.compId ? (
          <Chip
            label={
              params?.row?.compId?.map((item) => item.label) ||
              "No Company Name"
            }
            variant="outlined"
            sx={{ borderColor: "#0672BC", color: "#0672BC" }}
            icon={<CorporateFareIcon />}
          />
        ) : (
          <span>No Data</span>
        );
      },
    },
    {
      field: "locId",
      headerName: (
        <b>
          <span>LOCATION</span>
        </b>
      ),
      headerAlign: "center",
      headerClassName: locationCSS.headers,
      disableColumnMenu: true,
      sortable: false,
      align: "left",
      width: 270,
      renderCell: (params) => {
        // Ensure the renderCell function returns the JSX
        return params?.row?.locId ? (
          <Chip
            label={
              `${params?.row?.locId?.map((item) => item.label)}` ||
              "No Company Name"
            }
            variant="outlined"
            sx={{ borderColor: "#0672BC", color: "#0672BC" }}
            icon={<CorporateFareIcon />}
          />
        ) : (
          <span>No Data</span>
        );
      },
    },

    {
      field: "name",
      headerName: <b> NAME </b>,
      headerAlign: "center",
      headerClassName: locationCSS.headers,
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 140,
    },
    {
      field: "email",
      headerName: <b> EMAIL </b>,
      headerAlign: "center",
      headerClassName: locationCSS.headers,
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 300,
    },
    {
      field: "phone",
      headerName: <b> PHONE </b>,
      headerAlign: "center",
      headerClassName: locationCSS.headers,
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 280,
    },
  ];

  return (
    <>
      <Grid item md={4} xs={4} ml={4} mt={2} mr={3}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search Users"
          onChange={searchData}
          className={locationCSS.searchBar}
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
        {locationLoading ? (
          <LoadingTable />
        ) : users && users?.length > 0 ? (
          <DataGrid
            rows={users}
            columns={columns}
            className={locationCSS.mainGrid}
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
        title="Add Users"
        editTitle="Edit Users"
        form={form}
        submitFun={submitFun}
        open={formDrawer}
        setOpen={setFormDrawer}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
        locSelectedValue={locSelectedValue}
        setLocSelectedValue={setLocSelectedValue}
      />
    </>
  );
};

export default LiveUsers;
