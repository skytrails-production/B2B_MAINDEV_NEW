// import React, { Fragment, useEffect, useState } from "react";
// import { Popover, Transition } from "@headlessui/react";
// import NcInputNumber from "../../heroSection/NcInputNumber";
// import ClearDataButton from "../../heroSection/ClearDataButton";


// const GuestFlightSmall = ({
//   fieldClassName = "[ nc-hero-field-padding ]",
//   className = "[ nc-flex-1 ]",
//   buttonSubmitHref = "/listing-stay-map",
//   hasButtonSubmit = true,
//   onGuestDataChange,
// }) => {
//   const [guestAdultsInputValue, setGuestAdultsInputValue] = useState(1);
//   const [guestChildrenInputValue, setGuestChildrenInputValue] = useState(0);
//   const [guestInfantsInputValue, setGuestInfantsInputValue] = useState(0);

//   const handleChangeData = (value, type) => {
//     if (type === "guestAdults") {
//       setGuestAdultsInputValue(value);
//     }
//     if (type === "guestChildren") {
//       setGuestChildrenInputValue(value);
//     }
//     if (type === "guestInfants") {
//       setGuestInfantsInputValue(value);
//     }
//   };

//   const totalGuests =
//     guestChildrenInputValue + guestAdultsInputValue + guestInfantsInputValue;


//     useEffect(() => {
//         const payload = {
//             adults: guestAdultsInputValue,
//            children: guestChildrenInputValue,
//            infant: guestInfantsInputValue,
//         };
//         onGuestDataChange(payload);
//     }, [guestAdultsInputValue, guestChildrenInputValue, guestInfantsInputValue]);


//   return (
//     <Popover className={`flex relative ${className}`}>
//       {({ open }) => (
//         <>
//           <div
//             className={`flex-1 z-10 flex items-center focus:outline-none ${
//               open ? "nc-hero-field-focused" : ""
//             }`}
//           >
//             <Popover.Button
//               className={`relative z-10 flex-1 flex text-left items-center ${fieldClassName} space-x-3 focus:outline-none`}
//             >
//               <div className="text-neutral-300 dark:text-neutral-400">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6 lg:h-7 lg:w-7"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M16 11V9a4 4 0 00-8 0v2M5 21h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z"
//                   />
//                 </svg>
//               </div>
//               <div className="flex-grow">
//                 <span className="block xl:text-lg font-semibold">
//                   {totalGuests || ""} Guests
//                 </span>
//                 <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
//                   {totalGuests ? "Guests" : "Add guests"}
//                 </span>
//               </div>

//               {!!totalGuests && open && (
//                 <ClearDataButton
//                   onClick={() => {
//                     setGuestAdultsInputValue(0);
//                     setGuestChildrenInputValue(0);
//                     setGuestInfantsInputValue(0);
//                   }}
//                 />
//               )}
//             </Popover.Button>
//           </div>

//           {open && (
//             <div className="h-8 absolute self-center top-1/2 -translate-y-1/2 z-0 -left-0.5 right-0.5 bg-white dark:bg-neutral-800"></div>
//           )}
//           <Transition
//             as={Fragment}
//             enter="transition ease-out duration-200"
//             enterFrom="opacity-0 translate-y-1"
//             enterTo="opacity-100 translate-y-0"
//             leave="transition ease-in duration-150"
//             leaveFrom="opacity-100 translate-y-0"
//             leaveTo="opacity-0 translate-y-1"
//           >
//             <Popover.Panel className="absolute right-0 z-10 w-full sm:min-w-[340px] max-w-sm bg-white dark:bg-neutral-800 top-full mt-3 py-5 sm:py-6 px-4 sm:px-8 rounded-3xl shadow-xl">
//               <NcInputNumber
//                 className="w-full"
//                 defaultValue={guestAdultsInputValue}
//                 onChange={(value) => handleChangeData(value, "guestAdults")}
//                 max={10}
//                 min={1}
//                 label="Adults"
//                 desc="Ages 13 or above"
//               />
//               <NcInputNumber
//                 className="w-full mt-6"
//                 defaultValue={guestChildrenInputValue}
//                 onChange={(value) => handleChangeData(value, "guestChildren")}
//                 max={4}
//                 label="Children"
//                 desc="Ages 2–12"
//               />
//               <NcInputNumber
//                 className="w-full mt-6"
//                 defaultValue={guestInfantsInputValue}
//                 onChange={(value) => handleChangeData(value, "guestInfants")}
//                 max={4}
//                 label="Infants"
//                 desc="Ages 0–2"
//               />
//             </Popover.Panel>
//           </Transition>
//         </>
//       )}
//     </Popover>
//   );
// };

// export default GuestFlightSmall;















import React, { useEffect, useState } from "react";
import NcInputNumber from "../../heroSection/NcInputNumber";
import { TrashIcon } from "@heroicons/react/24/outline";


const GuestsInputMobile = ({ className = "", onGuestDataChange, }) => {

  const [guestAdultsInputValue, setGuestAdultsInputValue] = useState(1);
  const [guestChildrenInputValue, setGuestChildrenInputValue] = useState(0);
  const [guestInfantsInputValue, setGuestInfantsInputValue] = useState(0);

  const handleChangeData = (value, type) => {
    if (type === "adults") {
      setGuestAdultsInputValue(value);
    }
    if (type === "children") {
      setGuestChildrenInputValue(value);
    }
    if (type === "infant") {
      setGuestInfantsInputValue(value);
    }
  };

  const totalGuests =
    guestChildrenInputValue + guestAdultsInputValue + guestInfantsInputValue;


    useEffect(() => {
        const payload = {
            adults: guestAdultsInputValue,
           children: guestChildrenInputValue,
           infant: guestInfantsInputValue,
        };
        onGuestDataChange(payload);
    }, [guestAdultsInputValue, guestChildrenInputValue, guestInfantsInputValue]);


    return (
        <div className={`flex flex-col relative p-5 ${className}`}>
            <span className="mb-5 block font-semibold text-xl sm:text-2xl">
                {`Who's coming?`}
            </span>

                <div  className="mb-6">
                    <NcInputNumber
                        className="w-full"
                        defaultValue={guestAdultsInputValue}
                        onChange={(value) => handleChangeData(value, "adults")}
                        max={10}
                        min={1}
                        label="Adults"
                    />
                    <NcInputNumber
                        className="w-full mt-4"
                        defaultValue={guestChildrenInputValue}
                        onChange={(value) => handleChangeData(value, "children")}
                        max={4}
                        label="Children"
                        desc="Ages 2–12"
                    />

                    <NcInputNumber
                        className="w-full mt-4"
                        defaultValue={guestInfantsInputValue}
                        onChange={(value) => handleChangeData(value, "infant")}
                        max={4}
                        label="Children"
                        desc="Ages 2–12"
                    />

                </div>


{/* 
            <button
                type="button"
                className="w-full mt-4 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                onClick={handleAddRoom}
            >
                Add Room
            </button> */}

        </div>
    );
};

export default GuestsInputMobile;

