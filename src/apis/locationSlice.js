import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiHeader } from "../common/apiHeaders";
import axios from "axios";

export const addLocation = createAsyncThunk(
  "addLocation",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_PATH}/location/addlocation`,
        data,
        apiHeader
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAllLocations = createAsyncThunk(
  "getAllLocations",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_PATH}/location/getalllocations`,
        data,
        apiHeader
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getLocations = createAsyncThunk(
  "getLocations",
  async ({ page = 1, limit = 5, search = "" }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_PATH
        }/location/getlocations?page=${page}&limit=${limit}`,
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

export const getDeletedLocations = createAsyncThunk(
  "getDeletedLocations",
  async ({ page = 1, limit = 5, search = "" }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_PATH
        }/location/getdeletedlocations?page=${page}&limit=${limit}`,
        { search },
        apiHeader
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateLocationbyid = createAsyncThunk(
  "updateLocationbyid",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_PATH}/location/updatelocationbyid/${
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

export const deleteLocationbyid = createAsyncThunk(
  "deleteLocationbyid",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_PATH}/location/deletelocationbyid/${
          data.id
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

export const restoreLocationbyid = createAsyncThunk(
  "restoreLocationbyid",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_PATH
        }/location/restorelocationbyid/${data}`,
        apiHeader
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getLocationbyCompid = createAsyncThunk(
  "getLocationbyCompid",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_PATH}/location/getlocationbycompanyId/${
          data?.id
        }`,
        apiHeader
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
const locationSliceDetails = createSlice({
  name: "locationSliceDetails",
  initialState: {
    location: [],
    delLocation: [],
    totalPages: 0,
    currentPage: 1,
    locationLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addLocation.pending, (state) => {
        state.locationLoading = true;
      })
      .addCase(addLocation.fulfilled, (state, action) => {
        state.locationLoading = false;
        state.location.push(action.payload.data);
        state.error = null;
      })
      .addCase(addLocation.rejected, (state, action) => {
        state.locationLoading = false;
        state.error = action.payload;
      })

      .addCase(getAllLocations.pending, (state) => {
        state.locationLoading = true;
      })
      .addCase(getAllLocations.fulfilled, (state, action) => {
        state.locationLoading = false;
        state.location = action.payload.data;
        state.error = null;
      })
      .addCase(getAllLocations.rejected, (state, action) => {
        state.locationLoading = false;
        state.error = action.payload;
      })

      //get Location with pagination--------------

      .addCase(getLocations.pending, (state) => {
        state.locationLoading = true;
      })
      .addCase(getLocations.fulfilled, (state, action) => {
        state.locationLoading = false;
        state.location = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.error = null;
      })
      .addCase(getLocations.rejected, (state, action) => {
        state.locationLoading = false;
        state.error = action.payload;
      })

      //get Deleted Location with pagination--------------

      .addCase(getDeletedLocations.pending, (state) => {
        state.locationLoading = true;
      })
      .addCase(getDeletedLocations.fulfilled, (state, action) => {
        state.locationLoading = false;
        state.delLocation = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.error = null;
      })
      .addCase(getDeletedLocations.rejected, (state, action) => {
        state.locationLoading = false;
        state.error = action.payload;
      })

      .addCase(updateLocationbyid.pending, (state) => {
        state.locationLoading = true;
      })
      .addCase(updateLocationbyid.fulfilled, (state, action) => {
        state.locationLoading = false;
        state.location = state.location.map((item) =>
          item._id === action.payload.data._id ? action.payload.data : item
        );
      })
      .addCase(updateLocationbyid.rejected, (state, action) => {
        state.locationLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteLocationbyid.pending, (state) => {
        state.locationLoading = true;
      })
      .addCase(deleteLocationbyid.fulfilled, (state, action) => {
        state.locationLoading = false;
        const { _id } = action.payload.data;
        if (_id) {
          state.location = state.location.filter((f) => f._id !== _id);
          state?.delLocation?.unshift(action?.payload?.data);
        }
      })
      .addCase(deleteLocationbyid.rejected, (state, action) => {
        state.locationLoading = false;
        state.error = action.payload;
      })

      .addCase(restoreLocationbyid.pending, (state) => {
        state.locationLoading = true;
      })
      .addCase(restoreLocationbyid.fulfilled, (state, action) => {
        state.locationLoading = false;
        const { _id } = action.payload.data;
        if (_id) {
          state.delLocation = state.delLocation.filter((f) => f._id !== _id);
          state?.location?.unshift(action?.payload?.data);
        }
      })
      .addCase(restoreLocationbyid.rejected, (state, action) => {
        state.locationLoading = false;
        state.error = action.payload;
      })

      .addCase(getLocationbyCompid.pending, (state) => {
        state.locationLoading = true;
      })
      .addCase(getLocationbyCompid.fulfilled, (state, action) => {
        state.locationLoading = false;
        state.location = action.payload.data;
      })
      .addCase(getLocationbyCompid.rejected, (state, action) => {
        state.locationLoading = false;
        state.error = action.payload;
      });
  },
});

export default locationSliceDetails.reducer;
