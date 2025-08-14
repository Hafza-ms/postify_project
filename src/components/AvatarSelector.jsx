import React, { useState } from "react";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

const predefinedAvatars = [
  "https://res.cloudinary.com/dsqas8ddo/image/upload/v1753507892/avatar4_jbldgb.jpg",
  "https://res.cloudinary.com/dsqas8ddo/image/upload/v1753508474/avatar1_epovm1.jpg",
  "https://res.cloudinary.com/dsqas8ddo/image/upload/v1753507892/avatar2_vnjea4.jpg",
  "https://res.cloudinary.com/dsqas8ddo/image/upload/v1753507892/avatar3_l07dyc.jpg"
  // Add more avatar URLs as needed
];

const AvatarSelector = ({ onAvatarSelected }) => {
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadedUrl(""); // Clear avatar selection when uploading new
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please choose a file.");
    try {
      setIsUploading(true);
      const url = await uploadToCloudinary(selectedFile);
      setUploadedUrl(url);
      onAvatarSelected({ url, type: "uploaded" });
    } catch (error) {
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAvatarSelect = (url, index) => {
    setUploadedUrl(url);
    setSelectedFile(null); // Clear file selection when choosing avatar
    onAvatarSelected({ url, type: `avatar-${index + 1}` });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h3>Choose an Avatar</h3>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px"
        }}
      >
        {predefinedAvatars.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`avatar-${index}`}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              cursor: "pointer",
              border: uploadedUrl === url ? "3px solid #007bff" : "1px solid gray",
              transition: "border 0.2s"
            }}
            onClick={() => handleAvatarSelect(url, index)}
          />
        ))}
      </div>

      <hr style={{ margin: "20px 0" }} />

      <h4>Or Upload Your Own</h4>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        disabled={isUploading || !selectedFile}
        style={{ marginLeft: "10px" }}
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>

      {uploadedUrl && (
        <div style={{ marginTop: "20px" }}>
          <h5>Selected Avatar Preview:</h5>
          <img
            src={uploadedUrl}
            alt="Selected avatar"
            style={{ width: "100px", borderRadius: "50%", border: "2px solid #28a745" }}
          />
        </div>
      )}
    </div>
  );
};

export default AvatarSelector;
