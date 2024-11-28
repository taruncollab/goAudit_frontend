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
import Layout from "./Layout/Layout";
import { RoutesArray } from "./common/utils";
import ProtectedRoute from "./Routes/PrivateRoute";
import PublicRoute from "./Routes/PublicRoute";
import Dashboard from "./pages/dashboard/Dashboard";
import NotFound from "./pages/404/404";

function App() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const { auth } = useSelector((state) => state.authData);

  useEffect(() => {
    const initializeApp = async () => {
      await dispatch(getUsers());
      await dispatch(getDashboardCount());

      const res = await dispatch(getUserByToken());
      if (res?.type?.includes("rejected")) {
        localStorage.removeItem("userToken");
      }
      setLoading(false); // Set loading to false after initialization
    };

    initializeApp();
  }, [dispatch]);

  // Show a loading screen until app initialization is complete
  if (loading) {
    return <div>Loading...</div>;
  }

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

          {/* <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          /> */}

          {/* Dynamic Routes */}
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

          <Route
            path="/"
            element={<Navigate to={auth ? "/dashboard" : "/login"} />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
