import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Accordion } from "flowbite-react";
import { useSelector } from "react-redux";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { Minus, Plus } from "lucide-react";
import { passportReqired } from "../../utility/flightUtility/BookwarperUtility";
// import { validatePhoneNumber } from "../../utility/validationFunctions";

const PaxComponent = forwardRef((props, ref) => {
  const reducerState = useSelector((state) => state);
  // const countryList = reducerState?.airportList?.countryList;
  const isPassportRequired = passportReqired();
  const adultCount = Number(sessionStorage?.getItem("adults"));
  const childCount = Number(sessionStorage?.getItem("childs"));
  const infantCount = Number(sessionStorage?.getItem("infants"));

  const [passengerData, setPassengerData] = useState({
    adults: Array.from({ length: adultCount }, (_, index) => ({
      title: "",
      firstName: "",
      lastName: "",
      gender: "",
      email: "",
      addressLine1: "delhi",
      city: "Delhi",
      TicketNumber: "Hold",
      amount: null,
      FirstName: "",
      LastName: "",
      PaxType: 1,
      DateOfBirth: "",
      Gender: 1,
      passportNo: "",
      passportExpiry: "",
      AddressLine1: "test",
      AddressLine2: "test2",
      Fare: "",
      City: "gurgaon",
      CountryCode: "IN",
      CellCountryCode: "+91-",
      ContactNo: "",
      Nationality: "",
      Email: "",
      IsLeadPax: index === 0, // First adult is the lead passenger; rest are false.
      FFAirlineCode: null,
      FFNumber: "",
      GSTCompanyAddress: "",
      GSTCompanyContactNumber: "",
      GSTCompanyName: "",
      GSTNumber: "",
      GSTCompanyEmail: "",
    })),
    childs: Array(childCount).fill({
      title: "",
      firstName: "",
      lastName: "",
      gender: "",
      email: "",
      addressLine1: "delhi",
      city: "Delhi",
      TicketNumber: "Hold",
      amount: null,
      Title: "",
      FirstName: "",
      LastName: "",
      PaxType: 2,
      DateOfBirth: "",
      Gender: 1,
      passportNo: "",
      passportExpiry: "",
      Fare: "",
      IsLeadPax: false,
      FFAirlineCode: null,
      FFNumber: "",
    }),
    infants: Array(infantCount).fill({
      title: "",
      firstName: "",
      lastName: "",
      gender: "",
      email: "",
      addressLine1: "delhi",
      city: "Delhi",
      TicketNumber: "Hold",
      amount: null,
      Title: "",
      FirstName: "",
      LastName: "",
      PaxType: 3,
      DateOfBirth: "",
      Gender: 1,
      passportNo: "",
      passportExpiry: "",
      Fare: "",
      IsLeadPax: false,
      FFAirlineCode: null,
      FFNumber: "",
    }),
  });

  // console.log(passengerData, "passengerData");

  const [errorIndex, setErrorIndex] = useState(null);
  const [isAccordionVisible, setIsAccordionVisible] = useState(true);
  const errorRef = useRef(null);

  // Handles updates for individual passengers in each type
  const handleChange = (type, index, field, value) => {
    const updatedPassengers = [...passengerData[type]];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value,
    };

    setPassengerData((prev) => ({
      ...prev,
      [type]: updatedPassengers,
    }));
  };

  // console.log(passengerData, "passenger data in the pax component");
  const handleDateChange = (type, index, field, value, unit) => {
    const updatedPassengers = [...passengerData[type]];
    const currentDate = updatedPassengers[index][field] || "";
    const dateParts = currentDate.split("-").map((part) => part || "");

    if (unit === "year") dateParts[0] = value;
    if (unit === "month") dateParts[1] = value.padStart(2, "0");
    if (unit === "day") dateParts[2] = value.padStart(2, "0");

    const newDate = dateParts.join("-");
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: newDate,
    };

    setPassengerData((prev) => ({
      ...prev,
      [type]: updatedPassengers,
    }));
  };

  const validateForm = async () => {
    let firstError = null;

    if (
      !passengerData.adults?.[0]?.email ||
      !/\S+@\S+\.\S+/.test(passengerData.adults?.[0]?.email)
    ) {
      firstError = { type: "email", index: 0 };
    }

    // Validate adults
    const adultErrorIndex = passengerData.adults.findIndex(
      (adult) =>
        !adult.title ||
        !adult.firstName?.trim() ||
        !adult.lastName?.trim() ||
        !adult.gender ||
        !isValidDate(adult.DateOfBirth) ||
        (isPassportRequired &&
          (!adult.passportNo?.trim() || !isValidDate(adult.passportExpiry)))
    );

    if (adultErrorIndex !== -1) {
      firstError = { type: "adults", index: adultErrorIndex };
    }

    // Validate children
    if (!firstError) {
      const childErrorIndex = passengerData.childs.findIndex(
        (child) =>
          !child.firstName?.trim() ||
          !child.lastName?.trim() ||
          !child.gender ||
          !isValidDate(child.DateOfBirth) ||
          (isPassportRequired &&
            (!child.passportNo?.trim() || !isValidDate(child.passportExpiry)))
      );
      if (childErrorIndex !== -1) {
        firstError = { type: "childs", index: childErrorIndex };
      }
    }

    // Validate infants
    if (!firstError) {
      const infantErrorIndex = passengerData.infants.findIndex(
        (infant) =>
          !infant.firstName?.trim() ||
          !infant.lastName?.trim() ||
          !infant.gender ||
          !isValidDate(infant.DateOfBirth) ||
          (passengerData.passportRequired &&
            (!infant.passportNo?.trim() || !isValidDate(infant.passportExpiry)))
      );
      if (infantErrorIndex !== -1) {
        firstError = { type: "infants", index: infantErrorIndex };
      }
    }

    // Validate email
    if (!firstError) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (
        !passengerData.adults?.[0]?.email ||
        !emailRegex.test(passengerData.adults?.[0]?.email)
      ) {
        firstError = { type: "email", index: 0 };
      }
    }
    if (!firstError) {
      const contactNo = passengerData.adults?.[0]?.ContactNo;
      const phoneRegex = /^[1-9][0-9]{9}$/;
      if (!contactNo || !phoneRegex.test(contactNo)) {
        firstError = { type: "contact", index: 0 };
      }
    }
    if (firstError) {
      setErrorIndex(firstError);

      // Scroll to error
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (errorRef.current) {
        errorRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return false;
    }

    return true;
  };

  // Helper function to validate dates
  const isValidDate = (dateString) => {
    if (!dateString) return false;
    const parts = dateString.split("-");
    if (parts.length !== 3) return false;
    const [year, month, day] = parts;
    const date = new Date(`${year}-${month}-${day}`);
    return !isNaN(date.getTime());
  };

  // Expose validation function to parent
  useImperativeHandle(ref, () => ({
    validateForm,
    getPassengerData: () => passengerData,
  }));

  // Add email error section

  // console.log(errorIndex, "error index");

  const currentYear = new Date().getFullYear();
  const minYearForAdult = currentYear - 18;
  const minYearForChild = currentYear - 2;
  const minYearForPassport = currentYear + 10;
  //   const minYearForInfant = currentYear - 18;

  const days = Array.from({ length: 31 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const Month = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const yearAdult = Array.from({ length: 90 }, (_, i) =>
    String(minYearForAdult - i).padStart(2, "0")
  );
  const yearChild = Array.from({ length: 12 }, (_, i) =>
    String(minYearForChild - i).padStart(2, "0")
  );
  const yearInfant = Array.from({ length: 3 }, (_, i) =>
    String(currentYear - i).padStart(2, "0")
  );
  const yearPassport = Array.from({ length: 10 }, (_, i) =>
    String(currentYear + i).padStart(2, "0")
  );

  const renderAccordion = (type, data) => {
    if (!data || !data.length) return null;

    return (
      <div className="p-3 bg-white">
        <h2 className="text-lg font-semibold mb-2 capitalize text-gray-700">
          {type}
        </h2>
        {data.map((passenger, index) => (
          <div
            key={index}
            ref={
              errorIndex?.type === type && errorIndex?.index === index
                ? errorRef
                : null
            }
            className="mb-0"
          >
            {/* Error message for the first invalid passenger */}
            {errorIndex?.type === type && errorIndex?.index === index && (
              <div
                className="bg-red-400 text-white text-center py-1 mb-4 animate-shake" // Tailwind class
                // OR for custom CSS:
                // className="bg-red-400 text-white text-center py-1 mb-4 shake-animation"
              >
                Please fill in the details for {type.slice(0, -1)} {index + 1}.
              </div>
            )}
            <Accordion alwaysOpen={false} className="divide-none mb-3">
              <Accordion.Panel className="mb-2">
                <Accordion.Title className=" focus:ring-0 bg-transparent  flex items-center justify-between w-full px-2 py-0 font-medium rtl:text-right active:text-gray-700 text-gray-700 focus:text-gray-700  border-gray-500 hover:bg-gray-100 gap-3 rounded-lg border-0">
                  <div>
                    <span className="text-sm font-semibold text-gray-700">
                      {passenger.firstName &&
                      passenger.lastName &&
                      passenger.gender
                        ? `${passenger.firstName} ${passenger.lastName}`
                        : `
                              ${
                                type.slice(0, -1).charAt(0).toUpperCase() +
                                type.slice(0, -1).slice(1)
                              } ${index + 1}`}
                    </span>
                  </div>
                </Accordion.Title>
                <Accordion.Content className="p-3">
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4">
                    <div className="">
                      <label
                        for="email"
                        class="block mb-2 text-sm font-medium text-gray-700 "
                      >
                        Title
                      </label>

                      <Listbox
                        value={passenger.title}
                        onChange={(value) =>
                          handleChange(type, index, "title", value)
                        }
                      >
                        <div className="relative">
                          <Listbox.Button className=" rounded-md border-1 border-gray-500 text-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500  w-full min-w-16 p-2.5 flex justify-between">
                            <span className="col-start-1 row-start-1 flex items-center gap-3 ">
                              <span className="block truncate">
                                {passenger.title || "Title"}
                              </span>
                            </span>
                            <ChevronUpDownIcon
                              aria-hidden="true"
                              className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                            />
                          </Listbox.Button>

                          <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                            <Listbox.Option
                              value="Mr"
                              className="group relative cursor-default select-none py-2 pl-3 pr-2 text-gray-900 data-[focus]:bg-primary-6000 data-[focus]:text-white"
                            >
                              <div className="flex items-center">
                                <span className="block truncate font-normal group-data-[selected]:font-semibold">
                                  Mr
                                </span>
                              </div>
                            </Listbox.Option>
                            <Listbox.Option
                              value="Miss"
                              className="group relative cursor-default select-none py-2 pl-3 pr-2 text-gray-900 data-[focus]:bg-primary-6000 data-[focus]:text-white"
                            >
                              <div className="flex items-center">
                                <span className="block truncate font-normal group-data-[selected]:font-semibold">
                                  Miss
                                </span>
                              </div>
                            </Listbox.Option>
                            <Listbox.Option
                              value="Mrs"
                              className="group relative cursor-default select-none py-2 pl-3 pr-2 text-gray-900 data-[focus]:bg-primary-6000 data-[focus]:text-white"
                            >
                              <div className="flex items-center">
                                <span className="block truncate font-normal group-data-[selected]:font-semibold">
                                  Mrs
                                </span>
                              </div>
                            </Listbox.Option>
                          </Listbox.Options>
                        </div>
                      </Listbox>
                    </div>

                    <div className="col-span-3">
                      <label
                        for="email"
                        class="block mb-2 text-sm font-medium text-gray-700 "
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        placeholder="First Name"
                        id="fname"
                        value={passenger.firstName}
                        onChange={(e) =>
                          handleChange(type, index, "firstName", e.target.value)
                        }
                        className=" rounded-md border-1 bg-transparent border-gray-500 text-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      />
                    </div>

                    <div className="col-span-3">
                      <label
                        for="email"
                        class="block mb-2 text-sm font-medium text-gray-700 "
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        placeholder="Last Name"
                        id="lname"
                        value={passenger.lastName}
                        onChange={(e) =>
                          handleChange(type, index, "lastName", e.target.value)
                        }
                        className=" rounded-md border-1 bg-transparent border-gray-500 text-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className=" ">
                      <label
                        for="email"
                        class="block mb-2 text-sm font-medium text-gray-700 "
                      >
                        Date of Birth
                      </label>
                      <div className="grid grid-cols-3">
                        <Listbox
                          value={passenger.DateOfBirth.split("-")[2] || ""}
                          onChange={(value) =>
                            handleDateChange(
                              type,
                              index,
                              "DateOfBirth",
                              value,
                              "day"
                            )
                          }
                        >
                          <div className="relative">
                            <Listbox.Button className="bg-transparent rounded-l-md border-1 active:border-gray-900 border-gray-500 text-gray-700 text-sm   w-full  p-1.5 py-2.5 flex justify-between">
                              <span className="col-start-1 row-start-1 flex items-center gap-3 ">
                                <span className="block truncate">
                                  {passenger.DateOfBirth.split("-")[2] || "Day"}
                                </span>
                              </span>
                              <ChevronUpDownIcon
                                aria-hidden="true"
                                className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                              />
                            </Listbox.Button>

                            <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                              {days.map((day) => (
                                <Listbox.Option
                                  key={day}
                                  value={day}
                                  className="group relative cursor-default select-none py-2 pl-3 pr-2 text-gray-900 data-[focus]:bg-primary-6000 data-[focus]:text-white"
                                >
                                  <div className="flex items-center">
                                    <span className="block truncate font-normal group-data-[selected]:font-semibold">
                                      {day}
                                    </span>
                                  </div>
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </div>
                        </Listbox>

                        <Listbox
                          value={passenger.DateOfBirth.split("-")[1] || ""}
                          onChange={(value) =>
                            handleDateChange(
                              type,
                              index,
                              "DateOfBirth",
                              value,
                              "month"
                            )
                          }
                        >
                          <div className="relative">
                            <Listbox.Button className="bg-transparent border-1 border-gray-500 text-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500  w-full  p-1.5 py-2.5 flex justify-between">
                              <span className="col-start-1 row-start-1 flex items-center gap-3 ">
                                <span className="block truncate">
                                  {passenger.DateOfBirth.split("-")[1] ||
                                    "Month"}
                                </span>
                              </span>
                              <ChevronUpDownIcon
                                aria-hidden="true"
                                className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                              />
                            </Listbox.Button>

                            <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                              {Month.map((day) => (
                                <Listbox.Option
                                  key={day}
                                  value={day}
                                  className="group relative cursor-default select-none py-2 pl-3 pr-2 text-gray-900 data-[focus]:bg-primary-6000 data-[focus]:text-white"
                                >
                                  <div className="flex items-center">
                                    <span className="block truncate font-normal group-data-[selected]:font-semibold">
                                      {day}
                                    </span>
                                  </div>
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </div>
                        </Listbox>

                        <Listbox
                          value={passenger.DateOfBirth.split("-")[0] || ""}
                          onChange={(value) =>
                            handleDateChange(
                              type,
                              index,
                              "DateOfBirth",
                              value,
                              "year"
                            )
                          }
                        >
                          <div className="relative">
                            <Listbox.Button className="bg-transparent rounded-r-md border-1 border-gray-500 text-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500  w-full  p-1.5 py-2.5 flex flex-nowrap justify-between">
                              <span className="col-start-1 row-start-1 flex items-center gap-3 ">
                                <span className="block truncate">
                                  {passenger.DateOfBirth.split("-")[0] ||
                                    "Year"}
                                </span>
                              </span>
                              <ChevronUpDownIcon
                                aria-hidden="true"
                                className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                              />
                            </Listbox.Button>

                            <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                              {type === "adults" &&
                                yearAdult.map((day) => (
                                  <Listbox.Option
                                    key={day}
                                    value={day}
                                    className="group relative cursor-default select-none py-2 pl-3 pr-2 text-gray-900 data-[focus]:bg-primary-6000 data-[focus]:text-white"
                                  >
                                    <div className="flex items-center">
                                      <span className="block  font-normal group-data-[selected]:font-semibold">
                                        {day}
                                      </span>
                                    </div>
                                  </Listbox.Option>
                                ))}
                              {type === "childs" &&
                                yearChild.map((day) => (
                                  <Listbox.Option
                                    key={day}
                                    value={day}
                                    className="group relative cursor-default select-none py-2 pl-3 pr-2 text-gray-900 data-[focus]:bg-secondary-6000 data-[focus]:text-white"
                                  >
                                    <div className="flex items-center">
                                      <span className=" block font-normal group-data-[selected]:font-semibold">
                                        {day}
                                      </span>
                                    </div>
                                  </Listbox.Option>
                                ))}
                              {type === "infants" &&
                                yearInfant.map((day) => (
                                  <Listbox.Option
                                    key={day}
                                    value={day}
                                    className="group relative cursor-default select-none py-2 pl-3 pr-2 text-gray-900 data-[focus]:bg-secondary-6000 data-[focus]:text-white"
                                  >
                                    <div className="flex items-center">
                                      <span className="ml-3 block  font-normal group-data-[selected]:font-semibold">
                                        {day}
                                      </span>
                                    </div>
                                  </Listbox.Option>
                                ))}
                            </Listbox.Options>
                          </div>
                        </Listbox>
                      </div>
                    </div>

                    <div className="  ">
                      <label
                        for="email"
                        class="block mb-2 text-sm font-medium text-gray-700 "
                      >
                        Gender
                      </label>

                      <div className="flex">
                        <button
                          type="button"
                          className={`p-2 flex-1 px-4 rounded-l-md  border-b-4 ${
                            passenger.gender === 1
                              ? "border-primary-6000 bg-transparent border-l border-r border-t text-gray-700"
                              : "border-1 border-gray-500 text-gray-700"
                          }`}
                          onClick={() => handleChange(type, index, "gender", 1)}
                        >
                          Male
                        </button>
                        <div className="border-r-2 h-full"></div>
                        <button
                          type="button"
                          className={`p-2 flex-1 px-4 rounded-r-md border-b-4 ${
                            passenger.gender === 2
                              ? "border-primary-6000 bg-transparent border-l border-r border-t text-gray-700"
                              : "border-1 border-gray-500 text-gray-700"
                          }`}
                          onClick={() => handleChange(type, index, "gender", 2)}
                        >
                          Female
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {isPassportRequired && (
                      <>
                        <div>
                          <label
                            for="email"
                            class="block mb-2 text-sm font-medium text-gray-700 "
                          >
                            Passport Number
                          </label>
                          <input
                            type="text"
                            placeholder="Passport Number"
                            id="passportNumber"
                            value={passenger.passportNumber}
                            onChange={(e) =>
                              handleChange(
                                type,
                                index,
                                "passportNo",
                                e.target.value
                              )
                            }
                            className="bg-transparent rounded-md border-1 border-gray-500 text-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          />
                        </div>

                        <div>
                          <label
                            for="email"
                            class="block mb-2 text-sm font-medium text-gray-700 "
                          >
                            Passport Expiry
                          </label>
                          <div className="grid grid-cols-3">
                            <Listbox
                              value={
                                passenger.passportExpiry.split("-")[2] || ""
                              }
                              onChange={(value) =>
                                handleDateChange(
                                  type,
                                  index,
                                  "passportExpiry",
                                  value,
                                  "day"
                                )
                              }
                            >
                              <div className="relative">
                                <Listbox.Button className="bg-transparent rounded-l-md border-1 active:border-gray-900 border-gray-500 text-gray-700 text-sm   w-full  p-1.5 py-2.5 flex justify-between">
                                  <span className="col-start-1 row-start-1 flex items-center gap-3 ">
                                    <span className="block truncate">
                                      {passenger.passportExpiry.split("-")[2] ||
                                        "Day"}
                                    </span>
                                  </span>
                                  <ChevronUpDownIcon
                                    aria-hidden="true"
                                    className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                  />
                                </Listbox.Button>

                                <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                  {days.map((day) => (
                                    <Listbox.Option
                                      key={day}
                                      value={day}
                                      className="group relative cursor-default select-none py-2 pl-3 pr-2 text-gray-900 data-[focus]:bg-primary-6000 data-[focus]:text-white"
                                    >
                                      <div className="flex items-center">
                                        <span className="block truncate font-normal group-data-[selected]:font-semibold">
                                          {day}
                                        </span>
                                      </div>
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </div>
                            </Listbox>

                            <Listbox
                              value={
                                passenger.passportExpiry.split("-")[1] || ""
                              }
                              onChange={(value) =>
                                handleDateChange(
                                  type,
                                  index,
                                  "passportExpiry",
                                  value,
                                  "month"
                                )
                              }
                            >
                              <div className="relative">
                                <Listbox.Button className="bg-transparent border-1 border-gray-500 text-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500  w-full  p-1.5 py-2.5 flex justify-between">
                                  <span className="col-start-1 row-start-1 flex items-center gap-3 ">
                                    <span className="block truncate">
                                      {passenger.passportExpiry.split("-")[1] ||
                                        "Month"}
                                    </span>
                                  </span>
                                  <ChevronUpDownIcon
                                    aria-hidden="true"
                                    className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                  />
                                </Listbox.Button>

                                <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                  {Month.map((day) => (
                                    <Listbox.Option
                                      key={day}
                                      value={day}
                                      className="group relative cursor-default select-none py-2 pl-3 pr-2 text-gray-900 data-[focus]:bg-primary-6000 data-[focus]:text-white"
                                    >
                                      <div className="flex items-center">
                                        <span className=" block truncate font-normal group-data-[selected]:font-semibold">
                                          {day}
                                        </span>
                                      </div>
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </div>
                            </Listbox>
                            <Listbox
                              value={
                                passenger.passportExpiry.split("-")[0] || ""
                              }
                              onChange={(value) =>
                                handleDateChange(
                                  type,
                                  index,
                                  "passportExpiry",
                                  value,
                                  "year"
                                )
                              }
                            >
                              <div className="relative">
                                <Listbox.Button className="bg-transparent rounded-r-md border-1 border-gray-500 text-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500  w-full  p-1.5 py-2.5 flex flex-nowrap justify-between">
                                  <span className="col-start-1 row-start-1 flex items-center gap-3 ">
                                    <span className="block truncate">
                                      {passenger.passportExpiry.split("-")[0] ||
                                        "Year"}
                                    </span>
                                  </span>
                                  <ChevronUpDownIcon
                                    aria-hidden="true"
                                    className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                  />
                                </Listbox.Button>

                                <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                  {yearPassport.map((day) => (
                                    <Listbox.Option
                                      key={day}
                                      value={day}
                                      className="group w-full relative cursor-default select-none py-2 pl-3 pr-2 text-gray-900 data-[focus]:bg-primary-6000 data-[focus]:text-white"
                                    >
                                      <div className="flex items-center">
                                        <span className=" block font-normal group-data-[selected]:font-semibold">
                                          {day}
                                        </span>
                                      </div>
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </div>
                            </Listbox>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Accordion.Content>
              </Accordion.Panel>
            </Accordion>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="">
      <div className="shadow-sm  border-gray-200 mt-4">
        <p
          className={`   text-gray-100 p-2 px-4 bg-primary-6000 text-lg font-bold cursor-pointer flex justify-between items-center transition-all duration-200 ease-in-out `}
          onClick={() => setIsAccordionVisible((prev) => !prev)}
        >
          Passenger Details
          <span className="text-xl">
            {isAccordionVisible ? <Minus size={16} /> : <Plus size={16} />}
          </span>
        </p>
        <div
          className={`transition-all duration-300 ease-in-out  ${
            isAccordionVisible ? "max-h-full" : "max-h-0  overflow-hidden"
          }`}
        >
          {renderAccordion("adults", passengerData.adults)}
          {renderAccordion("childs", passengerData.childs)}
          {renderAccordion("infants", passengerData.infants)}
        </div>
      </div>

      {errorIndex?.type === "email" && (
        <div
          ref={errorRef}
          className="bg-red-400 text-white text-center py-1 mb-4 animate-shake mt-3"
        >
          Please enter a valid email address
        </div>
      )}
      {errorIndex?.type === "contact" && (
        <div
          ref={errorRef}
          className="bg-red-400 text-white text-sm text-center py-1 mb-4 animate-shake mt-3"
        >
          Please enter a valid Mobile Number
        </div>
      )}
      <div className="mt-4 border  p-3 bg-white ">
        <p className="text-base font-medium mb-3 text-gray-700">
          Your Booking details will be sent to
        </p>
        <div className="flex gap-3 flex-col sm:flex-row items-center">
          <input
            type="email"
            id="eemmaaiill"
            placeholder="Enter Email"
            value={passengerData.adults?.[0]?.email}
            onChange={(e) => handleChange("adults", 0, "email", e.target.value)}
            className="bg-transparent rounded-md border-1 border-gray-500 text-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full md:w-1/2 p-2.5"
          />
          <input
            type="tel"
            id="tel"
            placeholder="Enter Phone No"
            value={passengerData.adults?.[0]?.ContactNo}
            onChange={(e) =>
              handleChange("adults", 0, "ContactNo", e.target.value)
            }
            className="bg-transparent rounded-md border-1 border-gray-500 text-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full md:w-1/2 p-2.5"
          />
        </div>
      </div>
    </div>
  );
});

export default PaxComponent;
