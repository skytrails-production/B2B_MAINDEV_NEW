import { XMLParser } from "fast-xml-parser";
import axios from "axios";
import userApi from "../../Redux/API/api";
import { apiURL } from "../../Constants/constant";
import SecureStorage from "react-secure-storage";
// import { Navigate } from "react-router-dom";
// Utility function to convert XML to JSON and set state
let xmlContinue = "";
let dataElementsMaster = "";
function convertDateFormatAmd(originalDate) {
  // Convert to Date object
  const dateObj = new Date(originalDate);

  // Get day
  const day = dateObj.getDate();

  // Get month in abbreviated form
  const monthAbbrev = dateObj.toLocaleString("default", { month: "short" });

  // Get year in abbreviated form
  const yearAbbrev = dateObj.getFullYear().toString().slice(-2);

  // Form the desired format
  const convertedDate = `${day}${monthAbbrev}${yearAbbrev}`;

  return convertedDate;
}
// api for airesell
export const fetchData = async ({
  sesstioResultIndex,
  setAirsellRes,
  setXmlData,
  adultCount,
  childCount,
  infantCount,
}) => {
  console.log(sesstioResultIndex, "sesstionResultIndex");
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

  const res = await axios({
    method: "POST",
    url: `${apiURL.baseURL}/skyTrails/amadeus/airsell`,
    data: `<Air_SellFromRecommendation>
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
            </Air_SellFromRecommendation>`,
    headers: {
      "Content-Type": "text/xml",
      //  token: token,
    },
  });
  setAirsellRes(res?.data);
  setXmlData(res?.data?.data?.data);
};
export const startHBookingProcessAMD = ({
  sesstioResultIndex,
  jsonData,
  adultCount,
  childCount,
  passengerData,
  infantCount,
  seatListPayload,
  navigate,
  airesellRes,
  finalAmount,
  arrTimeISO1,
  depTimeISO1,
  ResultIndex,
  discountvalue,
  jsonSavePnrData,
  setJsonSaveData,
  totalSeatAmount,
}) => {
  console.log(sesstioResultIndex, "sessionResultIndex");
  const refundAmount = async ({
    refundTxnId,
    finalAmount,
    totalSeatAmount,
  }) => {
    try {
      const token = SecureStorage.getItem("jwtToken");
      const payload = {
        refund_amount: 1,
        // refund_amount:
        // parseInt(ResultIndex?.monetaryDetail?.[0]?.amount) +
        // markUpamount *
        //   parseInt(ResultIndex?.monetaryDetail?.[0]?.amount).toFixed(0),
        // Number(finalAmount).toFixed(2) +Number(totalSeatAmount),

        txnId: refundTxnId,
      };

      const res = await axios({
        method: "POST",
        url: `${apiURL.baseURL}/skyTrails/api/transaction/refundPolicy`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });
    } catch (error) {
      console.warn(error);
    } finally {
      // saveDb();
      // datasaveTodb(jsonSavePnrData, sesstioResultIndex, reducerState, finalAmount, arrTimeISO1, depTimeISO1);
    }

    // swalModal(
    //   "flight",
    //   // reducerState?.flightBook?.flightBookData?.Error?.ErrorMessage,
    //   "Booking failed, your amount will be refunded within 72 hours.",
    //   false
    // );
  };
  // Navigate function
  const NavigateFUN = () => {
    navigate(
      `/bookedTicketSucess/${jsonSavePnrData?.pnrHeader?.reservationInfo?.reservation?.controlNumber}`,
      {
        state: {
          PNR: jsonSavePnrData?.pnrHeader?.reservationInfo?.reservation
            ?.controlNumber,
          datavalue: jsonSavePnrData,
          sesstioResultIndex: sesstioResultIndex,
          finalAmount: finalAmount + totalSeatAmount,
          arrTimeISO1: arrTimeISO1,
          depTimeISO1: depTimeISO1,
          ResultIndex: ResultIndex,
          jsonData: jsonData,
          discountvalue: discountvalue,
        },
      }
    );
  };
  const convertXmlToJsonSavePnr = async (res) => {
    const parser = new XMLParser();
    const result = await parser.parse(res);
    let convertData;
    if (res !== "") {
      convertData = await result["soapenv:Envelope"]["soapenv:Body"][
        "PNR_Reply"
      ];
      setJsonSaveData(convertData);
    }
  };
  const fetchDataSavepnr = async (ress) => {
    try {
      const res = await axios({
        method: "POST",
        url: `${apiURL.baseURL}/skyTrails/amadeus/savepnr`,
        data: {
          amadeusMessageID: ress?.MessageID,
          amadeusUniqueID: ress?.UniqueID,
          amadeusSessionID: ress?.SessionId,
          amadeusSequenceNumber: ress?.SequenceNumber,
          amadeusSecurityToken: ress?.SecurityToken,
        },
        headers: {
          "Content-Type": "application/json",

          //  token: token,
        },
      });

      convertXmlToJsonSavePnr(res?.data?.data?.data);
    } catch (errors) {
      console.log("Error in fetchDataSavepnr", errors);
      refundAmount();
      NavigateFUN();
    }
  };
  const fetchDataAmadesticketcreatetstfrompricing = async (ress) => {
    try {
      const res = await axios({
        method: "POST",
        url: `${apiURL.baseURL}/skyTrails/amadeus/ticketcreatetstfrompricing`,
        data: {
          amadeusMessageID: ress?.MessageID,
          amadeusUniqueID: ress?.UniqueID,
          amadeusSessionID: ress?.SessionId,
          amadeusSequenceNumber: ress?.SequenceNumber,
          amadeusSecurityToken: ress?.SecurityToken,
          totalPax: parseInt(adultCount) + parseInt(childCount),
        },
        headers: {
          "Content-Type": "application/json",

          //  token: token,
        },
      });

      if (res?.data?.status === 200) {
        // fetchDataAmadesticketcreatetstfrompricing(res?.data?.data?.headers);
        fetchDataSavepnr(res?.data?.data?.headers);
      }
    } catch (error) {
      console.error("Error fetching fare price PNR with booking class:", error);
      refundAmount();
      NavigateFUN();

      // Handle error accordingly (e.g., show an error message to the user)
    }
  };
  const farepricepnrwithbookingclass = async (ress) => {
    // console.log(airesellRes?.data?.MessageID, "ffffffffffffffffffffffffff");
    try {
      const res = await axios({
        method: "POST",
        url: `${apiURL.baseURL}/skyTrails/amadeus/farepricepnrwithbookingclass`,
        data: {
          amadeusMessageID: ress?.MessageID,
          amadeusUniqueID: ress?.UniqueID,
          amadeusSessionID: ress?.SessionId,
          amadeusSequenceNumber: ress?.SequenceNumber,
          amadeusSecurityToken: ress?.SecurityToken,
          flightCode:
            sesstioResultIndex?.flightDetails?.flightInformation?.companyId
              ?.marketingCarrier,
        },
        headers: {
          "Content-Type": "application/json",

          //  token: token,
        },
      });

      if (res?.data?.status === 200) {
        fetchDataAmadesticketcreatetstfrompricing(res?.data?.data?.headers);
      }
    } catch (error) {
      console.error("Error fetching fare price PNR with booking class:", error);
      refundAmount();
      NavigateFUN();

      // Handle error accordingly (e.g., show an error message to the user)
    }
  };
  const fetchDataAmadesContinue = async (amadiesPayload) => {
    console.log(
      airesellRes?.data?.headers?.MessageID,
      airesellRes?.data?.headers?.UniqueID,
      airesellRes?.data?.headers?.SessionId,
      airesellRes?.data?.headers?.SecurityToken
    );
    try {
      const res = await axios({
        method: "POST",
        url: `${apiURL.baseURL}/skyTrails/amadeus/pnraddmultielements`,
        data: amadiesPayload,
        // headers: { ...airesellRes?.data?.headers, "Content-Type": "text/xml" },
        headers: {
          "Content-Type": "text/xml",
          amadeusMessageID: airesellRes?.data?.headers?.MessageID,
          amadeusUniqueID: airesellRes?.data?.headers?.UniqueID,
          amadeusSessionID: airesellRes?.data?.headers?.SessionId,
          amadeusSequenceNumber: airesellRes?.data?.headers?.SequenceNumber,
          amadeusSecurityToken: airesellRes?.data?.headers?.SecurityToken,
          //  token: token,
        },
      });

      if (res?.data?.status === 200) {
        // fetchDataAmadesticketcreatetstfrompricing(res?.data?.data?.headers);
        farepricepnrwithbookingclass(res?.data?.data?.headers);
      }
    } catch (error) {
      console.error("Error fetching fare price PNR with booking class:", error);
      refundAmount();
      NavigateFUN();
      // Handle error accordingly (e.g., show an error message to the user)
    }
  };
  const xmlpassengerData = async () => {
    for (let i = 0; i < Number(adultCount) + Number(childCount); i++) {
      xmlContinue += `<travellerInfo>
      <elementManagementPassenger>
          <reference>
              <qualifier>PR</qualifier>
              <number>${i + 1}</number>
          </reference>
          <segmentName>NM</segmentName>
      </elementManagementPassenger>
      <passengerData>
          <travellerInformation>
              <traveller>
                  <surname>${passengerData[i]?.lastName}</surname>
                 
                  <quantity>${
                    passengerData[i]?.PaxType === 1 ? adultCount : childCount
                  }</quantity>
              </traveller>
              <passenger>
                  <firstName>${passengerData[i]?.firstName}</firstName>
                  <type>${
                    passengerData[i]?.PaxType === 1 ? "ADT" : "CHD"
                  }</type>
              </passenger>
              </travellerInformation>
              ${
                passengerData[i]?.PaxType !== 1
                  ? `<dateOfBirth>
                      <dateAndTimeDetails>
                          <qualifier>706</qualifier>
                          <date>${convertDateFormatAmd(
                            passengerData[i]?.DateOfBirth
                          )}</date>
                      </dateAndTimeDetails>
                    </dateOfBirth>`
                  : ""
              }
      </passengerData>
      ${
        i < infantCount
          ? ` <passengerData>
          <travellerInformation>
              <traveller>
                  <surname>${
                    //   ,
                    passengerData[Number(adultCount) + Number(childCount) + i]
                      ?.lastName
                  }</surname>
                  <quantity>${infantCount}</quantity>
              </traveller>
              <passenger>
                  <firstName>${
                    passengerData[Number(adultCount) + Number(childCount) + i]
                      ?.firstName
                  }</firstName>
                  <type>${"INF"}</type>
              </passenger>
              </travellerInformation>
              ${
                `<dateOfBirth>
                      <dateAndTimeDetails>
                          <qualifier>706</qualifier>
                          <date>${convertDateFormatAmd(
                            passengerData[
                              Number(adultCount) + Number(childCount) + i
                            ]?.DateOfBirth
                          )}</date>
                      </dateAndTimeDetails>
                    </dateOfBirth>`
                // : ""
              }
      </passengerData>`
          : ""
      }
  </travellerInfo>`;
      dataElementsMaster += `<dataElementsIndiv>
            <elementManagementData>
                <reference>
                    <qualifier>OT</qualifier>
                    <number>${i + 1}</number>
                </reference>
                <segmentName>AP</segmentName>
            </elementManagementData>
            <freetextData>
                <freetextDetail>
                    <subjectQualifier>3</subjectQualifier>
                    <type>P02</type>
                </freetextDetail>
                <longFreetext>${passengerData[0]?.email}</longFreetext>
            </freetextData>
            <referenceForDataElement>
                <reference>
                    <qualifier>PR</qualifier>
                    <number>${i + 1}</number>
                </reference>
            </referenceForDataElement>
        </dataElementsIndiv>
        <dataElementsIndiv>
            <elementManagementData>
                <reference>
                    <qualifier>OT</qualifier>
                    <number>${i + 1}</number>
                </reference>
                <segmentName>AP</segmentName>
            </elementManagementData>
            <freetextData>
                <freetextDetail>
                    <subjectQualifier>3</subjectQualifier>
                    <type>7</type>
                    <status>A</status>
                </freetextDetail>
                <longFreetext>${passengerData[0]?.ContactNo}</longFreetext>
            </freetextData>
            <referenceForDataElement>
                <reference>
                    <qualifier>PR</qualifier>
                    <number>${i + 1}</number>
                </reference>
            </referenceForDataElement>
        </dataElementsIndiv>`;
    }

    let amadiesPayload = `<PNR_AddMultiElements
    xmlns="http://xml.amadeus.com/PNRADD_17_1_1A">
    <pnrActions>
        <optionCode>0</optionCode>
    </pnrActions>
 ${xmlContinue}
  
    <dataElementsMaster>
        <marker1 />
        ${dataElementsMaster}
        
          <dataElementsIndiv>
            <elementManagementData>
                <reference>
                    <qualifier>OT</qualifier>
                    <number>1</number>
                </reference>
                <segmentName>TK</segmentName>
            </elementManagementData>
            <ticketElement>
                <passengerType>PAX</passengerType>
                <ticket>
                    <indicator>OK</indicator>
                </ticket>
            </ticketElement>
        </dataElementsIndiv>
        <dataElementsIndiv>
            <elementManagementData>
                <segmentName>FP</segmentName>
            </elementManagementData>
            <formOfPayment>
                <fop>
                    <identification>CA</identification>
                </fop>
            </formOfPayment>
        </dataElementsIndiv>
        <dataElementsIndiv>
            <elementManagementData>
                <segmentName>RF</segmentName>
            </elementManagementData>
            <freetextData>
                <freetextDetail>
                    <subjectQualifier>3</subjectQualifier>
                    <type>P22</type>
                </freetextDetail>
                <longFreetext>62</longFreetext>
            </freetextData>
        </dataElementsIndiv>
        <dataElementsIndiv>
            <elementManagementData>
                <segmentName>OS</segmentName>
            </elementManagementData>
            <freetextData>
                <freetextDetail>
                    <subjectQualifier>3</subjectQualifier>
                    <type>P27</type>
                    <companyId>${
                      sesstioResultIndex?.flightDetails?.flightInformation
                        ?.companyId?.marketingCarrier ||
                      sesstioResultIndex?.flightDetails[0]?.flightInformation
                        ?.companyId?.marketingCarrier
                    }</companyId>
                </freetextDetail>
                <longFreetext>PAX CTCM ${
                  passengerData[0]?.ContactNo
                }</longFreetext>
            </freetextData>
        </dataElementsIndiv>
        
       ${seatListPayload}
        
        </dataElementsMaster>
        </PNR_AddMultiElements>`;
    // console.log(amadiesPayload, "amadiesPayload")

    fetchDataAmadesContinue(amadiesPayload);
  };
  xmlpassengerData();
};
export const startBookingProcessAMD_New = async ({
  sesstioResultIndex,
  jsonData,
  adultCount,
  childCount,
  passengerData,
  infantCount,
  seatListPayload,
  navigate,
  airesellRes,
  finalAmount,
  arrTimeISO1,
  depTimeISO1,
  ResultIndex,
  discountvalue,
  jsonSavePnrData,
  setJsonSaveData,
  totalSeatAmount,
}) => {
  xmlContinue = "";
  dataElementsMaster = "";
  console.log(sesstioResultIndex, "sessionResultIndex");
  // const refundAmount = async ({
  //   refundTxnId,
  //   finalAmount,
  //   totalSeatAmount,
  // }) => {
  //   try {
  //     const token = SecureStorage.getItem("jwtToken");
  //     const payload = {
  //       refund_amount: 1,
  //       // refund_amount:
  //       // parseInt(ResultIndex?.monetaryDetail?.[0]?.amount) +
  //       // markUpamount *
  //       //   parseInt(ResultIndex?.monetaryDetail?.[0]?.amount).toFixed(0),
  //       // Number(finalAmount).toFixed(2) +Number(totalSeatAmount),

  //       txnId: refundTxnId,
  //     };

  //     const res = await axios({
  //       method: "POST",
  //       url: `${apiURL.baseURL}/skyTrails/api/transaction/refundPolicy`,
  //       data: payload,
  //       headers: {
  //         "Content-Type": "application/json",
  //         token: token,
  //       },
  //     });
  //   } catch (error) {
  //     console.warn(error);
  //   } finally {
  //     // saveDb();
  //     // datasaveTodb(jsonSavePnrData, sesstioResultIndex, reducerState, finalAmount, arrTimeISO1, depTimeISO1);
  //   }

  //   // swalModal(
  //   //   "flight",
  //   //   // reducerState?.flightBook?.flightBookData?.Error?.ErrorMessage,
  //   //   "Booking failed, your amount will be refunded within 72 hours.",
  //   //   false
  //   // );
  // };
  // Navigate function
  // const NavigateFUN = () => {
  //   navigate(
  //     `/bookedTicketSucess/${jsonSavePnrData?.pnrHeader?.reservationInfo?.reservation?.controlNumber}`,
  //     {
  //       state: {
  //         PNR: jsonSavePnrData?.pnrHeader?.reservationInfo?.reservation
  //           ?.controlNumber,
  //         datavalue: jsonSavePnrData,
  //         sesstioResultIndex: sesstioResultIndex,
  //         finalAmount: finalAmount + totalSeatAmount,
  //         arrTimeISO1: arrTimeISO1,
  //         depTimeISO1: depTimeISO1,
  //         ResultIndex: ResultIndex,
  //         jsonData: jsonData,
  //         discountvalue: discountvalue,
  //       },
  //     }
  //   );
  // };
  let savePnrData;
  const convertXmlToJsonSavePnr = async (res) => {
    const parser = new XMLParser();
    const result = await parser.parse(res);
    let convertData;
    if (res !== "") {
      convertData = await result["soapenv:Envelope"]["soapenv:Body"][
        "PNR_Reply"
      ];
      // setJsonSaveData(convertData);
      return convertData;
      console.log(convertData, "convertData");
    }
  };
  const fetchDataSavepnr = async (ress) => {
    try {
      const res = await axios({
        method: "POST",
        url: `${apiURL.baseURL}/skyTrails/amadeus/savepnr`,
        data: {
          amadeusMessageID: ress?.MessageID,
          amadeusUniqueID: ress?.UniqueID,
          amadeusSessionID: ress?.SessionId,
          amadeusSequenceNumber: ress?.SequenceNumber,
          amadeusSecurityToken: ress?.SecurityToken,
        },
        headers: {
          "Content-Type": "application/json",

          //  token: token,
        },
      });

      savePnrData = await convertXmlToJsonSavePnr(res?.data?.data?.data);
      return savePnrData;
    } catch (errors) {
      savePnrData({ error: true, errorMessage: errors.message });

      console.log("Error in fetchDataSavepnr", errors);
      // refundAmount();
      // NavigateFUN();
    }
  };
  const fetchDataAmadesticketcreatetstfrompricing = async (ress) => {
    try {
      const res = await axios({
        method: "POST",
        url: `${apiURL.baseURL}/skyTrails/amadeus/ticketcreatetstfrompricing`,
        data: {
          amadeusMessageID: ress?.MessageID,
          amadeusUniqueID: ress?.UniqueID,
          amadeusSessionID: ress?.SessionId,
          amadeusSequenceNumber: ress?.SequenceNumber,
          amadeusSecurityToken: ress?.SecurityToken,
          totalPax: parseInt(adultCount) + parseInt(childCount),
        },
        headers: {
          "Content-Type": "application/json",

          //  token: token,
        },
      });

      if (res?.data?.status === 200) {
        // fetchDataAmadesticketcreatetstfrompricing(res?.data?.data?.headers);
        await fetchDataSavepnr(res?.data?.data?.headers);
      }
    } catch (error) {
      console.error("Error fetching fare price PNR with booking class:", error);
      // refundAmount();
      // NavigateFUN();

      // Handle error accordingly (e.g., show an error message to the user)
    }
  };
  const farepricepnrwithbookingclass = async (ress) => {
    // console.log(airesellRes?.data?.MessageID, "ffffffffffffffffffffffffff");
    try {
      const res = await axios({
        method: "POST",
        url: `${apiURL.baseURL}/skyTrails/amadeus/farepricepnrwithbookingclass`,
        data: {
          amadeusMessageID: ress?.MessageID,
          amadeusUniqueID: ress?.UniqueID,
          amadeusSessionID: ress?.SessionId,
          amadeusSequenceNumber: ress?.SequenceNumber,
          amadeusSecurityToken: ress?.SecurityToken,
          flightCode:
            sesstioResultIndex?.flightDetails?.flightInformation?.companyId
              ?.marketingCarrier,
        },
        headers: {
          "Content-Type": "application/json",

          //  token: token,
        },
      });

      if (res?.data?.status === 200) {
        await fetchDataAmadesticketcreatetstfrompricing(
          res?.data?.data?.headers
        );
      }
    } catch (error) {
      console.error("Error fetching fare price PNR with booking class:", error);
      // refundAmount();
      // NavigateFUN();

      // Handle error accordingly (e.g., show an error message to the user)
    }
  };
  const fetchDataAmadesContinue = async (amadiesPayload) => {
    console.log(
      airesellRes,
      "airselresponse",
      airesellRes?.headers?.MessageID,
      airesellRes?.headers?.UniqueID,
      airesellRes?.headers?.SessionId,
      airesellRes?.headers?.SecurityToken
    );
    try {
      const res = await axios({
        method: "POST",
        url: `${apiURL.baseURL}/skyTrails/amadeus/pnraddmultielements`,
        data: amadiesPayload,
        // headers: { ...airesellRes?.data?.headers, "Content-Type": "text/xml" },
        headers: {
          "Content-Type": "text/xml",
          amadeusMessageID: airesellRes?.headers?.MessageID,
          amadeusUniqueID: airesellRes?.headers?.UniqueID,
          amadeusSessionID: airesellRes?.headers?.SessionId,
          amadeusSequenceNumber: airesellRes?.headers?.SequenceNumber,
          amadeusSecurityToken: airesellRes?.headers?.SecurityToken,
          //  token: token,
        },
      });

      if (res?.data?.status === 200) {
        // fetchDataAmadesticketcreatetstfrompricing(res?.data?.data?.headers);
        await farepricepnrwithbookingclass(res?.data?.data?.headers);
      }
    } catch (error) {
      console.error("Error fetching fare price PNR with booking class:", error);
      // refundAmount();
      // NavigateFUN();
      // Handle error accordingly (e.g., show an error message to the user)
    }
  };
  const xmlpassengerData = async () => {
    for (let i = 0; i < Number(adultCount) + Number(childCount); i++) {
      xmlContinue += `<travellerInfo>
      <elementManagementPassenger>
          <reference>
              <qualifier>PR</qualifier>
              <number>${i + 1}</number>
          </reference>
          <segmentName>NM</segmentName>
      </elementManagementPassenger>
      <passengerData>
          <travellerInformation>
              <traveller>
                  <surname>${passengerData[i]?.lastName}</surname>
                 
                  <quantity>${
                    passengerData[i]?.PaxType === 1 ? adultCount : childCount
                  }</quantity>
              </traveller>
              <passenger>
                  <firstName>${passengerData[i]?.firstName}</firstName>
                  <type>${
                    passengerData[i]?.PaxType === 1 ? "ADT" : "CHD"
                  }</type>
              </passenger>
              </travellerInformation>
              ${
                passengerData[i]?.PaxType !== 1
                  ? `<dateOfBirth>
                      <dateAndTimeDetails>
                          <qualifier>706</qualifier>
                          <date>${convertDateFormatAmd(
                            passengerData[i]?.DateOfBirth
                          )}</date>
                      </dateAndTimeDetails>
                    </dateOfBirth>`
                  : ""
              }
      </passengerData>
      ${
        i < infantCount
          ? ` <passengerData>
          <travellerInformation>
              <traveller>
                  <surname>${
                    //   ,
                    passengerData[Number(adultCount) + Number(childCount) + i]
                      ?.lastName
                  }</surname>
                  <quantity>${infantCount}</quantity>
              </traveller>
              <passenger>
                  <firstName>${
                    passengerData[Number(adultCount) + Number(childCount) + i]
                      ?.firstName
                  }</firstName>
                  <type>${"INF"}</type>
              </passenger>
              </travellerInformation>
              ${
                `<dateOfBirth>
                      <dateAndTimeDetails>
                          <qualifier>706</qualifier>
                          <date>${convertDateFormatAmd(
                            passengerData[
                              Number(adultCount) + Number(childCount) + i
                            ]?.DateOfBirth
                          )}</date>
                      </dateAndTimeDetails>
                    </dateOfBirth>`
                // : ""
              }
      </passengerData>`
          : ""
      }
  </travellerInfo>`;
      dataElementsMaster += `<dataElementsIndiv>
            <elementManagementData>
                <reference>
                    <qualifier>OT</qualifier>
                    <number>${i + 1}</number>
                </reference>
                <segmentName>AP</segmentName>
            </elementManagementData>
            <freetextData>
                <freetextDetail>
                    <subjectQualifier>3</subjectQualifier>
                    <type>P02</type>
                </freetextDetail>
                <longFreetext>${passengerData[0]?.email}</longFreetext>
            </freetextData>
            <referenceForDataElement>
                <reference>
                    <qualifier>PR</qualifier>
                    <number>${i + 1}</number>
                </reference>
            </referenceForDataElement>
        </dataElementsIndiv>
        <dataElementsIndiv>
            <elementManagementData>
                <reference>
                    <qualifier>OT</qualifier>
                    <number>${i + 1}</number>
                </reference>
                <segmentName>AP</segmentName>
            </elementManagementData>
            <freetextData>
                <freetextDetail>
                    <subjectQualifier>3</subjectQualifier>
                    <type>7</type>
                    <status>A</status>
                </freetextDetail>
                <longFreetext>${passengerData[0]?.ContactNo}</longFreetext>
            </freetextData>
            <referenceForDataElement>
                <reference>
                    <qualifier>PR</qualifier>
                    <number>${i + 1}</number>
                </reference>
            </referenceForDataElement>
        </dataElementsIndiv>`;
    }

    let amadiesPayload = `<PNR_AddMultiElements
    xmlns="http://xml.amadeus.com/PNRADD_17_1_1A">
    <pnrActions>
        <optionCode>0</optionCode>
    </pnrActions>
 ${xmlContinue}
  
    <dataElementsMaster>
        <marker1 />
        ${dataElementsMaster}
        
          <dataElementsIndiv>
            <elementManagementData>
                <reference>
                    <qualifier>OT</qualifier>
                    <number>1</number>
                </reference>
                <segmentName>TK</segmentName>
            </elementManagementData>
            <ticketElement>
                <passengerType>PAX</passengerType>
                <ticket>
                    <indicator>OK</indicator>
                </ticket>
            </ticketElement>
        </dataElementsIndiv>
        <dataElementsIndiv>
            <elementManagementData>
                <segmentName>FP</segmentName>
            </elementManagementData>
            <formOfPayment>
                <fop>
                    <identification>CA</identification>
                </fop>
            </formOfPayment>
        </dataElementsIndiv>
        <dataElementsIndiv>
            <elementManagementData>
                <segmentName>RF</segmentName>
            </elementManagementData>
            <freetextData>
                <freetextDetail>
                    <subjectQualifier>3</subjectQualifier>
                    <type>P22</type>
                </freetextDetail>
                <longFreetext>62</longFreetext>
            </freetextData>
        </dataElementsIndiv>
        <dataElementsIndiv>
            <elementManagementData>
                <segmentName>OS</segmentName>
            </elementManagementData>
            <freetextData>
                <freetextDetail>
                    <subjectQualifier>3</subjectQualifier>
                    <type>P27</type>
                    <companyId>${
                      sesstioResultIndex?.flightDetails?.flightInformation
                        ?.companyId?.marketingCarrier ||
                      sesstioResultIndex?.flightDetails[0]?.flightInformation
                        ?.companyId?.marketingCarrier
                    }</companyId>
                </freetextDetail>
                <longFreetext>PAX CTCM ${
                  passengerData[0]?.ContactNo
                }</longFreetext>
            </freetextData>
        </dataElementsIndiv>
        
       ${seatListPayload}
        
        </dataElementsMaster>
        </PNR_AddMultiElements>`;
    // console.log(amadiesPayload, "amadiesPayload")

    await fetchDataAmadesContinue(amadiesPayload);
  };
  await xmlpassengerData();
  console.log(savePnrData, " savePnrDataqqq");
  return savePnrData;
};

export const convertXmlToJson = (xmlData, setJsonData) => {
  const parser = new XMLParser();
  const result = parser.parse(xmlData);

  let convertData;
  if (xmlData !== "") {
    convertData =
      result["soapenv:Envelope"]["soapenv:Body"][
        "Air_SellFromRecommendationReply"
      ];
    setJsonData(convertData); // Set the JSON data using the passed setter
  }
};
export const convertXmlToJsonSavePnr = async (res, setJsonSaveData) => {
  const parser = new XMLParser();
  const result = await parser.parse(res);
  let convertData;
  if (res !== "") {
    convertData = result["soapenv:Envelope"]["soapenv:Body"]["PNR_Reply"];
    setJsonSaveData(convertData);
  }
};

// navigate("/");
