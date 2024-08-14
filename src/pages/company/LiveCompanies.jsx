import { useEffect, useState } from "react";
import { IconButton, Grid, Stack, TextField } from "@mui/material";
import companyCSS from "./company.module.scss";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import FormDrawer from "../../components/Drawer/FormDrawer";
import {
  addCompany,
  deleteCompanybyid,
  getCompanies,
  updateCompanybyid,
} from "../../apis/companySlice";
import noPhoto from "../../assets/no_photo.jpg";
import { toast } from "react-toastify";
// import DeleteIcon from "../../assets/delete.png";
// import EditIcon from "../../assets/edit.png";
import { DataGrid, GridDeleteIcon } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";

const LiveCompanies = () => {
  const [upload, setUpload] = useState(null);
  const [base64, setBase64] = useState(null);
  const [formDrawer, setFormDrawer] = useState([false, null]);
  // const [filterred, setFiltered] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const [count, setCount] = useState(0);

  const dispatch = useDispatch();
  const { comp } = useSelector((state) => state.companyData);
  const { auth } = useSelector((state) => state.authData);

  useEffect(() => {
    const callApi = async() => {
      const res = await dispatch(getCompanies({ page, pageSize, search: searchTerm }));

      setData(res?.payload?.data);
      setCount(res?.payload?.totalCount);
    }
    callApi();
  }, [page, pageSize, searchTerm, dispatch]);

  const handlePaginationModelChange = (model) => {
    setPage(model.page);
    setPageSize(model.pageSize);
  };

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
        const res = await dispatch(deleteCompanybyid({ id: id, dId: auth._id }));
    if (res.type.includes("fulfilled")) {
      toast.warning(res.payload.message);
    }
    
    const recall = await dispatch(getCompanies({ page, pageSize, search: searchTerm }))
    
    setCount(recall?.payload?.totalCount);
    setData(recall?.payload?.data);
      } else {
        swal("Cancelled!");
      }
    });
  };

  const handleEdit = async (id) => {
    const data = comp?.find((e) => e._id == id);

    setFormDrawer([true, data]);
  };

  const searchData = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

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
            {/* <div className={companyCSS.compLogoBG}> */}
              <img
                src={params.row.compLogo || noPhoto}
                alt="Company Logo"
                className={companyCSS.compLogo}
              />
            {/* </div> */}
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
      field: "shortName",
      headerName: <b>SHORT NAME</b>,
      headerAlign: "center",
      headerClassName: companyCSS.headers,
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      width: 200,
      renderCell: (params) => {
        return (
          params.row.shortName.charAt(0).toUpperCase() +
          params.row.shortName.slice(1)
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
              gap={1}
              direction={"row"}
              justifyContent={"center"}
              height={"100%"}
              alignItems={"center"}
            >
              <IconButton
                size="small"
                onClick={() => handleEdit(params.row._id)}
                className={companyCSS.editBtnBG}
              >
                <EditIcon className={companyCSS.editBtn} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDelete(params.row._id)}
                className={companyCSS.deleteBtnBG}
              >
                <GridDeleteIcon className={companyCSS.deleteBtn} />
              </IconButton>
            </Stack>
            {/* <Stack
              gap={2}
              direction={"row"}
              justifyContent={"center"}
              height={"100%"}
              alignItems={"center"}
            >
              <IconButton onClick={() => handleEdit(params.row._id)}>
                <img src={EditIcon} alt="" className={companyCSS.icons} />
              </IconButton>
              <IconButton onClick={() => handleDelete(params.row._id)}>
                <img src={DeleteIcon} alt="" className={companyCSS.icons} />
              </IconButton>
            </Stack> */}
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
          rowCount={count}
          rowHeight={80}
          autoHeight
          autoWidth
          slots={
            {
              // pagination: null,
            }
          }
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
          // initialState={{
          //   pagination: {
          //     paginationModel: {
          //       pageSize: filterred?.length > 0 ? filterred.length : 10,
          //       page:page
          //     },
          //   },
          // }}
          pageSizeOptions={[pageSize]}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onPaginationModelChange={handlePaginationModelChange}
          rowsPerPageOptions={[3]}
          getRowId={(e) => e._id}
          disableRowSelectionOnClick
        />
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

export default LiveCompanies;
