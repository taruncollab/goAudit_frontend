import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { IconButton, Menu, MenuItem, Box, Paper, Button, Grid, Stack, TextField } from "@mui/material";

import { MoreVert } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import locationCSS from "./location.module.scss";
import { getDeletedLocations, restoreLocationbyid } from "../../apis/locationSlice";
import { toast } from "react-toastify";
import RestorePageIcon from '@mui/icons-material/RestorePage';
// import { restoreLocationbyid } from 'apis/locationSlice';

const DeletedLocation = () => {
  const theme = useTheme();

  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const open = Boolean(anchorEl);

  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [count, setCount] = useState(0);

  const { delLocation } = useSelector((state) => state.locationData);
  const { comp, delComp } = useSelector((state) => state.companyData);

  useEffect(() => {
    const callApi = async() => {
      const res = await dispatch(getDeletedLocations({ page, pageSize, search: searchTerm }));

      setData(res?.payload?.data);
      setCount(res?.payload?.totalCount);
    }
    callApi();
  }, [page, pageSize, searchTerm, dispatch]);

  const handlePaginationModelChange = (model) => {
    setPage(model.page);
    setPageSize(model.pageSize);
  };

  const handleClick = (event, id) => {
    setSelectedId(id);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRestore = async (id) => {
    const res = await dispatch(restoreLocationbyid(id));

    if (res.type.includes("fulfilled")) {
      handleClose();
      toast.success(res.payload.message)
    }

    const recall = await dispatch(getDeletedLocations({ page, pageSize, search: searchTerm}))
    
    setCount(recall?.payload?.totalCount);
    setData(recall?.payload?.data);
  };

  // let companyArray = [...comp, ...delComp];

  const searchData = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const columns = [
    {
      field: 'action',
      headerName: <b>ACTION </b>,
      sortable: false,
      headerAlign: 'center',
      headerClassName: locationCSS.headers, 
      align: 'center', 
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
              <IconButton size="small" onClick={() => handleRestore(params.row._id)} className={locationCSS.restoreBtnBG}>
              <RestorePageIcon  className={locationCSS.restoreBtn}/>
              </IconButton>
            </Stack>
          {/* <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={open ? 'long-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              // onClick={handleClick}
              onClick={(event) => handleClick(event, params.row._id)}
            >
              <MoreVert />
            </IconButton>
            <Menu
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button'
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight: 48 * 4.5,
                  width: '20ch'
                }
              }}
            >
              <MenuItem onClick={handleRestore}>Restore</MenuItem>
            </Menu> */}

        </>
      )
    },
    {
      field: 'compName',
      headerName: <b> <span>COMPANY/<br />DEPARTMENT</span> </b>,
      headerAlign: 'center', 
      headerClassName: locationCSS.headers,
      disableColumnMenu: true,
      sortable: false,
      align: 'center', 
      width: 160,
      // renderCell: (params) => {
      //   return (
      //     <div>
      //       {/* {companyArray.map((f) => { */}
      //       {companyArray.map((f) => {
      //         if (f._id === params.row.compId) {
      //           return (
      //             <p
      //               key={f._id}
      //               style={{ color: f.isDelete == 1 ? "red" : "" }}
      //             >
      //               {f.name}
      //             </p>
      //           );
      //         }
      //       })}
      //     </div>
      //   );
      // },
    },
    {
      field: 'locName',
      headerName: <b> LOCATION </b>,
      headerAlign: 'center', 
      headerClassName: locationCSS.headers,
      align: 'center', 
      disableColumnMenu: true,
      sortable: false,
      width: 100
    },
    {
      field: 'locationCode',
      headerName: <b> LOCATION CODE </b>,
      headerAlign: 'center', 
      headerClassName: locationCSS.headers,
      align: 'center', 
      disableColumnMenu: true,
      sortable: false,
      width: 140,
    },
    {
      field: 'address',
      headerName: <b> ADDRESS </b>,
      headerAlign: 'center', 
      headerClassName: locationCSS.headers,
      align: 'center', 
      disableColumnMenu: true,
      sortable: false,
      width: 200
    },
    {
      field: 'postCode',
      headerName: <b> ZIP CODE </b>,
      headerAlign: 'center', 
      headerClassName: locationCSS.headers,
      align: 'center', 
      disableColumnMenu: true,
      sortable: false,
      width: 100
    },
    {
      field: 'toMail',
      headerName: <b> TO MAIL </b>,
      headerAlign: 'center', 
      headerClassName: locationCSS.headers,
      align: 'center', 
      disableColumnMenu: true,
      sortable: false,
      width: 200
    },
    {
      field: 'ccMail',
      headerName: <b> CC MAIL </b>,
      headerAlign: 'center', 
      headerClassName: locationCSS.headers,
      align: 'center', 
      disableColumnMenu: true,
      sortable: false,
      width: 200
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
        <DataGrid
          rows={data || []}
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
          pagination
          paginationMode="server"
          rowCount={count}
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
          rowsPerPageOptions={[5]}
          getRowId={(e) => e._id}
          disableRowSelectionOnClick
        />
      </Grid>
    </>
  );
};

export default DeletedLocation;
