import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridDeleteIcon } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import questionCSS from "./question.module.scss";
import { deleteQuestionbyid, getQuestions } from "../../apis/questionSlice";
import { toast } from "react-toastify";

const Question = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [count, setCount] = useState(0);

  const { users } = useSelector((state) => state.authData);
  const { comp, delComp } = useSelector((state) => state.companyData);
  const { question } = useSelector((state) => state.questionData);
  const { location } = useSelector((state) => state.locationData);
  const { category } = useSelector((state) => state.categoryData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const callApi = async () => {
      const res = await dispatch(
        getQuestions({ page, pageSize, search: searchTerm })
      );

      setData(res?.payload?.data);
      setCount(res?.payload?.totalCount);
    };
    callApi();
  }, [page, pageSize, searchTerm, dispatch]);

  const handlePaginationModelChange = (model) => {
    setPage(model.page);
    setPageSize(model.pageSize);
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
        const res = await dispatch(deleteQuestionbyid(id));
    if (res.type.includes("fulfilled")) {
      toast.warning(res.payload.message);
    }

    const recall = await dispatch(
      getQuestions({ page, pageSize, search: searchTerm })
    );

    setCount(recall?.payload?.totalCount);
    setData(recall?.payload?.data);
      } else {
        swal("Cancelled!");
      }
    });
    
  };

  const searchData = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // let companyArray = [...comp, ...delComp];

  const columns = [
    {
      field: "action",
      headerName: <b>ACTION </b>,
      headerAlign: "center",
      headerClassName: questionCSS.headers,
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 180,
      renderCell: (params) => (
        <Stack
          gap={1}
          direction={"row"}
          justifyContent={"center"}
          height={"100%"}
          alignItems={"center"}
        >
          <IconButton
            className={questionCSS.editBtnBG}
            size="small"
            onClick={() => navigate(`/questionform/${params.row._id}`)}
          >
            <EditIcon className={questionCSS.editBtn} />
          </IconButton>
          <IconButton
            className={questionCSS.deleteBtnBG}
            size="small"
            onClick={() => handleDelete(params.row._id)}
          >
            <GridDeleteIcon className={questionCSS.deleteBtn} />
          </IconButton>
          <IconButton
            className={questionCSS.viewBtnBG}
            size="small"
            onClick={() => navigate(`/questiondetails/${params.row._id}`)}
          >
            <VisibilityIcon className={questionCSS.viewBtn} />
          </IconButton>
        </Stack>
      ),
    },
    {
      field: "title",
      headerName: <b>TITLE</b>,
      headerAlign: "center",
      headerClassName: questionCSS.headers,
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 200,
    },
    {
      field: "categoryId",
      headerName: <b>CATEGORY</b>,
      headerAlign: "center",
      headerClassName: questionCSS.headers,
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 200,
      renderCell: (params) => (
        <div>
          {category &&
            category.map((f, i) => {
              if (f._id === params.row.categoryId) {
                return <p key={i}>{f.name}</p>;
              }
            })}
        </div>
      ),
    },
    {
      field: "compName",
      headerName: (
        <b>
          COMPANY/ <br /> DEPARTMENT
        </b>
      ),
      headerAlign: "center",
      headerClassName: questionCSS.headers,
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 200,
      // renderCell: (params) => (
      //   <div>
      //     {companyArray.map((f, i) => {
      //       if (f._id === params.row.compId) {
      //         return <p key={i}  style={{ color: f.isDelete == 1 ? "red" : "" }}>{f.name}</p>;
      //       }
      //     })}
      //   </div>
      // ),
    },
    {
      field: "locName",
      headerName: <b>LOCATION </b>,
      headerAlign: "center",
      headerClassName: questionCSS.headers,
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 200,
      // renderCell: (params) => (
      //   <div>
      //     {location.map((f, i) => {
      //       if (f._id === params.row.locId) {
      //         return <p key={i}>{f.locName}</p>;
      //       }
      //     })}
      //   </div>
      // ),
    },
    {
      field: "createdBy",
      headerName: <b>CREATED BY </b>,
      headerAlign: "center",
      headerClassName: questionCSS.headers,
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 200,
      renderCell: (params) => (
        <div>
          {users &&
            users.map((f, i) => {
              if (f._id === params.row.createdBy) {
                return <p key={i}>{f.name}</p>;
              }
            })}
        </div>
      ),
    },
  ];

  return (
    <>
      <Grid container>
        <Grid item xs={12} container justifyContent={"space-between"}>
          <Typography className={questionCSS.title}>QUESTION</Typography>
          <Button
            variant="contained"
            className={`me-4 ${questionCSS.addBtn}`}
            onClick={() => navigate("/questionform")}
          >
            Add
          </Button>
        </Grid>

        <Grid item md={4} xs={10} ml={4} mt={2} mr={3}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search Templetes"
            onChange={searchData}
            className={questionCSS.searchBar}
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

        <Grid item md={12} xs={12} mr={3} ml={3} mt={3}>
          <DataGrid
            rows={data || []}
            columns={columns}
            className={questionCSS.mainGrid}
            rowCount={count}
            autoWidth
            autoHeight
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
                  page: page,
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
      </Grid>
    </>
  );
};

export default Question;
