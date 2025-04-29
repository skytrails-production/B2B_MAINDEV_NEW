import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      {/* Footer bhi yahin add kar sakte ho */}
    </>
  );
};

export default MainLayout;
