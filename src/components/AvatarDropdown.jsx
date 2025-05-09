import { Popover, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Avatar from "./Avatar";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Authentic from "../pages/Auth/Authentic";
import { ChevronDown } from "lucide-react";

export default function AvatarDropdown({ className = "" }) {
  const reducerState = useSelector((state) => state);
  console.log("reducerState", reducerState);
  const userName =
    reducerState?.logIn?.loginData?.first_name +
    " " +
    reducerState?.logIn?.loginData?.last_name;
  const profile = reducerState?.logIn?.loginData?.data?.result?.profilePic;
  const email = reducerState?.logIn?.loginData?.email;
  const countryCode =
    reducerState?.logIn?.loginData?.data?.result?.phone?.country_code;
  const phone =
    reducerState?.logIn?.loginData?.data?.result?.phone?.mobile_number;

  // confirmation modal open close
  const [showConfirmationModalVisible, setShowConfirmationModalVisible] =
    useState(false);

  const showConfirmationModal = () => {
    setShowConfirmationModalVisible(true);
  };

  const closeConfirmationModal = () => {
    setShowConfirmationModalVisible(false);
  };

  // logout modal open close
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const showLogoutModal = () => {
    setLogoutModalVisible(true);
  };

  const closeLogoutModal = () => {
    setLogoutModalVisible(false);
  };
  // logout modal open close
  return (
    <>
      <Popover className={`AvatarDropdown relative flex ${className}`}>
        {({ open, close }) => (
          <>
            {userName ? (
              <Popover.Button
                className={`self-center cursor-pointer flex p-2 gap-2 h-10 px-4  sm:h-12 rounded-md text-gray-800  bg-transparent border-1 border-gray-400  focus:outline-none  items-center justify-center`}
              >
                <h4 className="font-semibold hidden md:flex text-sm xl:text-base mb-0">
                  {/* Hey, {userName.split(" ")?.[0]} */}
                  {userName}
                </h4>
                {/* <Avatar sizeClass="w-8 h-8 sm:w-9 sm:h-9" photo={profile} /> */}
                <ChevronDown />
              </Popover.Button>
            ) : (
              <div
                onClick={showConfirmationModal}
                className={`self-center flex p-2 cursor-pointer gap-3 h-10  sm:h-12 rounded-full text-slate-300  bg-gray-700 hover:bg-gray-800  focus:outline-none  items-center justify-center`}
              >
                <h4 className="font-semibold hidden md:flex text-base mb-0">
                  user
                </h4>
                <Avatar sizeClass="w-8 h-8 sm:w-9 sm:h-9" />
              </div>
            )}
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-50 w-screen max-w-[300px]  top-full -right-10 sm:right-0 sm:px-0">
                <div className="overflow-hidden rounded-3xl shadow-md xl:shadow-lg lg:shadow-lg md:shadow-lg  sm:shadow-lg  ring-opacity-5">
                  <div className="relative grid grid-cols-1 gap-6 bg-white xl:py-7 lg:py-7 md:py-7 py-7 px-6">
                    <div className="flex items-center space-x-3">
                      <Avatar sizeClass="w-12 h-12" photo={profile} />

                      <div className="flex-grow">
                        <h4 className="font-semibold font-sans text-base mb-0">
                          {userName}
                        </h4>
                        <p className="text-xs font-sans mt-0.5">
                          {email || `${countryCode} - ${phone}`}
                        </p>
                      </div>
                    </div>

                    <div className="w-full border-b border-neutral-200" />

                    {/* Option 1 */}
                    <a
                      href="https://crm.theskytrails.com/"
                      className="flex text-gray-900 no-underline items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100  focus:outline-none"
                      onClick={() => close()}
                    >
                      <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 ">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.1601 10.87C12.0601 10.86 11.9401 10.86 11.8301 10.87C9.45006 10.79 7.56006 8.84 7.56006 6.44C7.56006 3.99 9.54006 2 12.0001 2C14.4501 2 16.4401 3.99 16.4401 6.44C16.4301 8.84 14.5401 10.79 12.1601 10.87Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M7.15997 14.56C4.73997 16.18 4.73997 18.82 7.15997 20.43C9.90997 22.27 14.42 22.27 17.17 20.43C19.59 18.81 19.59 16.17 17.17 14.56C14.43 12.73 9.91997 12.73 7.15997 14.56Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium ">My Account</p>
                      </div>
                    </a>

                    {/* Option 2 */}
                    <Link
                      to="/bookinghistory"
                      href="#"
                      className="flex text-gray-900 no-underline items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 focus:outline-none"
                      onClick={() => close()}
                    >
                      <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 ">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M8 12.2H15"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8 16.2H12.38"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10 6H14C16 6 16 5 16 4C16 2 15 2 14 2H10C9 2 8 2 8 4C8 6 9 6 10 6Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M16 4.02002C19.33 4.20002 21 5.43002 21 10V16C21 20 20 22 15 22H9C4 22 3 20 3 16V10C3 5.44002 4.67 4.20002 8 4.02002"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium ">My bookings</p>
                      </div>
                    </Link>

                    <div className="w-full border-b border-neutral-200" />

                    {/* Option 3 */}
                    {/* <Link
                      to="/contactus"
                      className="flex text-gray-900 no-underline items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 focus:outline-none"
                      onClick={() => close()}
                    >
                      <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 ">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.97 22C17.4928 22 21.97 17.5228 21.97 12C21.97 6.47715 17.4928 2 11.97 2C6.44715 2 1.97 6.47715 1.97 12C1.97 17.5228 6.44715 22 11.97 22Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5 9.51472 14.4853 7.5 12 7.5C9.51472 7.5 7.5 9.51472 7.5 12C7.5 14.4853 9.51472 16.5 12 16.5Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M4.89999 4.92993L8.43999 8.45993"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M4.89999 19.07L8.43999 15.54"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19.05 19.07L15.51 15.54"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19.05 4.92993L15.51 8.45993"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium ">Help</p>
                      </div>
                    </Link> */}

                    {/* Option 4 */}
                    <div
                      className="flex text-gray-900 cursor-pointer no-underline items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 focus:outline-none"
                      // onClick={() => close()}
                      onClick={showLogoutModal}
                    >
                      <div className="flex items-center justify-center flex-shrink-0 text-neutral-500">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.90002 7.55999C9.21002 3.95999 11.06 2.48999 15.11 2.48999H15.24C19.71 2.48999 21.5 4.27999 21.5 8.74999V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24002 20.08 8.91002 16.54"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M15 12H3.62"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5.85 8.6499L2.5 11.9999L5.85 15.3499"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium ">Log out</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>

      <Authentic
        isOpen={showConfirmationModalVisible}
        onClose={closeConfirmationModal}
        isLogoutOpen={logoutModalVisible}
        onLogoutClose={closeLogoutModal}
      />
    </>
  );
}
