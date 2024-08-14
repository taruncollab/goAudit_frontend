import companyCSS from "./company.module.scss";
import { IconButton, Stack, Grid, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getDeletedCompanies, restoreCompanybyid } from "../../apis/companySlice";
import { getUserName } from "../../common/common";
import moment from "moment";
import noPhoto from "../../assets/no_photo.jpg";
import { toast } from "react-toastify";
// import RestoreIcon from "../../assets/restore.png";
import RestorePageIcon from '@mui/icons-material/RestorePage';
import { DataGrid } from "@mui/x-data-grid";

const DeletedCompanies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.authData);
  const { users } = useSelector((state) => state.authData);
  const { delComp } = useSelector((state) => state.companyData);

  useEffect(() => {
    const callApi = async() => {
      const res = await dispatch(getDeletedCompanies({ page, pageSize, search: searchTerm }));
      setData(res?.payload?.data);
      setCount(res?.payload?.totalCount);
    }
    callApi();
  }, [page, pageSize, searchTerm, dispatch]);

  const handlePaginationModelChange = (model) => {
    setPage(model.page);
    setPageSize(model.pageSize);
  };

  const handleRestore = async (id) => {
    const res = await dispatch(restoreCompanybyid(id));
    if (res.type.includes("fulfilled")) {
      toast.success(res.payload.message);
    }

    const recall = await dispatch(getDeletedCompanies({ page, pageSize, search: searchTerm  }))
    
    setCount(recall?.payload?.totalCount);
    setData(recall?.payload?.data);
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
              <IconButton size="small" onClick={() => handleRestore(params.row._id)} className={companyCSS.restoreBtnBG}>
              <RestorePageIcon  className={companyCSS.restoreBtn}/>
              </IconButton>
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
        <DataGrid
          rows={data || []}
          columns={columns}
          className={companyCSS.mainGrid}
          rowHeight={80}
          rowCount={count}
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
          pagination
          paginationMode="server"
          initialState={{
            ...data.initialState,
            pagination: {
              ...data.initialState?.pagination,
              paginationModel: {
                pageSize: pageSize,
                page: page 
              },
            },
          }}
          pageSizeOptions={[pageSize]}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onPaginationModelChange={handlePaginationModelChange}
          rowsPerPageOptions={[3]}
          getRowId={(e) => e._id}
          disableRowSelectionOnClick
        />
      </Grid>
    </>
  );
};

export default DeletedCompanies;
