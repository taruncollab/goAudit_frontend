import { Button, Grid, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { DataGrid, GridDeleteIcon } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import EditIcon from "@mui/icons-material/Edit";
import EditNoteIcon from "@mui/icons-material/EditNote";
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import formCSS from "./form.module.scss";
import { getQuestions } from "../../apis/questionSlice";

const ShowForms = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [count, setCount] = useState(0);

  const { users } = useSelector((state) => state.authData);
  const { question } = useSelector((state) => state.questionData);
  const { comp, delComp } = useSelector((state) => state.companyData);
  const { location } = useSelector((state) => state.locationData);
  const { category } = useSelector((state) => state.categoryData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const callApi = async() => {
      const res = await dispatch(getQuestions({ page, pageSize, search: searchTerm }));

      setData(res?.payload?.data);
      setCount(res?.payload?.totalCount);
    }
    callApi();
  }, [page, pageSize, searchTerm, dispatch]);

  const handlePaginationModelChange = (model) => {
    setPage(model.page);
    setPageSize(model.pageSize);
  };

  const searchData = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  let companyArray = [...comp, ...delComp];

  const columns = [
    {
      field: "action",
      headerName: <b>FILL</b>,
      headerAlign: "center",
      headerClassName: formCSS.headers,
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <div>
          <IconButton className={formCSS.fillBtnBG} onClick={() => navigate(`/fillform/${params.row._id}`)}>
            {/* <EditNoteIcon /> */}
            <TextSnippetOutlinedIcon className={formCSS.fillBtn}/>
          </IconButton>
        </div>
      ),
    },
    {
      field: "title",
      headerName: <b>TITLE</b>,
      headerAlign: "center",
      headerClassName: formCSS.headers,
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 200,
    },
    {
      field: "categoryId",
      headerName: <b>CATEGORY</b>,
      headerAlign: "center",
      headerClassName: formCSS.headers,
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 160,
      renderCell: (params) => (
        <div>
          {category.map((f, i) => {
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
      headerClassName: formCSS.headers,
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 160,
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
      headerClassName: formCSS.headers,
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 160,
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
      headerClassName: formCSS.headers,
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 160,
      renderCell: (params) => (
        <div>
          {users && users.map((f, i) => {
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
          <Typography className={formCSS.title}>FILL FORM</Typography>
        </Grid>

      <Grid item md={4} xs={10} ml={4} mt={2} mr={3}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search Templetes"
          onChange={searchData}
          className={formCSS.searchBar}
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
            className={formCSS.mainGrid}
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
      </Grid>
    </>
  );
};

export default ShowForms;
