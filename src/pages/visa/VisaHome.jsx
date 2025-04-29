import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { apiURL } from "../../Constants/constant";

const VisaHome = () => {
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const fetchToken = async () => {
    try {
      const response = await axios.post(
        `${apiURL.baseURL}/api/skyTrails/getToken`
      );
      console.log(response);
      // console.lo
      setToken(response.data.response.access_token);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  const handleNavigate = () => {
    if (token) {
      sessionStorage.setItem("visaToken", token);
      navigate("/visa/userdetails");
    } else {
      fetchToken();
    }
  };

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <motion.div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        ></div>
      </motion.div>
      <div className="mx-auto max-w-3xl h-screen py-28 sm:py-36 lg:py-24">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="hidden sm:mb-8 sm:flex sm:justify-center"
        >
          <div className="relative rounded-full px-3 py-1 text-sm/6 text-indigo-600 ring-1 ring-indigo-900/10 hover:ring-gray-indigo/20">
            Welcome to the Skytrails Intelligence Visa{" "}
            <a href="#" className="font-semibold text-indigo-600">
              {/* <span className="absolute inset-0" aria-hidden="true"></span>Read
              more <span aria-hidden="true">&rarr;</span> */}
            </a>
          </div>
        </motion.div>
        <div className="text-center">
          <motion.h1
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl"
          >
            Get your visa quicky powered by AI
          </motion.h1>
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8"
          >
            SkyTrails simplifies the visa application process with cutting-edge
            artificial intelligence, ensuring speed, accuracy, and hassle-free
            approvals
          </motion.p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <button
              onClick={handleNavigate}
              className="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started <i class="fa-solid fa-arrow-right-long"></i>
            </button>
          </motion.div>
        </div>
      </div>
      <div
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        ></div>
      </div>
    </div>
  );
};

export default VisaHome;
// console.log(ddfd)
