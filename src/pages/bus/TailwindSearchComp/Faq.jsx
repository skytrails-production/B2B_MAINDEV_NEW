import React, { useEffect, useState } from "react";
import Heading from "./shared/Heading";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const Faq = () => {
  const [title, setTitle] = useState(""); // State to hold the value
  const [faq, setFaq] = useState([]); // State to hold the value
  const FAQ = useSelector((state) => state.faqRating.faqRating.faqRes);
  const location = useLocation(); // Access the location object

  // Extract the pathname, search, and state
  const { pathname } = location;

  // Effect that updates the title based on the current pathname
  useEffect(() => {
    switch (pathname) {
      case "/":
        setTitle("FLIGHTS");
        break;
      case "/st-hotel":
        setTitle("HOTELS");
        break;
      case "/bus":
        setTitle("BUSES");
        break;
      case "/holidaypackages":
        setTitle("HOLIDAYPACKAGE");
        break;
      default:
        setTitle("FLIGHTS");
        break;
    }
  }, [pathname]); // This only runs when pathname changes

  // Effect that filters the FAQ after the title is updated
  useEffect(() => {
    if (FAQ?.length > 0 && title) {
      let newFAQ = FAQ.filter((item) => {
        return title === item.category;
      });
      setFaq(newFAQ);
    }
  }, [FAQ, title]); // This runs when FAQ or title changes
  // console.log(pathname, "pathname: ");

  return (
    <section class="py-10">
      <div class="custom-container">
        <div class="mb-7">
          <Heading isCenter={true}>Frequently asked questions</Heading>
        </div>
        <div class="accordion-group" data-accordion="default-accordion">
          <div className=" w-full pt-10 ">
            <div className=" w-full bg-white rounded-xl">
              {faq?.map((item, i) => {
                return (
                  <Disclosure
                    as="div"
                    className="group accordion border-b border-solid  border-gray-200 transition-all duration-500 rounded-2xl hover:bg-indigo-50 accordion-active:bg-indigo-50 active p-6"
                    defaultOpen={false}
                  >
                    <DisclosureButton className="group accordion-toggle group inline-flex items-center justify-between leading-8 text-gray-900 w-full transition duration-500 text-left hover:text-indigo-600 accordion-active:font-medium accordion-active:text-indigo-600 ">
                      <span className="accordion-toggle group inline-flex items-left justify-between leading-8 text-gray-900 w-full transition duration-500  hover:text-indigo-600 accordion-active:font-medium accordion-active:text-indigo-600 flex-col  text-start group-hover:text-indigo-600  data-[focus]:bg-blue-950 group-data-[open]:text-indigo-600  ">
                        {item.Q}
                      </span>
                      <ChevronDownIcon className="size-5 text-gray-900 group-data-[hover]:fill-indigo-600 group-data-[open]:rotate-180 hover:text-indigo-600 group-data-[open]:fill-indigo-600  " />
                    </DisclosureButton>
                    <DisclosurePanel className="mt-2 text-sm/5  text-gray-900 leading-6 text-start">
                      {item.A}
                    </DisclosurePanel>
                  </Disclosure>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
