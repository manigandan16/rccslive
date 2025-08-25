import { Link } from "react-router-dom";
import img from "../assets/images/RBI.png";
import img2 from "../assets/images/HansaResearch.png";
import React, { useEffect, useState , useMemo } from "react";
import Select from 'react-select';
import axios from "axios";
import LineChart from "./LineChart";
import LineChart2 from "./LineChart2";
import LineChart3 from "./LineChart3";
import LineChart4 from "./LineChart4";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../utils/logout";

export default function Os() {

const [lineChartData1, setLineChartData1] = useState([]);
const [lineChartData2, setLineChartData2] = useState([]);

const [centresOptions, setCentresOptions] = useState([]);
const [genderOptions, setGenderOptions] = useState([]);
const [ageOptions, setAgeOptions] = useState([]);

const [selectedCentres, setSelectedCentres] = useState([]);
const [selectedGender, setSelectedGender] = useState([]);
const [selectedAge, setSelectedAge] = useState([]);

const [showGauge, setShowGauge] = useState(true);

// Fetch options
useEffect(() => {
  const fetchOptions = async () => {
    try {
      const [centresRes, genderRes, ageRes] = await Promise.all([
        axios.get("http://localhost:5000/centres"),
        axios.get("http://localhost:5000/gender"),
        axios.get("http://localhost:5000/age_range")
      ]);

      setCentresOptions(centresRes.data);
      setGenderOptions(genderRes.data);
      setAgeOptions(ageRes.data);
    } catch (err) {
      console.error("Error fetching options:", err);
    }
  };

  fetchOptions();
}, []);

// Fetch filtered data
// Fetch filtered data
useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        const centres = selectedCentres.map(opt => opt.value).join(',');
        const genders = selectedGender.map(opt => opt.value).join(',');
        const ages = selectedAge.map(opt => opt.value).join(',');
  
        const [res1, res2] = await Promise.all([
          axios.get("http://localhost:5000/linechart", {
            params: {
              question: 'Q3_1',  // 👈 ADD THIS
              centres,
              genders,
              ages
            }
          }),
          axios.get("http://localhost:5000/linechart2", {
            params: {
              question: 'Q3_2',  // 👈 ADD THIS
              centres,
              genders,
              ages
            }
          })
        ]);
  
        setLineChartData1(res1.data);
        setLineChartData2(res2.data);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      }
    };
  
    fetchFilteredData();
  }, [selectedCentres, selectedGender, selectedAge]);
  

// Extract data from linechart (for city, base, cnr)
const city = lineChartData1.map(d => d.city);
const base = lineChartData1?.[0]?.base ?? 0;
const base1 = lineChartData1.map(d => d.base);
const cnr = lineChartData1.map(d => d.current_net_responses);
const cip = lineChartData1.map(d => d.current_improve_percentage);
const csp = lineChartData1.map(d => d.current_same_percentage);
const cwp = lineChartData1.map(d => d.current_worsen_percentage);

// Extract data from linechart2 (for fnr)

