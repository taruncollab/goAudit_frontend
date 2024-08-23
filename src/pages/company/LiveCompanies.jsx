import { useEffect, useState } from "react";
import {
  IconButton,
  Grid,
  Stack,
  TextField,
  Box,
  Pagination,
} from "@mui/material";
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
import { DataGrid, GridDeleteIcon } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import LoadingTable from "../../common/loadingTable";
import useHandleDelete from "../../common/DeleteFunction";

const LiveCompanies = () => {
  const [upload, setUpload] = useState(null);
  const [base64, setBase64] = useState(null);
  const [formDrawer, setFormDrawer] = useState([false, null]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const { comp, totalPages, compLoading } = useSelector(
    (state) => state.companyData
  );
  const { auth } = useSelector((state) => state.authData);

  useEffect(() => {
    dispatch(getCompanies({ page: currentPage, limit: 5, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  //---For Pagination-----

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
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

  // Submit Function----------------
  const submitFun = async (values) => {
    if (formDrawer[1] !== null) {
      //Edit----------------------

      const res = await dispatch(updateCompanybyid(values));

      if (res.type.includes("fulfilled")) {
        setFormDrawer([false, null]);
        Swal.fire({
          title: "Successfully Updated",
          text: res.payload.message,
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } else {
      //Add----------------------
      const res = await dispatch(
        addCompany({ ...values, createdBy: auth._id, compLogo: base64 })
      );
      if (res.type.includes("fulfilled")) {
        setFormDrawer([false, null]);
        setUpload(null);
        setBase64(null);
        Swal.fire({
          title: "Successfully Updated",
          text: res.payload.message,
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
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

  //Handle Delete===================

  const handleDelete = useHandleDelete(deleteCompanybyid, "Company");

  //Edit Function====================
  const handleEdit = async (id) => {
    const data = comp?.find((e) => e._id == id);
    setUpload(data?.compLogo);
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
                onClick={() => handleEdit(params?.row?._id)}
                className={companyCSS.editBtnBG}
              >
                <EditIcon className={companyCSS.editBtn} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => {
                  handleDelete({ id: params?.row?._id, dId: auth?._id });
                }}
                className={companyCSS.deleteBtnBG}
              >
                <GridDeleteIcon className={companyCSS.deleteBtn} />
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
        {compLoading ? (
          <LoadingTable />
        ) : comp && comp?.length > 0 ? (
          <DataGrid
            rows={comp}
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
