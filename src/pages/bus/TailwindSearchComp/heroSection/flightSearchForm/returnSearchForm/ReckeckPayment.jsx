import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import BookWrapperSummary from "../../../../BookWraperFlight/BookWrapperSummary";
const ReckeckPayment = ({
  handleConfirmationModalClose,
  handlePayment,
  isConfirmationModalOpen,
}) => {
  return (
    <Dialog
      sx={{ zIndex: "99999" }}
      disableEscapeKeyDown
      open={isConfirmationModalOpen}
    >
      <DialogContent>Are you Sure Your details are Correct ?</DialogContent>
      <BookWrapperSummary widdthh={"w-full"} />
      <DialogActions>
        <div className="flex w-full justify-center items-center gap-2">
          <button
            className=" bg-white border-2 border-primary-700 text-primary-700 px-[24px] py-[8px] rounded-md font-semibold"
            onClick={handleConfirmationModalClose}
          >
            Re Check
          </button>
          <button
            className=" bg-primary-700 border-2 border-primary-700 text-white  px-[24px] py-[8px] rounded-md font-semibold"
            onClick={handlePayment}
          >
            Pay Now
          </button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default ReckeckPayment;
