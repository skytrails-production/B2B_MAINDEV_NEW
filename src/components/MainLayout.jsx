import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useEffect } from "react";
import NavbarVisa from "./NavbarVisa";

const MainLayout = () => {
  const isDummy = sessionStorage.getItem("isDummy");
  const redirectURL = sessionStorage.getItem("redirectURL");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isDummy) {
      navigate(`/${redirectURL}`, { replace: true });
    }
  }, [isDummy, navigate]);

  if (isDummy) {
    return null; // Or loading spinner while redirecting
  }

  return (
    <>
      {location.pathname.includes("visa") ? <NavbarVisa /> : <Navbar />}
      <Outlet />
    </>
  );
};

export default MainLayout;
