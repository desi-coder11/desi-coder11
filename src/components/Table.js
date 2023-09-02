

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditForm from "./EditForm";
import AddNew from "./AddNew";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const Table = ({ headers, apiUrl, maxKeysObject, onDataUpdate }) => {
  const [data, setData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [numberOfRows, setNumberOfRows] = useState(0);
  const [refreshTable, setRefreshTable] = useState(false);


  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const [sortedData, setSortedData] = useState([]);
  const [isDataReversed, setIsDataReversed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = rowsPerPage;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl);

      setNumberOfRows(response.data.length);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiUrl]);

  const sortData = (unsortedData) => {
    let sortedDataCopy = [...unsortedData];

    if (sortColumn) {
      sortedDataCopy.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        const numAValue = parseFloat(aValue);
        const numBValue = parseFloat(bValue);

        if (!isNaN(numAValue) && !isNaN(numBValue)) {
          if (numAValue < numBValue) {
            return sortOrder === "asc" ? -1 : 1;
          }
          if (numAValue > numBValue) {
            return sortOrder === "asc" ? 1 : -1;
          }
          return 0;
        } else if (typeof aValue === "string" && typeof bValue === "string") {
          if (aValue < bValue) {
            return sortOrder === "asc" ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortOrder === "asc" ? 1 : -1;
          }
          return 0;
        } else if (typeof aValue !== "string") {
          return sortOrder === "asc" ? 1 : -1;
        } else {
          return sortOrder === "asc" ? -1 : 1;
        }
      });
    }

    if (isDataReversed) {
      sortedDataCopy = sortedDataCopy.reverse();
    }

    return sortedDataCopy;
  };

  useEffect(() => {
    const sortedAndSlicedData = sortData(data).slice(startIndex, endIndex);
    setSortedData(sortedAndSlicedData);
  }, [data, sortColumn, sortOrder, isDataReversed, startIndex, endIndex]);

  const handleSaveEdit = async (editedData) => {
    setEditingIndex(null);

    if (onDataUpdate) {
      onDataUpdate();
    }
    setRefreshTable(true);
  };

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);

    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset to the first page when changing rows per page
  };

  const handleDelete = (obj) => {
    setDeletingItem(obj);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    // Perform the deletion logic here
    try {
      const objectId = deletingItem.id;
      const response = await axios.delete(`${apiUrl}/${deletingItem.id}`);

      console.log("API Response:", response.data);

      const newData = data.filter((item) => item.id !== objectId);
      setData(newData);

      // Close the delete modal and refresh the table
      setShowDeleteModal(false);
      setDeletingItem(null);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingItem(null);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleLastPage = () => {
    const totalPages = Math.ceil(numberOfRows / rowsPerPage);

    setCurrentPage(totalPages);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "dsc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const totalRows = data.length;

  const totalPages = Math.ceil(numberOfRows / rowsPerPage);

  const filteredData = data.filter((item) => {
    for (const header of headers) {
      const cellValue = item[header] || "";
      if (
        cellValue
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ) {
        return true;
      }
    }
    return false;
  });

  const filteredAndSortedData = sortData(filteredData);

  return (
    <>
    <div className="row">
      <AddNew apiUrl={apiUrl} maxKeysObject={maxKeysObject} fetchData={fetchData} />
      <button
       className="button-reverse"
        onClick={() => {
          setIsDataReversed(!isDataReversed);
        }}
      >
        Reverse
      </button>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      </div>
      <div className="rows-per-page-selector">
        Rows per page:
        <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value={numberOfRows}>All</option>
        </select>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Actions</th>
            {headers.map((header) => (
              <th key={header} onClick={() => handleSort(header)}>
                {header}
                {sortColumn === header && (
                  <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedData
            .slice(startIndex, endIndex)
            .map((item, index) => (
              <tr key={index}>
                <td>
                  {editingIndex === index ? (
                    <EditForm
                      data={item}
                      headers={headers}
                      onSave={handleSaveEdit}
                      onCancel={() => setEditingIndex(null)}
                      apiUrl={apiUrl}
                      maxKeysObject={maxKeysObject}
                      fetchData={fetchData}
                    />
                  ) : (
                    <>
                      <button onClick={() => setEditingIndex(index)}>
                        <FaEdit title="edit" style={{ color: "blue" }} />
                      </button>
                      <button onClick={() => handleDelete(item)}>
                        <FaTrash title="delete" style={{ color: "red" }} />
                      </button>
                    </>
                  )}
                </td>
                {headers.map((header) => (
                  <td key={header}>
                    {searchQuery ? (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: (item[header] || "")
                            .toString()
                            .replace(
                              new RegExp(
                                `(${searchQuery.replace(
                                  /[.*+?^${}()|[\]\\]/g,
                                  "\\$&"
                                )})`,
                                "gi"
                              ),
                              "<span class='highlighted'>$1</span>"
                            ),
                        }}
                      />
                    ) : (
                      item[header]
                    )}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      <div className="pagination-controls">
        <button
          className="button"
          onClick={handleFirstPage}
          disabled={currentPage === 1}
        >
          First Page
        </button>
        <button
          className="button"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="page-number">
          Page {currentPage} / {totalPages}
        </span>
        <button className="button" onClick={handleNextPage}>
          Next
        </button>
        <button
          className="button"
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
        >
          Last Page
        </button>
      </div>
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default Table;
