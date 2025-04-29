import BusSearchForm from "./TailwindSearchComp/heroSection/busSearchForm/BusSearchForm";

const Bus = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="flightMainBox relative py-16 pt-44 flex md:flex justify-center bg-cover bg-top bg-no-repeat">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          //   poster={homeBG}
          loop
          autoPlay
          muted
        >
          Your browser does not support the video tag.
        </video>
        <BusSearchForm />
      </div>
    </div>
  );
};
export default Bus;
