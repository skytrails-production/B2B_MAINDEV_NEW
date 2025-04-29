import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "../../Redux/store";
import userApi from "../../Redux/API/api";
import { convertXmlToJson } from "./newFlightBookingAmdUtility";

import { apiURL } from "../../Constants/constant";
import { XMLParser } from "fast-xml-parser";
import { startBookingProcessAMD_New } from "./flightbookingAmdUtility";
import moment from "moment";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import axios from "axios";

dayjs.extend(utc);

const convertToISO = (dateString, timeString) => {
  if (dateString && timeString) {
    // Extract date components
    const day = dateString.slice(0, 2); // "03"
    const month = dateString.slice(2, 4); // "04"
    const year = `20${dateString.slice(4, 6)}`; // "25"

    // Extract time components
    const hour = timeString.slice(0, 2); // "04" or "02"
    const minute = timeString.slice(2, 4); // "30" or "15"

    // Combine date and time and format to ISO
    return dayjs.utc(`${year}-${month}-${day}T${hour}:${minute}:00`).format(); // Default output is ISO format
  }
};

// export const useSeatUtility = () => {
//   const airlineSeatMap = useSelector((state) => state?.airlineSeatMap);

//   // const airlineSeatMap = [
//   //   [
//   //     {
//   //       seat: "F16",
//   //       amount: 1059,
//   //       currency: "INR",
//   //     },
//   //     {
//   //       seat: "F7",
//   //       amount: 1323,
//   //       currency: "INR",
//   //     },
//   //   ],
//   //   [
//   //     {
//   //       seat: "F7",
//   //       amount: 0,
//   //     },
//   //     {
//   //       seat: "F14",
//   //       amount: 0,
//   //     },
//   //   ],
//   // ];
//   // let seatGroup = `<seatGroup>
//   //       <seatRequest>
//   //         <special>
//   //           <data>${"10B"}</data>
//   //         </special>
//   //       </seatRequest>
//   //     </seatGroup>`;
//   // let dataElementsIndiv = `
//   //   <dataElementsIndiv>
//   //     <elementManagementData>
//   //       <segmentName>STR</segmentName>
//   //     </elementManagementData>
//   //     ${seatGroup}
//   //     <referenceForDataElement>
//   //       <reference>
//   //         <qualifier>PR</qualifier>
//   //         <number>1</number>
//   //       </reference>
//   //       <reference>
//   //         <qualifier>ST</qualifier>
//   //         <number>1</number>
//   //       </reference>
//   //     </referenceForDataElement>
//   //   </dataElementsIndiv>`;
//   console.log(airlineSeatMap, "airlineSeatMap");
//   let dataElementsIndiv = "";
//   if (Array.isArray(airlineSeatMap?.seatList)) {
//     airlineSeatMap?.seatList.forEach((flight, index) => {
//       let seatGroup = "";
//       flight.forEach((seat) => {
//         console.log(seat, "flight");
//         //         seatGroup += `
//         // <seatRequest>
//         // <special>
//         // <data>${seat.seat}</data>
//         // </special>
//         // </seatRequest>
//         // `;
//         seatGroup += `

// <data>${seat?.seat}</data>

// `;
//       });
//       dataElementsIndiv += `
//     <dataElementsIndiv>
//       <elementManagementData>
//         <segmentName>STR</segmentName>
//       </elementManagementData>
//       <seatGroup>
//       <seatRequest>
//  <special>
//       ${seatGroup}
//       </special>
// </seatRequest>

//       </seatGroup>
//       <referenceForDataElement>
//         <reference>
//           <qualifier>PR</qualifier>
//           <number>1</number>
//         </reference>
//         <reference>
//           <qualifier>ST</qualifier>
//           <number>${index + 1}</number>
//         </reference>
//       </referenceForDataElement>
//     </dataElementsIndiv>`;
//     });
//   }
//   // console.log(dataElementsIndiv, "reducer stateddddd");
//   return dataElementsIndiv;
// };

