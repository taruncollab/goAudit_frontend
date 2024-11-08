import {
  Box,
  Chip,
  Grid,
  IconButton,
  Pagination,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import formCSS from "./form.module.scss";
import { getQuestions } from "../../apis/questionSlice";
import LoadingTable from "../../common/loadingTable";
import {
  TextSnippetOutlined as TextSnippetOutlinedIcon,
  CorporateFare as CorporateFareIcon,
  LocationOn as LocationOnIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";

const ShowForms = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { users } = useSelector((state) => state.authData);
  const { question, totalPages, questionLoading } = useSelector(
    (state) => state.questionData
  );

  // State Zone--------------------------

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  //Effect Zone---------------------

  useEffect(() => {
    dispatch(getQuestions({ page: currentPage, limit: 5, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  //---For Pagination-----

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const searchData = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const columns = [
    {
      field: "action",
      headerName: <b>FILL Form</b>,
      headerAlign: "center",
      headerClassName: formCSS.headers,
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <div>
          <Tooltip title="Fill Form">
            <IconButton
              className={formCSS.fillBtnBG}
              onClick={() => navigate(`/fillform/${params.row?._id}`)}
            >
              <TextSnippetOutlinedIcon className={formCSS.fillBtn} />
            </IconButton>
          </Tooltip>
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
      width: 200,
      renderCell: (params) => {
        return (
          <Chip
            label={params?.row?.categoryId?.name || "No Category Name"}
            variant="outlined"
            sx={{ borderColor: "#0672BC", color: "#0672BC" }}
            icon={<CategoryIcon />}
          />
        );
      },
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
      headerClassName: formCSS.headers,
      disableColumnMenu: true,
      sortable: false,
      align: "center",
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
      field: "locId",
      headerName: <b>LOCATION </b>,
      headerAlign: "center",
      headerClassName: formCSS.headers,
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 200,
      renderCell: (params) => {
        return (
          <Chip
            label={params?.row?.locId.locName || "No Location"}
            variant="outlined"
            sx={{ borderColor: "#0672BC", color: "#0672BC" }}
            icon={<LocationOnIcon />}
          />
        );
      },
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
          <Typography className={formCSS.title}>FILL FORM</Typography>
        </Grid>

        <Grid item md={4} xs={5} ml={4} mt={2} mr={3}>
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

        <Grid item md={12} xs={11} ml={4} mt={3} mr={3}>
          {questionLoading ? (
            <LoadingTable />
          ) : question && question?.length > 0 ? (
            <DataGrid
              rows={question}
              columns={columns}
              className={formCSS.mainGrid}
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
              <img
                src="/img/No data.gif"
                alt="No data available"
                height="200"
              />
            </Box>
          )}
        </Grid>

        {/* Pagination------   */}

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
      </Grid>
    </>
  );
};

export default ShowForms;
