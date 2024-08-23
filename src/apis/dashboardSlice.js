import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apiHeader } from "../common/apiHeaders";

export const getDashboardCount = createAsyncThunk(
  "getDashboardCount",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_PATH}/dashboard/getdashboardcount`,
        data,
        apiHeader
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const dashboardSliceDetails = createSlice({
  name: "dashboardSliceDetails",
  initialState: {
    userCount: 0,
    companyCount: 0,
    locationCount: 0,
    categoryCount: 0,
    questionTempleteCount: 0,
    formCount: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDashboardCount.fulfilled, (state, action) => {
        state.loading = false;
        state.userCount = action.payload.data.users;
        state.companyCount = action.payload.data.companies;
        state.locationCount = action.payload.data.locations;
        state.categoryCount = action.payload.data.categories;
        state.questionTempleteCount = action.payload.data.questionsTemplate;
        state.formCount = action.payload.data.forms;

        state.error = null;
      })
      .addCase(getDashboardCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSliceDetails.reducer;
