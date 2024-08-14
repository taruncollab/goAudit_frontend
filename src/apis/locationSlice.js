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
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_PATH}/location/getlocations`,
        data,
        apiHeader
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getDeletedLocations = createAsyncThunk(
  "getDeletedLocations",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_PATH}/location/getdeletedlocations`,
        data,
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
        `${
          import.meta.env.VITE_BACKEND_PATH
        }/location/deletelocationbyid/${data.id}`,
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

const locationSliceDetails = createSlice({
  name: "locationSliceDetails",
  initialState: {
    location: [],
    delLocation: [],
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

      .addCase(getLocations.pending, (state) => {
        state.locationLoading = true;
      })
      .addCase(getLocations.fulfilled, (state, action) => {
        state.locationLoading = false;
        state.location = action.payload.data;
        state.error = null;
      })
      .addCase(getLocations.rejected, (state, action) => {
        state.locationLoading = false;
        state.error = action.payload;
      })

      .addCase(getDeletedLocations.pending, (state) => {
        state.locationLoading = true;
      })
      .addCase(getDeletedLocations.fulfilled, (state, action) => {
        state.locationLoading = false;
        state.delLocation = action.payload.data;
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
        state.compLoading = true;
      })
      .addCase(restoreLocationbyid.fulfilled, (state, action) => {
        state.compLoading = false;
        const { _id } = action.payload.data;
        if (_id) {
          state.delLocation = state.delLocation.filter((f) => f._id !== _id);
          state?.location?.unshift(action?.payload?.data);
        }
      })
      .addCase(restoreLocationbyid.rejected, (state, action) => {
        state.compLoading = false;
        state.error = action.payload;
      });
  },
});

export default locationSliceDetails.reducer;
