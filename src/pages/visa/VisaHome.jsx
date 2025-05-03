import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { apiURL } from "../../Constants/constant";

const VisaHome = () => {
  const [token, setToken] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const fetchToken = async () => {
    try {
      const response = await axios.post(
        `${apiURL.baseURL}/api/skyTrails/getToken`
      );
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
    <div className="relative isolate px-6 pt-14 lg:px-8 min-h-screen overflow-hidden">
      <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[url('https://ai.theskytrails.com/assets/background1-CtdDjmcE.png')] bg-[length:200%_200%] bg-[left_70%_top_50%] bg-no-repeat flex items-center justify-center isolate px-6 pt-14 lg:px-8"></div>
      {/* Glowing orange orbs */}
      {/* <motion.div
        className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-orange-500/90 filter blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-amber-500/90 filter blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      /> */}

      <div className="mx-auto max-w-6xl h-screen py-28 sm:py-36 lg:py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden sm:mb-8 sm:flex sm:justify-center"
        >
          <div className="relative rounded-full px-4 py-2 text-sm leading-6 text-[#fd5b00] ring-1 ring-orange-200 bg-orange-50 hover:ring-orange-300">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full text-[#fd5b00] animate-pulse"></span>
              Welcome to SkyTrails AI Visa Platform
            </span>
          </div>
        </motion.div>

        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-balance text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl"
          >
            <span className="inline-block">Next-Gen Visa Processing</span>
            <br />
            <span className="inline-block text-[#fd5b00]">Powered by AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 text-lg leading-8 text-gray-600 max-w-3xl mx-auto"
          >
            SkyTrails revolutionizes visa applications with quantum AI
            technology, delivering unprecedented speed, 99.8% accuracy, and
            seamless integration for a borderless future.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 flex items-center justify-center gap-x-6"
          >
            <motion.button
              onClick={handleNavigate}
              className="relative overflow-hidden  px-8 py-3.5 text-sm font-semibold bg-[#fd5b00] text-white rounded-3xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              <span className="relative z-10 flex items-center gap-2">
                Begin AI Processing
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              {isHovered && (
                <motion.span
                  className="absolute inset-0 bg-white/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 flex justify-center"
          >
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 text-orange-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>AI-Powered Verification</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-orange-200"></div>
              <div className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 text-orange-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Blockchain Security</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-orange-200"></div>
              <div className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 text-orange-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>98% Approval Rate</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating AI chip visualization */}
    </div>
  );
};

export default VisaHome;
