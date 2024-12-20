import { useMemo } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Pagination,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import formCSS from "./form.module.scss";
import { generateFormReportExcel, getForms } from "../../apis/formSlice";
import LoadingTable from "../../common/loadingTable";
import {
  CorporateFare as CorporateFareIcon,
  LocationOn as LocationOnIcon,
  Category as CategoryIcon,
  ReceiptLong as ReceiptLongIcon,
  RemoveRedEye as RemoveRedEyeIcon,
} from "@mui/icons-material";
import DownloadIcon from "@mui/icons-material/Download";
import DigitalSignModel from "./DigitalSign";
import { downloadReportExcel } from "../../common/utils";
import * as XLSX from "xlsx";
import _ from "lodash";
import { searchOptions } from "../../apis/optionSlice";

const FormRecords = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { users } = useSelector((state) => state.authData);
  const { form, totalPages, formLoading } = useSelector(
    (state) => state.formData
  );

  //State Zone---------------------

  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [imageURL, setImageURL] = useState([]);
  const [signatures, setSignatures] = useState([]);
  const [options, setOptions] = useState([]);
  const [queOption, setQueOption] = useState(null);
  const sigCanvas = [useRef(), useRef(), useRef()];

  //Effect Zone---------------------

  useEffect(() => {
    dispatch(getForms({ page: currentPage, limit: 5, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  //---For Pagination--

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const searchData = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const columns = [
    {
      field: "action",
      headerName: <b>VIEW</b>,
      headerAlign: "center",
      headerClassName: formCSS.headers,
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 250,
      renderCell: (params) => (
        <div>
          <Tooltip title="View Details">
            <IconButton
              onClick={() => navigate(`/formdetails/${params.row?._id}`)}
            >
              <RemoveRedEyeIcon className={formCSS.infoBtn} />
            </IconButton>
          </Tooltip>

          <a
            href={`${
              import.meta.env.VITE_BACKEND_PATH
            }/form/generateFormReport/${params.row._id}`}
            target="_blank"
          >
            <IconButton>
              <DownloadIcon className={formCSS.infoBtn} />
            </IconButton>
          </a>

          {params.row?.signatures?.length <= 0 && (
            <Tooltip title="View Details">
              <IconButton>
                <DigitalSignModel
                  formId={params.row?._id}
                  open={open}
                  setOpen={setOpen}
                  imageURL={imageURL}
                  setImageURL={setImageURL}
                  signatures={signatures}
                  setSignatures={setSignatures}
                  sigCanvas={sigCanvas}
                />
              </IconButton>
            </Tooltip>
          )}
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
            label={params?.row?.locId?.locName || "No Location"}
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
    {
      field: "score",
      headerName: <b>SCORE</b>,
      headerAlign: "center",
      headerClassName: formCSS.headers,
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 160,
    },
  ];

  const handleExcelDownload = async () => {
    let response = await dispatch(
      generateFormReportExcel({ option: queOption })
    );

    let excelData = response && response.payload && response.payload.data;

    if (excelData.length === 0) {
      alert("No data to export.");
      return;
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(downloadReportExcel(excelData));
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const wbBinary = XLSX.write(wb, { type: "binary" });
    const arrayBuffer = new Uint8Array(wbBinary.length);
    for (let i = 0; i < wbBinary.length; i++) {
      arrayBuffer[i] = wbBinary.charCodeAt(i);
    }

    const blob = new Blob([arrayBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Form Record Data.xlsx";
    link.click();
  };

  const fetchOptions = useMemo(
    () =>
      _.debounce(async (query) => {
        try {
          const response = await dispatch(searchOptions({ search: query }));

          setOptions(
            response &&
              response.payload &&
              response.payload.data.map((item) => ({
                label: item.text,
                value: item?._id,
              }))
          );
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }, 1000),
    []
  );

  useEffect(() => {
    fetchOptions(inputValue);
  }, [inputValue]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} mt={2} container justifyContent={"space-between"}>
          <Typography className={formCSS.title}>
            <ReceiptLongIcon style={{ fontSize: "26px" }} /> FORM RECORD
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4} mt={2} ml={2} mr={2}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search Form Records"
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

        <Grid item xs={12} sm={6} md={4} mt={2} ml={2} mr={2}>
          <Autocomplete
            disablePortal
            size="small"
            className={formCSS.searchBar}
            options={options}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            onChange={(e, newValue) => setQueOption(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Select Answer Type" />
            )}
          />
        </Grid>

        {queOption !== null && (
          <Grid item xs={12} sm={6} md={4} mt={2} ml={2} mr={2}>
            <Button variant="contained" onClick={handleExcelDownload}>
              Download Excel
            </Button>
          </Grid>
        )}

        <Grid item xs={11.5} mt={3} ml={2} mr={2}>
          {formLoading ? (
            <LoadingTable />
          ) : form && form?.length > 0 ? (
            <DataGrid
              rows={form}
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

        <Grid item xs={12} className="mt-3 mb-3">
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
        </Grid>
      </Grid>
    </>
  );
};

export default FormRecords;