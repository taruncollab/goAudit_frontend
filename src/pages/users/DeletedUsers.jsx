import { useEffect, useState } from "react";
import {
  IconButton,
  Box,
  Grid,
  Stack,
  TextField,
  Chip,
  Pagination,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import locationCSS from "./users.module.scss";
import {
  getDeletedLocations,
  restoreLocationbyid,
} from "../../apis/locationSlice";
import Swal from "sweetalert2";
import LoadingTable from "../../common/loadingTable";
import {
  RestorePage as RestorePageIcon,
  CorporateFare as CorporateFareIcon,
} from "@mui/icons-material";

const DeletedUsers = () => {
  const dispatch = useDispatch();

  const { delLocation, locationLoading, totalPages } = useSelector(
    (state) => state.locationData
  );

  //State Zone------------------------

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  //Effect Zone---------------------

  useEffect(() => {
    dispatch(
      getDeletedLocations({ page: currentPage, limit: 5, search: searchTerm })
    );
  }, [dispatch, currentPage, searchTerm]);

  //---For Pagination-----

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  //---For Restore--------------------

  const handleRestore = async (id) => {
    const res = await dispatch(restoreLocationbyid(id));

    if (res.type.includes("fulfilled")) {
      dispatch(
        getDeletedLocations({ page: currentPage, limit: 5, search: searchTerm })
      );
      Swal.fire({
        title: "Success",
        text: res.payload.message,
        icon: "success",
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  const searchData = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const columns = [
    {
      field: "action",
      headerName: <b>ACTION </b>,
      sortable: false,
      headerAlign: "center",
      headerClassName: locationCSS.headers,
      align: "center",
      disableColumnMenu: true,
      width: 100,
      renderCell: (params) => (
        <>
          <Stack
            gap={2}
            direction={"row"}
            justifyContent={"center"}
            height={"100%"}
            alignItems={"center"}
          >
            <Tooltip title="Restore">
              <IconButton
                size="small"
                onClick={() => handleRestore(params.row._id)}
                className={locationCSS.restoreBtnBG}
              >
                <RestorePageIcon className={locationCSS.restoreBtn} />
              </IconButton>
            </Tooltip>
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
        return (
          <Chip
            label={params?.row?.compId?.name || "No Company Name"}
            variant="outlined"
            sx={{ borderColor: "#0672BC", color: "#0672BC" }}
            icon={<CorporateFareIcon />}
          />
        );
      },
    },

    {
      field: "locName",
      headerName: <b> LOCATION </b>,
      headerAlign: "center",
      headerClassName: locationCSS.headers,
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 160,
    },
    {
      field: "locationCode",
      headerName: <b> LOCATION CODE </b>,
      headerAlign: "center",
      headerClassName: locationCSS.headers,
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 140,
    },
    {
      field: "address",
      headerName: <b> ADDRESS </b>,
      headerAlign: "center",
      headerClassName: locationCSS.headers,
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 250,
    },
    {
      field: "postCode",
      headerName: <b> ZIP CODE </b>,
      headerAlign: "center",
      headerClassName: locationCSS.headers,
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 100,
    },
    {
      field: "toMail",
      headerName: <b> TO MAIL </b>,
      headerAlign: "center",
      headerClassName: locationCSS.headers,
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 200,
    },
    {
      field: "ccMail",
      headerName: <b> CC MAIL </b>,
      headerAlign: "center",
      headerClassName: locationCSS.headers,
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 200,
    },
  ];

  return (
    <>
      <Grid item md={4} xs={10} ml={4} mt={2} mr={3}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search Locations"
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

      <Grid item md={12} xs={12} ml={4} mt={3} mr={3}>
        {locationLoading ? (
          <LoadingTable />
        ) : delLocation && delLocation?.length > 0 ? (
          <DataGrid
            rows={delLocation}
            columns={columns}
            className={locationCSS.mainGrid}
            autoHeight
            autoWidth
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
              color: "black",
            },
            "& .MuiPaginationItem-page:hover": {
              backgroundColor: "#0672bc",
              color: "black",
            },
          }}
        />
      </Box>
    </>
  );
};

export default DeletedUsers;
