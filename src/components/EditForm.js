
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditForm = ({
  apiUrl,
  data,
  headers,
  maxKeysObject,
  onSave,
  onCancel,
  fetchData , 
}) => {
  const [editedData, setEditedData] = useState(data);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    setEditedData(data);
    setSuccessMessage(null); 
  }, [data]);

  const handleInputChange = (key, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        `${apiUrl}/${editedData.id}`,
        editedData
      );

      setSuccessMessage('Data saved successfully!');
      onSave(editedData);

      // Call the fetchData function to refresh data after edit
      fetchData();
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className="EditFormOverlay">
      <div className="EditForm">
        <div className="EditFormHeader">
          <h2>Edit Form</h2>
        </div>
        <div className="EditFormFields">
          {headers.map((key) => (
            <div key={key} className="FormField">
              <label htmlFor={key}>{key}</label>
              <input
                type="text"
                id={key}
                name={key}
                value={editedData[key]}
                onChange={(e) => handleInputChange(key, e.target.value)}
                readOnly={key === 'id'}
              />
            </div>
          ))}
        </div>
        <div className="ButtonGroup">
          <button onClick={handleSubmit}>Save</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
        {successMessage && (
          <p className="success-message" style={{ marginTop: '10px' }}>
            {successMessage}
          </p>
        )}      </div>
    </div>
  );
};

export default EditForm;


