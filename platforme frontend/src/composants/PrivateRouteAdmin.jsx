import { Navigate } from "react-router-dom";

const PrivateRouteAdmin = ({ children }) => {
  const token = localStorage.getItem("admin");

  return token ? children : <Navigate to="/admin" />;
};

//  login + JWT
//  protected routes propres
//  auto redirect après login
//  logout sécurisé
//  anti-back button (ton problème initial)
//JWT + Refresh Token
export default PrivateRouteAdmin;