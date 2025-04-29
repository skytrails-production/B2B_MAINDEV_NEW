import React, { useState, useEffect } from "react";
import "./Returnflightloader.css";


const quotes = [
  {
    text: "Set your dreams upwards at unbeatable prices - only with Skytrails flights!",
    // img: img1,
  },
  {
    text: "Explore the world affordably - Skytrails' flights, where price meets adventure!",
    // img: img2,
  },
  {
    text: "Unlock the sky's treasures with Skytrails exclusive flight offers.",
    // img: img1,
  },
  {
    text: "Elevate your journey without elevating the cost - Skytrails' flight deals.",
    // img: img2
  },
  {
    text: "From takeoff to touchdown, Skytrails offers the best prices for your flight dreams.",
    // img: img2
  },
  {
    text: "Hold on!!We are fetching best result for you",
  },
];

const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };

function Returnflightloader() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const result = getRandomQuote();
          setData(result);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      };
  
      fetchData();
  
      const intervalId = setInterval(() => {
        setLoading(true);
        fetchData();
        setCurrentImgIndex((prevIndex) => (prevIndex + 1) % quotes.length);
      }, 4000);
  
      return () => clearInterval(intervalId);
    }, []);


  return (
    <>
        <div className="flightLoadingreturn" >
      <div className="imageflightcontentreturn" >
        

        <div className="flightimgcontainerreturn">
          <img src="https://raw.githubusercontent.com/The-SkyTrails/Images/main/aeroplaneLoad.gif" alt="flight" className="flightloadingimgreturn" />
        </div>
      </div>

      <div className="funnyfactreturn">
        {loading && <h3>Please Wait...</h3>}
        {data && (
          <div>
            <h5>{data.text}</h5>
          </div>
        )}
      </div>
    </div>
    </>
  )
}

export default Returnflightloader;