import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apiHeader } from "../common/apiHeaders";

// ----------------For addCustomer----------------------------\\

export const addCategory = createAsyncThunk(
  "addCategory",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_PATH}/category/addcategory`,
        data,
        apiHeader
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const getAllCategories = createAsyncThunk(
  "getAllCategories",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_PATH}/category/getallcategories`,data,
        apiHeader
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);



export const deleteCategorybyid = createAsyncThunk(
  "deleteCategorybyid",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_PATH}/category/deletecategorybyid/${data}`,
        apiHeader
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCategorybyid = createAsyncThunk(
  "updateCategorybyid",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_PATH}/category/updatecategorybyid/${
          data?.id
        }`,
        data,
        apiHeader
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const categorySliceDetails = createSlice({
  name: "categorySliceDetails",
  initialState: {
    category: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.category.unshift(action.payload.data);
        state.error = null;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload.data;
        state.error = null;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteCategorybyid.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCategorybyid.fulfilled, (state, action) => {
        state.loading = false;

        const { _id } = action.payload.data;
        if (_id) {
          state.category = state.category.filter(
            (ele) => ele._id !== _id
          );
        }
      })
      .addCase(deleteCategorybyid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateCategorybyid.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategorybyid.fulfilled, (state, action) => {
        state.loading = false;
        const { data } = action.payload;
        state.category = state.category.map((ele) =>
          ele._id === data._id ? data : ele
        );
      })
      .addCase(updateCategorybyid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
  },
});

export default categorySliceDetails.reducer;
