import React from "react";
import { Modal, Button } from "antd";
import BookWrapperSummary from "../../../components/BookWraperFlight/BookWrapperSummary";
import PayButton from "../../../utility/PayButton";
// import BookWrapperSummary from "../../../../components/BookWraperFlight/BookWrapperSummary";
// import PayButton from "../../../../utility/PayButton";

const RecheckPaymentDummy = ({
  handleConfirmationModalClose,
  handlePayment,
  isConfirmationModalOpen,
  phone,
  email,
  ticketPrice,
  bookingType,
  buttonText,
  setPaymentLoading,
  setLoaderPayment1,
  setLoaderPayment,
  setLoadingButton,
  className,
}) => {
  return (
    <Modal
      open={isConfirmationModalOpen}
      onCancel={handleConfirmationModalClose}
      footer={null}
      closable={false}
      centered
      zIndex={99999}
    >
      <div className="text-center">
        <p className="text-base font-medium mb-4">
          Are you sure your details are correct?
        </p>

        <BookWrapperSummary widdthh={"w-full"} />

        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            className="border-primary-700 text-primary-700 font-semibold px-6 py-2 rounded-md"
            onClick={handleConfirmationModalClose}
            style={{
              backgroundColor: "#fff",
              borderColor: "#1D4ED8",
              color: "#1D4ED8",
            }}
          >
            Re Check
          </Button>
          <PayButton
            phone={phone}
            email={email}
            ticketPrice={ticketPrice}
            bookingType={bookingType}
            buttonText={buttonText}
            setPaymentLoading={setPaymentLoading}
            setLoaderPayment1={setLoaderPayment1}
            setLoaderPayment={setLoaderPayment}
            setLoadingButton={setLoadingButton}
            className={className}
          />
        </div>
      </div>
    </Modal>
  );
};

export default RecheckPaymentDummy;
