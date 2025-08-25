import { Link } from "react-router-dom";
import img from "../assets/images/RBI.png";
import img2 from "../assets/images/HansaResearch.png";
import img3 from "../assets/images/table rccs.gif";
import img4 from "../assets/images/Arrow 2.svg";
import img5 from "../assets/images/Arrow 1.svg";
import img6 from "../assets/images/roc.jpg";
import img7 from "../assets/images/sheet.jpg";
import img8 from "../assets/images/cali.jpg";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../utils/logout";

export default function Fw() {
  const [data, setData] = useState([]);

  const [showGauge, setShowGauge] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/get-datafw")
      .then((response) => {
        if (response.data.length > 0) {
          //   setHeaders(Object.keys(response.data[0]));
          setData(response.data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const base = data?.[0]?.TotalAchievedCount ?? 0;

  //   const base = 100;
  const centres = [...new Set(data.map((item) => item.Centre))];
  const targetpercentage = data.map((item) => item.TargetAchievedPercentage);
  const pendingpercentage = data.map((item) => item.PendingPercentage);
  const target = data?.[0]?.TotalTargetCount ?? 0;
  const completed = data?.[0]?.TotalAchievedCount ?? 0;
  const overallAchievedPercentage = data?.[0]?.OverallPercentage ?? 0;
  const remainingAp = 100 - overallAchievedPercentage;

  const [selectedCenters, setSelectedCenters] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [uniqueCenters, setUniqueCenters] = useState([]);

  useEffect(() => {
    const centers = [...new Set(data.map((item) => item.Centre))];
    setUniqueCenters(centers);
  }, [data]);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const gaugeOptions = {
    series: [
      {
        type: "pie",
        radius: ["100%", "70%"],
        center: ["50%", "80%"],
        avoidLabelOverlap: false,
        padAngle: 2,
        color: ["#012150", "#d9d9d9"],
        startAngle: 180,
        endAngle: 360,
        itemStyle: { borderRadius: 6 },
        label: {
          show: true,
          position: "center",
          fontSize: 16,
          fontWeight: "bold",
          formatter: `Overall\n${overallAchievedPercentage}%`,
        },
        data: [
          { value: overallAchievedPercentage, name: "Completed" },
          { value: remainingAp, name: "Target" },
        ],
      },
    ],
  };

  const filteredData =
    selectedCenters.length > 0
      ? data.filter((item) => selectedCenters.includes(item.Centre))
      : data;

  const lineOptions = {
    title: {
      text: `(n=${base})`,
      top: "3%",
      right: "5%",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: function (params) {
        let tooltipText = `${params[0].name}<br/>`;
        params.forEach((item) => {
          tooltipText += `${item.marker} ${item.seriesName}: ${item.value}%<br/>`;
        });
        return tooltipText;
      },
    },
    legend: { left: "center", top: "5%" },
    grid: {
      left: "3%",
      right: "4%",
      top: "15%",
      bottom: "0%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: centres,
      axisLabel: { rotate: 40, color: "black", fontSize: 12 },
    },
    yAxis: { type: "value", axisLabel: { color: "black", fontSize: 12 } },
    series: [
      {
        name: "Achieved",
        type: "bar",
        stack: "total",
        color: "#238823",
        label: { show: true, formatter: "{c}%" },
        data: targetpercentage,
      },
      {
        name: "Pending",
        type: "bar",
        stack: "total",
        color: "#D2222D",
        label: { show: true, formatter: "{c}%" },
        data: pendingpercentage,
      },
    ],
  };

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
          {/* <!-- nav bar --> */}
          <div className="w-full bg-white">
            <div className="flex justify-between items-center">
              <div className="flex flex-row w-2/6 pl-6 py-1 ">
                <Link
                  to="/rccs"
                  className=" pr-12 flex flex-row justify-center items-center px-3 py-2 gap-2 bg-[#012150] rounded-full border-4 border-white z-20"
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
                        d="M4 12V9c0 2.2 3.6 4 8 4s8-1.8 8-4v3c0 .5-.2.9-.5 1.4c-.8-.3-1.6-.4-2.5-.4c-2.5 0-4.9 1.1-6.4 2.9C6.8 15.6 4 14 4 12m8-1c4.4 0 8-1.8 8-4s-3.6-4-8-4s-8 1.8-8 4s3.6 4 8 4m-2.9 8.7l-.3-.7l.3-.7c.1-.2.2-.3.2-.5c-3.1-.6-5.3-2-5.3-3.8v3c0 1.8 2.4 3.3 5.7 3.8c-.2-.3-.4-.7-.6-1.1M17 18c-.6 0-1 .4-1 1s.4 1 1 1s1-.4 1-1s-.4-1-1-1m6 1c-.9 2.3-3.3 4-6 4s-5.1-1.7-6-4c.9-2.3 3.3-4 6-4s5.1 1.7 6 4m-3.5 0c0-1.4-1.1-2.5-2.5-2.5s-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5"
                      />
                    </svg>
                  </span>
                </Link>
                <a className="-translate-x-11 flex flex-row justify-center items-center px-3 py-2 gap-2 bg-[#c0860c] rounded-full border-4 border-white z-30">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path fill="#fff" d="M12 12V3h-1a10 10 0 1 0 10 10v-1Z" />
                      <path fill="#fff" d="M14 10V1a9 9 0 0 1 9 9Z" />
                    </svg>
                  </span>
                  <p className="text-[0.95rem] text-white font-semibold">
                    Field Work
                  </p>
                </a>
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
              {/* <!-- Buttons to select --> */}
              <div className="w-2/6 flex justify-center items-center flex-row gap-[2rem] py-3">
                <div className="p-2 glit rounded-3xl">
                  <a
                    href="#"
                    className="text-white text-[1.2rem] font-semibold px-3 py-1 border-[#c0860c] border-glit bg-transparent rounded-md"
                  >
                    Field Work Status{" "}
                  </a>
                </div>
                <div className="px-1 py-2 glit rounded-3xl">
                  <Link
                    to="/uid"
                    className="text-[#012150] text-[1.2rem] font-semibold px-5 py-1 rounded-[1.1rem] border-white border-2 bg-white"
                  >
                    UID Data
                  </Link>
                </div>
              </div>
              <div className="w-2/6 flex flex-row-reverse pr-2">
                <label className="ground">
                  <input
                    className="input"
                    type="checkbox"
                    name=""
                    id="Q_change"
                    checked={!showGauge}
                    onChange={() => setShowGauge((prev) => !prev)}
                  />
                  <span className="interchange">
                    <span className="z-30 lefite">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill="#fff"
                          d="M1.364 5.138v12.02h17.272V5.138zM.909 1.5h18.182c.502 0 .909.4.909.895v15.21a.9.9 0 0 1-.91.895H.91c-.503 0-.91-.4-.91-.895V2.395C0 1.9.407 1.5.91 1.5m5.227 1.759c0-.37.306-.671.682-.671s.682.3.682.671v13.899c0 .37-.305.67-.682.67a.676.676 0 0 1-.682-.67zm6.96-.64c.377 0 .682.3.682.67v4.995h4.91c.377 0 .683.301.683.672c0 .37-.306.671-.682.671l-4.911-.001v3.062h5.002c.377 0 .682.3.682.671c0 .37-.305.671-.682.671h-5.002v3.158a.676.676 0 0 1-.682.671a.676.676 0 0 1-.681-.67l-.001-3.159H1.001a.676.676 0 0 1-.682-.67c0-.371.305-.672.682-.672h11.413V9.626L.909 9.627a.676.676 0 0 1-.682-.671c0-.37.306-.671.682-.671l11.505-.001V3.289c0-.37.306-.67.682-.67"
                        />
                      </svg>
                    </span>
                    <span className="z-30 rightie">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#fff"
                          d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M9 17H7v-7h2zm4 0h-2V7h2zm4 0h-2v-4h2z"
                        />
                      </svg>
                    </span>
                  </span>
                </label>
                <div className="w-[23%] text-center flex justify-center items-center">
                  <span
                    className="w-1/4 text-lg font-medium text-[#012150]"
                    id="base"
                  >
                    &nbsp;
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row-start-2 row-end-[-1] col-start-1 col-end-[-1]">
          <div className="w-full h-full flex justify-center items-center flex-col ">
            {/* <!-- Switch one --> */}
            <div
              id="switch_1"
              className={`${!showGauge ? "hidden" : ""} w-full h-[97%]`}
            >
              {/* {console.log(base1)} */}

              <div className="w-full h-full  flex flex-col bg-white  justify-center items-center gap-4">
                <div className="w-full h-[40%] flex flex-row justify-center items-center">
                  <div className="w-[90%] flex items-center">
                    {/* <!-- chart and tabs --> */}
                    <div className="w-[65%] h-full flex flex-col justify-center items-center gap-4 ml-10">
                      <div className="w-full text-center text-[1.35rem] font-semibold flex flex-row justify-center items-center gap-4">
                        <img src={img4} alt="" className="w-[28%]" />
                        <p className="2/6 text-TabTxt">
                          Field Work Round - 2025
                        </p>
                        <img src={img5} alt="" className="w-[28%]" />
                      </div>
                      <div className="w-full flex flex-row justify-evenly items-center gap-4">
                        {/* <!-- tab1 --> */}
                        <div className="w-[20%] h-full rounded-lg p-1 flex flex-col justify-center items-center bg-white fwr_shadow border-b-[10px] border-[#4d6b9f]">
                          <div className="flex justify-center items-center">
                            <img className="w-[70%]" src={img6} alt="" />
                          </div>
                          <div className="flex flex-col justify-center items-center text-white">
                            <p className="py-[0.2rem] text-[#4d6b9f] text-[1.05rem] font-semibold">
                              Start of Field Work
                            </p>
                            <p className="py-[0.2rem] text-[#012150] text-[1.05rem] font-semibold">
                              <span>
                                02<sup>nd</sup>Jan 2025
                              </span>
                            </p>
                          </div>
                        </div>
                        {/* <!-- tab 2 --> */}
                        <div className="w-[20%] h-full rounded-lg p-1 flex flex-col justify-center items-center bg-white fwr_shadow border-b-[10px] border-[#578a15]">
                          <div className="flex justify-center items-center">
                            <img className="w-[70%]" src={img7} alt="" />
                          </div>
                          <div className="flex flex-col justify-center items-center text-white">
                            <p className="py-[0.2rem] text-[#578a15] text-[1.05rem] font-semibold">
                              End of Field Work
                            </p>
                            <p className="py-[0.2rem] text-[#012150] text-[1.05rem] font-semibold">
                              <span>
                                02<sup>nd</sup>Jan 2025
                              </span>
                            </p>
                          </div>
                        </div>
                        {/* <!-- tab 3 --> */}
                        <div className="w-[20%] h-full rounded-lg p-1 flex flex-col justify-center items-center bg-white fwr_shadow border-b-[10px] border-[#d57c53]">
                          <div className="flex justify-center items-center">
                            <img className="w-[70%]" src={img8} alt="" />
                          </div>
                          <div className="flex flex-col justify-center items-center text-white">
                            <p className="py-[0.2rem] text-[#d57c53] text-[1.05rem] font-semibold">
                              Date of Report
                            </p>
                            <p className="py-[0.2rem] text-[#012150] text-[1.05rem] font-semibold">
                              <span>
                                02<sup>nd</sup>Jan 2025
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <!-- Gauge chart  --> */}
                    <div className="w-[35%]">
                      <div className="w-full h-[28vh]" id="chart">
                        {/* <div id="Gauge1" style={{height: '100%'}}></div> */}
                        <ReactECharts
                          option={gaugeOptions}
                          style={{ height: "100%" }}
                        />
                      </div>
                      <div className="flex flex-row justify-center items-center gap-2">
                        <span className="bg-[#D9D9D9] rounded-lg p-1 pt-1">
                          <span className="text-[#292929] text-xs px-1 font-semibold">
                            Target
                          </span>
                          <span
                            id="target"
                            className="text-[#292929] text-lg font-bold"
                          >
                            {target}
                          </span>
                        </span>
                        <span className="bg-[#012150] rounded-lg p-1 pt-1">
                          <span className="text-white text-xs px-1 font-semibold">
                            Completed
                          </span>
                          <span
                            id="completed"
                            className="text-white text-lg font-bold"
                          >
                            {completed}
                          </span>
                        </span>
                      </div>
                    </div>
                    {/* <GaugeChart /> */}
                  </div>
                </div>
                <div className="w-full h-[60%] flex justify-center items-center">
                  {/* <!-- Table --> */}
                  {/* filter icon , filter dropdown */}
                  {/* <div  ref={dropdownRef}
                    className="w-[80%] h-[96%]  overflow-scroll"
                    id="wrapper"
                  >
                    <table
                      id="fwTable"
                      className="w-full text-sm text-left rtl:text-right  "
                    >
                      <thead className="rounded-full w-full text-white bg-[#012150] sticky top-0">
                        <tr className="border-2 border-white">
                          <th className="min-w-[20vw] px-3 py-3 border-2 border-white relative">
                            {" "}
                            Centres
                            <span 
                              className="absolute top-1/2 transform -translate-y-1/2 right-2"
                              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                              id="filterButton"
                            >
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
                            </span>
                            
                            <div
                              id="filterDropdown"
                              className="hidden absolute z-10 bg-[#012150] border border-gray-300 rounded shadow-md w-48 p-2"

                            >
                              <div
                                id="filterOptions"
                                className="max-h-40 overflow-y-auto"
                              ></div>
                              <button
                                id="clearFilters"
                                className="mt-2 w-full text-white bg-red-500 px-3 py-1 rounded"
                              >
                                Clear Filters
                              </button>
                            </div>
                          </th>
                          <th className="min-w-[10vw] px-3 py-3 border-2 border-white text-center  ">
                            Target
                          </th>
                          <th className="min-w-[10vw] px-3 py-3 border-2 border-white text-center ">
                            Achieved
                          </th>
                          <th className="min-w-[10vw] px-3 py-3 border-2 border-white text-center ">
                            Target Achieved %
                          </th>
                          <th className="min-w-[10vw] px-3 py-3 border-2 border-white text-center ">
                            Pending %
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((item, index) => (
                          <tr
                            key={index}
                            className="border-2 border-bordergrey border-dotted"
                          >
                            <td className="min-w-[10vw] border-l-2 border-dotted border-black px-3 py-3 text-[0.95rem] text-black Capitalize">
                              {item.Centre}
                            </td>
                            <td className="10vw] border-l-2 border-dotted border-black px-3 py-3 text-center">
                              {item.Target}
                            </td>
                            <td className="10vw] border-l-2 border-dotted border-black px-3 py-3 text-center">
                              {item.Achieved}
                            </td>
                            <td className="10vw] border-l-2 border-dotted border-black px-3 py-3 text-center">
                              {item.TargetAchievedPercentage}
                            </td>
                            <td className="10vw] border-l-2 border-dotted border-black px-3 py-3 text-center">
                              {item.PendingPercentage}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div> */}
                  <div
                    ref={dropdownRef}
                    className="w-[80%] h-[96%] overflow-scroll"
                    id="wrapper"
                  >
                    <table
                      id="fwTable"
                      className="w-full text-sm text-left rtl:text-right"
                    >
                      <thead className="rounded-full w-full text-white bg-[#012150] sticky top-0">
                        <tr className="border-2 border-white">
                          <th className="min-w-[20vw] px-3 py-3 border-2 border-white relative">
                            Centres
                            <span
                              className="absolute top-1/2 transform -translate-y-1/2 right-2 cursor-pointer"
                              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
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
                            </span>
                            {isDropdownOpen && (
                              <div
                                ref={dropdownRef}
                                className="absolute z-10 bg-[#012150] border border-gray-300 rounded shadow-md w-48 p-2"
                              >
                                <div className="max-h-40 overflow-y-auto">
                                  {uniqueCenters.map((center) => (
                                    <label
                                      key={center}
                                      className="flex items-center text-white space-x-2"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={selectedCenters.includes(
                                          center
                                        )}
                                        onChange={() => {
                                          setSelectedCenters((prev) =>
                                            prev.includes(center)
                                              ? prev.filter((c) => c !== center)
                                              : [...prev, center]
                                          );
                                        }}
                                      />
                                      <span>{center}</span>
                                    </label>
                                  ))}
                                </div>
                                <button
                                  onClick={() => setSelectedCenters([])}
                                  className="mt-2 w-full text-white bg-red-500 px-3 py-1 rounded"
                                >
                                  Clear Filters
                                </button>
                              </div>
                            )}
                          </th>
                          <th className="min-w-[10vw] px-3 py-3 border-2 border-white text-center">
                            Target
                          </th>
                          <th className="min-w-[10vw] px-3 py-3 border-2 border-white text-center">
                            Achieved
                          </th>
                          <th className="min-w-[10vw] px-3 py-3 border-2 border-white text-center">
                            Target Achieved %
                          </th>
                          <th className="min-w-[10vw] px-3 py-3 border-2 border-white text-center">
                            Pending %
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((item, index) => (
                          <tr
                            key={index}
                            className="border-2 border-bordergrey border-dotted"
                          >
                            <td className="min-w-[10vw] border-l-2 border-dotted border-black px-3 py-3 text-[0.95rem] text-black capitalize">
                              {item.Centre}
                            </td>
                            <td className="10vw border-l-2 border-dotted border-black px-3 py-3 text-center">
                              {item.Target}
                            </td>
                            <td className="10vw border-l-2 border-dotted border-black px-3 py-3 text-center">
                              {item.Achieved}
                            </td>
                            <td className="10vw border-l-2 border-dotted border-black px-3 py-3 text-center">
                              {item.TargetAchievedPercentage}
                            </td>
                            <td className="10vw border-l-2 border-dotted border-black px-3 py-3 text-center">
                              {item.PendingPercentage}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- Switvh two --> */}

            <div
              id="switch_2"
              className={`${showGauge ? "hidden" : ""} w-full h-[97%]`}
            >
              <div className="w-full h-full flex flex-col bg-white p-2 justify-center items-center">
                <div className="w-[98%] h-[96%] flex justify-center items-center rounded-md">
                  <div className="w-full h-[60vh]">
                    <ReactECharts
                      option={lineOptions}
                      style={{ height: "100%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
