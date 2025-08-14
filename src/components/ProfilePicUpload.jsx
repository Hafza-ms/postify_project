import React, { useState } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Image,
  Spinner,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./Firebase";
import axios from "axios";

// Cloudinary config
const CLOUD_NAME = "dsqas8ddo";
const UPLOAD_PRESET = "ml_default";

// Predefined Avatars
const avatars = [
  {
    url: "https://res.cloudinary.com/dsqas8ddo/image/upload/v1753508474/avatar1_epovm1.jpg",
    name: "avatar1",
  },
  {
    url: "https://res.cloudinary.com/dsqas8ddo/image/upload/v1753507892/avatar2_vnjea4.jpg",
    name: "avatar2",
  },
  {
    url: "https://res.cloudinary.com/dsqas8ddo/image/upload/v1753507892/avatar3_l07dyc.jpg",
    name: "avatar3",
  },
  {
    url: "https://res.cloudinary.com/dsqas8ddo/image/upload/v1753507892/avatar4_jbldgb.jpg",
    name: "avatar4",
  },
];

const defaultAvatar =
  "https://res.cloudinary.com/dsqas8ddo/image/upload/v1754379973/defaultprofile_xkgq8c.jpg";

const ProfilePicUpload = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state;

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [usedDefault, setUsedDefault] = useState(false);
  const [loading, setLoading] = useState(false);

  // Image input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setSelectedAvatar(null);
      setUsedDefault(false);
    } else {
      alert("Please select a valid image file.");
    }
  };

  // Avatar selection
  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setImage(null);
    setPreview(null);
    setUsedDefault(false);
  };

  // Use default
  const handleSkip = () => {
    setSelectedAvatar(null);
    setImage(null);
    setPreview(null);
    setUsedDefault(true);
  };

  // Submit to Firestore
  const handleFinish = async () => {
    if (!userData || !userData.uid) {
      alert("User data missing. Please go back and sign up again.");
      return;
    }

    setLoading(true);
    try {
      let profilePicURL = "";
      let avatarName = "";
      let imageName = "";

      // Upload to Cloudinary
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", UPLOAD_PRESET);

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          formData
        );

        profilePicURL = response.data.secure_url;
        imageName = response.data.public_id;
        avatarName = "custom";
      } else if (selectedAvatar) {
        profilePicURL = selectedAvatar.url;
        avatarName = selectedAvatar.name;
        imageName = selectedAvatar.name;
      } else {
        profilePicURL = defaultAvatar;
        avatarName = "default";
        imageName = "default_user";
      }

      // Save to Firestore
      const finalUserData = {
        ...userData,
        profilePic: profilePicURL,
        avatarName,
        imageName,
      };

      await setDoc(doc(db, "users", userData.uid), finalUserData);

      alert("🎉 Account created successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error saving user:", err);
      alert("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="text-center mt-4">
      <h2>Choose Your Profile Picture</h2>

      <h5 className="mt-4">Upload Your Own Image</h5>
      <Row className="justify-content-center">
        <Col md={6}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={loading}
          />
          {preview && (
            <Image
              src={preview}
              roundedCircle
              height={150}
              className="mt-3 border border-primary"
              alt="Uploaded preview"
            />
          )}
        </Col>
      </Row>

      <h5 className="mt-4">Or Choose From Avatars</h5>
      <Row className="justify-content-center mt-2">
        {avatars.map((avatar, index) => (
          <Col xs={3} sm={2} md={2} key={index}>
            <OverlayTrigger
              overlay={<Tooltip>{avatar.name}</Tooltip>}
              placement="top"
            >
              <Image
                src={avatar.url}
                roundedCircle
                height={80}
                style={{
                  border:
                    selectedAvatar?.url === avatar.url
                      ? "3px solid green"
                      : "2px solid gray",
                  cursor: "pointer",
                }}
                onClick={() => handleAvatarSelect(avatar)}
                alt={avatar.name}
              />
            </OverlayTrigger>
          </Col>
        ))}
      </Row>

      <h5 className="mt-4">Or Skip</h5>
      <Button
        variant="outline-secondary"
        className="mb-3"
        onClick={handleSkip}
        disabled={loading}
      >
        Skip & Use Default
      </Button>

      {usedDefault && (
        <div className="mt-2">
          <Image
            src={defaultAvatar}
            roundedCircle
            height={150}
            style={{ opacity: 0.5 }}
            alt="Default avatar"
          />
          <p className="text-muted mt-2">(No image selected)</p>
        </div>
      )}

      <div className="mt-4">
        <Button variant="primary" onClick={handleFinish} disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : "Finish & Create"}
        </Button>
      </div>
    </Container>
  );
};

export default ProfilePicUpload;
