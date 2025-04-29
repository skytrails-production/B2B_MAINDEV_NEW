import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
const ProtectedLayout = () => {
  const userData = useSelector((state) => state?.logIn);
  return userData?.loginData?.id ? (
    <Outlet />
  ) : (
    <Navigate to="/itinerary" replace />
  );
  //   return <div>ProtectedLayout</div>;
};

export default ProtectedLayout;
