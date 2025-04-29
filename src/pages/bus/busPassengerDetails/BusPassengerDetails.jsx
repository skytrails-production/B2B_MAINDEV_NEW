import React, { useEffect, useState } from "react";
import BusSummary from "../busSummary/BusSummary";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiURL } from "../../../Constants/constant";
import { busSeatBlockAction } from "../../../Redux/busSearch/busSearchAction";
import dayjs from "dayjs";

import { Select } from "antd";
import {
  validateEmail,
  validatePhoneNumber,
  validateName,
  validateAge,
  validateGender,
} from "../../../utility/validationFunctions";

const { Option } = Select;

const BusPassengerDetail = () => {
  const navigate = useNavigate();
  const reducerState = useSelector((state) => state);
  const dispatch = useDispatch();
  const busFullData =
    reducerState?.getBusResult?.busResult?.data?.data?.BusSearchResult;
  const passengerLists = [];
  const [sub, setSub] = useState(false);
  const seatData = sessionStorage.getItem("seatData");
  const parsedSeatData = JSON.parse(seatData);
  const passengerCount = parsedSeatData?.blockedSeatArray.length;
  const resultIndex = parsedSeatData?.resultIndex;
  const boardingPoint = parsedSeatData?.selectedOrigin;
  const droppingPoint = parsedSeatData?.selectedDropPoint;
  const seatObject = parsedSeatData?.blockedSeatArray;
  const published = seatObject.reduce(function (
    accumulator,
    currentValue,
    currentIndex,
    array
  ) {
    return accumulator + currentValue?.Price?.PublishedPriceRoundedOff;
  },
  0);
  const markUpamount =
    reducerState?.markup?.markUpData?.data?.result[0]?.busMarkup;
  const grandTotal = published + markUpamount;

  const passengerTemplate = {
    LeadPassenger: true,
    PassengerId: 0,
    // Title: "Mr",
    Title: "",
    Address: "",
    Age: "",
    Email: "",
    FirstName: "",
    Gender: "",
    IdNumber: null,
    IdType: null,
    LastName: "",
    Phoneno: "",
  };

  for (let i = 0; i < passengerCount; i++) {
    passengerLists.push({
      ...passengerTemplate,
      LeadPassenger: i === 0,
    });
  }

  const allPassenger = [passengerLists];
  const [passengerData, setPassengerData] = useState(allPassenger.flat());

  const handleServiceChange = (e, index) => {
    const { name, value } = e.target;
    const updatedPassenger = [...passengerData];
    updatedPassenger[index] = {
      ...updatedPassenger[index],
      [name]: value,
    };

    setPassengerData(updatedPassenger);
  };

  function handleSeatBlock() {
    const payload = {
      Passenger: passengerData?.map((item, index) => {
        return {
          ...item,
          Seat: parsedSeatData?.blockedSeatArray[index],
          Email: apiURL.flightEmail,
          Title: item?.Gender == "1" ? "Mr." : "Miss.",
        };
      }),

      EndUserIp: reducerState?.ip?.ipData,
      ResultIndex: JSON.stringify(resultIndex),
      TraceId: busFullData?.TraceId,
      TokenId: reducerState?.ip?.tokenData,
      BoardingPointId: boardingPoint,
      DroppingPointId: droppingPoint,
    };
    dispatch(busSeatBlockAction(payload));
    sessionStorage.setItem("busPassName", JSON.stringify(passengerData));
    navigate("/BusReviewBooking");
  }

  const selectedBus = busFullData.BusResults.find(
    (bus) => bus.ResultIndex === resultIndex
  );

  const [showBtn, setShowBtn] = useState(false);

  const departureTime = new Date(selectedBus.DepartureTime).getTime();
  const arrivalTime = new Date(selectedBus.ArrivalTime).getTime();
  const timeDifference = arrivalTime - departureTime;
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const duration = `${hours}hr ${minutes}min`;

  function validtion() {
    const res = passengerData.filter(
      (item) =>
        validatePhoneNumber(item.Phoneno) &&
        validateEmail(item.Email) &&
        validateName(item.FirstName) &&
        validateName(item.LastName) &&
        validateAge(item.Age) &&
        validateGender(item.Gender) &&
        item?.Address !== ""
    );
    const result = res.length === passengerData.length ? true : false;

    return result;
  }
  async function result() {
    const vali = validtion();
    if (vali) {
      setShowBtn(true);
    } else {
      setShowBtn(false);
    }
  }

  useEffect(() => {
    result();
  }, [passengerData]);

  useEffect(() => {
    if (
      reducerState?.getBusResult?.busResult?.data?.data?.BusSearchResult?.Error
        ?.ErrorCode !== 0 ||
      reducerState?.getBusResult?.busResult?.data?.data?.BusSearchResult?.Error
        ?.ErrorCode === undefined ||
      sessionStorage.getItem("seatData") === undefined
    ) {
      navigate("/busResult");
    }
  }, []);
  if (
    reducerState?.getBusResult?.busResult?.data?.data?.BusSearchResult?.Error
      ?.ErrorCode !== 0 ||
    reducerState?.getBusResult?.busResult?.data?.data?.BusSearchResult?.Error
      ?.ErrorCode === undefined ||
    sessionStorage.getItem("seatData") === undefined
  ) {
    return <></>;
  }

  return (
    <div className="bg-indigo-50 w-full !h-[100vh] ">
      <div className="container relative z-10 p-4 bg-indigo-50 ">
        <div className="mt-4 row ">
          <div className="col-lg-8 bg-white p-2 shadow-sm rounded-md ">
            <div className="row  ">
              <div className="col-lg-12  ">
                <div className="singlebusMain bg-white ">
                  <h3 className="busNameHeading  !from-indigo-400 !to-indigo-50 !bg-gradient-to-r text-xl text-gray-700 ">
                    {selectedBus?.TravelName?.toUpperCase()}
                  </h3>
                  <div className="text-gray-700 singleBusResultBox border-0">
                    <div className="sbsb1">
                      <p className="!text-2xl">{selectedBus?.BusType}</p>
                    </div>
                    <div className="sbsb2 !text-2xl">
                      <div>
                        <h3 className=" !text-xl text-gray-700">
                          {busFullData?.Origin}
                        </h3>
                        <h4 className=" !text-xl text-gray-700">
                          {dayjs(selectedBus?.DepartureTime).format(
                            "DD MMM, YY"
                          )}
                        </h4>
                        <p className=" !text-xl text-gray-700">
                          {dayjs(selectedBus?.DepartureTime).format("h:mm A")}
                        </p>
                      </div>
                      <div>
                        <p className=" !text-xl text-gray-700">{duration}</p>

                        <div className="busDistance ">
                          <span className="busCircle1 !bg-primary-400 "></span>
                          <span className="busLine2 !bg-primary-400"></span>
                          <span className="busCircle2 !bg-primary-400"></span>
                        </div>

                        <p className=" !text-xl text-gray-700">
                          {selectedBus?.AvailableSeats} Seats Left
                        </p>
                      </div>
                      <div>
                        <h3 className=" !text-xl text-gray-700">
                          {busFullData?.Destination}
                        </h3>
                        <h4 className=" !text-xl text-gray-700">
                          {dayjs(selectedBus?.ArrivalTime).format("DD MMM, YY")}
                        </h4>
                        <p className=" !text-xl text-gray-700">
                          {dayjs(selectedBus?.ArrivalTime).format("h:mm A")}
                        </p>
                      </div>
                      <div>
                        <h3 className=" !text-xl text-gray-700">
                          ₹ {grandTotal.toFixed(0)}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-12">
                <div className="pickDrop  !text-xl text-gray-700  !from-indigo-100 !to-indigo-50 !bg-gradient-to-r ">
                  <div>
                    <h3 className="!text-xl text-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="me-2"
                        width="32"
                        height="32"
                        // fill="#141211"
                        fill="currentColor"
                        data-name="Layer 1"
                        id="fi_16443511"
                        viewBox="0 0 128 128"
                      >
                        <title></title>
                        <path d="M111,40a9,9,0,1,0-9,9A9.01353,9.01353,0,0,0,111,40Z"></path>
                        <path d="M85.99988,57.62231v1.02563c1.3197.61261,2.65515,1.18036,4,1.71759V57.62231c0-3.09851,3.12207-5.61945,6.96-5.61945h.048a13.037,13.037,0,0,1-4.51056-3.15778C88.67419,50.34863,85.99988,53.71375,85.99988,57.62231Z"></path>
                        <path d="M117.99988,65.98431v-8.362c0-3.90857-2.67426-7.27362-6.49744-8.77722a13.03641,13.03641,0,0,1-4.51056,3.15778h.048c3.83789,0,6.96,2.52094,6.96,5.61945v8.19843C115.33209,65.90778,116.66565,65.96686,117.99988,65.98431Z"></path>
                        <path d="M22.00165,44.50006A8.49951,8.49951,0,1,0,30.50116,36,8.50962,8.50962,0,0,0,22.00165,44.50006Z"></path>
                        <path d="M126,94H112v6h14a2.00587,2.00587,0,0,1,2,2V92.03A2.00627,2.00627,0,0,1,126,94Z"></path>
                        <path d="M126,0H67.84A11.87514,11.87514,0,0,0,56,11.89V16H47.41A3.1747,3.1747,0,0,0,44,18.95V22H42a2.00587,2.00587,0,0,0-2,2V36a1.99947,1.99947,0,0,0,2,2h8a1.99947,1.99947,0,0,0,2-2V24a2.00587,2.00587,0,0,0-2-2H48V20h8v84.11A11.8816,11.8816,0,0,0,67.84,116H74v5.33A6.67479,6.67479,0,0,0,80.67,128h4.66A6.67479,6.67479,0,0,0,92,121.33V116h34a2.00591,2.00591,0,0,0,2-2V102a2.00591,2.00591,0,0,1-2,2H110a2.00591,2.00591,0,0,1-2-2V92a2.00587,2.00587,0,0,1,2-2h16a2.00626,2.00626,0,0,1,2,1.97c-.01-8.54-.01-17.09-.01-20.47a2.00453,2.00453,0,0,0-2.17-1.82,80.1682,80.1682,0,0,1-45.78-9.62A7.833,7.833,0,0,1,76,53.18V26.91A2.87286,2.87286,0,0,1,78.84,24H126a2.00591,2.00591,0,0,0,2-2V2A2.00587,2.00587,0,0,0,126,0ZM88,121.33A2.67593,2.67593,0,0,1,85.33,124H80.67A2.67593,2.67593,0,0,1,78,121.33V116H88Zm-2.31677-20.93372A.91775.91775,0,0,1,85.02783,102H74.0379A2.00511,2.00511,0,0,1,72,100.02936v-8.055a2.045,2.045,0,0,1,3.34021-1.51581ZM121,14H109a2,2,0,0,1,0-4h12a2,2,0,0,1,0,4Z"></path>
                        <path d="M.36609,125.20258a2.81227,2.81227,0,0,0,2.21179,1.38824l9.04639,1.27783a8.25566,8.25566,0,0,0,6.23987-1.27051,5.42279,5.42279,0,0,0,2.07025-3.96637,4.72629,4.72629,0,0,0-3.11218-4.87067l7.0741-11.003-.17017-2.335-1.88074-2.41187-.45508,1.24774L11.97778,117.8988a1.99982,1.99982,0,0,0,1.3476,3.05328c.70117.119,2.71063.27924,2.62286,1.3559-.1416,1.73694-2.37158,1.83618-3.70874,1.60846l-7.84918-1.10889c.02637-.05908,11.57257-24.76,11.57257-24.76a1.998,1.998,0,0,0,.11328-1.39606l-1.36786-4.65094H19.1109l8.40216,10.77454c.0293.03662.05859.07275.08984.10742a.25846.25846,0,0,1,.02734.08936l1.63953,22.48657a2.60517,2.60517,0,0,0,2.7323,2.54059c.291,0,9.38226-.75732,9.38226-.75732,2.98419-.31152,4.87085-2.94586,4.58765-6.40582-.19727-2.40924-2.621-3.50006-4.43726-3.98151l.5058-18.51385c.001-.03711.001-.07422,0-.11084a4.58383,4.58383,0,0,0-.2392-1.27643c-.054-.16449-.87207-2.52258-1.82886-5.27777A3.423,3.423,0,0,0,41.355,90.53534c1.38647-1.98566.16174-4.061-1.08875-5.70673-1.4386-1.89233-3.39258-4.48132-3.1825-8.54846l.05865-4.66772,6.1969-3.74005a5.27387,5.27387,0,0,0-.14355-9.24078,5.39091,5.39091,0,0,0-5.28778.13818l-.70612.43469a12.91872,12.91872,0,0,0-.91461-3.63458A12.39629,12.39629,0,0,1,32.468,56.82983a8.95268,8.95268,0,0,1,.81128,3.853l-.01184.94373-6.646,4.09149a2.00018,2.00018,0,0,0,2.0976,3.40631l11.262-6.93372a1.35709,1.35709,0,0,1,1.33-.03125,1.26345,1.26345,0,0,1,.68939,1.11377,1.28357,1.28357,0,0,1-.68939,1.15192L24.96826,74.288a1.99889,1.99889,0,0,0-.67871,2.74561,2.05365,2.05365,0,0,0,2.745.67926L33.11176,74.045l-.02484,1.97968c-.3053,5.55817,2.38123,9.10162,3.99493,11.22437.17578.23193.38379.50537.56049.75146H11.39185a36.12229,36.12229,0,0,0,2.8595-4.00006H16.002a2,2,0,0,0,1.99988-2V72.00037a2,2,0,0,0,0-4.00006v-.00049L18,68H14a2,2,0,0,1,0-4h4l.00183.00018v-9.067c.154-.18726.3114-.37189.48145-.54529A8.01954,8.01954,0,0,1,21.0271,52.631,12.50483,12.50483,0,0,1,18.929,49.20648c-.32581.16016-.64215.34106-.95355.53174a1.99369,1.99369,0,0,0-1.97345-1.7381H8.769a4.52421,4.52421,0,0,0-4.58276,4.35211L2.00958,79.395c-.00488.05371-.00684.10693-.00684.16064a4.52046,4.52046,0,0,0,4.58276,4.44489H9.47046c-.21869.28278-.43677.55646-.64777.814a8.73613,8.73613,0,0,0-1.59857,2.42291A3.5921,3.5921,0,0,0,7.647,90.53082,3.40166,3.40166,0,0,0,10.428,92.00055h.166l1.4306,5.02643S.92957,120.75281.82117,120.9931C.25867,122.23676-.44147,123.78461.36609,125.20258Zm35.48541-33.202c1.10638,3.18536,2.08514,6.00592,2.15216,6.20667.01953.06055.03125.10889.03613.12744l-.54974,20.10907a2.00352,2.00352,0,0,0,1.77832,2.04248,6.2587,6.2587,0,0,1,2.38416.60028c.79932.47.22174,2.08221-.63733,2.17224L33.166,123.895l-1.54187-21.116a4.19107,4.19107,0,0,0-1.00775-2.5293l-6.4328-8.24915Z"></path>
                      </svg>
                      Boarding
                    </h3>
                    <p className="!text-xl text-gray-700">
                      {selectedBus?.BoardingPointsDetails &&
                        selectedBus.BoardingPointsDetails.length > 0 &&
                        selectedBus.BoardingPointsDetails[boardingPoint - 1]
                          ?.CityPointLocation}
                    </p>
                    <span className="!text-xl text-gray-700">
                      {dayjs(selectedBus?.DepartureTime).format("h:mm A")}
                    </span>
                  </div>

                  <div>
                    <h3 className="!text-xl text-gray-700">
                      <svg
                        id="fi_16443483"
                        className="me-2"
                        width="32"
                        height="32"
                        viewBox="0 0 128 128"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#141211"
                        data-name="Layer 1"
                      >
                        <circle cx="102" cy="39.999" r="9"></circle>
                        <path d="m85.99988 57.61957v2.033c1.3197.61255 2.65509 1.18054 4 1.71777v-3.75077c0-3.09863 3.12207-5.62018 6.96-5.62018h.048a13.0373 13.0373 0 0 1 -4.51056-3.1579c-3.82313 1.50366-6.49744 4.86896-6.49744 8.77808z"></path>
                        <path d="m117.99988 66.98853v-9.369c0-3.90912-2.67426-7.27441-6.49744-8.77808a13.03673 13.03673 0 0 1 -4.51056 3.1579h.048c3.83789 0 6.96 2.52155 6.96 5.62018v9.20567c1.33227.08697 2.66577.14599 4 .16333z"></path>
                        <path d="m29.72791 121.68414c1.13043-.03021 2.41974.09082 3.06049-1.04932a1.91836 1.91836 0 0 0 -.03809-1.94678l-8.5354-13.92261-.428-2.22235-.579.43884-.43976 7.03143 4.92621 8.035c-2.03546.42871-4.70721 1.49615-4.7644 4.58673a4.71065 4.71065 0 0 0 1.6106 3.74658 7.6936 7.6936 0 0 0 4.9949 1.61834c.40247 0 11.75079-.8822 11.75079-.8822a2.81755 2.81755 0 0 0 2.304-1.26794c.837-1.32812.21246-2.78607-.28955-3.95758-.09326-.21863-9.8999-22.27118-9.8999-22.27118l.36011-4.63745-4.26276 3.23077-.12384 1.59479a1.91274 1.91274 0 0 0 .16064.929s9.94238 22.35229 10.043 22.58813l-9.311.71515a4.57391 4.57391 0 0 1 -3.05414-.57.86788.86788 0 0 1 -.28326-.76575c.01228-.64831 2.00337-.92229 2.79836-1.0216z"></path>
                        <ellipse
                          cx="15.992"
                          cy="47.822"
                          rx="8.001"
                          ry="7.822"
                        ></ellipse>
                        <path d="m20.00433 64.2265-2.00033 17.5985a1.96522 1.96522 0 0 0 1.76733 2.15875 2.00706 2.00706 0 0 0 2.2088-1.72723l2.00031-17.59845a1.96517 1.96517 0 0 0 -1.76733-2.15875 1.9895 1.9895 0 0 0 -2.20878 1.72718z"></path>
                        <path d="m42.18 60.42a4.05444 4.05444 0 0 0 -4.16-3.8h-7.93a11.25177 11.25177 0 0 0 -4.07-2.37 11.95983 11.95983 0 0 1 -3.41 3.35 7.25746 7.25746 0 0 1 5.06 2.15c.11.11.22.24.32.36v6.2h3.93a2 2 0 0 1 0 4h-4a1.95532 1.95532 0 1 0 .07 3.91v9.78a1.97648 1.97648 0 0 0 2 1.95v1.5a4.16341 4.16341 0 0 1 -.73 1.05s-12.8 9.71-12.86 9.77a3.89493 3.89493 0 0 0 -1.07 2.43l-1.45 23.28-9.06-.58c-.22-.02-.65-.07-.81-.96-.15-.85.94-.95 1.54-1.07a19.58009 19.58009 0 0 1 2.65-.33 1.9728 1.9728 0 0 0 1.87-2l-.51-20.47v-.03c.23-.55 2.91-6.25 4.56-9.73a1.95661 1.95661 0 0 0 .18-.82v-22.45a8.22373 8.22373 0 0 1 2.33-5.95c.03-.02.06-.05.09-.07-.25.01-.48.03-.73.03a11.95294 11.95294 0 0 1 -3.85-.63 12.32688 12.32688 0 0 0 -1.84 6.64v22c-4.37 9.24-4.47 9.56-4.51 9.69a4.06225 4.06225 0 0 0 -.23 1.21.17038.17038 0 0 0 0 .1l.47 18.77a13.91854 13.91854 0 0 0 -3.42.83 4.60232 4.60232 0 0 0 -2.54 4.96 4.82127 4.82127 0 0 0 4.41 4.18s10.35.69 10.63.69a2.68 2.68 0 0 0 1.74-.57 2.61086 2.61086 0 0 0 .94-1.92l1.53-24.52s12.67-9.62 12.74-9.69a6.2584 6.2584 0 0 0 1.93-3.72v-1.62h5.85a4.04362 4.04362 0 0 0 4.16-3.9c0-.05-.01-.1-.01-.16z"></path>
                        <path d="m125.82 70.68c-2.7.24-5.4.33-8.09.3-1.18-.02-2.36-.06-3.53-.13 0 .01.01.01.01.02a79.81714 79.81714 0 0 1 -24.64-5.37c-.84-.33-1.67-.68-2.51-1.03-2.38-1.02-4.73-2.15-7.02-3.41a7.833 7.833 0 0 1 -4.04-6.88v-27.27a2.87286 2.87286 0 0 1 2.84-2.91h47.16a2.00591 2.00591 0 0 0 2-2v-20a2.00587 2.00587 0 0 0 -2-2h-58.16a11.87514 11.87514 0 0 0 -11.84 11.89v4.11h-8.59a3.1747 3.1747 0 0 0 -3.41 2.95v3.05h-2a1.99947 1.99947 0 0 0 -2 2v12a2.00591 2.00591 0 0 0 2 2h8a2.00591 2.00591 0 0 0 2-2v-12a1.99947 1.99947 0 0 0 -2-2h-2v-2h8v84.11a11.87517 11.87517 0 0 0 11.84 11.89h5.16v5.33a6.67479 6.67479 0 0 0 6.67 6.67h4.66a6.67479 6.67479 0 0 0 6.67-6.67v-5.33h35a1.99947 1.99947 0 0 0 2-2c0-1.1.09-40.4-.01-41.5a2.00565 2.00565 0 0 0 -2.17-1.82zm-17.82-60.68h12a2 2 0 0 1 0 4h-12a2 2 0 0 1 0-4zm-33.96 92a2.0025 2.0025 0 0 1 -2.04-1.97v-8.06a2.0417 2.0417 0 0 1 3.34-1.51l10.34 9.94a.91338.91338 0 0 1 -.65 1.6zm12.96 19.33a2.67593 2.67593 0 0 1 -2.67 2.67h-4.66a2.67593 2.67593 0 0 1 -2.67-2.67v-5.33h10zm39-21.33a2 2 0 0 1 0 4h-15a3.00883 3.00883 0 0 1 -3-3v-8a3.00879 3.00879 0 0 1 3-3h15a2 2 0 0 1 0 4h-14v6z"></path>
                      </svg>
                      Dropping
                    </h3>
                    <p className="!text-xl text-gray-700">
                      {selectedBus?.DroppingPointsDetails &&
                        selectedBus?.DroppingPointsDetails.length > 0 &&
                        selectedBus?.DroppingPointsDetails[droppingPoint - 1]
                          ?.CityPointLocation}
                    </p>
                    <span className="!text-xl text-gray-600">
                      {dayjs(selectedBus?.ArrivalTime).format("h:mm A")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 col-lg-12">
                <div className="text-gray-900 passengerDetailsMainOuter ">
                  <h3 className=" !from-indigo-400 !to-indigo-50 !bg-gradient-to-r text-2xl text-gray-700 ">
                    Guest Details
                  </h3>
                  <div className="passengerDetailsMain">
                    {passengerCount > 0 &&
                      Array.from({ length: passengerCount }, (_, index) => (
                        <div>
                          <p className="!text-xl text-gray-700">
                            Passenger {index + 1}
                          </p>

                          <div className="bookFlightPassInner">
                            <div className="mb-3 row g-3">
                              <div className="col-lg-4">
                                {/* <div class="form-floating"> */}
                                <label
                                  for="floatingInput"
                                  className="!text-gray-500 !text-lg"
                                >
                                  First Name
                                </label>
                                <input
                                  name="FirstName"
                                  // placeholder="Enter your name"
                                  className="form-control !text-lg"
                                  value={passengerData?.FirstName}
                                  onChange={(e) =>
                                    handleServiceChange(e, index)
                                  }
                                />
                                {sub &&
                                  !validateName(
                                    passengerData[index].FirstName
                                  ) && (
                                    <span className="error10 !text-red-400">
                                      Enter your Name
                                    </span>
                                  )}
                              </div>
                              <div className="col-lg-3">
                                {/* <div class="form-floating"> */}
                                <label
                                  for="floatingInput "
                                  className="!text-gray-500 !text-lg"
                                >
                                  Last Name
                                </label>
                                <input
                                  name="LastName"
                                  className="form-control !text-gray-500 !text-lg"
                                  // placeholder="Enter your last name"
                                  value={passengerData.LastName}
                                  onChange={(e) =>
                                    handleServiceChange(e, index)
                                  }
                                />

                                {sub &&
                                  !validateName(
                                    passengerData[index].LastName
                                  ) && (
                                    <span className="error10">
                                      Enter Last Name
                                    </span>
                                  )}

                                {/* <label for="floatingInput">Last Name</label> */}
                                {/* </div> */}
                              </div>

                              <div className="col-lg-5">
                                {/* <div class="form-floating"> */}
                                <label
                                  for="floatingInput "
                                  className="!text-gray-500 !text-lg"
                                >
                                  Phone Number
                                </label>
                                <input
                                  name="Phoneno"
                                  type="text"
                                  className="form-control !text-gray-500 !text-lg"
                                  // placeholder="Enter your Phoneno"
                                  value={passengerData?.Phoneno}
                                  onChange={(e) =>
                                    handleServiceChange(e, index)
                                  }
                                />
                                {sub &&
                                  !validatePhoneNumber(
                                    passengerData[index].Phoneno
                                  ) && (
                                    <span className="error10">
                                      Enter a valid phone number
                                    </span>
                                  )}
                              </div>

                              <div className="col-lg-3">
                                <label
                                  htmlFor="exampleInputEmail1"
                                  className="!text-gray-500 !text-lg"
                                >
                                  Gender
                                </label>
                                <Select
                                  value={passengerData?.Gender}
                                  className="d-block "
                                  name="Gender"
                                  onChange={(value) =>
                                    handleServiceChange(
                                      { target: { name: "Gender", value } },
                                      index
                                    )
                                  }
                                >
                                  <Option value="">Other</Option>
                                  <Option value="1">Male</Option>
                                  <Option value="2">Female</Option>
                                </Select>
                                {sub &&
                                  !validateGender(
                                    passengerData[index].Gender
                                  ) && (
                                    <span className="error10">
                                      Enter a valid Gender
                                    </span>
                                  )}
                              </div>

                              <div className="col-lg-3">
                                {/* <div class="form-floating"> */}
                                <label
                                  for="floatingInput"
                                  className="!text-gray-500 !text-lg"
                                >
                                  Age
                                </label>
                                <input
                                  name="Age"
                                  // placeholder="Enter your name"
                                  className="form-control !text-gray-500 !text-lg"
                                  value={passengerData?.Age}
                                  onChange={(e) =>
                                    handleServiceChange(e, index)
                                  }
                                />
                                {sub &&
                                  !validateAge(passengerData[index].Age) && (
                                    <span className="error10">
                                      Enter your Age
                                    </span>
                                  )}
                              </div>

                              <div className="col-lg-6">
                                {/* <div class="form-floating"> */}
                                <label
                                  for="floatingInput "
                                  className="!text-gray-500 !text-lg"
                                >
                                  Enter Email
                                </label>
                                <input
                                  name="Email"
                                  type="email"
                                  className="form-control !text-gray-500 !text-lg"
                                  // placeholder="Enter your email"
                                  value={passengerData[index]?.Email}
                                  onChange={(e) =>
                                    handleServiceChange(e, index)
                                  }
                                />

                                {sub &&
                                  !validateEmail(
                                    passengerData[index].Email
                                  ) && (
                                    <span className="error10">
                                      Enter a valid email
                                    </span>
                                  )}

                                {/* <label for="floatingInput">Enter Email</label> */}
                                {/* </div> */}
                              </div>

                              <div className="col-lg-12 col-md-12">
                                {/* <div class="form-floating"> */}
                                <label
                                  for="floatingInput "
                                  className="!text-gray-500 !text-lg"
                                >
                                  Enter Address
                                </label>
                                <input
                                  name="Address"
                                  type="text"
                                  className="form-control !text-gray-500 !text-lg"
                                  // placeholder="Enter your address"
                                  value={passengerData?.Address}
                                  onChange={(e) =>
                                    handleServiceChange(e, index)
                                  }
                                />
                                {sub && passengerData[index].Address === "" && (
                                  <span className="error10">Enter Address</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 ">
            <BusSummary onSeatBlock={handleSeatBlock} isDisabled={showBtn} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusPassengerDetail;
