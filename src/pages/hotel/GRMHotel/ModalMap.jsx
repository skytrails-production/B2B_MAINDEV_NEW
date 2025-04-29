import React, { useState } from "react";
import { Modal } from "flowbite-react";
import { MapPin } from "lucide-react";
const ModalMap = ({ mapUrl }) => {
  const [openMapModal, setOpenMapModal] = useState(false);
  return (
    <div>
      <div className="flex flex-row items-center gap-2">
        <p
          onClick={() => setOpenMapModal(true)}
          className="cursor-pointer no-underline mb-0 text-gray-600 flex flex-row items-center gap-1 font-semibold text-[14px]"
        >
          <MapPin className="h-6 w-6 text-primary-6000" /> see on map
        </p>
      </div>

      <Modal show={openMapModal} onClose={() => setOpenMapModal(false)}>
        <Modal.Header className="p-2"></Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <iframe
              src={mapUrl}
              className="w-full h-[400px] rounded-lg"
              title="Google Map"
              allowFullScreen
            ></iframe>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ModalMap;
