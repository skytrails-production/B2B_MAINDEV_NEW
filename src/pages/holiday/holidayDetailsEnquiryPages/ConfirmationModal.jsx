import React, { useState } from "react";
import { Select, Modal, Button, Slider, Checkbox } from "antd";
import "./holidayenquiryform.scss";

const ConfirmationModal = ({ isOpen, onClose }) => {
  return (
    <div>
      <Modal
        // title="Select Cities"
        centered
        // maskClosable={false}
        open={isOpen}
        onCancel={onClose}
        footer={null}
      >
        <div className="confirmModalEnquiry">
          <h1>Submitted</h1>
          <p>
            Your enquiry has been successfully submitted. Our team will reach
            out to you soon.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default ConfirmationModal;
