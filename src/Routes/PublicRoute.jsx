// PublicRoute.js
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../common/common";

const PublicRoute = ({ children }) => {
  return !isAuthenticated() ? children : <Navigate to="/dashboard" />;
};

export default PublicRoute;