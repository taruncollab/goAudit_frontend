import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../apis/authSlice";
import companySlice from "../apis/companySlice";
import locationSlice from "../apis/locationSlice";
import categorySlice from "../apis/categorySlice";
import questionSlice from "../apis/questionSlice";
import formSlice from "../apis/formSlice";
import dashboardSliceDetails from "../apis/dashboardSlice";

const store = configureStore({
  reducer: {
    authData: authSlice,
    companyData: companySlice,
    locationData: locationSlice,
    categoryData: categorySlice,
    questionData: questionSlice,
    formData: formSlice,
    dashboardData: dashboardSliceDetails,
  },
});

export default store;