const fip = lineChartData2.map(d => d.future_improve_percentage);
const fnr = lineChartData2.map(d => d.future_net_responses);
const fsp = lineChartData2.map(d => d.future_same_percentage);
const fwp = lineChartData2.map(d => d.future_worsen_percentage);

  // const city = [...new Set(data.map((item) => item.city))];
  // const cnr = data.map((item) => item.current_net_responses);

  const handleMultiSelectChange = (selectedOptions, setState) => {
    // If no options are selected, clear the selection
    if (!selectedOptions) {
      setState([]);
      return;
    }
  
    // Check if "All" is selected
    const isAllSelected = selectedOptions.some(opt => opt.value === "All");
  
    if (isAllSelected) {
      // If "All" is selected, set only "All" and clear others
      setState([{ label: "All", value: "All" }]);
    } else {
      // If "All" is not selected, remove "All" from the selection
      const filteredOptions = selectedOptions.filter(opt => opt.value !== "All");
      setState(filteredOptions);
    }
  };
  

  const handleCentresChange = (selected) => {
    handleMultiSelectChange(selected, setSelectedCentres);
  };
  
  const handleGenderChange = (selected) => {
    handleMultiSelectChange(selected, setSelectedGender);
  };
  
  const handleAgeChange = (selected) => {
    handleMultiSelectChange(selected, setSelectedAge);
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: '40px',
      maxHeight: '40px',
      overflow: 'hidden',
      flexWrap: 'nowrap', // important for preventing line wrap
    }),
    valueContainer: (base) => ({
      ...base,
      maxHeight: '40px',
      overflowY: 'auto',
      paddingTop: 0,
      paddingBottom: 0,
    }),
    multiValue: (base) => ({
      ...base,
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: '40px',
    }),
  };

  
  const navigate = useNavigate();
  
    const confirmLogout = () => {
      const confirmed = window.confirm("Are you sure you want to logout?");
      if (confirmed) {
        handleLogout(navigate);
      };
    };

    const sortedAgeOptions = [...ageOptions].sort((a, b) => {
      // Keep "All" at the top
      if (a.label === "All") return -1;
      if (b.label === "All") return 1;
    
      // Extract the starting number from the label
      const getStartNumber = (label) => parseInt(label.match(/\d+/)?.[0]);
    
      return getStartNumber(a.label) - getStartNumber(b.label);
    });

  
    const sortedCOptions = [...centresOptions].sort((a, b) => {
      // Keep "All" at the top
      if (a.label === "All") return -1;
      if (b.label === "All") return 1;

      return a.label.localeCompare(b.label);
      
    });

    const sortedGOptions = [...genderOptions].sort((a, b) => {
      // Keep "All" at the top
      if (a.label === "All") return -1;
      if (b.label === "All") return 1;

      return a.label.localeCompare(b.label);
      
    });


  return (
    <>
    <section className="relative font-Inria grid grid-cols-1 grid-rows-[20vh_70vh_10vh]">
          <div
            className="flex justify-evenly items-center flex-col w-full row-start-1 row-end-2 col-start-1 col-end-2"
          >
            {/* <!-- Header --> */}
            <header className="w-full flex flex-wrap">
              <div className="w-[25%] flex justify-center items-center">
                <img className="w-[75%] p-2" src={img} alt="logo" />
              </div>
              {/* <!-- Title --> */}
              <div className="w-[55%] flex justify-center items-center text-white">
                <p
                  className="text-[1.5rem] clrgrad rounded-full font-bold text-center py-3 w-full bg-[#c0860c]"
                >
                  Rural Consumer Confidence Survey (RCCS)
                </p>
              </div>
              {/* <!-- Hansa Logo --> */}
              <div className="w-[15%] flex justify-center items-center">
                <img className="w-2/4" src={img2} alt="" />
              </div>
              <div className="flex justify-center items-center pointing" id="logout" onClick={confirmLogout}>
                <span className="flex justify-center items-center">
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
                <div className="flex flex-row pl-6 py-1">
                  <Link
                    to="/rccs"
                    className="pr-12 flex flex-row justify-center items-center px-3 py-2 gap-2 bg-[#012150] rounded-full border-4 border-white"
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
                  <Link
                    to="/fw"
                    className="-translate-x-[2.55rem] pr-12 flex flex-row justify-center items-center px-3 py-2 gap-2 bg-[#012150] rounded-full border-4 border-white z-20"
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
                  <a
                    className="-translate-x-[5rem] flex flex-row justify-center items-center px-6 py-2 gap-2 bg-[#c0860c] rounded-full border-4 border-white z-30"
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#ffffff"
                          d="M15.86 4.39v15c0 1.67 1.14 2.61 2.39 2.61c1.14 0 2.39-.79 2.39-2.61V4.5c0-1.54-1.14-2.5-2.39-2.5s-2.39 1.06-2.39 2.39M9.61 12v7.39C9.61 21.07 10.77 22 12 22c1.14 0 2.39-.79 2.39-2.61v-7.28c0-1.54-1.14-2.5-2.39-2.5S9.61 10.67 9.61 12m-3.86 5.23c1.32 0 2.39 1.07 2.39 2.38a2.39 2.39 0 1 1-4.78 0c0-1.31 1.07-2.38 2.39-2.38"
                        />
                      </svg>
                    </span>
                    <p className="text-[0.95rem] text-white font-semibold">Analytics</p>
                  </a>
                </div>
                {/* <!-- Filters --> */}
                <div className="w-full flex justify-center items-center flex-row gap-4">
                <div className={`${showGauge ? "hidden" : ""} w-[24%] text-center flex justify-center items-center`}>
          <label className="pr-2 text-lg font-semibold text-[#012150] ml-[-100px]">Centres</label>
          <div className="w-3/4 rounded-md">
          <Select
          className="react-select-container"
          classNamePrefix="react-select"
          styles={customStyles}
  options={sortedCOptions}
  isMulti
  value={selectedCentres}
  onChange={handleCentresChange}
/>
          </div>
        </div>
    
        <div className="w-[24%] text-center flex justify-center items-center">
          <label className="pr-2 text-lg font-semibold text-[#012150] ml-[-100px]">Gender</label>
          <div className="w-3/4 rounded-md">
          <Select
          className="react-select-container"
          classNamePrefix="react-select"
          styles={customStyles}
  options={sortedGOptions}
  isMulti
  value={selectedGender}
  onChange={handleGenderChange}
/>
          </div>
        </div>
    
        <div className="w-[24%] text-center flex justify-center items-center">
          <label className="pr-2 text-lg font-semibold text-[#012150] ml-[-100px]">Age</label>
          <div className="w-3/4 rounded-md">
          <Select
          className="react-select-container"
          classNamePrefix="react-select"
          styles={customStyles}
  options={sortedAgeOptions}
  isMulti
  value={selectedAge}
  onChange={handleAgeChange}
/>
          </div>
        </div>
                </div>
                <div className="flex flex-row-reverse pr-2">
                  {/* <!-- Toggle --> */}
                  <label className="ground10">
                    <input className="input" type="checkbox" name="" id="Q_change" checked={!showGauge}
                    onChange={() => setShowGauge((prev) => !prev)} style={{visibility:"hidden"}}/>
                    <span className="interchange10">
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
                </div>
              </div>
            </div>
          </div>
    {/* <Select
      value={selectedOption}
      onChange={handleChange}
      options={options}
      isClearable
    /> */}
    <div className="row-start-2 row-end-[-2] col-start-1 col-end-[-1] mt-4">
        <div
          className="w-full h-full flex justify-evenly items-center flex-wrap flex-row"
        >
          <div id="table_contain" className={`${showGauge ? "hidden" : ""} w-full h-full`}>
            <div className="w-full h-full flex justify-center items-center">
              <div className="w-[90%] h-[90%] overflow-scroll">
                {/* <!-- Table --> */}
                <div className="w-full h-[90%]" id="wrapper">
                  <table
                    id="Table"
                    className="w-full bg-white text-sm text-left rtl:text-right"
                  >
                    <thead className="w-full text-white bg-white sticky top-0">
                      <tr className="border-2 border-white bg-[#012150]">
                        <th
                          className="min-w-[10vw] px-3 py-3 border-2 border-white text-center text-[1.25rem]"
                          rowSpan="2"
                        >
                          Centres
                        </th>
                        <th
                          className="min-w-[10vw] px-3 py-3 border-2 border-white text-center text-[1.25rem]"
                          rowSpan="2"
                        >
                          Base
                        </th>
                        <th
                          className="min-w-[10vw] px-3 py-3 border-2 border-white text-center text-[1.25rem]"
                          colSpan="4"
                        >
                          Current - Overall Spendings
                        </th>
                        <th
                          className="min-w-[10vw] px-3 py-3 border-2 border-white text-center text-[1.25rem]"
                          colSpan="4"
                        >
                          Future - Overall Spendings
                        </th>
                      </tr>
                      <tr className="border-2 border-white">
                        <th
                          className="min-w-[8vw] px-3 py-3 border-2 bg-[#fea296] text-[#012150] text-[1.1rem] text-center"
                        >
                          Improve
                        </th>
                        <th
                          className="min-w-[8vw] px-3 py-3 border-2 bg-[#fea296] text-[#012150] text-[1.1rem] text-center"
                        >
                          Same
                        </th>
                        <th
                          className="min-w-[8vw] px-3 py-3 border-2 bg-[#fea296] text-[#012150] text-[1.1rem] text-center"
                        >
                          Worsen
                        </th>
                        <th
                          className="min-w-[8vw] px-3 py-3 border-2 bg-[#fea296] text-[#012150] text-[1.1rem] text-center"
                        >
                          Net Responses
                        </th>
                        <th
                          className="min-w-[8vw] px-3 py-3 border-2 bg-[#fea296] text-[#012150] text-[1.1rem] text-center"
                        >
                          Improve
                        </th>
                        <th
                          className="min-w-[8vw] px-3 py-3 border-2 bg-[#fea296] text-[#012150] text-[1.1rem] text-center"
                        >
                          Same
                        </th>
                        <th
                          className="min-w-[8vw] px-3 py-3 border-2 bg-[#fea296] text-[#012150] text-[1.1rem] text-center"
                        >
                          Worsen
                        </th>
                        <th
                          className="min-w-[8vw] px-3 py-3 border-2 bg-[#fea296] text-[#012150] text-[1.1rem] text-center"
                        >
                          Net Responses
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                       
                        {city.map((item,index)=>(<tr key={index}
      className={`border-2 border-bordergrey ${
        index === 0 ? 'font-bold' : ''
      }`}>
                          <td className="min-w-[8vw] border-l-2 border-backgrey px-3 py-3 text-[0.95rem] text-black capitalize">{item}</td>  
                                        <td className="min-w-[8vw] border-l-2 border-backgrey px-3 py-3 text-center ">{base1[index]}</td>
                                        <td className="min-w-[8vw] border-l-2 border-backgrey px-3 py-3 text-center ">{cip[index]}%</td> 
                                        <td className="min-w-[8vw] border-l-2 border-backgrey px-3 py-3 text-center ">{csp[index]}%</td> 
                                        <td className="min-w-[8vw] border-l-2 border-backgrey px-3 py-3 text-center ">{cwp[index]}%</td> 
                                        <td className="min-w-[8vw] border-l-2 border-backgrey px-3 py-3 text-center ">{cnr[index]}%</td> 
                                        <td className="min-w-[8vw] border-l-2 border-backgrey px-3 py-3 text-center ">{fip[index]}%</td> 
                                        <td className="min-w-[8vw] border-l-2 border-backgrey px-3 py-3 text-center ">{fsp[index]}%</td> 
                                        <td className="min-w-[8vw] border-l-2 border-backgrey px-3 py-3 text-center ">{fwp[index]}%</td> 
                                        <td className="min-w-[8vw] border-l-2 border-backgrey px-3 py-3 text-center ">{fnr[index]}%</td></tr> ))}
                                         
                                    
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Switvh two --> */}

          <div id="chart_contain" className={`${!showGauge ? "hidden" : ""} w-full h-full`} checked={!showGauge}
                    onChange={() => setShowGauge((prev) => !prev)}>
            <div
              className="w-full h-full flex justify-evenly items-center flex-wrap flex-row gap-4 overflow-scroll"
            >
              {/* <!-- chart 1 --> */}
              <div
                className="h-[53vh] w-[48%] border border-black new_shadow rounded-md"
                id="chart" 
              >
                <div id="Line_1" style={{height: "100%"}}>
                <LineChart
                base = {base}
                city = {city}
                cnr = {cnr} 
                txt = {'Overall Spendings '}
                /></div> 
                
              </div>
              {/* <!-- chart 2 --> */}
              <div
                className="h-[53vh] w-[48%] border border-black new_shadow rounded-md"
                id="chart"
              >
                <div id="Line_2" style={{height: "100%"}}>
                <LineChart2
                base = {base}
                city = {city}
                fnr = {fnr} 
                txt = {'Overall Spendings '}
                />
                </div>
              </div>
              {/* <!-- chart 3 --> */}
              <div
                className="h-[53vh] w-[48%] border border-black new_shadow rounded-md"
                id="chart"
              >
                <div id="Line_3" style={{height: "100%"}}>
                <LineChart3
                base = {base}
                city = {city}
                cip = {cip}
                csp = {csp}
                cwp = {cwp} 
                txt = {'Overall Spendings '}
                l1 = {'Increase'}
                l2 = {'Remains Same'}
                l3 = {'Decrease'}
                />
                </div>
              </div>
              {/* <!-- chart 4 --> */}
              <div
                className="h-[53vh] w-[48%] border border-black new_shadow rounded-md"
                id="chart"
              >
                <div id="Line_4" style={{height: "100%"}}>
                <LineChart4
                base = {base}
                city = {city}
                fip = {fip}
                fsp = {fsp}
                fwp = {fwp} 
                txt = {'Overall Spendings '}
                l1 = {'Increase'}
                l2 = {'Remains Same'}
                l3 = {'Decrease'}
                />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 w-full">
                {/* <!-- Buttons to select --> */}
                <nav className="w-full flex justify-center items-center flex-wrap  bg-[#012150] py-2 px-2">
                    <Link to="/pro" className="text-white text-[0.95rem] font-semibold px-3 py-1 border-r-2 border-white bg-[#012150] ">
                        Profile Of Respondents 
                    </Link>
                    <Link to="/ge" className="text-white text-[0.95rem] font-semibold px-3 py-1 border-r-2 bg-[#012150] ">
                        General Economic
                    </Link>
                    <Link to="/ee" className="text-white text-[0.95rem] font-semibold px-3 py-1 bg-[#012150] border-r-2">
                        Employment Economic
                    </Link>
                    <Link to="/pe" className="text-white text-[0.95rem] font-semibold px-3 py-1 bg-[#012150] border-r-2">
                        Price Economic
                    </Link>
                    <Link to="/ie" className="text-white text-[0.95rem] font-semibold px-3 py-1 bg-[#012150] ">
                        Income Economic
                    </Link>
                    <Link to="/os" className="text-white  text-[0.95rem] font-semibold px-3 py-2 border-4 border-white bg-[#c0860c] rounded-full -translate-y-7">
                        Overall Spending
                    </Link>
                    <Link to="/es" className="text-white text-[0.95rem] font-semibold px-3 py-1 border-r-2 border-white bg-[#012150] ">
                        Essential Spending
                    </Link>
                    <Link to="/nes" className="text-white text-[0.95rem] font-semibold px-3 py-1 border-r-2 border-white bg-[#012150] ">
                        Non Essential Spending
                    </Link>
                    <Link to="/ies" className="text-white text-[0.95rem] font-semibold px-3 py-1  bg-[#012150] ">
                        Inflation Expectations
                    </Link>
                </nav>
            </div>
      </section>
    </>
    
  );
}
