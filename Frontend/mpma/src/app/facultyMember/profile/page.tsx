"use client";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { LecturerService } from "@/services/LecturerService";
import { Lecturer } from "@/types/Lecturer";

/**
 * ! Profile Page Component for Faculty Members
 * * Displays and allows editing of lecturer profile information
 * @returns {JSX.Element} Profile page component
 */
const Profile = () => {
  // ! State Management
  // * Get authentication context for user info and token
  const { user, token } = useAuth();

  // * Form states for editable fields
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // * Form data and lecturer profile
  const [formData, setFormData] = useState({
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [lecturerData, setLecturerData] = useState<Lecturer | null>(null);

  // * State for areas of interest
  const [areasOfInterest, setAreasOfInterest] = useState<string[]>([]);

  // * State for new area input
  const [newArea, setNewArea] = useState("");

  // * Fetch lecturer profile data when component mounts
  useEffect(() => {
    const fetchLecturerProfile = async () => {
      if (!token || !user?.id) {
        setError("Authentication required to view profile");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch lecturer profile from backend
        const profile = await LecturerService.getLecturerById(user.id, token);

        // Update state with fetched data
        setLecturerData(profile);
        setFormData({
          email: profile.email || "",
          phoneNumber: profile.phoneNumber || "",
          address: profile.address || "",
        });
        setAreasOfInterest(profile.areasOfInterest || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLecturerProfile();
  }, [token, user?.id]);

  // ! Event Handlers
  /**
   * Toggles edit mode for editable fields
   */
  const handleEditToggle = () => {
    if (isEditing) {
      // ? Save changes when transitioning from edit to view mode
      handleSaveChanges();
    }
    setIsEditing(!isEditing);
    setNewArea(""); // Reset new area input when toggling edit mode
  };

  /**
   * Handles input changes for editable fields
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - Input change event
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /**
   * Handles changes to the new area input field
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleNewAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewArea(e.target.value);
  };

  /**
   * Adds a new area of interest to the list
   * ? Only adds if the input is not empty
   */
  const handleAddArea = () => {
    if (newArea.trim() !== "") {
      setAreasOfInterest([...areasOfInterest, newArea.trim()]);
      setNewArea(""); // Reset input after adding
    }
  };

  /**
   * Removes an area of interest from the list
   * @param {number} index - Index of the area to remove
   */
  const handleRemoveArea = (index: number) => {
    const updatedAreas = [...areasOfInterest];
    updatedAreas.splice(index, 1);
    setAreasOfInterest(updatedAreas);
  };

  /**
   * Handles saving profile changes to the backend
   */
  const handleSaveChanges = async () => {
    if (!token || !user?.id || !lecturerData) {
      toast.error("Authentication required to update profile");
      return;
    }

    try {
      setLoading(true);

      // Prepare update data with form fields and areas of interest
      const updateData = {
        ...formData,
        areasOfInterest,
      };

      // Call the service to update the profile
      await LecturerService.updateLecturerProfile(user.id, updateData, token);

      // Show success message
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles keypress events for the new area input
   * ? Allows adding a new area by pressing Enter
   * @param {React.KeyboardEvent<HTMLInputElement>} e - Keyboard event
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddArea();
    }
  };

  /**
   * Renders a form field based on configuration
   * @param {object} config - Field configuration
   * @returns {JSX.Element} Rendered form field
   */
  const renderField = (config: {
    label: string;
    name?: string;
    value: string;
    type?: string;
    isTextarea?: boolean;
    isEditable?: boolean;
    colSpan?: string;
  }) => {
    const isCurrentlyEditable = isEditing && config.isEditable;

    return (
      <div className={`form-control ${config.colSpan || ""}`}>
        <label className="label">
          <span className="label-text font-medium">{config.label}</span>
        </label>
        {config.isTextarea ? (
          <textarea
            name={config.name}
            value={config.value}
            onChange={handleInputChange}
            className={`textarea textarea-bordered ${isCurrentlyEditable ? "bg-primary" : "bg-background"} h-24`}
            disabled={!isCurrentlyEditable}
          />
        ) : (
          <input
            type={config.type || "text"}
            name={config.name}
            value={config.value}
            onChange={handleInputChange}
            className={`input input-bordered ${isCurrentlyEditable ? "bg-primary" : "bg-background"}`}
            disabled={!isCurrentlyEditable}
          />
        )}
      </div>
    );
  };

  // ? Define field configurations for consistent rendering using actual data
  const fieldConfigs = lecturerData
    ? [
        { label: "Person ID", value: lecturerData.personId?.toString() || "" },
        { label: "Username", value: lecturerData.username || "" },
        { label: "Name", value: lecturerData.name || "" },
        { label: "Department", value: lecturerData.department || "" },
        {
          label: "Email",
          name: "email",
          value: formData.email,
          type: "email",
          isEditable: true,
        },
        {
          label: "Phone Number",
          name: "phoneNumber",
          value: formData.phoneNumber,
          type: "tel",
          isEditable: true,
        },
        { label: "Date of Birth", value: lecturerData.dateOfBirth || "" },
        {
          label: "Address",
          name: "address",
          value: formData.address,
          isTextarea: true,
          isEditable: true,
          colSpan: "md:col-span-2",
        },
      ]
    : [];

  // * Handle loading and error states
  if (loading && !lecturerData) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full p-8">
          <div className="text-lg">Loading profile...</div>
        </div>
      </Layout>
    );
  }

  if (error && !lecturerData) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full p-8">
          <div className="text-lg text-red-500">{error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="border-2 border-borderColor p-4 bg-primary">
          <div className="text-2xl font-medium p-4 text-foreground">
            Faculty Profile
          </div>

          <div className="flex flex-col lg:flex-row gap-6 p-4">
            {/* Profile Picture Section */}
            <div className="lg:w-1/3 flex flex-col items-center gap-4">
              <div className="avatar">
                <div className="w-48 h-48 rounded-md">
                  <img
                    src={
                      lecturerData?.profilePicture ||
                      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    }
                    alt="Profile Picture"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="w-full mt-4">
                <div className="border-2 border-borderColor p-4 bg-tertiary rounded-md">
                  <h3 className="text-lg font-semibold mb-2">
                    Areas of Interest
                  </h3>

                  {/* Areas of Interest List */}
                  <ul className="list-disc pl-5 mb-2">
                    {areasOfInterest.map((area, index) => (
                      <li
                        key={index}
                        className="mb-1 flex justify-between items-center"
                      >
                        <span>{area}</span>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => handleRemoveArea(index)}
                            className="btn btn-xs btn-error text-xs ml-2"
                            aria-label={`Remove ${area}`}
                          >
                            ×
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>

                  {/* Add new area input (shown only in edit mode) */}
                  {isEditing && (
                    <div className="flex mt-4">
                      <input
                        type="text"
                        value={newArea}
                        onChange={handleNewAreaChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Add new area"
                        className="input input-bordered input-sm bg-primary flex-grow mr-2"
                      />
                      <button
                        type="button"
                        onClick={handleAddArea}
                        className="btn btn-sm bg-quaternary hover:bg-tertiary"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Details Section */}
            <div className="lg:w-2/3 mt-6 lg:mt-0">
              <div className="border-2 border-borderColor p-4 bg-tertiary rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fieldConfigs.map((config, index) => (
                    <React.Fragment key={index}>
                      {renderField(config)}
                    </React.Fragment>
                  ))}
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    className={`btn ${loading ? "loading" : ""} bg-quaternary hover:bg-tertiary hover:text-foreground`}
                    onClick={handleEditToggle}
                    disabled={loading}
                  >
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
