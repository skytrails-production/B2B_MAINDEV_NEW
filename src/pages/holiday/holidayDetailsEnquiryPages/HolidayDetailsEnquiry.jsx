import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { searchOnePackageAction } from "../../../Redux/OnePackageSearchResult/actionOneSearchPackage";
import packLoader from "../../../images/packLoader.png";
import { motion } from "motion/react";
import HolidayDetailsBottomDetails from "./HolidayDetailsBottomDetails";
import HolidayEnquiryForm from "./HolidayEnquiryForm";
import HolidayDetailsGallery from "./HolidayDetailsGallery";
import HolidayOtherDetails from "./HolidayOtherDetails";
// import Navbar from "../../navbar/Navbar";

const HolidayDetailsEnquiry = () => {
  const dispatch = useDispatch();
  const reducerState = useSelector((state) => state);
  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState(null);
  const [loading, setLoading] = useState(true);
  const onePackage =
    reducerState?.searchOneResult?.OneSearchPackageResult?.data?.data;

  const [searchParams] = useSearchParams();
  const id = searchParams.get("packageId");

  useEffect(() => {
    const payload = {
      id,
    };
    dispatch(searchOnePackageAction(payload));
  }, []);

  const fixedTime = () =>
    setTimeout(() => {
      setLoading(false);
    }, 1500);

  useEffect(() => {
    fixedTime();
  }, [reducerState?.searchOneResult?.OneSearchPackageResult?.data?.data]);

  return (
    <>
      {loading && (
        <div
          id="loading-overlay"
          class="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-40"
        >
          <motion.img
            src={packLoader}
            alt=""
            className="w-60"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      )}
      {/* ) : ( */}
      <section className="pt-4 bg-white">
        {/* <Navbar /> */}
        <div className="container ">
          <HolidayDetailsGallery
            data={onePackage}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />

          <div className="mt-4 row">
            <div className="col-lg-8">
              <HolidayDetailsBottomDetails
                packageData={onePackage}
                setIsOpen={setIsOpen}
                filterType={filterType}
                setFilterType={setFilterType}
              />
            </div>
            <div className="col-lg-4">
              <HolidayEnquiryForm
                onePackage={onePackage}
                filterType={filterType}
              />
            </div>
          </div>

          <HolidayOtherDetails data={onePackage} />
        </div>
      </section>
      {/* )} */}
    </>
  );
};

export default HolidayDetailsEnquiry;
