import React from "react";

const ContinueBtn = ({
  valiation,
  setSub,
  handleTravelClickOpen,
  setReviewTravellerModal,
  handleFocus,
}) => {
  return (
    <>
      <button
        className="py-2 px-8 mt-4  bg-primary-6000 font-bold text-center rounded-md text-white "
        onClick={() => handleTravelClickOpen()}
      >
        Continue
      </button>
    </>
  );
};

export default ContinueBtn;
