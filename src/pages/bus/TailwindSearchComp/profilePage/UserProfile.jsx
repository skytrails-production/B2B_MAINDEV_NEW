import React, { useState, useEffect } from "react";
import axios from "axios";
import SecureStorage from "react-secure-storage";
import { apiURL } from "../../../Constants/constant";
import { useDispatch, useSelector } from "react-redux";
import {
  editActionIMAGE,
  logoutAction,
  updateActionIMAGE,
} from "../../../Redux/Auth/logIn/actionLogin";
import { ipAction, tokenAction } from "../../../Redux/IP/actionIp";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const dispatch = useDispatch();
  const reducerState = useSelector((state) => state);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    mobile_number: "",
    dob: "",
    nationality: "",
    gender: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
    email: "",
    bio: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // New state for preview image
  const [isEditable, setIsEditable] = useState(false);
  const [isEditableUploadImage, setIsEditableUploadImage] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(""); // For popup message
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const token = SecureStorage.getItem("jwtToken");

  if (!token) {
    navigate("/");
  }

  useEffect(() => {
    // Fetch user data
    axios
      .get(`${apiURL.baseURL}/skytrails/api/user/getUserProfile`, {
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      })
      .then((response) => {
        const result = response.data.result;
        setUserData({
          name: result.username || "",
          mobile_number: result.phone.mobile_number || "",
          dob: result.dob || "",
          nationality: result.Nationality || "",
          gender: result.gender || "",
          address: result.address || "",
          pincode: result.pincode || "",
          city: result.City || "",
          state: result.State || "",
          email: result.email || "",
          bio: result.bio || "",
        });
        setProfileImage(result.profilePic || ""); // Assuming result contains profile image URL
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [token]);

  useEffect(() => {
    // Hide the update message after 2 seconds
    if (updateMessage) {
      const timer = setTimeout(() => {
        setUpdateMessage("");
      }, 2000);
      return () => clearTimeout(timer); // Clear timer on component unmount
    }
  }, [updateMessage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditable(true);
  };
  //   const disabledUpdateImage = () => {
  //     setIsEditableUploadImage(true);
  //   };

  const handleSubmit = () => {
    const payload = {
      username: userData.name,
      email: userData.email,
      mobile_number: userData.mobile_number,
      gender: userData.gender,
      Nationality: userData.nationality,
      City: userData.city,
      State: userData.state,
      pincode: userData.pincode,
      dob: userData.dob,
      address: userData.address,
      bio: userData.bio,
      coverPic: "",
    };

    try {
      dispatch(editActionIMAGE(payload));
      setIsEditable(false);
    } catch (err) {}
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setPreviewImage(previewURL); // Set preview image to show selected image
      setProfileImage(file); // Store the actual file in profileImage state
      setIsEditableUploadImage(true);
    }
  };

  const handleUpdateImage = () => {
    if (profileImage) {
      const formData = new FormData();
      formData.append("images", profileImage);

      dispatch(updateActionIMAGE(formData));
      setUpdateMessage("Profile image updated successfully!"); // Optional: Show update message
      setIsEditableUploadImage(false);
    }
  };

  const handleDelete = () => {
    axios
      .delete(`${apiURL.baseURL}/skyTrails/api/user/deleteProfile`, {
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      })
      .then(() => {
        dispatch(logoutAction());
        SecureStorage.removeItem("jwtToken");
        dispatch(ipAction());
        const payload = {
          EndUserIp: reducerState?.ip?.ipData,
        };
        dispatch(tokenAction(payload));
        navigate("/");
      })
      .catch((error) => {
        console.error("Error deleting profile:", error);
      });
  };

  return (
    <div className="container pt-14 sm:pt-20 pb-24 lg:pb-32">
      {updateMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white p-3 rounded-lg shadow-md">
          {updateMessage}
        </div>
      )}
      <div className="flex flex-col md:flex-row">
        <div className="flex-shrink-0 flex items-center flex-col">
          <div className="relative rounded-full overflow-hidden flex">
            <div className="wil-avatar relative flex-shrink-0 inline-flex items-center justify-center text-neutral-100 uppercase font-semibold shadow-inner rounded-full w-32 h-32 ring-1 ring-white">
              <img
                className="absolute inset-0 w-full h-full object-cover rounded-full"
                src={
                  previewImage || // Display preview image if available
                  profileImage ||
                  "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"
                }
                alt="Profile"
              />
              <span className="wil-avatar__name">J</span>
            </div>
            <label className="absolute inset-0 bg-gray-950 bg-opacity-60 flex flex-col items-center justify-center text-neutral-50 cursor-pointer">
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              <span className="mt-1 text-xs">Change Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
          </div>
          {isEditableUploadImage && (
            <button
              onClick={handleUpdateImage}
              className="mt-4 bg-primary-6000 text-white px-4 py-2 rounded-full"
            >
              Update Image
            </button>
          )}
          {!isEditableUploadImage && (
            <button
              //   onClick={disabledUpdateImage}
              className="mt-4 bg-gray-400 text-white px-4 py-2 rounded-full"
            >
              Upload Image
            </button>
          )}
        </div>

        {/* Form Section */}
        <div className="flex-grow mt-10 md:mt-0 md:pl-16 max-w-3xl space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                disabled={!isEditable}
                className="block w-full border border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 rounded-2xl text-sm font-normal h-11 px-4 py-3 mt-1.5"
              />
            </div>
            <div>
              <label className="block font-semibold">Mobile Number</label>
              <input
                type="text"
                name="mobile_number"
                value={userData.mobile_number}
                onChange={handleInputChange}
                disabled={true}
                className="block w-full border border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-gray-200 dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 rounded-2xl text-sm font-normal h-11 px-4 py-3 mt-1.5"
              />
            </div>
            <div>
              <label className="block font-semibold">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={userData.dob}
                onChange={handleInputChange}
                disabled={!isEditable}
                className="block border w-full border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 rounded-2xl text-sm font-normal h-11 px-4 py-3 mt-1.5"
              />
            </div>
            <div>
              <label className="block font-semibold">Nationality</label>
              <input
                type="text"
                name="nationality"
                value={userData.nationality}
                onChange={handleInputChange}
                disabled={!isEditable}
                className="block w-full border border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 rounded-2xl text-sm font-normal h-11 px-4 py-3 mt-1.5"
              />
            </div>
            <div>
              <label className="block font-semibold">Gender</label>
              <select
                name="gender"
                value={userData.gender}
                onChange={handleInputChange}
                disabled={!isEditable}
                className="nc-Select px-4  border h-11 mt-1.5 block w-full text-sm rounded-2xl border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900"
              >
                <option value="1">Male</option>
                <option value="2">Female</option>
                <option value="3">Other</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold">Address</label>
              <input
                type="text"
                name="address"
                value={userData.address}
                onChange={handleInputChange}
                disabled={!isEditable}
                className="block w-full border border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 rounded-2xl text-sm font-normal h-11 px-4 py-3 mt-1.5"
              />
            </div>
            <div>
              <label className="block font-semibold">Pin Code</label>
              <input
                type="text"
                name="pincode"
                value={userData.pincode}
                onChange={handleInputChange}
                disabled={!isEditable}
                className="block w-full border border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 rounded-2xl text-sm font-normal h-11 px-4 py-3 mt-1.5"
              />
            </div>
            <div>
              <label className="block font-semibold">City</label>
              <input
                type="text"
                name="city"
                value={userData.city}
                onChange={handleInputChange}
                disabled={!isEditable}
                className="block w-full border border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 rounded-2xl text-sm font-normal h-11 px-4 py-3 mt-1.5"
              />
            </div>
            <div>
              <label className="block font-semibold">State</label>
              <input
                type="text"
                name="state"
                value={userData.state}
                onChange={handleInputChange}
                disabled={!isEditable}
                className="block w-full border border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 rounded-2xl text-sm font-normal h-11 px-4 py-3 mt-1.5"
              />
            </div>
            <div>
              <label className="block font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                disabled={true}
                className="block w-full border border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-gray-200 dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 rounded-2xl text-sm font-normal h-11 px-4 py-3 mt-1.5"
              />
            </div>
            <div className="col-span-2">
              <label className="block font-semibold">Bio</label>
              <textarea
                name="bio"
                value={userData.bio}
                onChange={handleInputChange}
                disabled={!isEditable}
                rows={4}
                className="block w-full px-4 py-3 border text-sm rounded-2xl border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 mt-1.5"
              />
            </div>
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            {!isEditable && (
              <button
                onClick={handleEdit}
                className="text-white px-12 rounded-2xl py-2 bg-gray-400"
              >
                Edit
              </button>
            )}
            {isEditable && (
              <button
                onClick={handleSubmit}
                className="text-white font-semibold px-12 rounded-2xl py-2 bg-primary-6000"
              >
                Update Info
              </button>
            )}

            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-red-600 font-semibold px-12 rounded-2xl py-2 border-2 border-red-600"
            >
              Delete
            </button>
          </div>
        </div>

        {showDeleteModal && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Deletion</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowDeleteModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  Are you sure you want to delete your profile?
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDelete}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
