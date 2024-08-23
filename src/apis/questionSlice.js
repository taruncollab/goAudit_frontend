import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiHeader } from "../common/apiHeaders";
import axios from "axios";

export const addQuestion = createAsyncThunk(
  "addQuestion",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_PATH}/question/addquestion`,
        data,
        apiHeader
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getQuestions = createAsyncThunk(
  "getQuestions",
  async ({ page = 1, limit = 5, search = "" }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_PATH
        }/question/getquestions?page=${page}&limit=${limit}`,
        { search },
        apiHeader
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateQuestionbyid = createAsyncThunk(
  "updateQuestionbyid",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_PATH}/question/updatequestionbyid/${
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

export const deleteQuestionbyid = createAsyncThunk(
  "deleteQuestionbyid",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_PATH
        }/question/deletequestionbyid/${data}`,
        apiHeader
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const questionSliceDetails = createSlice({
  name: "questionSliceDetails",
  initialState: {
    question: [],
    // delQuestion: [],
    totalPages: 0,
    currentPage: 1,
    questionLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addQuestion.pending, (state) => {
        state.questionLoading = true;
      })
      .addCase(addQuestion.fulfilled, (state, action) => {
        state.questionLoading = false;
        state.question.unshift(action.payload.data);
        state.error = null;
      })
      .addCase(addQuestion.rejected, (state, action) => {
        state.questionLoading = false;
        state.error = action.payload;
      })

      //Get Questions with Paginations-------------

      .addCase(getQuestions.pending, (state) => {
        state.questionLoading = true;
      })
      .addCase(getQuestions.fulfilled, (state, action) => {
        state.questionLoading = false;
        state.question = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.error = null;
      })
      .addCase(getQuestions.rejected, (state, action) => {
        state.questionLoading = false;
        state.error = action.payload;
      })

      .addCase(updateQuestionbyid.pending, (state) => {
        state.questionLoading = true;
      })
      .addCase(updateQuestionbyid.fulfilled, (state, action) => {
        state.questionLoading = false;
        state.question = state.question.map((item) =>
          item._id === action.payload.data._id ? action.payload.data : item
        );
      })
      .addCase(updateQuestionbyid.rejected, (state, action) => {
        state.questionLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteQuestionbyid.pending, (state) => {
        state.questionLoading = true;
      })
      .addCase(deleteQuestionbyid.fulfilled, (state, action) => {
        state.questionLoading = false;
        const { _id } = action.payload.data;
        if (_id) {
          state.question = state.question.filter((f) => f._id !== _id);
          // state?.delQuestion?.unshift(action?.payload?.data)
        }
      })
      .addCase(deleteQuestionbyid.rejected, (state, action) => {
        state.questionLoading = false;
        state.error = action.payload;
      });
  },
});

export default questionSliceDetails.reducer;