export const useSeatUtility = () => {
  const airlineSeatMap = useSelector((state) => state?.airlineSeatMap);

  let dataElementsIndiv = "";
  let seatIndex = 1; // To ensure unique seat references

  if (Array.isArray(airlineSeatMap?.seatList)) {
    airlineSeatMap?.seatList.forEach((flight, passengerIndex) => {
      let seatGroup = "";

      flight.forEach((seat) => {
        // console.log(seat, "flight");

        seatGroup += `
          <seatRequest>
            <special>
              <data>${seat?.seat}</data>
            </special>
          </seatRequest>
        `;

        // Ensure seatIndex is unique for each seat
        seatIndex++;
      });

      dataElementsIndiv += `
        <dataElementsIndiv>
          <elementManagementData>
            <segmentName>STR</segmentName>
          </elementManagementData>
          <seatGroup>
            ${seatGroup}
          </seatGroup>
          <referenceForDataElement>
            <reference>
              <qualifier>PR</qualifier>
              <number>${passengerIndex + 1}</number> 
            </reference>
            <reference>
              <qualifier>ST</qualifier>
              <number>${seatIndex}</number> 
            </reference>
          </referenceForDataElement>
        </dataElementsIndiv>`;
    });
  }

  // console.log(
  //   dataElementsIndiv,
  //   "Generated seat request for multiple passengers"
  // );
  return dataElementsIndiv;
};
const fetchDataAirlse = async ({
  sesstioResultIndex,
  // setAirsellRes,
  // setXmlData,
  adultCount,
  childCount,
  infantCount,
}) => {
  // console.log(sesstioResultIndex, "sesstionResultIndex");
  function appendSegment() {
    let text = "";

    for (let i = 0; i < sesstioResultIndex?.flightDetails?.length; i++) {
      let isOther = false;
      let index = 0;
      if (0 < childCount || 0 < infantCount) {
        isOther = true;
        if (i < adultCount) {
          index = 0;
        } else if (adultCount < i && i < childCount) {
          index = 1;
        } else if (adultCount < i && childCount < i && i < infantCount) {
          index = 2;
        }
      }
      isOther = false;

      text += ` <segmentInformation>
                        <travelProductInformation>
                            <flightDate>
                                <departureDate>${
                                  isOther
                                    ? sesstioResultIndex[0]?.flightDetails[i]
                                        ?.flightInformation?.productDateTime
                                        ?.dateOfDeparture
                                    : sesstioResultIndex?.flightDetails[i]
                                        ?.flightInformation?.productDateTime
                                        ?.dateOfDeparture
                                }</departureDate>
                            </flightDate>
                            <boardPointDetails>
                                <trueLocationId>${
                                  isOther
                                    ? sesstioResultIndex[0]?.flightDetails[i]
                                        ?.flightInformation?.location[0]
                                        ?.locationId
                                    : sesstioResultIndex?.flightDetails[i]
                                        ?.flightInformation?.location[0]
                                        ?.locationId
                                }</trueLocationId>
                            </boardPointDetails>
                            <offpointDetails>
                                <trueLocationId>${
                                  isOther
                                    ? sesstioResultIndex[0]?.flightDetails[i]
                                        ?.flightInformation?.location[1]
                                        ?.locationId
                                    : sesstioResultIndex?.flightDetails[i]
                                        ?.flightInformation?.location[1]
                                        ?.locationId
                                }</trueLocationId>
                            </offpointDetails>
                            <companyDetails>
                                <marketingCompany>${
                                  isOther
                                    ? sesstioResultIndex[0]?.flightDetails[i]
                                        ?.flightInformation?.companyId
                                        ?.marketingCarrier
                                    : sesstioResultIndex?.flightDetails[i]
                                        ?.flightInformation?.companyId
                                        ?.marketingCarrier
                                }</marketingCompany>
                            </companyDetails>
                            <flightIdentification>
                                <flightNumber>${
                                  isOther
                                    ? sesstioResultIndex[0]?.flightDetails[i]
                                        ?.flightInformation?.flightOrtrainNumber
                                    : sesstioResultIndex?.flightDetails[i]
                                        ?.flightInformation?.flightOrtrainNumber
                                }</flightNumber>
                                <bookingClass>${
                                  sesstioResultIndex[0]?.fareDetails
                                    ?.groupOfFares?.productInformation
                                    ?.cabinProduct?.rbd ||
                                  sesstioResultIndex?.fareDetails?.groupOfFares
                                    ?.productInformation?.cabinProduct?.rbd ||
                                  sesstioResultIndex[0]?.fareDetails
                                    ?.groupOfFares?.productInformation
                                    ?.cabinProduct?.rbd ||
                                  sesstioResultIndex?.fareDetails?.groupOfFares[
                                    i
                                  ]?.productInformation?.cabinProduct?.rbd ||
                                  sesstioResultIndex?.fareDetails?.groupOfFares
                                    ?.productInformation?.cabinProduct?.rbd ||
                                  sesstioResultIndex?.fareDetails
                                    ?.groupOfFares[0]?.productInformation
                                    ?.cabinProduct?.rbd ||
                                  sesstioResultIndex?.fareDetails
                                    ?.groupOfFares[0]?.productInformation
                                    ?.cabinProduct?.rbd ||
                                  sesstioResultIndex[0]?.fareDetails
                                    ?.groupOfFares[0]?.productInformation
                                    ?.cabinProduct?.rbd ||
                                  sesstioResultIndex?.fareDetails
                                    ?.groupOfFares[0]?.productInformation
                                    ?.cabinProduct[0]?.rbd
                                }</bookingClass>
                            </flightIdentification>
                        </travelProductInformation>
                        <relatedproductInformation>
                            <quantity>${
                              Number(adultCount) + Number(childCount)
                            }</quantity>
                            <statusCode>NN</statusCode>
                        </relatedproductInformation>
                    </segmentInformation>
  `;
    }

    return text;
  }
  const segmentImformation = sesstioResultIndex?.flightDetails
    ?.flightInformation
    ? `
       <segmentInformation>
                        <travelProductInformation>
                            <flightDate>
                                <departureDate>${
                                  sesstioResultIndex[0]?.flightDetails
                                    ?.flightInformation?.productDateTime
                                    ?.dateOfDeparture ||
                                  sesstioResultIndex?.flightDetails[0]
                                    ?.flightInformation?.productDateTime
                                    ?.dateOfDeparture ||
                                  sesstioResultIndex[0]?.flightDetails
                                    ?.flightDetails?.flightInformation
                                    ?.productDateTime?.dateOfDeparture ||
                                  sesstioResultIndex?.flightDetails
                                    ?.flightDetails?.flightInformation
                                    ?.productDateTime?.dateOfDeparture ||
                                  sesstioResultIndex?.flightDetails
                                    ?.flightInformation?.productDateTime
                                    ?.dateOfDeparture
                                }</departureDate>
                            </flightDate>
                            <boardPointDetails>
                                <trueLocationId>${
                                  sesstioResultIndex?.flightDetails
                                    ?.flightInformation?.location[0]?.locationId
                                }</trueLocationId>
                            </boardPointDetails>
                            <offpointDetails>
                                <trueLocationId>${
                                  sesstioResultIndex?.flightDetails
                                    ?.flightInformation?.location[1]?.locationId
                                }</trueLocationId>
                            </offpointDetails>
                            <companyDetails>
                                <marketingCompany>${
                                  sesstioResultIndex?.flightDetails
                                    ?.flightInformation?.companyId
                                    ?.marketingCarrier
                                }</marketingCompany>
                            </companyDetails>
                            <flightIdentification>
                                <flightNumber>${
                                  sesstioResultIndex?.flightDetails
                                    ?.flightInformation?.flightOrtrainNumber
                                }</flightNumber>
                                <bookingClass>${
                                  // sesstioResultIndex?.fareDetails?.groupOfFares
                                  //   ?.productInformation
                                  //   ? sesstioResultIndex?.fareDetails
                                  //       ?.groupOfFares?.productInformation
                                  //       ?.cabinProduct?.rbd
                                  //   : sesstioResultIndex[0]?.fareDetails
                                  //       ?.groupOfFares[0]?.productInformation
                                  //       ?.cabinProduct?.rbd

                                  sesstioResultIndex[0]?.fareDetails
                                    ?.groupOfFares?.productInformation
                                    ?.cabinProduct?.rbd ||
                                  sesstioResultIndex?.fareDetails?.groupOfFares
                                    ?.productInformation?.cabinProduct?.rbd ||
                                  sesstioResultIndex[0]?.fareDetails
                                    ?.groupOfFares?.productInformation
                                    ?.cabinProduct?.rbd ||
                                  sesstioResultIndex?.fareDetails
                                    ?.groupOfFares[0]?.productInformation
                                    ?.cabinProduct?.rbd ||
                                  sesstioResultIndex?.fareDetails?.groupOfFares
                                    ?.productInformation?.cabinProduct?.rbd ||
                                  sesstioResultIndex?.fareDetails
                                    ?.groupOfFares[0]?.productInformation
                                    ?.cabinProduct?.rbd ||
                                  sesstioResultIndex[0]?.fareDetails
                                    ?.groupOfFares[0]?.productInformation
                                    ?.cabinProduct?.rbd ||
                                  sesstioResultIndex?.fareDetails
                                    ?.groupOfFares[0]?.productInformation
                                    ?.cabinProduct[0]?.rbd
                                }</bookingClass>
                            </flightIdentification>
                        </travelProductInformation>
                        <relatedproductInformation>
                            <quantity>${
                              Number(adultCount) + Number(childCount)
                            }</quantity>
                            <statusCode>NN</statusCode>
                        </relatedproductInformation>
                    </segmentInformation>
  `
    : appendSegment();

  const payload = `<Air_SellFromRecommendation>
                <messageActionDetails>
                    <messageFunctionDetails>
                        <messageFunction>183</messageFunction>
                        <additionalMessageFunction>M1</additionalMessageFunction>
                    </messageFunctionDetails>
                </messageActionDetails>
                <itineraryDetails>
                    <originDestinationDetails>
                        <origin>${
                          sesstioResultIndex?.flightDetails?.flightInformation
                            ? sesstioResultIndex?.flightDetails
                                ?.flightInformation?.location[0]?.locationId
                            : sesstioResultIndex?.flightDetails[0]
                                ?.flightInformation?.location[0]?.locationId
                        }</origin>
                        <destination>${
                          sesstioResultIndex?.flightDetails?.flightInformation
                            ? sesstioResultIndex?.flightDetails
                                ?.flightInformation?.location[1]?.locationId
                            : sesstioResultIndex?.flightDetails[
                                sesstioResultIndex?.flightDetails?.length - 1
                              ]?.flightInformation?.location[1]?.locationId
                        }</destination>
                    </originDestinationDetails>
                    <message>
                        <messageFunctionDetails>
                            <messageFunction>183</messageFunction>
                        </messageFunctionDetails>
                    </message>
                  
                    ${segmentImformation}

                </itineraryDetails>
            </Air_SellFromRecommendation>`;

  const res = await userApi?.fetchAirsel(payload);
  const airselXml = await convertXmlToJson(res?.data?.data?.data);
  // console.log(airselXml, "airselXml");
  const headers = res?.data?.data?.headers;
  return { airselXml: airselXml, headers: headers };
  // setAirsellRes(res?.data);
  // setXmlData(res?.data?.data?.data);
};
export const fareQuateRuleAirsel = async (type) => {
  const reducerState = store.getState();
  // console.log(reducerState, "reducerState");

  const fareCode = reducerState?.fareQuoteRuleAirselReducer?.return;

  // console.log(fareCode, "fareCodeeee");
  // if (
  //   0 < fareCode.length ||
  //   reducerState?.fareQuoteRuleAirselReducer?.isLoading == true
  // ) {
  //   console.log(fareCode, "fareCodeeee2");
  //   return fareCode;
  // }

  const Onward = reducerState?.returnSelected?.returnSelectedFlight?.onward;
  const Return = reducerState?.returnSelected?.returnSelectedFlight?.return;

  const {
    journeyFlightParam,
    journeyFlightTvoTraceId,
    returnFlightParam,
    returnFlightTvoTraceId,
  } = reducerState?.return;
  const handleDispatch = async (flight, type) => {
    // console.log(flight, "handleDispatch");

    if (flight.type == "TBO") {
      const ResultIndex =
        type == "onward"
          ? Onward?.flight?.ResultIndex
          : Return?.flight?.ResultIndex;
      const TraceId =
        type == "onward" ? journeyFlightTvoTraceId : returnFlightTvoTraceId;

      const payload = {
        EndUserIp: reducerState?.ip?.ipData,
        TokenId: reducerState?.ip?.tokenData,
        TraceId: TraceId,
        ResultIndex: ResultIndex,
      };
      const flightQuote = await userApi?.flightQuoteSearch(payload);
      const flightRule = await userApi?.flightRuleSearch(payload);

      // console.log(data, "hiioioiooo");
      return { flightQuote: flightQuote, flightRule: flightRule };
    } else if (flight.type == "KAFILA") {
      const Param = type == "onward" ? journeyFlightParam : returnFlightParam;
      const SelectedFlights =
        type == "onward" ? Onward?.flight : Return?.flight;
      const payload = {
        Param: Param,
        SelectedFlights: [SelectedFlights],
      };
      const data = await userApi?.kafilaFareCheck(payload);

      // console.log(data, "kafiladata");
      return data;
    } else if (flight.type == "AMD") {
      // const adultCount = 1;
      // const childCount = 0;
      // const infantCount = 0;
      const adultCount = sessionStorage.getItem("adults");
      const childCount = sessionStorage.getItem("childs");
      const infantCount = sessionStorage.getItem("infants");
      const sesstioResultIndex =
        type == "onward" ? Onward?.flight : Return?.flight;

      const data = await fetchDataAirlse({
        sesstioResultIndex,
        adultCount,
        childCount,
        infantCount,
      });
      // console.log(data, "Airseldata");
      return data;
    }
  };
  if (type == "onward") {
    const fareCodeFareRule = await handleDispatch(Onward, type);
    // console.log(fareCodeFareRule, "onwardFarecoed");
    // dispatch(fetchFlightQuotesAireselSucessOneway(fareCodeFareRule));
    return fareCodeFareRule;
  } else {
    const fareCodeFareRule = await handleDispatch(Return, type);
    // console.log(fareCodeFareRule, "ReturnFarecoed");
    // dispatch(fetchFlightQuotesAireselSucessReturn(fareCodeFareRule));
    return fareCodeFareRule;
  }
};

