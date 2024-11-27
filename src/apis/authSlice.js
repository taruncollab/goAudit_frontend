import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiHeader } from "../common/apiHeaders";
import axios from "axios";

export const signUp = createAsyncThunk(
  "signUp",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_PATH}/auth/signup`,
        data,
        apiHeader
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getOtp = createAsyncThunk(
  "getOtp",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_PATH}/auth/getotp`,
        data,
        apiHeader
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const logIn = createAsyncThunk(
  "logIn",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_PATH}/auth/login`,
        data,
        apiHeader
      );

      if (res?.data?.data) {
        localStorage.setItem("user", JSON.stringify(res.data?.data));
      }

      if (res?.data?.token) {
        localStorage.setItem("userToken", res.data?.token);
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getUserByToken = createAsyncThunk(
  "getUserByToken",
  async (data, { rejectWithValue }) => {
    try {
      let token = localStorage.getItem("userToken");

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_PATH}/auth/getuserbytoken`,
        { token },
        apiHeader
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getUsers = createAsyncThunk(
  "getUsers",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_PATH}/auth/getusers`,
        {
          params: data,
        },
        apiHeader
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createUser = createAsyncThunk(
  "createUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_PATH}/auth/createUser`,
        data,
        apiHeader
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUser = createAsyncThunk(
  "updateUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_PATH}/auth/updateuserbyid/${data._id}`,
        data,
        apiHeader
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const authSliceDetails = createSlice({
  name: "authSliceDetails",
  initialState: {
    auth: [],
    users: [],
    authLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.authLoading = false;
        state.auth = action.payload.data;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload;
      })

      .addCase(getOtp.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(getOtp.fulfilled, (state, action) => {
        state.authLoading = false;
        state.auth = action.payload.data;
      })
      .addCase(getOtp.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload;
      })

      .addCase(logIn.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.authLoading = false;
        state.auth = action.payload.data;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload;
      })

      .addCase(getUserByToken.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(getUserByToken.fulfilled, (state, action) => {
        state.authLoading = false;
        state.auth = action.payload.data;
      })
      .addCase(getUserByToken.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload;
      })

      .addCase(getUsers.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.authLoading = false;
        state.users = action.payload.data;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload;
      });
  },
});

export default authSliceDetails.reducer;
