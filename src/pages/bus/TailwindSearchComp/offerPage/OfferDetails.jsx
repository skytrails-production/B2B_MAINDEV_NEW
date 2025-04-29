import { ConstructionOutlined } from "@mui/icons-material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiURL } from "../../../Constants/constant";
import playstoreSVG from "../../../images/download/playstoreSVG.svg";
import appstoreSVG from "../../../images/download/appstoreSVG.svg";
import dayjs from "dayjs";

const OfferDetails = () => {
  const [copied, setCopied] = useState(false);
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  // Retrieve query parameters
  const couponType = searchParams.get("couponType");
  const couponId = searchParams.get("couponId");

  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${apiURL.baseURL}/skyTrails/api/combine/combieOffers/${couponId}`
      );
      const data = response.data.result;
      setData(data);
      console.log(data, "data");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return; // Early exit if email is empty

    setIsLoading(true);
    setIsDisabled(true);

    try {
      const response = await axios.post(
        `${apiURL.baseURL}/skyTrails/api/user/promotionalEmails/createEntry`,
        { email }
      );

      if (response.status === 200) {
        setEmail(""); // Clear the email field on success
        setIsLoading(false);

        // Temporarily show "Submitted" on the button
        setIsDisabled(true);
        setTimeout(() => {
          setIsDisabled(false);
        }, 2000); // Enable the button again after 2 seconds
      }
    } catch (error) {
      console.error("Error subscribing:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = () => {
    const textToCopy = document.getElementById("easepayid").innerText;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };

  return (
    <div>
      <div className="custom-container my-5">
        <div className="row">
          <div className="col-lg-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                {data?.title}
              </h1>

              <div className="flex flex-row justify-between my-4">
                <div className="flex flex-col items-center justify-center border-2 border-gray-400 rounded-md p-3">
                  <p>BOOKING PERIOD</p>
                  <span>
                    {dayjs(data?.expirationDate).format("DD MMM, YY")}
                  </span>
                </div>

                {data?.couponCode && (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <p>Promo Code</p>
                      <div className="flex flex-row gap-2 items-center">
                        <p
                          className="border-2 border-dashed py-2 px-2 border-gray-500 rounded-md font-semibold"
                          id="easepayid"
                        >
                          {data?.couponCode}
                        </p>
                        <button
                          // style={{ backgroundColor: copied ? "#94211a" : "" }}
                          className="px-4 py-2 text-white bg-primary-6000 hover:bg-primary-700 font-semibold rounded-md text-lg"
                          onClick={copyText}
                        >
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {data?.discountPercentage && (
                <div className="p-4 my-4 border rounded-lg shadow-md bg-white">
                  <h2 className="text-lg font-semibold mb-2">
                    What Do You Get?
                  </h2>
                  <p className="text-gray-600 mb-4">
                    <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    Customers under this offer will enjoy:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border border-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-2 px-4 font-semibold text-gray-700 border-r border-gray-200">
                            Service
                          </th>
                          <th className="py-2 px-4 font-semibold text-gray-700 border-r border-gray-200">
                            Minimum Booking Amount
                          </th>
                          <th className="py-2 px-4 font-semibold text-gray-700 border-r border-gray-200">
                            Maximum Booking Amount
                          </th>
                          <th className="py-2 px-4 font-semibold text-gray-700">
                            Limit Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.discountPercentage.map((discount, index) => (
                          <tr key={discount._id}>
                            <td className="py-2 px-4 border-t border-gray-200">
                              {discount.name}
                            </td>
                            <td className="py-2 px-4 border-t border-gray-200">
                              INR {discount.value.min[0]}
                            </td>
                            <td className="py-2 px-4 border-t border-gray-200">
                              INR {discount.value.max[0]}
                            </td>
                            <td className="py-2 px-4 border-t border-gray-200">
                              INR {discount.limitAmount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* How do you get it? Section */}
              <div className="p-4 my-4 border rounded-lg shadow-md bg-white">
                <h2 className="text-lg bg-gray-300 p-3 rounded-md font-semibold mb-2">
                  How do you get it?
                </h2>
                <ul className="list-disc list-inside p-0 text-gray-700 space-y-2">
                  {data?.howDoUGetit &&
                    data.howDoUGetit.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                </ul>
              </div>

              <div className="p-4 my-4 border rounded-lg shadow-md bg-white">
                <h2 className="text-lg bg-gray-300 p-3 rounded-md font-semibold mb-2">
                  Terms & Conditions
                </h2>
                <ul className="list-disc list-inside p-0 text-gray-700 space-y-2">
                  {data?.termsAndCond &&
                    data.termsAndCond.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div>
              <img className="rounded-lg" src={data?.image} alt="" />
            </div>
            <div className="border mt-3 rounded-lg py-3 bg-gray-400 text-center bg-white shadow-md ">
              <h2 className="text-lg font-semibold mb-4">
                Download The Skytrails Mobile App
              </h2>

              <div className="flex justify-center space-x-2 w-full">
                <a
                  href="https://play.google.com/store/apps/details?id=com.skytrails&hl=en_IN"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={playstoreSVG}
                    alt="Google Play"
                    className="w-full object-contain"
                  />
                </a>
                <a
                  href="https://apps.apple.com/in/app/the-skytrails/id6475768819"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={appstoreSVG}
                    alt="App Store"
                    className="w-full object-contain"
                  />
                </a>
              </div>
            </div>

            <div className="bg-white shadow-md p-3 rounded-md mt-4">
              <form onSubmit={handleSubmit}>
                <label className="block font-semibold">
                  Subscribe for More Offers
                </label>
                <div className="flex flex-row justify-center">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isDisabled}
                    className="block w-full border border-neutral-200 bg-gray-200  rounded-md me-3 text-sm font-normal h-11 px-4 py-3 mt-1.5"
                  />
                  <button
                    type="submit"
                    className="h-11 px-4 py-2 mt-1.5 rounded-md bg-primary-6000 text-white font-semibold"
                    disabled={isDisabled}
                  >
                    {isLoading
                      ? "Loading..."
                      : isDisabled
                      ? "Submitted"
                      : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferDetails;
