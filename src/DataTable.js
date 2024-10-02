import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

// Import mock data from the JSON file
const mockDataUrl = "/mockData.json";

const DataTable = () => {
  // State to store filters and data
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    reportType: "",
    branch: "",
    checklist: ""
  });

  // Fetch mock data from the JSON file
  useEffect(() => {
    fetch(mockDataUrl)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setFilteredData(data);
      });
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Apply filters to the data
  useEffect(() => {
    let filtered = data;

    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter(
        (item) => item.date >= filters.startDate && item.date <= filters.endDate
      );
    }
    if (filters.reportType) {
      filtered = filtered.filter((item) => item.reportType === filters.reportType);
    }
    if (filters.branch) {
      filtered = filtered.filter((item) => item.branch === filters.branch);
    }
    if (filters.checklist) {
      filtered = filtered.filter((item) => item.checklist === filters.checklist);
    }

    setFilteredData(filtered);
  }, [filters, data]);

  // Export the data to an Excel file
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "FilteredData.xlsx");
  };

  return (
    <div>
      <h1>Data Table with Filters</h1>

      {/* Filters */}
      <div className="filters">
        <label>Date Range:</label>
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
        />

        <label>Report Type:</label>
        <select
          name="reportType"
          value={filters.reportType}
          onChange={handleFilterChange}
        >
          <option value="">All</option>
          <option value="Sales">Sales</option>
          <option value="Inventory">Inventory</option>
          <option value="Finance">Finance</option>
        </select>

        <label>Branch:</label>
        <select name="branch" value={filters.branch} onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="New York">New York</option>
          <option value="Los Angeles">Los Angeles</option>
          <option value="Chicago">Chicago</option>
        </select>

        <label>Checklist:</label>
        <select
          name="checklist"
          value={filters.checklist}
          onChange={handleFilterChange}
        >
          <option value="">All</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Export to Excel Button */}
      <button onClick={exportToExcel}>Export to Excel</button>

      {/* Table showing filtered data */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Report Type</th>
            <th>Branch</th>
            <th>Checklist</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.date}</td>
                <td>{item.reportType}</td>
                <td>{item.branch}</td>
                <td>{item.checklist}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No Data Available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
