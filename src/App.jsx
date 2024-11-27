import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserByToken, getUsers } from "./apis/authSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getDashboardCount } from "./apis/dashboardSlice";
import Layout from "../src/Layout/Layout";
import { RoutesArray } from "./common/utils";
import ProtectedRoute from "./Routes/PrivateRoute";
import PublicRoute from "./Routes/PublicRoute";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  const dispatch = useDispatch();

  const [expire, setExpire] = useState(false);
  const { auth } = useSelector((state) => state.authData);

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
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          {RoutesArray &&
            RoutesArray.map((item, index) => (
              <Route
                key={index}
                path={item.link}
                element={
                  <ProtectedRoute>
                    <Layout>
                      <item.component />
                    </Layout>
                  </ProtectedRoute>
                }
              />
            ))}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
