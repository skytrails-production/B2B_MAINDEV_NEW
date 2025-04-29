import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { hotelBlockRoomAction } from "../../../../../Redux/Hotel/hotel";
import { BedDouble, Utensils } from "lucide-react";
import { useEffect } from "react";

const RoomComponent = forwardRef(({ onChosenRoomsUpdate }, ref) => {
  const dispatch = useDispatch();
  const reducerState = useSelector((state) => state);
  const ResultIndex = sessionStorage.getItem("ResultIndex");
  const HotelCode = sessionStorage.getItem("HotelCode");
  const hotelInfo = reducerState?.hotelSearchResult?.hotelInfo?.HotelInfoResult;
  const grnHotelData =
    reducerState?.hotelSearchResultGRN?.ticketData?.data?.data;
  const [ChooosenRoom, setChooosenRoom] = useState([]);
  const hotelRoom =
    reducerState?.hotelSearchResult?.hotelRoom?.GetHotelRoomResult;

  const [disabledOption, setDisabledOption] = useState(
    reducerState?.hotelSearchResult?.hotelRoom?.GetHotelRoomResult
      ?.RoomCombinations?.RoomCombination[0]?.RoomIndex
  );

  const roomComponent = (RoomIndex, RoomIndexArr, col, row) => {
    const firstFilteredArray = hotelRoom?.HotelRoomsDetails.map(
      (item, index) => {
        if (disabledOption.includes(item.RoomIndex)) {
          return { ...item, disabled: false };
        } else {
          return { ...item, disabled: true };
        }
      }
    );

    const filteredComponent = firstFilteredArray.filter((item, index) => {
      return item.RoomIndex == RoomIndex;
    });

    const currData = new Date();
    const formattedDate = dayjs(
      filteredComponent[0]?.LastCancellationDate
    ).format("DD MMM, YY");

    let displayText;
    if (currData > dayjs(filteredComponent[0]?.LastCancellationDate)) {
      displayText = "No Cancellation";
    } else {
      displayText = formattedDate;
    }

    return (
      <div
        onClick={(e) => {
          setDisabledOption(RoomIndexArr);
        }}
        className="p-3 mb-3 w-full rounded-md bg-white border shadow-sm cursor-pointer"
      >
        <div className="flex pb-2 flex-row items-center justify-between">
          <div className="px-3 border-r">
            <input
              className={`checkbox_input rounded-full w-6 h-6`}
              type="checkbox"
              value={filteredComponent[0]?.RoomIndex}
              disabled={row >= 0 && col > 0 && filteredComponent[0].disabled}
              checked={!filteredComponent[0].disabled}
              onClick={(e) => {
                setDisabledOption(RoomIndexArr);
              }}
            />
          </div>
          <div className="flex-grow px-3 border-r">
            {/* {item?.rooms?.slice(0, 1)?.map((room, e) => ( */}
            <div>
              <p className="truncate w-11/12">
                {filteredComponent[0]?.RoomTypeName}
              </p>
              <p className="">{filteredComponent[0]?.RatePlanName}</p>
            </div>
            {/* ))} */}
          </div>
          <div className="px-3 flex flex-col items-end">
            <p className="text-md text-purple font-semibold">
              ₹ {filteredComponent[0]?.Price?.PublishedPriceRoundedOff}
            </p>
            <p className="text-sm text-gray-800 font-semibold">Select Room</p>
          </div>
        </div>

        <div className="px-3 flex flex-row justify-start items-center gap-2 pt-2 border-t">
          {filteredComponent[0]?.RatePlanName === "Room Only" && (
            <div className="flex flex-row items-center gap-2 font-semibold text-[14px] text-gray-700">
              <BedDouble className="h-6 w-6 text-purple" />
              Room Only
            </div>
          )}
          {filteredComponent[0]?.RatePlanName === "Breakfast" && (
            <div className="flex flex-row items-center gap-2 font-semibold text-[14px] text-gray-700">
              <Utensils className="h-6 w-6 text-purple" />
              Free Breakfast
            </div>
          )}
          {!displayText === "No Cancellation" && (
            <div className="flex flex-row items-center gap-2 font-semibold text-[14px] text-gray-700">
              Refundable (Cancel Before {displayText})
            </div>
          )}
          {displayText === "No Cancellation" && (
            <div className="flex flex-row items-center gap-2 font-semibold text-[14px] text-gray-700">
              Non Refundable
            </div>
          )}
        </div>
      </div>
    );
  };
  const handleChoosenRoom = () => {
    const choosenRoom = [];
    const option = disabledOption;
    option?.map((matchedItem, index) => {
      hotelRoom?.HotelRoomsDetails?.map((item, index) => {
        if (item.RoomIndex == matchedItem) {
          choosenRoom.push(item);
          // setChooosenRoom(item);
        }
      });
    });
    // console.log(choosenRoom, "choosenRoom");
    setChooosenRoom(choosenRoom);

    if (onChosenRoomsUpdate) {
      // console.log(choosenRoom, "choosen in the room comproom");
      onChosenRoomsUpdate(choosenRoom);
    }

    return choosenRoom;
  };
  // console.log(ChooosenRoom, "handleChoosenRoom");

  // useEffect(() => {
  //   setChooosenRoom(ChooosenRoom);
  // }, [ChooosenRoom]);

  useEffect(() => {
    handleChoosenRoom();
  }, [disabledOption]);

  const handleClick = () => {
    sessionStorage.setItem("HotelIndex", disabledOption);
    const smoking =
      hotelRoom?.HotelRoomsDetails[disabledOption]?.SmokingPreference;
    var SmokingPreference;
    if (smoking == "NoPreference") {
      SmokingPreference = 0;
    }
    if (smoking == "Smoking") {
      SmokingPreference = 1;
    }
    if (smoking == "NonSmoking") {
      SmokingPreference = 2;
    }
    if (smoking == "Either") {
      SmokingPreference = 3;
    }
    const payload = {
      ResultIndex: ResultIndex,
      HotelCode: HotelCode,
      HotelName: hotelInfo?.HotelDetails?.HotelName,
      GuestNationality: "IN",
      NoOfRooms: grnHotelData?.no_of_rooms || grnHotelData?.NoOfRooms,
      ClientReferenceNo: 0,
      IsVoucherBooking: true,

      HotelRoomsDetails: handleChoosenRoom().map((item, index) => {
        return {
          RoomIndex: item?.RoomIndex,
          RoomTypeCode: item?.RoomTypeCode,
          RoomTypeName: item?.RoomTypeName,
          RatePlanCode: item?.RatePlanCode,
          BedTypeCode: null,
          SmokingPreference: SmokingPreference,
          Supplements: null,
          Price: {
            CurrencyCode: item?.Price?.CurrencyCode,
            RoomPrice: item?.Price?.RoomPrice,
            Tax: item?.Price?.Tax,
            ExtraGuestCharge: item.Price?.ExtraGuestCharge,
            ChildCharge: item?.Price?.ChildCharge,
            OtherCharges: item?.Price?.OtherCharges,
            Discount: item?.Price?.Discount,
            PublishedPrice: item?.Price?.PublishedPrice,
            PublishedPriceRoundedOff: item?.Price?.PublishedPriceRoundedOff,
            OfferedPrice: item?.Price?.OfferedPrice,
            OfferedPriceRoundedOff: item?.Price?.OfferedPriceRoundedOff,
            AgentCommission: item?.Price?.AgentCommission,
            AgentMarkUp: item?.Price?.AgentMarkUp,
            ServiceTax: item?.Price?.ServiceTax,
            TCS: item?.Price?.TCS,
            TDS: item?.Price?.TDS,
            ServiceCharge: item?.Price?.ServiceCharge,
            TotalGSTAmount: item?.Price?.TotalGSTAmount,
          },
          GST: {
            CGSTAmount: item?.GST?.CGSTAmount,
            CGSTRate: item?.GST?.CGSTRate,
            CessAmount: item?.GST?.CessAmount,
            CessRate: item?.GST?.CessRate,
            IGSTAmount: item?.GST?.IGSTAmount,
            IGSTRate: item?.GST?.IGSTRate,
            SGSTAmount: item?.GST?.SGSTAmount,
            SGSTRate: item?.GST?.SGSTRate,
            TaxableAmount: item?.GST?.TaxableAmount,
          },
        };
      }),

      EndUserIp: reducerState?.ip?.ipData,
      TokenId: reducerState?.ip?.tokenData,
      TraceId:
        reducerState?.hotelSearchResultGRN?.ticketData?.data?.data?.TraceId,
    };
    dispatch(hotelBlockRoomAction(payload));
  };

  useImperativeHandle(ref, () => ({
    handleClick,
  }));

  return (
    <div className="">
      {hotelRoom?.RoomCombinations?.RoomCombination.map((item1, index1) => {
        return (
          <div className="">
            {item1?.RoomIndex?.map((item2, index2) => {
              if (index2 == 0) {
                return (
                  <div className="roomCompo" key={index2}>
                    {roomComponent(item2, item1?.RoomIndex, index2, index1)}
                  </div>
                );
              }
            })}
          </div>
        );
      })}

      {/* <div className="col-lg-12 bokknnbuuu">
        <button type="submit" className="bookNowButton" onClick={handleClick}>
          Continue
        </button>
      </div> */}
    </div>
  );
});

export default RoomComponent;
