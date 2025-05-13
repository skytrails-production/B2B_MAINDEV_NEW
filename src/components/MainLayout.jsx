import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useEffect } from "react";

const MainLayout = () => {
  const isDummy = sessionStorage.getItem("isDummy");
  const redirectURL = sessionStorage.getItem("redirectURL");
  const navigate = useNavigate();
  console.log(isDummy, "isDummy");

  // useEffect(() => {
  //   if (isDummy === "true") {
  //     navigate(`/${redirectURL}`, { replace: true });
  //   }
  // }, [isDummy, navigate]);

  // if (isDummy === "true") {
  //   return null; // Or loading spinner while redirecting
  // }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default MainLayout;
