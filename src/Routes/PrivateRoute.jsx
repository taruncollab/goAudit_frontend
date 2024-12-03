import { Navigate, useLocation, matchPath } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const allowedPathsForU = ["/showforms", "/formrecords", "/draftform"];

  const dynamicRoutesForU = ["/fillform/:id?", "/formdetails/:id", "/draftfillform/:id?"];

  const isAllowed =
    allowedPathsForU.includes(location.pathname) ||
    dynamicRoutesForU.some((route) => matchPath(route, location.pathname));

  if (user.role == "U" && !isAllowed) {
    return <Navigate to="/showforms" replace />;
  }

  return children;
};

export default ProtectedRoute;