export const fareQuateRuleAirselErrorCheck = async (type) => {
  const reducerState = store.getState();

  const fareCode = reducerState?.fareQuoteRuleAirselReducer?.return;

  // console.log(fareCode, "fareCodeeee");

  const Onward = reducerState?.returnSelected?.returnSelectedFlight?.onward;
  const Return = reducerState?.returnSelected?.returnSelectedFlight?.return;
  const flightQuoteOnward = reducerState?.fareQuoteRuleAirselReducer?.oneway;
  // ?.flightQuote;
  const flightQuoteReturn = reducerState?.fareQuoteRuleAirselReducer?.return;
  // ?.flightQuote;

  const handleErrorCheck = async (flight, type) => {
    // console.log(flight, "handleDispatch");

    if (flight.type == "TBO") {
      const flightQuoteTBO =
        type == "onward"
          ? reducerState?.fareQuoteRuleAirselReducer?.oneway?.flightQuote
          : reducerState?.fareQuoteRuleAirselReducer?.return?.flightQuote;
      if (flightQuoteTBO?.error == true) {
        // console.log("tboiferror");
        return {
          error: true,
          loading: false,
          message: flightQuoteTBO,
        };
      } else if (
        flightQuoteTBO?.data?.data?.Response?.Error?.ErrorCode &&
        flightQuoteTBO?.data?.data?.Response?.Error?.ErrorCode != 0
      ) {
        // console.log("tboelseiferror");
        return {
          error: true,
          loading: false,
          message: flightQuoteTBO?.data?.data?.Response?.Error?.ErrorMessage,
        };
      } else {
        return {
          error: false,
          loading: false,
          message: "Fare Quote Found",
        };
      }
      // console.log(flightQuoteTBO, "flight Quote");
    } else if (flight.type == "KAFILA") {
      const flightQuoteKafila =
        type == "onward"
          ? reducerState?.fareQuoteRuleAirselReducer?.oneway
          : reducerState?.fareQuoteRuleAirselReducer?.return;
      if (flightQuoteKafila?.error == true) {
        return {
          error: true,
          loading: false,
          message: flightQuoteKafila?.errorMessage,
        };
      }
      //   else if (flightQuoteKafila?.data?.data?.Response?.Error?.ErrorCode != 0) {
      //    return {
      //      error: true,
      //      loading: false,
      //      message: flightQuoteTBO?.data?.data?.Response?.Error?.ErrorMessage,
      //    };
      //  }
      else {
        return {
          error: false,
          loading: false,
          message: "Fare Quote Found",
        };
      }

      // const Param = type == "onward" ? journeyFlightParam : returnFlightParam;
    } else if (flight.type == "AMD") {
      const flightQuoteAMD =
        type == "onward"
          ? reducerState?.fareQuoteRuleAirselReducer?.oneway
          : reducerState?.fareQuoteRuleAirselReducer?.return;
      // console.log(flightQuoteAMD, "flightQuoteAMD");
      let response = {};
      if (
        flightQuoteAMD?.airselXml?.itineraryDetails?.segmentInformation
          ?.actionDetails
      ) {
        if (
          flightQuoteAMD?.airselXml?.itineraryDetails?.segmentInformation
            ?.actionDetails?.statusCode != "OK"
        ) {
          response = {
            error: true,
            loading: false,
            message: "No Class Available",
          };
          // console.log(response, "amd errorcheckIF");
          return response;
        } else {
          response = {
            error: false,
            loading: false,
            message: "Fare Quote Found",
          };
          return response;
        }
      } else {
        response =
          flightQuoteAMD?.airselXml?.itineraryDetails?.segmentInformation?.filter(
            (i) => {
              if (i?.actionDetails?.statusCode !== "OK") {
                // console.log(i, "statusCodestatusCode");
                return {
                  error: true,
                  loading: false,
                  message: "No Class Available",
                };
              }
            }
          );
      }

      if (0 < response?.length) {
        return {
          error: true,
          loading: false,
          message: "No Class Available",
        };
      } else {
        return {
          error: false,
          loading: false,
          message: "Fare Quote Found",
        };
      }
    }
  };
  // console.log(flightQuoteOnward, "flightQuoteOnward");
  if (type == "onward") {
    if (!flightQuoteOnward) {
      return {
        error: false,
        loading: true,
        message: "loading...",
      };
    } else {
      const fareCodeFareRule = await handleErrorCheck(Onward, type);
      // console.log(fareCodeFareRule, "onwardFarecoed");
      // dispatch(fetchFlightQuotesAireselSucessOneway(fareCodeFareRule));
      return fareCodeFareRule;
    }
  } else {
    if (!flightQuoteReturn) {
      return {
        error: false,
        loading: true,
        message: "loading...",
      };
    } else {
      const fareCodeFareRule = await handleErrorCheck(Return, type);
      // console.log(fareCodeFareRule, "ReturnFarecoed");
      // dispatch(fetchFlightQuotesAireselSucessReturn(fareCodeFareRule));
      return fareCodeFareRule;
    }
  }
};
export const flightSeatMap = async (type) => {
  // console.log(type, "typeSeatmapAction");
  const reducerState = store.getState();

  const Onward = reducerState?.returnSelected?.returnSelectedFlight?.onward;
  const Return = reducerState?.returnSelected?.returnSelectedFlight?.return;
  let passengerData = [];

  const {
    journeyFlightParam,
    journeyFlightTvoTraceId,
    returnFlightParam,
    returnFlightTvoTraceId,
  } = reducerState?.return;
  const handleSeatBaggageListDispatch = async (flight, type) => {
    // console.log(flight, "handleDispatch");

    if (flight.type == "TBO") {
      const ResultIndex =
        type == "onward"
          ? Onward?.flight?.ResultIndex
          : Return?.flight?.ResultIndex;
      const TraceId =
        type == "onward" ? journeyFlightTvoTraceId : returnFlightTvoTraceId;

      const payload = {
        EndUserIp: reducerState?.ip?.ipData,
        TokenId: reducerState?.ip?.tokenData,
        TraceId: TraceId,
        ResultIndex: ResultIndex,
      };
      const ssrResponse = await userApi?.flightSSR(payload);

      // console.log(ssrResponse, "ssrResponse");
      return ssrResponse;
    } else if (flight.type == "KAFILA") {
      const Param = type == "onward" ? journeyFlightParam : returnFlightParam;
      const SelectedFlights =
        type == "onward" ? Onward?.flight : Return?.flight;
      const payload =
        type == "onward"
          ? reducerState?.fareQuoteRuleAirselReducer?.oneway?.data?.result
          : reducerState?.fareQuoteRuleAirselReducer?.return?.data?.result;
      console.log(payload, "payload");
      payload.IsAncl = true;
      const kafilaSsrResponse = await userApi?.kafilaSsrApi({
        ...payload,
        Param: Param,
      });

      const data = kafilaSsrResponse?.data?.result;
      const isError = data?.Error?.IsError;
      // console.log(
      //   reducerState,
      //   "reducerState",
      //   payload,
      //   kafilaSsrResponse?.data?.result,
      //   "kafilaSsrResponse",
      //   data?.Ancl?.Seat
      // );
      let seatMapList = data?.Ancl?.Seat;
      let BaggageList = data?.Ancl?.Baggage;
      let mealList = data?.Ancl?.Meals;
      let seatListt = [];
      let seatAmountList = [];
      let seatAmountListMid = [];
      let meal = [];
      meal = mealList?.reduce((result, param) => {
        // if (param.Code !== "NoMeal") {
        const flightNumber = param.FNo;
        if (!result[flightNumber]) {
          result[flightNumber] = [];
        }
        result[flightNumber].push(0);
        // }
        return result;
      }, {});

      seatMapList.forEach((seat, index) => {
        seatListt.push([]);
        seatAmountList.push([]);
        seatAmountListMid.push([]);
        const AmountList = new Set();
        seat.forEach((item, index) => {
          item[0]?.Price !== 0 && AmountList.add(item[0]?.Price);
        });
        seatAmountList[index] = [...AmountList];
        // seatAmountList[index] = [...AmountList];
      });
      seatAmountList?.forEach((item, index) => {
        item.sort((a, b) => {
          return a - b; // Sort numbers in ascending order
        });
        seatAmountListMid[index] =
          seatAmountList[index][parseInt(seatAmountList[index]?.length / 2)];
      });

      // seatAmountListMid?.[].push(
      //   seatAmountList[parseInt(seatAmountList.length / 2)]
      // );
      let baglis = [...Array(BaggageList?.length)].fill(0);
      // console.log(data, "kafiladata");
      return {
        seatMap: data?.Ancl?.Seat,

        number_of_seat_map: data?.Ancl?.Seat?.length,

        number_of_airline: data?.Ancl?.Seat?.length,
        seatList: seatListt,
        amountList: seatAmountListMid,
        amountTVO: seatAmountList,
        defaultSeatOccupation: [],
        midAmount: 0,
        seatDataList: [],
        mealsList: mealList,
        baggageList: BaggageList,
        meals: meal,
        baggage: baglis,
        isError: isError,
        isLoading: false,
        errorMessage: "",
        isSeatsShow: false,
      };
    } else if (flight.type == "AMD") {
      // const adultCount = 1;
      // const childCount = 0;
      // const infantCount = 0;
      const adultCount = Number(sessionStorage.getItem("adults"));
      const childCount = Number(sessionStorage.getItem("childs"));
      const infantCount = Number(sessionStorage.getItem("infants"));
      let seatMapData = [];
      let seatMap = [];
      let seatDataAmount = [];
      let seatMapdataNew = [];
      let count = 0;
      let number_of_seat_map = {};
      let seatAmountList;
      let isSeatsShow;
      let isSeat = true;
      const state = type == "onward" ? Onward?.flight : Return?.flight;
      // console.log(state, "sessionresultIndex");
      let travler = "";
      for (let i = 0; i < Number(adultCount) + Number(childCount); i++) {
        let fareBasisCode = "";
        let fareBasisCode1 =
          state?.fareDetails?.groupOfFares?.[0]?.productInformation
            ?.fareProductDetail?.fareBasis;

        if (adultCount == 0 || childCount == 0) {
          fareBasisCode =
            state?.fareDetails?.groupOfFares?.productInformation
              ?.fareProductDetail?.fareBasis;
        } else if (i < Number(adultCount)) {
          fareBasisCode =
            state?.[0]?.fareDetails?.groupOfFares?.productInformation
              ?.fareProductDetail?.fareBasis ||
            state?.[0]?.fareDetails?.groupOfFares?.[0]?.productInformation
              ?.fareProductDetail?.fareBasis;
        } else {
          fareBasisCode =
            state?.[1]?.fareDetails?.groupOfFares?.productInformation
              ?.fareProductDetail?.fareBasis;
        }

        travler += `<traveler>
    <travelerInformation>

      <paxDetails>

        <surname>${passengerData?.[i]?.lastName || "dummy"}</surname>

      </paxDetails>

      <otherPaxDetails>

        <givenName>${passengerData?.[i]?.firstName || "dummy"}</givenName>

        <type>${passengerData?.[i]?.PaxType == 1 ? "ADT" : "CHD"}</type>
    

      </otherPaxDetails>

    </travelerInformation>
 


        <fareQualifierDetails>

          <additionalFareDetails>

            <rateClass>${fareBasisCode || fareBasisCode1}/${(
          fareBasisCode || fareBasisCode1
        )?.slice(-2)}</rateClass>

          </additionalFareDetails>

        </fareQualifierDetails>

      </traveler>`;
      }
      // console.log(travler, "Travel");
      const convertXmlToJsonSeat = async (xmlData) => {
        count++;
        const parser = new XMLParser();
        const result = await parser.parse(xmlData);
        seatMapdataNew.push(result);

        // console.log(seatMapdataNew, "seatMapdataNew");
        seatMap = seatMapdataNew;
        // console.log(
        //   result?.Air_RetrieveSeatMapReply?.seatmapInformation
        //     ?.customerCentricData,
        //   "result"
        // );
        if (
          !result?.Air_RetrieveSeatMapReply?.seatmapInformation
            ?.customerCentricData
        ) {
          isSeat = false;
          isSeatsShow = isSeat;
          // console.log("false setisSeats", isSeatsShow);
          return;
        }
      };
      let seatlist = [];
      if (state?.flightDetails?.flightInformation) {
        let depDate =
          state?.flightDetails?.flightInformation?.productDateTime
            ?.dateOfDeparture;
        let dep =
          state?.flightDetails?.flightInformation?.location?.[0]?.locationId;
        let arr =
          state?.flightDetails?.flightInformation?.location?.[1]?.locationId;
        let airline =
          state?.flightDetails?.flightInformation?.companyId?.marketingCarrier;
        let flight_number =
          state?.flightDetails?.flightInformation?.flightOrtrainNumber;
        seatMapData.push({ depDate, dep, arr, airline, flight_number });
      } else {
        for (let i = 0; i < state?.flightDetails?.length; i++) {
          let depDate =
            state?.flightDetails?.[i]?.flightInformation?.productDateTime
              ?.dateOfDeparture;
          let dep =
            state?.flightDetails?.[i]?.flightInformation?.location?.[0]
              ?.locationId;
          let arr =
            state?.flightDetails?.[i]?.flightInformation?.location?.[1]
              ?.locationId;
          let airline =
            state?.flightDetails?.[i]?.flightInformation?.companyId
              ?.marketingCarrier;
          let flight_number =
            state?.flightDetails?.[i]?.flightInformation?.flightOrtrainNumber;
          // seatlist.push({})
          seatMapData.push({ depDate, dep, arr, airline, flight_number });
        }
        // dispatch(number_of_seat_map({ no: state?.flightDetails?.length, seatlist, seatlist: seatlist }))
      }

      let numOfPaln = state?.flightDetails?.flightInformation
        ? 1
        : state?.flightDetails?.length;
      if (state?.flightDetails?.flightInformation) {
        seatlist.push([]);
      } else {
        for (let i = 0; i < numOfPaln; i++) {
          seatlist.push([]);
        }
      }
      number_of_seat_map = { no: numOfPaln, seatList: seatlist };
      const handleData = async () => {
        // console.log("handleData 865");
        seatMapdataNew = [];
        for (let i = 0; i < seatMapData?.length; i++) {
          // console.log(seatMapData, "seatMapData");
          await fetchData(
            seatMapData[i]?.depDate,
            seatMapData[i]?.dep,
            seatMapData[i]?.arr,
            seatMapData[i]?.airline,
            seatMapData[i]?.flight_number
          );
        }
        // console.log(isSeatsShow, "isshowseat1");
        isSeatsShow = { isSeat: isSeat, loading: false };
      };
      const fetchData = async (depDate, dep, arr, airline, flight_number) => {
        const res = await axios({
          method: "POST",
          url: `${apiURL.baseURL}/skyTrails/amadeus/airretrieveseatmap`,
          data: `<Air_RetrieveSeatMap>

    <travelProductIdent>

        <flightDate>

            <departureDate>${depDate}</departureDate>

        </flightDate>

        <boardPointDetails>

            <trueLocationId>${dep}</trueLocationId>

        </boardPointDetails>

        <offpointDetails>

            <trueLocationId>${arr}</trueLocationId>

        </offpointDetails>

        <companyDetails>

            <marketingCompany>${airline}</marketingCompany>

        </companyDetails>

        <flightIdentification>

            <flightNumber>${flight_number}</flightNumber>

        </flightIdentification>

    </travelProductIdent>

    <seatRequestParameters>

        <genericDetails>

             <cabinClassDesignator>W</cabinClassDesignator>

         </genericDetails>

         <processingIndicator>FT</processingIndicator>

     </seatRequestParameters>

     ${travler}


</Air_RetrieveSeatMap>`,

          headers: {
            "Content-Type": "text/xml",
            //  token: token,
          },
        });

        convertXmlToJsonSeat(res?.data?.data);
      };
      await handleData();
      // console.log(
      //   seatMap,
      //   seatMap?.length,
      //   Number(adultCount) + Number(childCount),
      //   "traveler length seatmapdata"
      // );

      // const data = await fetchDataAirlse({
      //   sesstioResultIndex,
      //   adultCount,
      //   childCount,
      //   infantCount,
      // });
      // console.log(data, "Airseldata");
      // return data;
      return {
        seatMap: seatMap,
        number_of_seat_map: number_of_seat_map,

        number_of_airline: number_of_seat_map,
        seatList: number_of_seat_map?.seatList,
        amountList: [],
        amountTVO: [],
        defaultSeatOccupation: [],
        midAmount: 0,
        seatDataList: [],
        mealsList: [],
        baggageList: [],
        isError: false,
        isLoading: false,
        errorMessage: "",
        isSeatsShow: isSeatsShow,
      };
    }
  };
  if (type == "onward") {
    const seatBaggageList = await handleSeatBaggageListDispatch(Onward, type);
    // console.log(fareCodeFareRule, "onwardFarecoed");
    // dispatch(fetchFlightQuotesAireselSucessOneway(fareCodeFareRule));
    return seatBaggageList;
  } else {
    const seatBaggageList = await handleSeatBaggageListDispatch(Return, type);
    // console.log(fareCodeFareRule, "ReturnFarecoed");
    // dispatch(fetchFlightQuotesAireselSucessReturn(fareCodeFareRule));
    return seatBaggageList;
  }
};

