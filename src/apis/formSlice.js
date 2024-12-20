import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiHeader } from "../common/apiHeaders";
import axios from "axios";

export const addForm = createAsyncThunk(
  "addForm",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_PATH}/form/addform`,
        data,
        apiHeader
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getForms = createAsyncThunk(
  "getForms",
  async ({ page = 1, limit = 5, search = "" }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_PATH
        }/form/getforms?page=${page}&limit=${limit}`,
        { search },
        apiHeader()
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getFormbyLocId = createAsyncThunk(
  "getFormbyLocId",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_PATH}/form/getformbylocid/${data}`,
        data,
        apiHeader
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const generateAuditReportPdF = createAsyncThunk(
  "generateAuditReportPdF",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_PATH}/form/generateFormReport/${id}`,
        apiHeader
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const updateFormnById = createAsyncThunk(
  "updateFormnById",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_PATH}/form/updateformbyid/${
          data?.formId
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

export const generateFormReportExcel = createAsyncThunk(
  "generateFormReportExcel",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_PATH}/form/generateFormReportExcel`,
        { params: data },
        apiHeader()
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addDraft = createAsyncThunk(
  "addDraft",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_PATH}/form/adddraft`,
        data,
        apiHeader
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getDraftForms = createAsyncThunk(
  "getDraftForms",
  async ({ page = 1, limit = 5, search = "" }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_PATH
        }/form/getdraftforms?page=${page}&limit=${limit}`,
        { search },
        apiHeader()
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const formSliceDetails = createSlice({
  name: "formSliceDetails",
  initialState: {
    form: [],
    draftForm: [],
    formLoading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addForm.pending, (state) => {
        state.formLoading = true;
      })
      .addCase(addForm.fulfilled, (state, action) => {
        state.formLoading = false;
        state.form.unshift(action.payload.data);
        state.error = null;
      })
      .addCase(addForm.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload;
      })

      .addCase(getDraftForms.pending, (state) => {
        state.formLoading = true;
      })
      .addCase(getDraftForms.fulfilled, (state, action) => {
        state.formLoading = false;
        state.draftForm = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.error = null;
      })
      .addCase(getDraftForms.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload;
      })

      .addCase(getForms.pending, (state) => {
        state.formLoading = true;
      })
      .addCase(getForms.fulfilled, (state, action) => {
        state.formLoading = false;
        state.form = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.error = null;
      })
      .addCase(getForms.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload;
      })

      .addCase(getFormbyLocId.pending, (state) => {
        state.formLoading = true;
      })
      .addCase(getFormbyLocId.fulfilled, (state, action) => {
        state.formLoading = false;
        state.form = action.payload.data;
        state.error = null;
      })
      .addCase(getFormbyLocId.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload;
      })

      .addCase(updateFormnById.pending, (state) => {
        state.formLoading = true;
      })
      .addCase(updateFormnById.fulfilled, (state, action) => {
        state.formLoading = false;
        state.form = state.form.map((item) =>
          item._id === action.payload.data._id ? action.payload.data : item
        );
      })
      .addCase(updateFormnById.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload;
      });
  },
});

export default formSliceDetails.reducer;
