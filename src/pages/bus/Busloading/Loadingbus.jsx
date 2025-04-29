import React, { useEffect, useState } from 'react'
// import busNew from "../../../images/loading/busNew.gif"
import "./Loadingbus.css";
// import busLoad from "../../../images/load/busLoad.gif"



const quotes = [
  {
    text: "Explore more, pay less - Skytrails' buses bring affordability to adventure!",
    // img: img1,
  },
  {
    text: "Hop on for unbeatable journeys - Skytrails' buses at prices that delight!",
    // img: img2,
  },
  {
    text: "Scenic routes at pocket-friendly prices - only with Skytrails buses!",
    // img: img2,
  },
  {
    text: "Hold on!!We are fetching best result for you",
  },
  // {
  //   text: "Hold on!!!....",
  //   // img: img2
  // }
];



const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};

function Loadingbus() {

  const { text } = getRandomQuote();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [currentImgIndex, setCurrentImgIndex] = useState(0);

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
      // setCurrentImgIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);



  return (
    <div className="flightLoading">
      {/* <img src={flightLoading} alt="Flight Loading" /> */}
      <div className="imageflightcontent">

        <div className="busimgcontainer">
          <img
            // src={busNew}
            src="https://raw.githubusercontent.com/The-SkyTrails/Images/main/busLoad.gif"
            alt="loading"
            className="flightloadingimg"
          />
        </div>

      </div>

      <div className="funnyfact">
        {loading && <h3>Hold on...</h3>}
        {data && (
          <div>
            <h5>{text}</h5>
          </div>
        )}
      </div>
    </div>
  )
}

export default Loadingbus