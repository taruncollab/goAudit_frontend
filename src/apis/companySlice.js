import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiHeader } from "../common/apiHeaders";
import axios from "axios";

export const addCompany = createAsyncThunk(
  "addCompany",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_PATH}/company/addcomp`,
        data,
        apiHeader
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getCompanies = createAsyncThunk(
  "getCompanies",
  async ({ page = 1, limit = 5, search = "" }, { rejectWithValue }) => {
    try {
      // Make POST request to fetch companies
      const res = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_PATH
        }/company/getcomps?page=${page}&limit=${limit}`,
        { search },
        apiHeader
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : { message: error.message }
      );
    }
  }
);

export const getAllCompanies = createAsyncThunk(
  "getAllCompanies",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_PATH}/company/getallcomps`,
        data,
        apiHeader
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getDeletedCompanies = createAsyncThunk(
  "getDeletedCompanies",
  async ({ page = 1, limit = 5, search = "" }, { rejectWithValue }) => {
    try {
      // Make POST request to fetch companies
      const res = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_PATH
        }/company/getdeletedcomps?page=${page}&limit=${limit}`,
        { search },
        apiHeader
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : { message: error.message }
      );
    }
  }
);

export const updateCompanybyid = createAsyncThunk(
  "updateCompanybyid",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_PATH}/company/updatecompbyid/${
          data?._id
        }`,
        data,
        apiHeader
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteCompanybyid = createAsyncThunk(
  "deleteCompanybyid",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_PATH}/company/deletecompbyid/${
          data.id
        }`,
        data,
        apiHeader
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const restoreCompanybyid = createAsyncThunk(
  "restoreCompanybyid",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_PATH}/company/restorecompbyid/${data}`,
        apiHeader
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const companySliceDetails = createSlice({
  name: "companySliceDetails",
  initialState: {
    comp: [],
    delComp: [],
    compLoading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCompany.pending, (state) => {
        state.compLoading = true;
      })
      .addCase(addCompany.fulfilled, (state, action) => {
        state.compLoading = false;
        state.comp.unshift(action.payload.data);
        state.error = null;
      })
      .addCase(addCompany.rejected, (state, action) => {
        state.compLoading = false;
        state.error = action.payload;
      })

      //get Company with pagination--------------

      .addCase(getCompanies.pending, (state) => {
        state.compLoading = true;
      })
      .addCase(getCompanies.fulfilled, (state, action) => {
        state.compLoading = false;
        state.comp = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.error = null;
      })
      .addCase(getCompanies.rejected, (state, action) => {
        state.compLoading = false;
        state.error = action.payload;
      })

      .addCase(getAllCompanies.pending, (state) => {
        state.compLoading = true;
      })
      .addCase(getAllCompanies.fulfilled, (state, action) => {
        state.compLoading = false;
        state.comp = action.payload.data;
        state.error = null;
      })
      .addCase(getAllCompanies.rejected, (state, action) => {
        state.compLoading = false;
        state.error = action.payload;
      })

      //get Deleted Company with pagination--------------

      .addCase(getDeletedCompanies.pending, (state) => {
        state.compLoading = true;
      })
      .addCase(getDeletedCompanies.fulfilled, (state, action) => {
        state.compLoading = false;
        state.delComp = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.error = null;
      })
      .addCase(getDeletedCompanies.rejected, (state, action) => {
        state.compLoading = false;
        state.error = action.payload;
      })

      .addCase(updateCompanybyid.pending, (state) => {
        state.compLoading = true;
      })
      .addCase(updateCompanybyid.fulfilled, (state, action) => {
        state.compLoading = false;
        state.comp = state.comp.map((item) =>
          item._id === action.payload.data._id ? action.payload.data : item
        );
      })
      .addCase(updateCompanybyid.rejected, (state, action) => {
        state.compLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteCompanybyid.pending, (state) => {
        state.compLoading = true;
      })
      .addCase(deleteCompanybyid.fulfilled, (state, action) => {
        state.compLoading = false;
        const { _id } = action.payload.data;
        if (_id) {
          state.comp = state.comp.filter((f) => f._id !== _id);
          state?.delComp?.unshift(action.payload.data);
        }
      })
      .addCase(deleteCompanybyid.rejected, (state, action) => {
        state.compLoading = false;
        state.error = action.payload;
      })

      .addCase(restoreCompanybyid.pending, (state) => {
        state.compLoading = true;
      })
      .addCase(restoreCompanybyid.fulfilled, (state, action) => {
        state.compLoading = false;
        const { _id } = action.payload.data;
        if (_id) {
          state.delComp = state.delComp.filter((f) => f._id !== _id);
          state?.comp?.unshift(action.payload.data);
        }
      })
      .addCase(restoreCompanybyid.rejected, (state, action) => {
        state.compLoading = false;
        state.error = action.payload;
      });
  },
});

export default companySliceDetails.reducer;
