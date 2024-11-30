import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiHeader } from "../common/apiHeaders";
import axios from "axios";

export const searchOptions = createAsyncThunk(
  "searchOptions",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_PATH}/options/searchOptions`,
        data,
        apiHeader()
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const optionSliceDetails = createSlice({
  name: "optionSliceDetails",
  initialState: {
    options: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchOptions.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.options = action.payload.data;
      })
      .addCase(searchOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default optionSliceDetails.reducer;