export const findPrice = async (type) => {
  const reducerState = store.getState();
  // console.log(reducerState, "reducerState");
  const Onward = reducerState?.returnSelected?.returnSelectedFlight?.onward;
  const Return = reducerState?.returnSelected?.returnSelectedFlight?.return;
  const flightPrice = async (flight, type) => {
    // console.log(flight, "handleDispatch");

    if (flight.type == "TBO") {
      const price = flight?.flight?.Fare?.PublishedFare;
      // console.log(price, flight, "tboprice");
      return price;
    } else if (flight.type == "KAFILA") {
      const price = flight?.flight?.Fare?.GrandTotal;
      // console.log(price, flight, "kafilaprice");
      return price;
    } else if (flight.type == "AMD") {
      const price =
        parseInt(flight?.flight?.Fare?.monetaryDetail?.[0]) +
        parseInt(flight?.flight?.Fare?.monetaryDetail?.[1]);
      return price;
    }
    if (type == "onward") {
      const price = await flightPrice(Onward, type);
      // console.log(price, "findPrice");
      // dispatch(fetchFlightQuotesAireselSucessOneway(fareCodeFareRule));
      return price;
    } else {
      const price = await flightPrice(Return, type);
      // console.log(price, "findPrice");
      // dispatch(fetchFlightQuotesAireselSucessReturn(fareCodeFareRule));
      return price;
    }
  };
  if (type == "onward") {
    const Price = await flightPrice(Onward, type);

    // dispatch(fetchFlightQuotesAireselSucessOneway(fareCodeFareRule));
    return Price;
  } else {
    const Price = await flightPrice(Return, type);

    // dispatch(fetchFlightQuotesAireselSucessReturn(fareCodeFareRule));
    return Price;
  }
};
export const findSeatMealBaggagePrice = (type) => {
  const reducerState = store.getState();
  // console.log(reducerState, "reducerState");
  const Onward = reducerState?.returnSelected?.returnSelectedFlight?.onward;
  const Return = reducerState?.returnSelected?.returnSelectedFlight?.return;
  const ssrOnward = reducerState?.airlineSeatMapNew?.onward;
  const ssrReturn = reducerState?.airlineSeatMapNew?.return;

  let baggagePrice = 0;
  let mealPrice = 0;
  let seatPrice = 0;
  let totalMealPrice = 0;
  let totalBaggageAmount = 0;
  const handleSeatMealPrice = (flight, ssrDetails) => {
    // console.log(flight, "handleDispatch");

    if (flight.type == "TBO") {
      const price = flight?.flight?.Fare?.PublishedFare;
      let mealdata = ssrDetails?.mealsList;
      let seatList = ssrDetails?.seatList;
      let mealList = ssrDetails?.meals;
      let baggagedata = ssrDetails?.baggageList;

      let baggageList = ssrDetails?.baggage;

      seatPrice =
        seatPrice +
        ssrDetails?.amountTVO?.flat()?.reduce((acc, val) => acc + val, 0);

      function separateFunction(param) {
        // seatKeys = [];
        const groupedMeals = new Map();

        param?.forEach((item) => {
          if (item.Code !== "NoMeal") {
            const flightNumber = item.FlightNumber;
            if (!groupedMeals.has(flightNumber)) {
              groupedMeals.set(flightNumber, []);
              //   seatKeys.push(flightNumber);
            }
            groupedMeals.get(flightNumber).push(item);
          }
        });

        // Convert Map to an object and preserve order
        const result = {};
        for (const [key, value] of groupedMeals) {
          result[key] = value;
        }

        return result;
      }
      let separateData = separateFunction(mealdata);
      // console.log(separateData, "separateData");

      // Loop through each flight in mealList
      for (const flightNumber in mealList) {
        const meals = mealList[flightNumber];
        const mealPrices = separateData[flightNumber];

        // Calculate the total price for each meal
        meals.forEach((quantity, index) => {
          totalMealPrice += quantity * mealPrices?.[index].Price;
          // for (let i = 0; i < quantity; i++) {
          //   totalMealPrice.push(mealPrices[index]);
          // }
        });
      }
      function calculateBaggageTotal(baggage, baggageList) {
        let total = 0;
        for (let i = 0; i < baggage?.length; i++) {
          if (baggage[i] === 1) {
            total += baggageList[i].Price;
          }
        }
        return total;
      }
      totalBaggageAmount =
        totalBaggageAmount + calculateBaggageTotal(baggageList, baggagedata);

      // console.log(ssrDetails, "tboprice");
    } else if (flight.type == "KAFILA") {
      const price = flight?.flight?.Fare?.GrandTotal;
      let mealdata = ssrDetails?.mealsList;
      let seatList = ssrDetails?.seatList;
      let mealList = ssrDetails?.meals;
      let baggagedata = ssrDetails?.baggageList;

      let baggageList = ssrDetails?.baggage;

      Object.values(seatList).forEach((item) => {
        seatPrice += item.reduce((acc, val) => acc + val.Price, 0);
      });

      function separateFunction(param) {
        // console.log(param, "pramssss");
        // seatKeys = [];
        const groupedMeals = new Map();

        param?.forEach((item) => {
          if (item.Code !== "NoMeal") {
            const flightNumber = item.FNo;
            if (!groupedMeals.has(flightNumber)) {
              groupedMeals.set(flightNumber, []);
              //   seatKeys.push(flightNumber);
            }
            groupedMeals.get(flightNumber).push(item);
          }
        });

        // Convert Map to an object and preserve order
        const result = {};
        for (const [key, value] of groupedMeals) {
          result[key] = value;
        }

        return result;
      }
      let separateData = separateFunction(mealdata);
      // console.log(separateData, "separateData");

      // Loop through each flight in mealList
      for (const flightNumber in mealList) {
        const meals = mealList?.[flightNumber];
        const mealPrices = separateData?.[flightNumber];

        // Calculate the total price for each meal
        meals.forEach((quantity, index) => {
          totalMealPrice += quantity * mealPrices?.[index].Price;
          // for (let i = 0; i < quantity; i++) {
          //   totalMealPrice.push(mealPrices[index]);
          // }
        });
      }
      function calculateBaggageTotal(baggage, baggageList) {
        let total = 0;
        for (let i = 0; i < baggage?.length; i++) {
          if (baggage[i] === 1) {
            total += baggageList[i].Price;
          }
        }
        return total;
      }
      totalBaggageAmount =
        totalBaggageAmount + calculateBaggageTotal(baggageList, baggagedata);
      // console.log("kafilaprice");
    } else if (flight.type == "AMD") {
      let seatList = ssrDetails?.seatList;
      function calculateSeatTotal(seatList) {
        let total = 0;
        if (Array.isArray(seatList)) {
          seatList?.forEach((group) => {
            group?.forEach((seat) => {
              total += seat.amount;
            });
          });
        }
        return total;
      }

      seatPrice = seatPrice + calculateSeatTotal(seatList);
    }
  };
  if (type == "Onward") {
    handleSeatMealPrice(Onward, ssrOnward);
    return {
      seatPrice: seatPrice,
      mealPrice: totalMealPrice,
      baggagePrice: totalBaggageAmount,
    };
  }

  // dispatch(fetchFlightQuotesAireselSucessOneway(fareCodeFareRule));
  if (type == "Return" && Return) {
    handleSeatMealPrice(Return, ssrReturn);
    return {
      seatPrice: seatPrice,
      mealPrice: totalMealPrice,
      baggagePrice: totalBaggageAmount,
    };
  }
  handleSeatMealPrice(Onward, ssrOnward);
  if (Return) {
    handleSeatMealPrice(Return, ssrReturn);
    return {
      seatPrice: seatPrice,
      mealPrice: totalMealPrice,
      baggagePrice: totalBaggageAmount,
    };
  }

  // dispatch(fetchFlightQuotesAireselSucessReturn(fareCodeFareRule));
  return {
    seatPrice: seatPrice,
    mealPrice: totalMealPrice,
    baggagePrice: totalBaggageAmount,
  };
};

