import React from "react";
import { Spin } from "antd";
import PackageResultCard from "./PackageResultCard";

const HolidayResult = ({ packages, priceRange, searchTerm }) => {
  let filteredPackages = packages?.filter((pkg) => {
    if (
      searchTerm &&
      !pkg?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    if (
      pkg?.packageAmount?.[0]?.amount &&
      pkg?.packageAmount?.[0]?.amount >= priceRange[0] &&
      pkg?.packageAmount?.[0]?.amount <= priceRange[1]
    ) {
      return true;
    }
    // return true;
  });

  return (
    <div className="row g-4">
      {packages && packages.length === 0 ? (
        <div className="flex items-center justify-center h-screen w-200">
          <Spin size="large" />
        </div>
      ) : filteredPackages && filteredPackages.length > 0 ? (
        filteredPackages.map((pkg, index) => (
          <div key={index} className="col-lg-6">
            <PackageResultCard shadoww={"shadow-lg"} data={pkg} />
          </div>
        ))
      ) : (
        <div className="text-center w-100">No packages found</div>
      )}
    </div>
  );
};

export default HolidayResult;
