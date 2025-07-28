// src/utils/uploadToCloudinary.js
import axios from "axios";

const CLOUD_NAME = "dsqas8ddo";
const UPLOAD_PRESET = "ml_default"; // Make sure this matches your Cloudinary preset

export const uploadToCloudinary = async (file) => {
  if (!file?.type?.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );

    const { secure_url, public_id } = response.data;

    return {
      url: secure_url,
      publicId: public_id
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Upload failed. Please try again.");
  }
};