function convertDateFormatTBO(inputDate) {
  // Split the input date string into year, month, and day
  const [year, month, day] = inputDate?.split("-");

  // Create a new Date object using the components
  const newDate = new Date(year, month - 1, day);

  // Format the output date string as "yyyy-mm-ddTHH:mm:ss"
  const outputDate = newDate
    .toISOString()
    .slice(0, 19)
    .replace("T", "T00:00:00");
  // console.log(outputDate, "outputdate")

  return outputDate;
}
export const startBookingProcess = async (type) => {
  // console.log(type, "typeeeeeeeee");
  const reducerState = store.getState();
  let passengerData = reducerState?.passengers?.passengersData;

  // console.log(reducerState, passengerData, "reducerState", type);
  // console.log("staartbookingProcess", type);

  const fareCode = reducerState?.fareQuoteRuleAirselReducer?.return;

  // console.log(fareCode, "fareCodeeee");
  // if (
  //   0 < fareCode.length ||
  //   reducerState?.fareQuoteRuleAirselReducer?.isLoading == true
  // ) {
  //   console.log(fareCode, "fareCodeeee2");
  //   return fareCode;
  // }

  const Onward = reducerState?.returnSelected?.returnSelectedFlight?.onward;
  const Return = reducerState?.returnSelected?.returnSelectedFlight?.return;
  let baggage;
  let seat;
  let meal;

  const isPassportRequired = passportReqired();

  const {
    journeyFlightParam,
    journeyFlightTvoTraceId,
    returnFlightParam,
    returnFlightTvoTraceId,
  } = reducerState?.return;
  const handleDispatch = async (flight, type) => {
    // console.log(flight, "handleDispatch");

    if (flight.type == "TBO") {
      const fareBreak =
        type == "onward"
          ? reducerState?.fareQuoteRuleAirselReducer?.oneway?.flightQuote?.data
              ?.data?.Response?.Results?.FareBreakdown
          : reducerState?.fareQuoteRuleAirselReducer?.return?.flightQuote?.data
              ?.data?.Response?.Results?.FareBreakdown;
      let baggageData =
        type == "onward"
          ? reducerState?.airlineSeatMapNew?.onward?.baggageList
          : reducerState?.airlineSeatMapNew?.return?.baggageList;
      let baggageList =
        type == "onward"
          ? reducerState?.airlineSeatMapNew?.onward?.baggage
          : reducerState?.airlineSeatMapNew?.return?.baggage;
      seat =
        type == "onward"
          ? reducerState?.airlineSeatMapNew?.onward?.seatList
          : reducerState?.airlineSeatMapNew?.return?.seatList;
      let mealData =
        type == "onward"
          ? reducerState?.airlineSeatMapNew?.onward?.mealsList
          : reducerState?.airlineSeatMapNew?.return?.mealsList;
      let mealList =
        type == "onward"
          ? reducerState?.airlineSeatMapNew?.onward?.meals
          : reducerState?.airlineSeatMapNew?.return?.meals;
      const isLCC =
        type == "onward"
          ? reducerState?.fareQuoteRuleAirselReducer?.oneway?.flightQuote?.data
              ?.data?.Response?.Results?.IsLCC
          : reducerState?.fareQuoteRuleAirselReducer?.return?.flightQuote?.data
              ?.data?.Response?.Results?.IsLCC;
      let arr = [];
      let baggageDynamic = [];
      baggageList?.map((item, index) => {
        for (let i = 0; i < item; i++) {
          baggageDynamic.push(baggageData[index]);
        }
      });
      function separateFunction(param) {
        // seatKeys = [];
        const groupedMeals = new Map();

        param?.forEach((item) => {
          if (item.Code !== "NoMeal") {
            const flightNumber = item.FlightNumber;
            if (!groupedMeals.has(flightNumber)) {
              groupedMeals.set(flightNumber, []);
              //   seatKeys.push(flightNumber);
            }
            groupedMeals.get(flightNumber).push(item);
          }
        });

        // Convert Map to an object and preserve order
        const result = {};
        for (const [key, value] of groupedMeals) {
          result[key] = value;
        }

        return result;
      }
      let totalMeallist = [];

      let newMealList;
      let separateData = separateFunction(mealData);
      for (const flightNumber in mealList) {
        const meals = mealList[flightNumber];
        const mealPrices = separateData[flightNumber];

        // Calculate the total price for each meal
        meals.forEach((quantity, index) => {
          for (let i = 0; i < quantity; i++) {
            totalMeallist.push(mealPrices[index]);
          }
        });
        newMealList = separateFunction(totalMeallist);
      }

      const fareBreakDown = fareBreak.map((price, key) => {
        let obj1 = {
          Currency: price?.Currency,
          BaseFare: price?.BaseFare / price?.PassengerCount,
          Tax: price?.Tax / price?.PassengerCount,
          YQTax: price?.YQTax / price?.PassengerCount,
          AdditionalTxnFeePub:
            price?.AdditionalTxnFeePub / price?.PassengerCount,
          AdditionalTxnFeeOfrd:
            price?.AdditionalTxnFeeOfrd / price?.PassengerCount,
        };
        arr.push(obj1);
        // console.log(arr, "fareBreakdown");
        return obj1;
      });
      // console.log(fareBreakDown, "fareBreakDownnnn");
      const newPassengerData = passengerData?.map((item, index) => {
        const Fare = fareBreakDown[item?.PaxType - 1];
        console.log(Fare, "fareeeee");
        let seatDynamic = [];
        let mealDynamic = [];
        if (seat) {
          Object.keys(seat).forEach((key) => {
            if (seat[key]?.[index]) {
              seatDynamic?.push(seat[key]?.[index]);
            }
          });
        }
        if (newMealList) {
          Object.keys(newMealList).forEach((key) => {
            if (newMealList[key]?.[index]) {
              mealDynamic?.push(newMealList[key]?.[index]);
            }
          });
        }
        let tempBag = baggageDynamic?.[index] || [];
        // console.log(seatDynamic, mealDynamic, tempBag, "seatbaggagemealpyc");
        return {
          ...item,
          Title: item?.title,
          Email: apiURL.flightEmail,
          FirstName: item?.firstName,
          LastName: item?.lastName,
          Gender: item?.gender,

          ContactNo: passengerData?.[0]?.ContactNo,
          Fare: Fare,
          PassportNo: item?.passportNo,
          PassportExpiry: isPassportRequired
            ? convertDateFormatTBO(item?.passportExpiry)
            : "",
          MealDynamic: mealDynamic,
          SeatDynamic: seatDynamic,
          Baggage: tempBag,
        };
      });
      // console.log(newPassengerData, "passengerData");

      const ResultIndex =
        type == "onward"
          ? Onward?.flight?.ResultIndex
          : Return?.flight?.ResultIndex;
      const TraceId =
        type == "onward" ? journeyFlightTvoTraceId : returnFlightTvoTraceId;

      const payload = {
        EndUserIp: reducerState?.ip?.ipData,
        TokenId: reducerState?.ip?.tokenData,
        TraceId: TraceId,
        ResultIndex: ResultIndex,
        Passengers: newPassengerData,
      };
      if (isLCC == false) {
        // dispatch(bookActionGDS(payloadGDS));
        // console.log("bookActionGDS");

        const block = await userApi.flightBookGDS(payload);
        // console.log(block, "blockkkkk");
        if (block?.data?.data?.Response?.Response?.Error?.ErrorCode != 0) {
          return block;
        }

        const PNR = block?.data?.data?.Response?.Response?.PNR;
        const BookingId = block?.data?.data?.Response?.Response?.BookingId;

        const payLoadDomestic = {
          EndUserIp: reducerState?.ip?.ipData,
          TokenId: reducerState?.ip?.tokenData,
          TraceId: TraceId,
          PNR: PNR,
          BookingId: BookingId,
          ResultIndex: ResultIndex,
        };
        const payLoadInternational = {
          EndUserIp: reducerState?.ip?.ipData,
          TokenId: reducerState?.ip?.tokenData,
          TraceId: TraceId,
          PNR: PNR,
          BookingId: BookingId,
          // Passengers: passengerData?.map((item, index) => {
          //   return {
          //     ...item,
          //     Email: apiURL.flightEmail,

          //     ContactNo: passengerData[0]?.ContactNo,
          //     // PassportExpiry: isPassportRequired
          //     //   ? convertDateFormat(item?.PassportExpiry)
          //     //   : "",
          //     // Baggage:
          //     //   baggageData?.[index] == undefined ? [] : [baggageData?.[index]],
          //     // MealDynamic:
          //     //   mellData?.flat()?.[index] == undefined
          //     //     ? []
          //     //     : [mellData?.flat()?.[index]],
          //     // SeatDynamic:
          //     //   seatList?.[0]?.flat()?.[index] == undefined
          //     //     ? []
          //     //     : [seatList?.[0]?.flat()?.[index]],
          //   };
          // }),
        };

        const BookTicket = await userApi?.flightGetTicketNonLcc(
          payLoadDomestic
        );
        // console.log(BookTicket, "BookTicketNONLcc");

        return BookTicket;
      } else if (isLCC == true) {
        // getTicketForLCC();
        // console.log("getTicketForLcc");
        const getTicket = await userApi.flightGetTicketLcc(payload);
        return getTicket;
      }
    } else if (flight.type == "KAFILA") {
      const Param = type == "onward" ? journeyFlightParam : returnFlightParam;
      const SelectedFlights =
        type == "onward" ? Onward?.flight : Return?.flight;

      const fareresponse =
        type == "onward"
          ? reducerState?.fareQuoteRuleAirselReducer?.oneway
          : reducerState?.fareQuoteRuleAirselReducer?.return;
      // console.log(fareresponse, "kafilaFareCheck");
      let baggageData =
        type == "onward"
          ? reducerState?.airlineSeatMapNew?.onward?.baggageList
          : reducerState?.airlineSeatMapNew?.return?.baggageList;
      let baggageList =
        type == "onward"
          ? reducerState?.airlineSeatMapNew?.onward?.baggage
          : reducerState?.airlineSeatMapNew?.return?.baggage;
      seat =
        type == "onward"
          ? reducerState?.airlineSeatMapNew?.onward?.seatList
          : reducerState?.airlineSeatMapNew?.return?.seatList;
      let mealData =
        type == "onward"
          ? reducerState?.airlineSeatMapNew?.onward?.mealsList
          : reducerState?.airlineSeatMapNew?.return?.mealsList;
      let mealList =
        type == "onward"
          ? reducerState?.airlineSeatMapNew?.onward?.meals
          : reducerState?.airlineSeatMapNew?.return?.meals;
      let seatList =
        type == "onward"
          ? reducerState?.airlineSeatMapNew?.onward?.seatList
          : reducerState?.airlineSeatMapNew?.return?.seatList;
      let arr = [];
      let baggageDynamic = [];
      baggageList?.map((item, index) => {
        for (let i = 0; i < item; i++) {
          baggageDynamic.push(baggageData[index]);
        }
      });
      function separateFunction(param) {
        // seatKeys = [];
        const groupedMeals = new Map();

        param?.forEach((item) => {
          const flightNumber = item?.FNo;
          if (!groupedMeals.has(flightNumber)) {
            groupedMeals.set(flightNumber, []);
            //   seatKeys.push(flightNumber);
          }
          groupedMeals.get(flightNumber).push(item);
        });

        // Convert Map to an object and preserve order
        const result = {};
        for (const [key, value] of groupedMeals) {
          result[key] = value;
        }

        return result;
      }
      let totalMeallist = [];

      let newMealList;
      let separateData = separateFunction(mealData);
      for (const flightNumber in mealList) {
        const meals = mealList[flightNumber];
        const mealPrices = separateData[flightNumber];

        // Calculate the total price for each meal
        meals.forEach((quantity, index) => {
          for (let i = 0; i < quantity; i++) {
            totalMeallist.push(mealPrices[index]);
          }
        });
        newMealList = separateFunction(totalMeallist);
      }

      const payload = {
        FareChkRes: {
          IsFareUpdate: fareresponse?.data?.result?.IsFareUpdate,
          IsAncl: fareresponse?.data?.result?.IsAncl,
          Param: Param,
          SelectedFlight: fareresponse?.data?.result?.SelectedFlight,
          FareBreakup: fareresponse?.data?.result?.FareBreakup,
          GstData: null,
        },
        PaxInfo: {
          GstData: {
            IsGst: false,
            GstDetails: null,
          },
          PaxEmail: apiURL.flightEmail,
          PaxMobile: passengerData[0]?.ContactNo,
          Passengers: passengerData?.map((item, index) => {
            let mealDynamic = [];
            let seatDynamic = [];

            if (newMealList) {
              Object.keys(newMealList).forEach((key) => {
                if (newMealList[key]?.[index]) {
                  mealDynamic?.push(newMealList[key]?.[index]);
                }
              });
            }
            // console.log(seatList, "seatListseatList");
            if (seatList && typeof seatList === "object") {
              Object.keys(seatList).forEach((key) => {
                //   console.log(key, seatList[key]?.[index]); // Debugging seat data
                if (seatList[key]?.[index]) {
                  seatDynamic.push(seatList[key][index]); // Push only if seat exists
                }
              });
            }
            // if (newMealList) {
            //   Object.keys(newMealList).forEach((key) => {
            //     if (newMealList[key]?.[index]) {
            //       mealDynamic?.push(newMealList[key]?.[index]);
            //     }
            //   });
            // }
            let tempBag = Array.isArray(baggageDynamic?.[index])
              ? baggageDynamic?.[index]
              : baggageDynamic?.[index]
              ? [baggageDynamic?.[index]]
              : [];
            const paxvalue =
              item?.PaxType === 1
                ? "ADT"
                : item?.PaxType === 2
                ? "CHD"
                : item?.PaxType === 3
                ? "INF"
                : null;

            return {
              PaxType: paxvalue,
              Title: item?.title,
              FName: item?.firstName,
              LName: item?.lastName,
              Gender: item?.gender === 1 ? "Male" : "Female",
              Dob: item?.DateOfBirth,
              // Dob:null,
              // selectedbaggage?.[index] == undefined ? [] : [selectedbaggage?.[index]]
              Baggage: tempBag,
              Special: [],
              Meal: mealDynamic,

              Seat: seatDynamic,
              Optional: {
                TicketNumber: "",
                PassportNo: item?.PassportNo,
                PassportExpiryDate:
                  //  isPassportRequired
                  // ?
                  item?.PassportExpiry,
                // : "",
                FrequentFlyerNo: "",
                Nationality: item?.CountryCode,
                ResidentCountry: item?.CountryCode,
              },
            };
          }),
        },
      };
      // console.log(payload, "farepayload");

      const data = await userApi?.kafilapnr(payload);
      // console.log(data, "kafiladata");
      // return data;
      return data;
    } else if (flight.type == "AMD") {
      const adultCount = sessionStorage.getItem("adults");
      const childCount = sessionStorage.getItem("childs");
      const infantCount = sessionStorage.getItem("infants");
      const sesstioResultIndex =
        type == "onward" ? Onward?.flight : Return?.flight;
      const airesellRes =
        type == "onward"
          ? reducerState?.fareQuoteRuleAirselReducer?.oneway
          : reducerState?.fareQuoteRuleAirselReducer?.return;
      // console.log(airesellRes, "airselResult");
      let seatListPayload = [];
      const data = startBookingProcessAMD_New({
        sesstioResultIndex,
        adultCount,
        childCount,
        infantCount,
        seatListPayload,
        passengerData,
        airesellRes,
      });
      // console.log(data, "Airseldata");
      return data;
    }
  };

  if (type == "onward") {
    const fareCodeFareRule = await handleDispatch(Onward, type);
    // console.log(fareCodeFareRule, "onwardFarecoed");
    // dispatch(fetchFlightQuotesAireselSucessOneway(fareCodeFareRule));
    return fareCodeFareRule;
  } else {
    const fareCodeFareRule = await handleDispatch(Return, type);
    // console.log(fareCodeFareRule, "ReturnFarecoed");
    // dispatch(fetchFlightQuotesAireselSucessReturn(fareCodeFareRule));
    return fareCodeFareRule;
  }
};
// export const ticketDetails =  (type) => {
//   const reducerState = store.getState();
//   let passengerData = reducerState?.passengers?.passengersData;

