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

export const getCategories = createAsyncThunk(
  "getCategories",
  async ({ page = 1, limit = 5, search = "" }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_PATH
        }/category/getcategories?page=${page}&limit=${limit}`,
        { search },
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
        `${import.meta.env.VITE_BACKEND_PATH}/category/deletecategorybyid/${
          data?.id
        }`,
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
          data?._id
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

export const getDeletedCategories = createAsyncThunk(
  "getDeletedCategories",
  async ({ page = 1, limit = 5, search = "" }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_PATH
        }/category/getdeletedcategories?page=${page}&limit=${limit}`,
        { search },
        apiHeader
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const restoreCategorybyid = createAsyncThunk(
  "restoreCategorybyid",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_PATH
        }/category/restorecategorybyid/${data}`,
        apiHeader
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const categorySliceDetails = createSlice({
  name: "categorySliceDetails",
  initialState: {
    category: [],
    delCategory: [],
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

      //----------------For getCategories-------------------\\

      .addCase(getCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.error = null;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //----------------For get Deletd Categories-------------------\\

      .addCase(getDeletedCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDeletedCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.delCategory = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.error = null;
      })
      .addCase(getDeletedCategories.rejected, (state, action) => {
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
          state.category = state.category.filter((ele) => ele._id !== _id);
          state?.delCategory?.unshift(action.payload.data);
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

      .addCase(restoreCategorybyid.pending, (state) => {
        state.loading = true;
      })
      .addCase(restoreCategorybyid.fulfilled, (state, action) => {
        state.loading = false;
        const { _id } = action.payload.data;
        if (_id) {
          state.delCategory = state.delCategory.filter((f) => f._id !== _id);
          state?.category?.unshift(action.payload.data);
        }
      })
      .addCase(restoreCategorybyid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categorySliceDetails.reducer;
