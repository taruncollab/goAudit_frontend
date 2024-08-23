import companyCSS from "./company.module.scss";
import {
  IconButton,
  Stack,
  Grid,
  TextField,
  Box,
  Pagination,
  Tooltip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getDeletedCompanies,
  restoreCompanybyid,
} from "../../apis/companySlice";
import { getUserName } from "../../common/common";
import moment from "moment";
import noPhoto from "../../assets/no_photo.jpg";
import RestorePageIcon from "@mui/icons-material/RestorePage";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import LoadingTable from "../../common/loadingTable";

const DeletedCompanies = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.authData);
  const { delComp, totalPages, compLoading } = useSelector(
    (state) => state.companyData
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Effect Zone ------------------

  useEffect(() => {
    dispatch(
      getDeletedCompanies({ page: currentPage, limit: 5, search: searchTerm })
    );
  }, [dispatch, currentPage, searchTerm]);

  //---For Pagination-----------------

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  //---For Restore--------------------

  const handleRestore = async (id) => {
    const res = await dispatch(restoreCompanybyid(id));
    if (res.type.includes("fulfilled")) {
      Swal.fire({
        title: "Success",
        text: res.payload.message,
        icon: "success",
        timer: 2000,
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
      field: "compLogo",
      headerName: <b>COMPANY LOGO</b>,
      headerAlign: "center",
      headerClassName: companyCSS.headers,
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <img
              src={params.row.compLogo || noPhoto}
              alt="Company Logo"
              className={companyCSS.compLogo}
            />
          </>
        );
      },
    },
    {
      field: "name",
      headerName: <b>COMPANY NAME</b>,
      headerAlign: "center",
      headerClassName: companyCSS.headers,
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      width: 200,
      renderCell: (params) => {
        return (
          params.row.name.charAt(0).toUpperCase() + params.row.name.slice(1)
        );
      },
    },
    {
      field: "deletedBy",
      headerName: <b>DELETED BY</b>,
      headerAlign: "center",
      headerClassName: companyCSS.headers,
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      width: 200,
      renderCell: (params) => {
        return (
          getUserName(params?.row?.deletedBy, users).charAt(0).toUpperCase() +
          getUserName(params?.row?.deletedBy, users).slice(1)
        );
      },
    },
    {
      field: "dateField",
      headerName: <b>Deleted At</b>,
      headerAlign: "center",
      headerClassName: companyCSS.headers,
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      width: 200,
      renderCell: (params) => {
        const dateTime = moment(params?.row?.dateField);
        return (
          <div>
            <span>{dateTime.format("DD-MM-YYYY")} </span> -
            <span> {dateTime.format("HH:mm:ss")}</span>
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: <b>ACTION</b>,
      headerAlign: "center",
      headerClassName: companyCSS.headers,
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      width: 200,
      renderCell: (params) => {
        return (
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
                  className={companyCSS.restoreBtnBG}
                >
                  <RestorePageIcon className={companyCSS.restoreBtn} />
                </IconButton>
              </Tooltip>
            </Stack>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Grid item md={4} xs={10} ml={4} mt={2} mr={3}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search Companies"
          onChange={searchData}
          className={companyCSS.searchBar}
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
        {compLoading ? (
          <LoadingTable />
        ) : delComp && delComp.length > 0 ? (
          <DataGrid
            rows={delComp}
            columns={columns}
            className={companyCSS.mainGrid}
            rowHeight={80}
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
              backgroundColor: "#5ade5d",
              color: "black",
            },
          }}
        />
      </Box>
    </>
  );
};

export default DeletedCompanies;