//   console.log(reducerState, passengerData, "reducerState", type);

//   const Onward = reducerState?.returnSelected?.returnSelectedFlight?.onward;
//   const Return = reducerState?.returnSelected?.returnSelectedFlight?.return;
//   const SelectedFlights = type == "onward" ? Onward : Return;

//   const newPassengerData = passengerData?.map((item, index) => ({
//     name: `${item.firstName} ${item?.lastName}`,
//     seat: "12A",
//     class: "Economy",
//   }));
//   let PNR;

//   const handlePnr =  (flight, type) => {
//     if (flight.type == "TBO") {
//       const PNRData =
//         type == "onward"
//           ? reducerState?.newFlightBook?.oneway?.Response?.Results
//               ?.FareBreakdown
//           : reducerState?.newFlightBook?.return;

//       return { jiii: "jjjj" };
//     } else if (flight.type == "KAFILA") {
//       const SelectedFlights =
//         type == "onward" ? Onward?.flight : Return?.flight;
//       PNR =
//         type == "onward"
//           ? reducerState?.newFlightBook?.oneway?.result?.BookingInfo?.APnr
//           : reducerState?.newFlightBook?.return?.result?.BookingInfo?.APnr;
//       console.log("kafilaPnr", PNR);

//       return PNR;
//     } else if (flight.type == "AMD") {
//       const SelectedFlights =
//         type == "onward" ? Onward?.flight : Return?.flight;
//       const PNRData =
//         type == "onward"
//           ? reducerState?.newFlightBook?.oneway?.Response?.Results
//               ?.FareBreakdown
//           : reducerState?.newFlightBook?.return;
//       PNR = PNRData?.pnrHeader?.reservation?.controlNumber;
//       console.log("Amd PNR Data", PNR);

