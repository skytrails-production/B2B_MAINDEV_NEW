import { useState } from "react";
import { useSelector } from "react-redux";
import store from "../../Redux/store";
const FlightSearchUtility = () => {
  const airlineSeatMap = useSelector((state) => state?.airlineSeatMap);
  return <div></div>;
};

export default FlightSearchUtility;
