import {
  BrowserRouter,
  Navigate,
  redirect,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Company from "./pages/company/Company";
import Layout from "./Layout/Layout";
import Location from "./pages/location/Location";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Question from "./pages/question/Question";
import QuestionForm from "./pages/question/QuestionForm";
import QuestionDetails from "./pages/question/QuestionDetails";
import ShowForms from "./pages/form/ShowForms";
import Form from "./pages/form/Form";
import FormRecords from "./pages/form/formRecords";
import FormDetails from "./pages/form/FormDetails";
import Dashboard from "./pages/dashboard/Dashboard";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCompanies, getDeletedCompanies } from "./apis/companySlice";
import { getUserByToken, getUsers } from "./apis/authSlice";
import { getAllCategories } from "./apis/categorySlice";
import { getQuestions } from "./apis/questionSlice";
import { getForms } from "./apis/formSlice";
import { getDeletedLocations, getLocations } from "./apis/locationSlice";
import CompareScore from "./pages/Compare/CompareScore";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const dispatch = useDispatch();
  const [expire, setExpire] = useState(false)

  useEffect(() => {
    dispatch(getUsers());
    // dispatch(getCompanies());
    // dispatch(getDeletedCompanies());
    // dispatch(getLocations());
    // dispatch(getDeletedLocations());
    dispatch(getAllCategories());
    // dispatch(getQuestions());
    // dispatch(getForms());

    const checkToken = async () => {
      const res = await dispatch(getUserByToken());
      if (res.type.includes("rejected")) {
        localStorage.removeItem("userToken");
        setExpire(true)
      }
    };
    
    checkToken();
  }, []);
  
  useEffect(() => {
    if (expire) {
      <Navigate to={"/login"} />;
      
    }
  }, [expire]);

  return (
    <>
      <BrowserRouter>
      <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route
            path="/"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/company"
            element={
              <Layout>
                <Company />
              </Layout>
            }
          />
          <Route
            path="/location"
            element={
              <Layout>
                <Location />
              </Layout>
            }
          />
          <Route
            path="/question"
            element={
              <Layout>
                <Question />
              </Layout>
            }
          />
          <Route
            path="/questionform/:id?"
            element={
              <Layout>
                <QuestionForm />
              </Layout>
            }
          />
          <Route
            path="/questiondetails/:id"
            element={
              <Layout>
                <QuestionDetails />
              </Layout>
            }
          />
          <Route
            path="/showforms"
            element={
              <Layout>
                <ShowForms />
              </Layout>
            }
          />
          <Route
            path="/fillform/:id?"
            element={
              <Layout>
                <Form />
              </Layout>
            }
          />
          <Route
            path="/formrecords"
            element={
              <Layout>
                <FormRecords />
              </Layout>
            }
          />
          <Route
            path="/formdetails/:id"
            element={
              <Layout>
                <FormDetails />
              </Layout>
            }
          />
          <Route
            path="/comparescore"
            element={
              <Layout>
                <CompareScore />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