//       return PNR;
//     }
//   };
//   if (type == "onward") {
//     return handlePnr(Onward, type);
//   } else {
//     return handlePnr(Return, type);
//   }
// };
export const flightBookErrorCheck = (type) => {
  const reducerState = store.getState();

  const Onward = reducerState?.returnSelected?.returnSelectedFlight?.onward;
  const Return = reducerState?.returnSelected?.returnSelectedFlight?.return;
  const flightBookOnward = reducerState?.newFlightBook?.oneway;
  // ?.flightQuote;
  const flightBookReturn = reducerState?.newFlightBook?.return;
  // console.log(
  //   flightBookOnward?.data?.data?.Response?.Error?.ErrorCode,
  //   flightBookOnward,
  //   "flightBookOnward",
  //   flightBookReturn,
  //   flightBookOnward?.length,
  //   "bookFlight",
  //   flightBookReturn.length
  // );
  const handleErrorCheckBook = (flight, type) => {
    if (flight?.type == "TBO") {
      const flightBookTBO =
        type == "onward" ? flightBookOnward : flightBookReturn;
      if (flightBookTBO?.data?.data?.Response?.Error?.ErrorCode == 0) {
        // console.log(
        //   flightBookTBO?.data?.data?.Response?.Error?.ErrorCode,
        //   "tboiferror"
        // );
        return {
          error: false,
          loading: false,
          message: "CONFIRMED",
        };
      }
      //  else if (
      //   flightQuoteTBO?.data?.data?.Response?.Error?.ErrorCode &&
      //   flightQuoteTBO?.data?.data?.Response?.Error?.ErrorCode != 0
      // ) {
      //   console.log("tboelseiferror");
      //   return {
      //     error: true,
      //     loading: false,
      //     message:
      //       flightQuoteTBO?.data?.data?.Response?.Error?.ErrorMessage,
      //   };
      // }
      else {
        return {
          error: true,
          loading: false,
          message: "FAILED",
        };
      }
    } else if (flight?.type == "KAFILA") {
      const flightBookKafila =
        type == "onward" ? flightBookOnward : flightBookReturn;
      if (flightBookKafila?.result?.BookingInfo?.BookingStatus == "CONFIRMED") {
        return {
          error: false,
          loading: false,
          message: "CONFIRMED",
        };
      }
      //   else if (flightQuoteKafila?.data?.data?.Response?.Error?.ErrorCode != 0) {
      //    return {
      //      error: true,
      //      loading: false,
      //      message: flightQuoteTBO?.data?.data?.Response?.Error?.ErrorMessage,
      //    };
      //  }
      else {
        return {
          error: true,
          loading: false,
          message: "FAILED",
        };
      }

      // const Param = type == "onward" ? journeyFlightParam : returnFlightParam;
    } else if (flight?.type == "AMD") {
      const flightBookAMD =
        type == "onward" ? flightBookOnward : flightBookReturn;
      // console.log(flightBookAMD, "flightBookAMD");

      if (
        flightBookOnward?.pnrHeader?.reservationInfo?.reservation?.controlNumber
      ) {
        return {
          error: false,
          loading: false,
          message: "CONFIRMED",
        };
      } else {
        return {
          error: true,
          loading: false,
          message: "FAILED",
        };
      }
    }
  };
  if (type == "onward") {
    if (Object.keys(flightBookOnward)?.length == 0) {
      return {
        error: false,
        loading: true,
        message: "loading...",
      };
    } else {
      const flightBook = handleErrorCheckBook(Onward, type);
      // console.log(flightBook, "onwardFarecoed");
      // dispatch(fetchFlightQuotesAireselSucessOneway(fareCodeFareRule));
      return flightBook;
    }
  } else {
    if (Object.keys(flightBookReturn)?.length == 0) {
      return {
        error: false,
        loading: true,
        message: "loading...",
      };
    } else {
      const flightBook = handleErrorCheckBook(Return, type);
      // console.log(flightBook, "ReturnFarecoed");
      // dispatch(fetchFlightQuotesAireselSucessReturn(fareCodeFareRule));
      return flightBook;
    }
  }
};
export const ticketDetails = (type) => {
  const reducerState = store.getState();
  const passengerData = reducerState?.passengers?.passengersData;

  const Onward = reducerState?.returnSelected?.returnSelectedFlight?.onward;
  const Return = reducerState?.returnSelected?.returnSelectedFlight?.return;
  // console.log(type, "typeeee");

  const SelectedFlights = type === "onward" ? Onward : Return;

  const handlePnr = (flight, type) => {
    let PNR;
    let BookingId;
    let ticket = {
      flight: flight,
      PNR: "",

      BookingId: "",
      passengers: passengerData,
      boardingTime: "2h before departure",
    };
    let boardingTime;

    if (flight?.type === "TBO") {
      const PNRData =
        type === "onward"
          ? reducerState?.newFlightBook?.oneway?.data?.data?.Response?.Response
          : reducerState?.newFlightBook?.return?.data?.data?.Response?.Response;
      PNR = PNRData?.PNR;
      const isLCC =
        type == "onward"
          ? reducerState?.fareQuoteRuleAirselReducer?.oneway?.flightQuote?.data
              ?.data?.Response?.Results?.IsLCC
          : reducerState?.fareQuoteRuleAirselReducer?.return?.flightQuote?.data
              ?.data?.Response?.Results?.IsLCC;

      BookingId = PNRData?.BookingId;
      ticket.PNR = PNR;
      ticket.BookingId = BookingId;
      // console.log(PNRData, PNR, "TVO PNR Data", ticket, type);
      return ticket; // Placeholder - modify based on actual requirements
    } else if (flight?.type === "KAFILA") {
      PNR =
        type === "onward"
          ? reducerState?.newFlightBook?.oneway?.result?.BookingInfo?.APnr
          : reducerState?.newFlightBook?.return?.result?.BookingInfo?.APnr;
      ticket.PNR = PNR;
      // ticket.boardingTime = boardingTime;

      return ticket;
    } else if (flight?.type === "AMD") {
      const PNRData =
        type === "onward"
          ? reducerState?.newFlightBook?.oneway
          : reducerState?.newFlightBook?.return;
      PNR = PNRData?.pnrHeader?.reservationInfo?.reservation?.controlNumber;
      // console.log(
      //   "Amd PNR Data",
      //   PNR,
      //   PNRData?.originDestinationDetails?.itineraryInfo?.[0]?.flightDetail
      //     ?.timeDetail?.checkinTime
      // );
      boardingTime =
        PNRData?.originDestinationDetails?.itineraryInfo?.flightDetail
          ?.timeDetail?.checkinTime ||
        PNRData?.originDestinationDetails?.itineraryInfo?.[0]?.flightDetail
          ?.timeDetail?.checkinTime;

      ticket.PNR = PNR;
      ticket.boardingTime = boardingTime || "2h before departure";
      return ticket;
    }

    return ticket; // Default return if none of the conditions match
  };

  return handlePnr(SelectedFlights, type);
};
export const saveDB = (type, isHold, holdAmount) => {
  const reducerState = store.getState();
  const passengerData = reducerState?.passengers?.passengersData;
  const markUpamount =
    reducerState?.markup?.markUpData?.data?.result[0]?.flightMarkup;

  const Onward = reducerState?.returnSelected?.returnSelectedFlight?.onward;
  const Return = reducerState?.returnSelected?.returnSelectedFlight?.return;
  let baggage;
  let seat;
  let meal;
  // console.log(type, Onward, Return, passengerData, "typeeee");

  const SelectedFlights = type === "onward" ? Onward : Return;
  const formatDepTime = (dateString) =>
    moment(dateString).format("YYYY-MM-DDTHH:mm:ss");
  const payload = {
    userId: reducerState?.logIn?.loginData?.id,
    isHold: false,
    holdAmount: holdAmount || 0,
    lastTicketDate: "",
    oneWay: true,
    bookingPartyType: "Tbo",
    bookingId: "SKY" + Date.now(),
    oneWay: false,
    ticketType: "Original Ticket",
    pnr: "",
    origin: SelectedFlights?.origin,
    destination: SelectedFlights?.destination,
    paymentStatus: "success",
    totalAmount: SelectedFlights?.price,
    airlineDetails: "",
    passengerDetails: passengerData,
    bookingStatus: "BOOKED",
    baggage: [],
    mealDynamic: [],
    seatDynamic: [],
  };
  // console.log(payload, "payload");
  const handleBookingDetails = (flight, type) => {
    let PNR;
    let BookingId;
    let ticket = {
      flight: flight,
      PNR: "",

      BookingId: "",
      passengers: passengerData,
      boardingTime: "2h before departure",
    };
    let boardingTime;

    if (flight.type === "TBO") {
      let baggageData =
        type == "onward"
          ? reducerState?.airlineSeatMapNew?.onward?.baggageList
          : reducerState?.airlineSeatMapNew?.return?.baggageList;
      let baggageList =
        type == "onward"
          ? reducerState?.airlineSeatMapNew?.onward?.baggage
          : reducerState?.airlineSeatMapNew?.return?.baggage;
      seat =
        type == "onward"
          ? reducerState?.airlineSeatMapNew?.onward?.seatList
          : reducerState?.airlineSeatMapNew?.return?.seatList;
      let mealData =
        type == "onward"
          ? reducerState?.airlineSeatMapNew?.onward?.mealsList
          : reducerState?.airlineSeatMapNew?.return?.mealsList;
      let mealList =
        type == "onward"
          ? reducerState?.airlineSeatMapNew?.onward?.meals
          : reducerState?.airlineSeatMapNew?.return?.meals;
      const PNRData =
        type === "onward"
          ? reducerState?.newFlightBook?.oneway?.data?.data?.Response?.Response
          : reducerState?.newFlightBook?.return?.data?.data?.Response?.Response;
      PNR = PNRData?.PNR;
      PNRData?.FlightItinerary?.Passenger?.forEach((item, index) => {
        passengerData[index].TicketNumber = item?.Ticket?.TicketNumber || "";
        passengerData[index].amount = item?.Fare?.PublishedFare || "";
      });
      let airlineDetails = flight?.flight?.Segments?.[0]?.map((item, index) => {
        return {
          Airline: {
            AirlineCode: item.Airline.AirlineCode,
            AirlineName: item.Airline.AirlineName,
            FlightNumber: item.Airline.FlightNumber,
            FareClass: item.Airline.FareClass,
          },
          Origin: {
            AirportCode: item.Origin.Airport.AirportCode,
            AirportName: item.Origin.Airport.AirportName,
            CityName: item.Origin.Airport.CityName,
            Terminal: item.Origin.Airport.Terminal,
            DepTime: item.Origin.DepTime,
          },
          Destination: {
            AirportCode: item.Destination.Airport.AirportCode,
            AirportName: item.Destination.Airport.AirportName,
            CityName: item.Destination.Airport.CityName,
            Terminal: item.Destination.Airport.Terminal,
            ArrTime: item.Destination.ArrTime,
          },
          Baggage: item?.Baggage,
        };
      });
      let totalMeallist = [];

      let newMealList;
      let baggageDynamic = [];
      baggageList?.map((item, index) => {
        for (let i = 0; i < item; i++) {
          baggageDynamic.push(baggageData[index]);
        }
      });
      function separateFunction(param) {
        // seatKeys = [];
        const groupedMeals = new Map();

        param?.forEach((item) => {
          if (item.Code !== "NoMeal") {
            const flightNumber = item.FlightNumber;
            if (!groupedMeals.has(flightNumber)) {
              groupedMeals.set(flightNumber, []);
              //   seatKeys.push(flightNumber);
            }
            groupedMeals.get(flightNumber).push(item);
          }
        });

        // Convert Map to an object and preserve order
        const result = {};
        for (const [key, value] of groupedMeals) {
          result[key] = value;
        }

        return result;
      }
      let separateData = separateFunction(mealData);
      for (const flightNumber in mealList) {
        const meals = mealList[flightNumber];
        const mealPrices = separateData[flightNumber];

        // Calculate the total price for each meal
        meals.forEach((quantity, index) => {
          for (let i = 0; i < quantity; i++) {
            totalMeallist.push(mealPrices[index]);
          }
        });
        newMealList = separateFunction(totalMeallist);
      }
      let seatDynamic = [];
      let mealDynamic = [];
      if (seat) {
        Object.keys(seat).forEach((key) => {
          seatDynamic = [...seatDynamic, ...seat[key]];
        });
      }
      if (newMealList) {
        Object.keys(newMealList).forEach((key) => {
          mealDynamic = [...mealDynamic, ...newMealList[key]];
        });
      }
      BookingId = PNRData?.BookingId;
      payload.pnr = PNR;
      payload.airlineDetails = airlineDetails;
      payload.bookingId = BookingId;
      let bookingStatus = PNR ? "BOOKED" : "FAILED";
      payload.bookingStatus = bookingStatus;
      payload.seatDynamic = seatDynamic;
      payload.mealDynamic = mealDynamic;
      payload.baggage = baggageDynamic;
      // console.log(PNRData, PNR, payload, airlineDetails, "TVO PNR Data", type);
      // return ticket;
      // Placeholder - modify based on actual requirements
      // userApi.flightBookingDataSave(payload);
      userApi.flightBookingDetailsCommon(payload);
    } else if (flight.type === "KAFILA") {
      const flightDetails = flight?.flight;
      payload.bookingPartyType = "Kafila";
      let airlineDetails = flightDetails?.Itinerary?.map((item, index) => {
        return {
          Airline: {
            AirlineCode: item?.FCode,
            AirlineName: item?.FName,
            FlightNumber: item?.FNo,
            FareClass: item?.FClass,
          },
          Origin: {
            AirportCode: item?.Src,
            AirportName: item?.DArpt,
            CityName: item?.SrcName,
            Terminal: item?.DTrmnl,
            DepTime: item?.DDate,
          },
          Destination: {
            AirportCode: item?.Des,
            AirportName: item?.DArpt,
            CityName: item?.DesName,
            Terminal: item?.DTrmnl,
            DepTime: item?.DDate,
          },
          baggage: [],
          mealDynamic: [],
          seatDynamic: [],
        };
      });
      PNR =
        type === "onward"
          ? reducerState?.newFlightBook?.oneway?.result?.BookingInfo?.APnr
          : reducerState?.newFlightBook?.return?.result?.BookingInfo?.APnr;
      payload.pnr = PNR;
      payload.airlineDetails = airlineDetails;
      let bookingStatus = PNR ? "BOOKED" : "FAILED";
      payload.bookingStatus = bookingStatus;
      // ticket.boardingTime = boardingTime;
      // console.log(PNR, payload, "KAfila PNR Data", type);
      // userApi.addBookingDetailsKafila(payload);
      userApi.flightBookingDetailsCommon(payload);
      // return ticket;
    } else if (flight.type === "AMD") {
      const flightDetails = flight?.flight;
      seat =
        type == "onward"
          ? reducerState?.airlineSeatMapNew?.onward?.seatList
          : reducerState?.airlineSeatMapNew?.return?.seatList;
      let seatDynamic = [];
      if (seat) {
        seat.forEach((item) => {
          seatDynamic = [...seatDynamic, ...item];
        });
      }
      payload.bookingPartyType = "Amadeus";
      let Baggage =
        (flightDetails?.baggage?.freeBagAllownceInfo?.baggageDetails
          ?.quantityCode ||
          flightDetails?.baggage?.freeBagAllownceInfo?.baggageDetails
            ?.quantityCode) === "W"
          ? `${
              flightDetails?.baggage?.freeBagAllownceInfo?.baggageDetails
                ?.freeAllowance ||
              flightDetails?.baggage?.freeBagAllownceInfo?.baggageDetails
                ?.freeAllowance
            } ${
              flightDetails?.baggage?.freeBagAllownceInfo?.baggageDetails
                ?.unitQualifier ||
              (flightDetails?.baggage?.freeBagAllownceInfo?.baggageDetails
                ?.unitQualifier === "K"
                ? "KG"
                : flightDetails?.baggage?.freeBagAllownceInfo?.baggageDetails
                    ?.unitQualifier)
            }`
          : `(${
              flightDetails?.baggage?.freeBagAllownceInfo?.baggageDetails
                ?.freeAllowance ||
              flightDetails?.baggage?.freeBagAllownceInfo?.baggageDetails
                ?.freeAllowance
            } × 23KG)`;
      // console.log(flightDetails, "flightDetails");
      const nonStop = [
        {
          Airline: {
            AirlineCode:
              flightDetails?.flightDetails?.flightInformation?.companyId
                ?.marketingCarrier,
            AirlineName: findAirlineByCode(
              flightDetails?.flightDetails?.flightInformation?.companyId
                ?.marketingCarrier
            )?.airlineName,
            FlightNumber:
              flightDetails?.flightDetails?.flightInformation
                ?.flightOrtrainNumber,
            FareClass: "W",
            //   jsonSavePnrData?.originDestinationDetails?.itineraryInfo
            //     ?.travelProduct?.productDetails?.classOfService,
          },
          Origin: {
            AirportCode:
              flightDetails?.flightDetails?.flightInformation?.location?.[0]
                ?.locationId,
            AirportName: findAirportByCode(
              flightDetails?.flightDetails?.flightInformation?.location?.[0]
                ?.locationId
            )?.code,
            CityName: findAirportByCode(
              flightDetails?.flightDetails?.flightInformation?.location?.[0]
                ?.locationId
            )?.name,
            Terminal:
              flightDetails?.flightDetails?.flightInformation?.location?.[0]
                ?.terminal,
            DepTime: convertToISO(
              flightDetails?.flightDetails?.flightInformation?.productDateTime
                ?.dateOfDeparture,
              flightDetails?.flightDetails?.flightInformation?.productDateTime
                ?.timeOfDeparture
            ),
          },
          Destination: {
            AirportCode:
              flightDetails?.flightDetails?.flightInformation?.location?.[1]
                ?.locationId,
            AirportName: findAirportByCode(
              flightDetails?.flightDetails?.flightInformation?.location?.[1]
                ?.locationId
            )?.code,
            CityName: findAirportByCode(
              flightDetails?.flightDetails?.flightInformation?.location?.[1]
                ?.locationId
            )?.name,
            Terminal:
              flightDetails?.flightDetails?.flightInformation?.location?.[1]
                ?.terminal,
            ArrTime: convertToISO(
              flightDetails?.flightDetails?.flightInformation?.productDateTime
                ?.dateOfArrival,
              flightDetails?.flightDetails?.flightInformation?.productDateTime
                ?.timeOfArrival
            ),
          },
          Baggage: Baggage,
        },
      ];
      let airlineDetails = flightDetails?.flightDetails?.flightInformation
        ? nonStop
        : flightDetails?.flightDetails?.map((item) => {
            // console.log(item, "stops");

            return {
              Airline: {
                AirlineCode:
                  item?.flightInformation?.companyId?.marketingCarrier,
                AirlineName: findAirlineByCode(
                  item?.flightInformation?.companyId?.marketingCarrier
                )?.airlineName,
                FlightNumber: item?.flightInformation?.flightOrtrainNumber,
                FareClass: "W",
                //   jsonSavePnrData?.originDestinationDetails?.itineraryInfo
                //     ?.travelProduct?.productDetails?.classOfService,
              },
              Origin: {
                AirportCode: item?.flightInformation?.location?.[0]?.locationId,
                AirportName: findAirportByCode(
                  item?.flightInformation?.location?.[0]?.locationId
                )?.code,
                CityName: findAirportByCode(
                  item?.flightInformation?.location?.[0]?.locationId
                )?.name,
                Terminal: item?.flightInformation?.location?.[0]?.terminal,
                DepTime: convertToISO(
                  item?.flightInformation?.productDateTime?.dateOfDeparture,
                  item?.flightInformation?.productDateTime?.timeOfDeparture
                ),
              },
              Destination: {
                AirportCode: item?.flightInformation?.location?.[1]?.locationId,
                AirportName: findAirportByCode(
                  item?.flightInformation?.location?.[1]?.locationId
                )?.code,
                CityName: findAirportByCode(
                  item?.flightInformation?.location?.[1]?.locationId
                )?.name,
                Terminal: item?.flightInformation?.location?.[1]?.terminal,
                ArrTime: convertToISO(
                  item?.flightInformation?.productDateTime?.dateOfArrival,
                  item?.flightInformation?.productDateTime?.timeOfArrival
                ),
              },
              Baggage: Baggage,
            };
          });
      const PNRData =
        type === "onward"
          ? reducerState?.newFlightBook?.oneway
          : reducerState?.newFlightBook?.return;
      PNR = PNRData?.pnrHeader?.reservationInfo?.reservation?.controlNumber;
      payload.pnr = PNR;
      payload.isHold = isHold || false;
      payload.airlineDetails = airlineDetails;
      let bookingStatus = PNR ? "BOOKED" : "FAILED";
      payload.bookingStatus = bookingStatus;
      // console.log(
      //   "Amd PNR Data",
      //   PNR,
      //   PNRData?.originDestinationDetails?.itineraryInfo?.[0]?.flightDetail
      //     ?.timeDetail?.checkinTime,
      //   "payload",
      //   payload
      // );
      boardingTime =
        PNRData?.originDestinationDetails?.itineraryInfo?.flightDetail
          ?.timeDetail?.checkinTime ||
        PNRData?.originDestinationDetails?.itineraryInfo?.[0]?.flightDetail
          ?.timeDetail?.checkinTime;

      payload.pnr = PNR;
      payload.seatDynamic = seatDynamic;
      // console.log(
      //   PNRData,
      //   PNR,
      //   payload,
      //   "AMD PNR Data",
      //   type,
      //   flightDetails,
      //   "nonStop",
      //   nonStop
      // );
      // userApi.flightBookingDB(payload);
      userApi.flightBookingDetailsCommon(payload);
      // ticket.boardingTime = boardingTime || "2h before departure";
      // return ticket;
    }

    return ticket; // Default return if none of the conditions match
  };

  return handleBookingDetails(SelectedFlights, type);
};
export function findAirlineByCode(code) {
  // const reducerState = useSelector((state) => state);
  // Get the current state from the Redux store

  const state = store.getState();

  // Access the airport list from the state
  const airlinetList = state?.flightList?.flightDetails;

  // Perform the lookup
  if (!Array.isArray(airlinetList) || !code) return null;
  let data = airlinetList.find((airport) => airport?.airlineCode === code);

  return data;
}
// console.log(airports,airlines);
export function findAirportByCode(code) {
  // const reducerState = useSelector((state) => state);
  // const [airports, setAireport] = useState(
  //   reducerState?.flightList?.aireportList
  // );
  // const
  const state = store.getState();
  const airportList = state?.flightList?.aireportList;
  const data =
    airportList?.length > 0
      ? airportList?.find((airport) => airport?.AirportCode === code)
      : { name: code };
  // console.log(state?.flightList, "airportlist");
  return data;
}
export function passportReqired() {
  const reducerState = store.getState();
  const onwardCountry = reducerState?.searchFlight?.flightDetails?.from
    ?.CountryCode
    ? reducerState?.searchFlight?.flightDetails?.from?.CountryCode
    : findAirportByCode(reducerState?.searchFlight?.flightDetails?.from)
        ?.CountryCode;
  const returnCountry = reducerState?.searchFlight?.flightDetails?.to
    ?.CountryCode
    ? reducerState?.searchFlight?.flightDetails?.to?.CountryCode
    : findAirportByCode(reducerState?.searchFlight?.flightDetails?.to)
        ?.CountryCode;
  const isPassportRequired =
    onwardCountry?.trim() !== "IN" || returnCountry?.trim() !== "IN"
      ? true
      : false;

  // console.log(
  //   reducerState?.searchFlight?.flightDetails,
  //   onwardCountry,
  //   returnCountry,
  //   "passport required"
  // );
  return isPassportRequired;
}
