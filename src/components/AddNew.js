

import React, { useState } from "react";
import axios from "axios";

const AddNew = ({ apiUrl, maxKeysObject, onDataUpdate, fetchData }) => {
const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  
  const handleAddClick = () => {
    setShowForm(true);
    setSuccessMessage(null);
    setShowSuccessMessage(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(apiUrl, formData);
      console.log("Data posted successfully:", response.data);
      setSuccessMessage("Data posted successfully!");
      setFormData({});
      setShowForm(false);
      fetchData();
  
      if (onDataUpdate) {
        onDataUpdate();
      }
  
      setShowSuccessMessage(true);
  
      // Hide the success message after 2 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessMessage(null); // Reset the success message
      }, 2000);
  
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };
  
  return (
    <>
      <button className="button-add" onClick={handleAddClick}>
        Add New
      </button>

      {showForm && (
        <div className="EditFormOverlay">
          <div className="EditForm">
            <div className="EditFormHeader">
              <h2>ADD NEW ITEM</h2>
            </div>
            <form className="EditFormFields" onSubmit={handleFormSubmit}>
              {Object.keys(maxKeysObject).map((field) => (
                <div className="FormField" key={field}>
                  <label htmlFor={field}>{field}</label>
                  <input
                    type="text"
                    id={field}
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleFormChange}
                    readOnly={field === 'id'}
                  />
                </div>
              ))}
              <div className="ButtonGroup">
                <button type="submit">Add</button>
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {successMessage && <p className="success-message">{successMessage}</p>}
    </>
  );
};

export default AddNew;
