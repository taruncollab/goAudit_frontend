import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../apis/authSlice";
import companySlice from "../apis/companySlice";
import locationSlice from "../apis/locationSlice";
import categorySlice from "../apis/categorySlice";
import questionSlice from "../apis/questionSlice";
import formSlice from "../apis/formSlice";

const store = configureStore({
    reducer:{
        authData: authSlice,
        companyData: companySlice,
        locationData: locationSlice,
        categoryData: categorySlice,
        questionData: questionSlice,
        formData: formSlice,
    }
})
 
export default store;