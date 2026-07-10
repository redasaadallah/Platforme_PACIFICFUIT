import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user"); // check if logged in

  if (!user) {
    // Not logged in → redirect to login
    return <Navigate to="connect" replace />;
  }

  return children; // user is logged in → show page
}

export default ProtectedRoute;
