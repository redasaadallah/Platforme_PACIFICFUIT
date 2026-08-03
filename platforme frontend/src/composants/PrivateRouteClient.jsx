import { Navigate } from "react-router-dom";

const PrivateRouteClient = ({ children }) => {
  const token = sessionStorage.getItem("client");

  return token ? children : <Navigate to="/reservation" />;
};

export default PrivateRouteClient;