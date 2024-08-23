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
        apiHeader
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

const formSliceDetails = createSlice({
  name: "formSliceDetails",
  initialState: {
    form: [],
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
      });
  },
});

export default formSliceDetails.reducer;
