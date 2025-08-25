import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react"; // install lucide-react if you haven't
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import img from "../assets/images/RBI.png";
import img2 from "../assets/images/HansaResearch.png";
import img3 from "../assets/images/table rccs.gif";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../utils/logout";

export default function Rccs() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/get-data")
      .then((response) => {
        if (response.data.length > 0) {
          console.log(response);          
          setHeaders(Object.keys(response.data[0]));
          setData(response.data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const [activeFilter, setActiveFilter] = useState(null);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState({});
  const dropdownRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;
  const startIndex = (currentPage - 1) * itemsPerPage;

  //reset filters

  const resetFilters = () => {
    setFilters({});
    setActiveFilter(null); // optional: closes any open dropdown
  };

  //handling filters

  const handleFilterClick = (header) => {
    setActiveFilter(activeFilter === header ? null : header);
  };

  const handleCheckboxChange = (header, value) => {
    setFilters((prev) => {
      const current = prev[header] || [];
      const newValues = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      return { ...prev, [header]: newValues };
    });
  };

  //pagination

  const filteredData = data.filter((row) => {
    return Object.entries(filters).every(
      ([header, selectedValues]) =>
        selectedValues.length === 0 || selectedValues.includes(row[header])
    );
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSearchChange = (header, value) => {
    setSearchTerm((prev) => ({ ...prev, [header]: value }));
  };

  //filter data

  const getUniqueColumnValues = (header) => {
    const partialFiltered = data.filter((row) => {
      return Object.entries(filters).every(([key, selected]) => {
        if (key === header) return true;
        return selected.length === 0 || selected.includes(row[key]);
      });
    });

    let values = [...new Set(partialFiltered.map((row) => row[header]))];

    // Filter based on search term
    const term = searchTerm[header]?.toLowerCase() || "";
    if (term) {
      values = values.filter((val) =>
        (val || "").toString().toLowerCase().includes(term)
      );
    }

    return values;
  };

  //handling click for filters

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveFilter(null); // Close the dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //upload data

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/upload-data", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(res.data.message);
    } catch (err) {
      alert("Upload failed: " + err.message);
    }
}

//download data

const downloadExcel = () => {
    if (!filteredData || filteredData.length === 0) return;
  
    // Prepare worksheet from JSON data
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
  
    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Data");
  
    // Write workbook to binary Excel format
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
  
    // Create a blob and trigger download
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  
    saveAs(data, "filtered_data.xlsx");
  };

  //jsx

  const navigate = useNavigate();

  const confirmLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      handleLogout(navigate);
    };
  };
  
  return (
    <>
      <section className="font-Inria grid grid-cols-1 grid-rows-[20vh_80vh]">
        <div className="flex flex-col w-full row-start-1 row-end-2 col-start-1 col-end-2">
          {/* <!-- Header --> */}
          <header className="w-full flex flex-wrap">
            <div className="w-[25%] flex justify-center items-center">
              <img className="w-[75%] p-2" src={img} alt="logo" />
            </div>
            {/* <!-- Title --> */}
            <div className="w-[55%] flex justify-center items-center text-white">
              <p className="text-[1.5rem] clrgrad rounded-full font-bold text-center py-3 w-full bg-[#c0860c]">
                Rural Consumer Confidence Survey (RCCS)
              </p>
            </div>
            {/* <!-- Hansa Logo --> */}
            <div className="w-[15%] flex justify-center items-center">
              <img className="w-2/4" src={img2} alt="" />
            </div>
            <div className=" flex justify-center items-center">
              <span
                className="flex justify-center items-center pointing"
                id="logout"
                onClick={confirmLogout}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="38"
                  height="38"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#5976aa"
                    d="M12 1.75A10.25 10.25 0 1 0 22.25 12A10.26 10.26 0 0 0 12 1.75m-.75 4.62a.75.75 0 0 1 1.5 0v4.51a.75.75 0 0 1-1.5 0zm6.42 6.93a5.82 5.82 0 1 1-8.26-6.55a.751.751 0 0 1 .66 1.35a4.3 4.3 0 0 0-2.28 4.86a4.3 4.3 0 0 0 1.52 2.4a4.44 4.44 0 0 0 5.38 0a4.33 4.33 0 0 0-.77-7.26a.753.753 0 1 1 .67-1.35a5.88 5.88 0 0 1 2.68 2.74a5.82 5.82 0 0 1 .36 3.81z"
                  />
                </svg>
              </span>
            </div>
          </header>
          <div className="w-[100vw] h-[50vh] bg-white">
            <div className="flex justify-between items-center">
              <div className="flex flex-row  pl-6 pt-2 ">
                <a className="flex flex-row justify-center items-center px-3 py-2 gap-2 bg-[#c0860c] rounded-full border-4 border-white z-30">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#fff"
                        d="M4 12V9c0 2.2 3.6 4 8 4s8-1.8 8-4v3c0 .5-.2.9-.5 1.4c-.8-.3-1.6-.4-2.5-.4c-2.5 0-4.9 1.1-6.4 2.9C6.8 15.6 4 14 4 12m8-1c4.4 0 8-1.8 8-4s-3.6-4-8-4s-8 1.8-8 4s3.6 4 8 4m-2.9 8.7l-.3-.7l.3-.7c.1-.2.2-.3.2-.5c-3.1-.6-5.3-2-5.3-3.8v3c0 1.8 2.4 3.3 5.7 3.8c-.2-.3-.4-.7-.6-1.1M17 18c-.6 0-1 .4-1 1s.4 1 1 1s1-.4 1-1s-.4-1-1-1m6 1c-.9 2.3-3.3 4-6 4s-5.1-1.7-6-4c.9-2.3 3.3-4 6-4s5.1 1.7 6 4m-3.5 0c0-1.4-1.1-2.5-2.5-2.5s-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5"
                      />
                    </svg>
                  </span>
                  <p className="text-[.95rem] text-white font-semibold">
                    View & Upload Data
                  </p>
                </a>
                <Link
                  to="/fw"
                  className="-translate-x-11 pl-12 flex flex-row justify-center items-center px-3 py-2 gap-2 bg-[#012150] rounded-full border-4 border-white z-20"
                >
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#b2bcca"
                        d="M12 12V3h-1a10 10 0 1 0 10 10v-1Z"
                      />
                      <path fill="#b2bcca" d="M14 10V1a9 9 0 0 1 9 9Z" />
                    </svg>
                  </span>
                </Link>
                <Link
                  to="/pro"
                  className="-translate-x-[5.4rem] pl-12 flex flex-row justify-center items-center px-3 py-2 gap-2 bg-[#012150] rounded-full border-4 border-white"
                >
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#b2bcca"
                        d="M15.86 4.39v15c0 1.67 1.14 2.61 2.39 2.61c1.14 0 2.39-.79 2.39-2.61V4.5c0-1.54-1.14-2.5-2.39-2.5s-2.39 1.06-2.39 2.39M9.61 12v7.39C9.61 21.07 10.77 22 12 22c1.14 0 2.39-.79 2.39-2.61v-7.28c0-1.54-1.14-2.5-2.39-2.5S9.61 10.67 9.61 12m-3.86 5.23c1.32 0 2.39 1.07 2.39 2.38a2.39 2.39 0 1 1-4.78 0c0-1.31 1.07-2.38 2.39-2.38"
                      />
                    </svg>
                  </span>
                </Link>
              </div>
              <div className="flex flex-row justify-center items-center gap-2 ml-[-100px]">
                <img src={img3} className="w-14" alt="" />
                <label className="font-semibold text-[1.25rem] text-[#012150]">
                  {" "}
                  Total Records :{" "}
                  <span id="Total_table_count">
                    {" "}
                    {filteredData.length}
                  </span>{" "}
                </label>
              </div>
              <div className="flex flex-row-reverse pr-2">
                <button
                 onClick={downloadExcel}
                  className="p-2 pointing"
                  id="download"
                  title="Data Download"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#4d7d0f"
                      fillRule="evenodd"
                      d="M1.25 12C1.25 6.063 6.063 1.25 12 1.25S22.75 6.063 22.75 12S17.937 22.75 12 22.75S1.25 17.937 1.25 12m7 5a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75m7.78-6.97l-3.5 3.5a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 1 1 1.06-1.06l2.22 2.22V6a.75.75 0 0 1 1.5 0v5.19l2.22-2.22a.75.75 0 1 1 1.06 1.06"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  className="p-2 pointing"
                  id="upload"
                  title="Data Upload"
                  onClick={handleButtonClick}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    id="fileInput"
                    accept=".xlsx, .xls ,.csv"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#c86434"
                      d="M11.025 18.475q.05.675.213 1.313T11.675 21q-1.075-.025-2.562-.25t-2.85-.7t-2.313-1.225T3 17v-2.5q0 .975.838 1.7t2.05 1.2t2.612.738t2.525.337m1.65-5q-.475.55-.825 1.175t-.55 1.325q-1.125-.05-2.562-.3t-2.713-.725t-2.15-1.2T3 12V9.5q0 1.1 1.025 1.863t2.45 1.237t2.963.688T12 13.5q.15 0 .313-.012t.362-.013M12 11q-3.75 0-6.375-1.175T3 7t2.625-2.825T12 3t6.375 1.175T21 7t-2.625 2.825T12 11m5.5 10h1v-4.1l1.8 1.8l.7-.7l-3-3l-3 3l.7.7l1.8-1.8zm.5 2q-2.075 0-3.537-1.463T13 18t1.463-3.537T18 13t3.538 1.463T23 18t-1.463 3.538T18 23"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row-start-2 row-end-3 col-start-1 col-end-2">
          <div className="w-full h-[85vh] p-4 flex justify-start items-center flex-col">
            {/* <!-- Table View of Data --> */}
            <div className="relative flex flex-col  border-2 border-black mini-shadow px-2 py-4 justify-center items-center w-full h-[90%] shadow-md rounded-lg">
              <div className="w-[99%] h-[96%] overflow-scroll" id="wrapper">
                <table
                  id="dataTable"
                  className="w-full text-left rtl:text-right"
                >
                  <thead className="rounded-full w-full text-white bg-[#012150] sticky top-0 ">
                    <tr>
                      {headers.map((header, index) => (
                        <th
                          key={index}
                          className="min-w-[15vw] text-white text-[1.12rem] px-4 py-2 border-r-2 border-white relative"
                        >
                          <div className="flex items-center justify-between gap-2 relative">
                            <span>{header}</span>
                            {header !== "Audio_Link" && getUniqueColumnValues(header).length > 0  && (
                              <div className="relative inline-block">
                                <button
                                  onClick={() => handleFilterClick(header)}
                                  className="hover:text-gray-300"
                                >
                                  {/* Filter Icon */}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      fill="#5976AA"
                                      fillOpacity="0"
                                      stroke="#ffffff"
                                      strokeDasharray="56"
                                      strokeDashoffset="56"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M5 4h14l-5 6.5v9.5l-4 -4v-5.5Z"
                                    >
                                      <animate
                                        fill="freeze"
                                        attributeName="fill-opacity"
                                        begin="0.6s"
                                        dur="0.15s"
                                        values="0;0.3"
                                      />
                                      <animate
                                        fill="freeze"
                                        attributeName="stroke-dashoffset"
                                        dur="0.6s"
                                        values="56;0"
                                      />
                                    </path>
                                  </svg>
                                </button>

                                {/* Dropdown */}
                                {activeFilter === header && (
                                  <div
                                    ref={dropdownRef}
                                    className="filter-dropdown" style={{display:"block"}}
                                  >
                                    {/* Search Input */}
                                    <input
                                      type="text"
                                      placeholder="Search..."
                                      value={searchTerm[header] || ""}
                                      onChange={(e) =>
                                        handleSearchChange(
                                          header,
                                          e.target.value
                                        )
                                      }
                                      className="mb-2 w-full px-2 py-1 rounded text-black border border-gray-300"
                                    />
                                    {getUniqueColumnValues(header).map(
                                      (value) => (
                                        
                                        <label
                                          key={value}
                                          className="block text-white whitespace-nowrap"
                                        >
                                          <input
                                            type="checkbox"
                                            checked={
                                              filters[header]?.includes(
                                                value
                                              ) || false
                                            }
                                            onChange={() =>
                                              handleCheckboxChange(
                                                header,
                                                value
                                              )
                                            }
                                            className="mr-1"
                                          />
                                          {value || "N/A"}
                                        </label>
                                      )
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {filteredData
                      .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )
                      .map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {headers.map((header, colIndex) => (
                            <td
                              key={colIndex}
                              className="min-w-[15vw] px-4 py-2 border-b-2 border-grey-600 text-black"
                            >
                              {header === "Audio_Link" ? (
                                row[header] ? (
                                  <audio controls className="w-full">
                                    <source
                                      src={row[header]}
                                      type="audio/mpeg"
                                    />
                                    Your browser does not support the audio
                                    element.
                                  </audio>
                                ) : (
                                  <span className="text-gray-400 italic">
                                    No Audio
                                  </span>
                                )
                              ) : (
                                row[header]
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
                {/* Pagination Controls */}
                <div className="flex items-center gap-4">
                  {/* Total Rows Info */}
                  <span className="text-sm text-gray-600">
                    Showing {paginatedData.length} of {filteredData.length} rows
                  </span>

                  {/* Pagination Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      disabled={currentPage === 1}
                    >
                      Prev
                    </button>

                    <span className="text-gray-700">
                      Page {currentPage} of{" "}
                      {Math.ceil(filteredData.length / itemsPerPage)}
                    </span>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(
                            prev + 1,
                            Math.ceil(filteredData.length / itemsPerPage)
                          )
                        )
                      }
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      disabled={
                        currentPage ===
                        Math.ceil(filteredData.length / itemsPerPage)
                      }
                    >
                      Next
                    </button>
                  </div>
                </div>
                {/* Reset Filters Button */}
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
                >
                  <XCircle className="w-5 h-5" />
                  <span>Reset Filters</span>
                </button>
              </div>

              {/* <div className="flex justify-end mb-4">
                    <button
                        onClick={resetFilters}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                        Reset Filters
                    </button>
                    </div> */}

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
