import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  IconButton,
  Menu,
  MenuItem,
  Box,
  Paper,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import * as Yup from "yup";
import { DataGrid, GridDeleteIcon } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import {
  deleteLocationbyid,
  getLocations,
  updateLocationbyid,
} from "../../apis/locationSlice";
import locationCSS from "./location.module.scss";
import FormDrawer from "../../components/Drawer/FormDrawer";
import { toast } from "react-toastify";


const LiveLocations = () => {
  const theme = useTheme();

  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [formDrawer, setFormDrawer] = useState([false, null]);
  // const [filterred, setFiltered] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [count, setCount] = useState(0);

  const open = Boolean(anchorEl);
  const { auth } = useSelector((state) => state.authData);
  const { location } = useSelector((state) => state.locationData);
  const { comp, delComp } = useSelector((state) => state.companyData);

  useEffect(() => {
    const callApi = async() => {
      const res = await dispatch(getLocations({ page, pageSize, search: searchTerm }));

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

  const handleDelete = async (id) => {

    swal({
      title: "Are you sure?",
      text: "Do you want to Delete this file!!?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then(async(willDelete) => {
      if (willDelete) {
        const res = await dispatch(deleteLocationbyid({ id: id, dId: auth._id }));

        if (res.type.includes("fulfilled")) {
          handleClose();
          toast.warning(res.payload.message);
        }
    
        const recall = await dispatch(getLocations({ page, pageSize, search: searchTerm }))
        
        setCount(recall?.payload?.totalCount);
        setData(recall?.payload?.data);
      } else {
        swal("Cancelled!");
      }
    });

    
  };

  const handleEdit = (id) => {
    const data = location?.find((e) => e._id == id);
    setFormDrawer([true, data]);
    handleClose();
  };

  const submitFun = async (values) => {
    if (formDrawer[1] !== null) {
      const res = await dispatch(updateLocationbyid(values));

      if (res.type.includes("fulfilled")) {
        setFormDrawer([false, null]);
      }
    }
    // else {
    //   const res = await dispatch(addCompany({...values, compLogo:base64}));

    //   if (res.type.includes("fulfilled")) {
    //     setFormDrawer([false, null])
    //   }
    // }
  };

  const searchData = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // let companyArray = [...comp, ...delComp];

  const inputForm = [
    {
      title: "Select Company",
      name: "compId",
      type: "select",
      options: comp,
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
      add: true,
      edit: true,
    },
    {
      title: "Full Address",
      name: "address",
      type: "text",
      multiline: true,
      add: true,
      edit: true,
    },
    {
      title: "Postcode/Zipcode",
      name: "postCode",
      type: "number",
      add: true,
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
              onClick={() => handleDelete(params.row._id)}
              className={locationCSS.deleteBtnBG}
            >
              <GridDeleteIcon className={locationCSS.deleteBtn} />
            </IconButton>
          </Stack>
          {/* <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            // onClick={handleClick}
            onClick={(event) => handleClick(event, params.row._id)}
          >
            <MoreVert />
          </IconButton>
          <Menu
            id="long-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: 48 * 4.5,
                width: "20ch",
              },
            }}
          >
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </Menu> */}
        </>
      ),
    },
    {
      field: "compName",
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
      align: "center",
      width: 160,
      // renderCell: (params) => {
      //   return (
      //     <div>
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
      field: "locName",
      headerName: <b> LOCATION </b>,
      headerAlign: "center",
      headerClassName: locationCSS.headers,
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 100,
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
      width: 200,
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
        <DataGrid
          rows={data || []}
          columns={columns}
          className={locationCSS.mainGrid}
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
          rowsPerPageOptions={[5]}
          getRowId={(e) => e._id}
          disableRowSelectionOnClick
        />
      </Grid>

      <FormDrawer
        anchor="right"
        title="Add Company"
        editTitle="Edit Company"
        form={inputForm}
        submitFun={submitFun}
        open={formDrawer}
        setOpen={setFormDrawer}
      />
    </>
  );
};

export default LiveLocations;
