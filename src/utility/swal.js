import swal from "sweetalert2";
import FLIGHT from "../../src/images/flights/flightnoresult.svg";
import BUS from "../../src/images/no-result/bus-not-found.png";
import HOTEL from "../../src/images/no-result/hotel-not-found.png";
import PACKAGE from "../../src/images/no-result/no-content.png";
import PY from "../images/img/Cancelled event-pana (1).svg";
// import { Flight } from "@mui/icons-material"
export const swalModal = (type, message, payment) => {
  const img = {
    flight: FLIGHT,
    py: PY,
    bus: BUS,
    hotel: HOTEL,
    package: PACKAGE,
  };
  const dynamicImage = img[type];
  // console.warn(type, dynamicImage,  "type.....")
  swal.fire({
    imageUrl: dynamicImage || FLIGHT,
    html: `<h6 className="text-[13px]">${message}</h6>`,
    imageWidth: 250,
    imageHeight: 200,
    width: 350,
    height: 400,
    confirmButtonText: "Okay",
    confirmButtonColor: "#4f46e5",
    cancelButtonColor: "#4f46e5",

    showClass: {
      popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `,
    },
    hideClass: {
      popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `,
    },
  });
};
