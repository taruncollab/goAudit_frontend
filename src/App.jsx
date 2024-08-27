// import React, { lazy, Suspense, useEffect, useState } from "react";
// import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { getUserByToken, getUsers } from "./apis/authSlice";
// import { getDashboardCount } from "./apis/dashboardSlice";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { ThemeProvider, createTheme } from "@mui/material/styles";

// const Layout = lazy(() => import("./Layout/Layout"));
// const Login = lazy(() => import("./pages/auth/Login"));
// const SignUp = lazy(() => import("./pages/auth/SignUp"));
// const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
// const Company = lazy(() => import("./pages/company/Company"));
// const Location = lazy(() => import("./pages/location/Location"));
// const Category = lazy(() => import("./pages/category/Category"));
// const Question = lazy(() => import("./pages/question/Question"));
// const QuestionForm = lazy(() => import("./pages/question/QuestionForm"));
// const QuestionDetails = lazy(() => import("./pages/question/QuestionDetails"));
// const ShowForms = lazy(() => import("./pages/form/ShowForms"));
// const Form = lazy(() => import("./pages/form/Form"));
// const FormRecords = lazy(() => import("./pages/form/formRecords"));
// const FormDetails = lazy(() => import("./pages/form/FormDetails"));
// const CompareScore = lazy(() => import("./pages/Compare/CompareScore"));

// const LoadingSpinner = () => (
//   <div className="loading-spinner">
//     <div className="loader"></div>
//   </div>
// );

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#1976d2",
//     },
//     secondary: {
//       main: "#dc004e",
//     },
//   },
//   typography: {
//     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
//   },
// });

// function App() {
//   const dispatch = useDispatch();
//   const [expire, setExpire] = useState(false);

//   useEffect(() => {
//     dispatch(getUsers());
//     dispatch(getDashboardCount());

//     const checkToken = async () => {
//       const res = await dispatch(getUserByToken());
//       if (res?.type?.includes("rejected")) {
//         localStorage?.removeItem("userToken");
//         setExpire(true);
//       }
//     };

//     checkToken();
//   }, [dispatch]);

//   return (
//     <ThemeProvider theme={theme}>
//       <BrowserRouter>
//         <ToastContainer />
//         <Suspense fallback={<LoadingSpinner />}>
//           <Routes>
//             <Route path="/login" element={<Login />} />
//             <Route path="/signup" element={<SignUp />} />
//             {expire ? (
//               <Route path="*" element={<Navigate to="/login" replace />} />
//             ) : (
//               <>
//                 <Route
//                   path="/"
//                   element={
//                     <Layout>
//                       <Dashboard />
//                     </Layout>
//                   }
//                 />
//                 <Route
//                   path="/company"
//                   element={
//                     <Layout>
//                       <Company />
//                     </Layout>
//                   }
//                 />
//                 <Route
//                   path="/location"
//                   element={
//                     <Layout>
//                       <Location />
//                     </Layout>
//                   }
//                 />
//                 <Route
//                   path="/category"
//                   element={
//                     <Layout>
//                       <Category />
//                     </Layout>
//                   }
//                 />
//                 <Route
//                   path="/question"
//                   element={
//                     <Layout>
//                       <Question />
//                     </Layout>
//                   }
//                 />
//                 <Route
//                   path="/questionform/:id?"
//                   element={
//                     <Layout>
//                       <QuestionForm />
//                     </Layout>
//                   }
//                 />
//                 <Route
//                   path="/questiondetails/:id"
//                   element={
//                     <Layout>
//                       <QuestionDetails />
//                     </Layout>
//                   }
//                 />
//                 <Route
//                   path="/showforms"
//                   element={
//                     <Layout>
//                       <ShowForms />
//                     </Layout>
//                   }
//                 />
//                 <Route
//                   path="/fillform/:id?"
//                   element={
//                     <Layout>
//                       <Form />
//                     </Layout>
//                   }
//                 />
//                 <Route
//                   path="/formrecords"
//                   element={
//                     <Layout>
//                       <FormRecords />
//                     </Layout>
//                   }
//                 />
//                 <Route
//                   path="/formdetails/:id"
//                   element={
//                     <Layout>
//                       <FormDetails />
//                     </Layout>
//                   }
//                 />
//                 <Route
//                   path="/comparescore"
//                   element={
//                     <Layout>
//                       <CompareScore />
//                     </Layout>
//                   }
//                 />
//               </>
//             )}
//           </Routes>
//         </Suspense>
//       </BrowserRouter>
//     </ThemeProvider>
//   );
// }

// export default App;

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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
import { getUserByToken, getUsers } from "./apis/authSlice";

import CompareScore from "./pages/Compare/CompareScore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Category from "./pages/category/Category";
import { getDashboardCount } from "./apis/dashboardSlice";

function App() {
  const dispatch = useDispatch();
  const [expire, setExpire] = useState(false);

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getDashboardCount());

    const checkToken = async () => {
      const res = await dispatch(getUserByToken());
      if (res?.type?.includes("rejected")) {
        localStorage.removeItem("userToken");
        setExpire(true);
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
            path="/category"
            element={
              <Layout>
                <Category />
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
