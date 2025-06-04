import { Outlet, useNavigate } from "react-router-dom";
// import Navbar from "./Navbar";
import { useEffect } from "react";
import DummyNavbar from "../../../components/DummyNavBar";

const MainLayoutDummmy = () => {
  const isDummy = sessionStorage.getItem("isDummy");
  const redirectURL = sessionStorage.getItem("redirectURL");
  const navigate = useNavigate();

  useEffect(() => {
    if (isDummy !== "true") {
      //   navigate(`/${redirectURL}`, { replace: true });
      navigate(`/`, { replace: true });
    }
  }, [isDummy, navigate]);

  if (isDummy !== "true") {
    return null; // Or loading spinner while redirecting
  }

  return (
    <>
      <DummyNavbar />
      <Outlet />
    </>
  );
};

export default MainLayoutDummmy;
