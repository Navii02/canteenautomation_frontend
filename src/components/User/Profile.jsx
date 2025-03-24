import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
impor//t "./Profile.css";
import Dashboard from "./Dashboard";
import { url } from "../../service/serviceurl";
const Profile = () => {
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
 // Backend API URL

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${url}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", selectedFile);

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(`${url}/user/upload-profile`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      setUser((prevUser) => ({ ...prevUser, profileImage: response.data.profileImage }));
      alert("Profile image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  return (
    <>
      <div className="container-fluid py-5">
        <Dashboard />
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card shadow-lg border-0 rounded-lg">
                <div className="card-body text-center">
                  {/* Profile Image */}
                  <img
  src={user?.profileImage ? `${BASE_URL}${user.profileImage}` : "https://www.pngmart.com/files/23/Profile-PNG-Photo.png"}
  alt="Profile"
  className="rounded-circle img-fluid mb-3"
  style={{ width: "120px", height: "120px", objectFit: "cover" }}
/>

                  <h3 className="card-title">{user?.name || "User Name"}</h3>
                  <p className="text-muted">{user?.email || "user@example.com"}</p>

                  {/* Upload Profile Image */}
                  <input type="file" className="form-control mb-2" onChange={handleFileChange} />
                  <button className="btn btn-primary" onClick={handleUpload}>
                    Upload Profile Image
                  </button>
                </div>
               
                </div>
              </div>
            </div>
          </div>
        </div>
   
    </>
  );
};

export default Profile;
