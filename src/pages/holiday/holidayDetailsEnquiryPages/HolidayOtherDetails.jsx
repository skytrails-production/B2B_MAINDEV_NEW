import React from "react";

const HolidayOtherDetails = ({ data }) => {
  return (
    <div className=" mx-auto mt-4">
      <h2 className="mb-3 text-lg font-semibold text-gray-900 ">
        What’s inside the package?
      </h2>
      <div className="bg-white border rounded-lg p-3 md:p-3 lg:p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inclusions */}
          <div>
            <h3 className="font-bold text-lg mb-4">Inclusions</h3>
            <ul className="space-y-3 ps-0 border-r border-gray-300">
              {data?.insclusion_note.map((item, index) => (
                <li key={index} className="flex  items-center gap-2">
                  <i
                    class="fa fa-check-circle text-green-500 w-5 h-5"
                    aria-hidden="true"
                  ></i>
                  <span className="text-gray-700 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Exclusions */}
          <div>
            <h3 className="font-bold text-lg mb-4">Exclusions</h3>
            <ul className="space-y-3 ps-0">
              {data?.exclusion_note.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <i
                    class="fa fa-times-circle text-red-500 w-5 h-5"
                    aria-hidden="true"
                  ></i>
                  <span className="text-gray-700 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <h2 className="mb-3 mt-4 text-lg font-semibold text-gray-900 ">
        Term & Condition
      </h2>

      <div className="bg-white border rounded-lg p-3 md:p-3 lg:p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* term and condition */}
          <div>
            <h3 className="font-bold text-lg mb-4">Terms & Conditions</h3>
            <ul className="space-y-1 ps-3 text-gray-700 text-sm list-disc border-r border-gray-300">
              {data?.term_Conditions.map((item, index) => (
                <li key={index} className="mb-2">
                  {/* <span class="bg-gray-700 rounded-full w-2 h-2"></span> */}
                  {item}
                </li>
              ))}
            </ul>

            {/* <ul class="space-y-1 ps-3 text-gray-700 text-sm list-disc ">
              {packageData?.packageHighLight?.map((item, index) => (
                <li key={index} className="mb-2">
                  {item}
                </li>
              ))}
            </ul> */}
          </div>
          {/* cancellation policy */}
          <div>
            <h3 className="font-bold text-lg mb-4">Cancellation Policies</h3>
            <ul className="space-y-1 ps-3 text-gray-700 text-sm list-disc">
              {data?.cancellation_Policy.map((item, index) => (
                <li key={index} className="mb-2">
                  {" "}
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidayOtherDetails;
