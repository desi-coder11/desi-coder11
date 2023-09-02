
import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "./Table";
import EditForm from "./EditForm";

const ApiSelector = ({ onDataUpdate } ) => {
  const [isLoading, setIsLoading] = useState(false);
  const [datacenter, setDatacenter] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [fetchedData, setFetchedData] = useState([]);
  const [constructedUrl, setConstructedUrl] = useState("");
  const [tableHeaders, setTableHeaders] = useState([]);
  const [maxKeysObject, setMaxKeysObject] = useState({});
  const [selectedEditData, setSelectedEditData] = useState(null);



useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(constructedUrl);
        const data = response.data;

        const mergedKeys = new Set();
        data.forEach((obj) => {
          Object.keys(obj).forEach((key) => mergedKeys.add(key));
        });

        const newMaxKeysObject = Array.from(mergedKeys).reduce(
          (maxObj, key) => {
            if (!maxObj[key]) {
              maxObj[key] = '';
            }
            return maxObj;
          },
          {}
        );

        console.log(newMaxKeysObject );

        setFetchedData(data);
        setMaxKeysObject(newMaxKeysObject);
        setTableHeaders(Object.keys(newMaxKeysObject));
      } catch (error) {
        console.error("Error fetching data:", error);
      }finally {
        setIsLoading(false); // Set isLoading to false after fetching data
      }
    };

    if (constructedUrl) {
      fetchData();
    }
  }, [constructedUrl]);


  

  const handleDatacenterChange = (e) => {
    setDatacenter(e.target.value);
  };

  const handleEndpointChange = (e) => {
    setEndpoint(e.target.value);
  };

  const handleSelect = () => {
    const trimmedDatacenter = datacenter.trim();
    const trimmedEndpoint = endpoint.trim();
    if (trimmedDatacenter && trimmedEndpoint) {
      const newConstructedUrl = `${trimmedDatacenter}/${trimmedEndpoint}`;
      setConstructedUrl(newConstructedUrl);
      setIsLoading(true);
    }
    if (onDataUpdate) {
      onDataUpdate(fetchedData);
    }

  };

  const handleEditClick = (rowData) => {
    setSelectedEditData(rowData);
  };

  const handleEditSave = (editedData) => {
    const updatedData = fetchedData.map((data) =>
      data.id === editedData.id ? editedData : data
    );
    setFetchedData(updatedData);
    setSelectedEditData(null);
  };

  const handleEditCancel = () => {
    setSelectedEditData(null);
  };

  
  

  return (
    <>
      <div className="api-selector-container">
        <div className="api-selector-header">
          <h1>LB Admin</h1>
        </div>
        <div className="form-field">
          <label>Datacenter:</label>
          <select value={datacenter} onChange={handleDatacenterChange}>
            <option value="">Select Datacenter</option>
            <option value="http://20.228.168.6/exactapi">QA</option>
            <option value="https://data.exactspace.co/exactapi">PROD</option>
             <option value="https://edgelive.thermaxglobal.com/exactapi">THERMAX</option>
             <option value="https://cpp.utclconnect.com/exactapi">UTCL</option>
            <option value="https://rmds.bhel.in/exactapi">BHEL</option>
            <option value="http://10.36.141.34/exactapi">HRD</option>
            <option value="http://10.36.44.48/exactapi">LPG</option>
            
           
            {/* Add more datacenters here */}
          </select>
        </div>
        <div className="form-field">
          <label>Endpoint:</label>
          <select value={endpoint} onChange={handleEndpointChange}>
            <option value="">Select Endpoint</option>
            <option value="alerts">alerts</option>
            <option value="userprofiles">userprofiles</option>
            {/* Add more endpoints here */}
          </select>
        </div>
        <button className="select-button" onClick={handleSelect}>
          Select
        </button>

        {constructedUrl && (
          <div className="constructed-url">
            <p>Complete URL:</p> <code>{constructedUrl}</code>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="loader">Loading...</div>
      ) : tableHeaders.length > 0 ? (
        <div className="data-fetcher-container">
          <Table
            headers={tableHeaders}
            data={fetchedData}
            apiUrl={constructedUrl}
            onEditClick={handleEditClick}
            maxKeysObject={maxKeysObject}
            fetchData={fetchedData}
          />
        </div>
      ) : null}

      {selectedEditData && (
        <EditForm
          data={selectedEditData}
          headers={tableHeaders}
          apiUrl={constructedUrl} // Make sure you pass the correct value here
          onSave={handleEditSave}
          onCancel={handleEditCancel}
        />
      )}
    </>
  );
};

export default ApiSelector;

