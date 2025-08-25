import { Link } from "react-router-dom";
import img from "../assets/images/RBI.png";
import img2 from "../assets/images/HansaResearch.png";
import img3 from "../assets/images/gandhi.png";
import img4 from "../assets/images/male female.png";
import img5 from "../assets/images/AgeGroup.png";
import img6 from "../assets/images/Education.png";
import img7 from "../assets/images/checck.png";
import img8 from "../assets/images/rupee.png";
import img9 from "../assets/images/hat.png";
import img10 from "../assets/images/RupeeHand.png";
import img11 from "../assets/images/income.png";
import img12 from "../assets/images/citis of india.png";
import React, { useEffect, useState , useMemo } from "react";
import Select from 'react-select';
import axios from "axios";
import Ochart from "./Ochart";
import Ichart from "./Ichart";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../utils/logout";


export default function Pro() {

const [genderData1, setGenderData] = useState([]);
const [agedata , setAgeData] = useState([]);
const [edudata , setEduData] = useState([]);
const [famdata , setFamData] = useState([]);
const [occdata , setOccData] = useState([]);
const [incdata , setIncdata] = useState([]);
const [basedata , setBaseData] = useState([]);
const [wedata , setWeData] = useState([]);
// const [lineChartData2, setLineChartData2] = useState([]);

const [centresOptions, setCentresOptions] = useState([]);
const [genderOptions, setGenderOptions] = useState([]);
const [ageOptions, setAgeOptions] = useState([]);

const [selectedCentres, setSelectedCentres] = useState([]);
const [selectedGender, setSelectedGender] = useState([]);
const [selectedAge, setSelectedAge] = useState([]);

const [showGauge, setShowGauge] = useState(true);

// useEffect(() => {
//   const fetchFilteredData = async () => {
//     try {
//       const centres = selectedCentres.map(opt => opt.value).join(',');
//       const genders = selectedGender.map(opt => opt.value).join(',');
//       const ages = selectedAge.map(opt => opt.value).join(',');

//       const [res1, res2] = await Promise.all([
//         axios.get("http://localhost:5000/linechart", {
//           params: {
//             question: 'q1_1',  // 👈 ADD THIS
//             centres,
//             genders,
//             ages
//           }
//         }),
//         axios.get("http://localhost:5000/linechart2", {
//           params: {
//             question: 'q1_2',  // 👈 ADD THIS
//             centres,
//             genders,
//             ages
//           }
//         })
//       ]);

//       setLineChartData1(res1.data);
//       setLineChartData2(res2.data);
//     } catch (error) {
//       console.error("Error fetching filtered data:", error);
//     }
//   };

//   fetchFilteredData();
// }, [selectedCentres, selectedGender, selectedAge]);

useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        const centres = selectedCentres.map(opt => opt.value).join(',');
        const genders = selectedGender.map(opt => opt.value).join(',');
        const ages = selectedAge.map(opt => opt.value).join(',');
  
        const [res1, res2 , res3 , res4 , res5 , res6 , res7, res8] = await Promise.all([
          axios.get("http://localhost:5000/pro1", {
            params: { centres, genders, ages }
          }),
          axios.get("http://localhost:5000/pro2", {
            params: { centres, genders, ages }
          }),
          axios.get("http://localhost:5000/pro3", {
            params: { centres, genders, ages }
          }),
          axios.get("http://localhost:5000/pro4", {
            params: { centres, genders, ages }
          }),
          axios.get("http://localhost:5000/pro5", {
            params: { centres, genders, ages }
          }),
          axios.get("http://localhost:5000/pro6", {
            params: { centres, genders, ages }
          }),
          axios.get("http://localhost:5000/pro7", {
            params: { centres, genders, ages }
          }),
          axios.get("http://localhost:5000/pro8", {
            params: { centres, genders, ages }
          })
        ]);
  
        setGenderData(res1.data);
        setAgeData(res2.data); // Uncomment and use if needed
        setEduData(res3.data);
        setFamData(res4.data);
        setOccData(res5.data);
        setIncdata(res6.data);
        setBaseData(res7.data);
        setWeData(res8.data);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      }
    };
  
    fetchFilteredData();
  }, [selectedCentres, selectedGender, selectedAge]);
  
  
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


const male_p = Number(genderData1?.Male?.Gender_Percentage ?? 0);
const male_c = Number(genderData1?.Male?.Gender_Count ?? 0);

const female_p = Number(genderData1?.Female?.Gender_Percentage ?? 0) ;
const female_c = Number(genderData1?.Female?.Gender_Count ?? 0);

const age1 = Number(agedata?.['21 TO 29 YEARS']?.Age_Range_Percentage ?? 0);
const age1_c = Number(agedata?.['21 TO 29 YEARS']?.Age_Range_Count ?? 0);

const age2 = Number(agedata?.['30 TO 39 YEARS']?.Age_Range_Percentage ?? 0);
const age2_c = Number(agedata?.['30 TO 39 YEARS']?.Age_Range_Count ?? 0);

const age3 = Number(agedata?.['40 TO 59 YEARS']?.Age_Range_Percentage ?? 0);
const age3_c = Number(agedata?.['40 TO 59 YEARS']?.Age_Range_Count ?? 0);

const age4 = Number(agedata?.['60 YEARS AND ABOVE']?.Age_Range_Percentage ?? 0);
const age4_c = Number(agedata?.['60 YEARS AND ABOVE']?.Age_Range_Count ?? 0);

const std1 = Number(edudata?.['5TH STD - BELOW 10TH STD']?.Edu_Quali_Percentage ?? 0);
const std1_c = Number(edudata?.['5TH STD - BELOW 10TH STD']?.Edu_Quali_Count ?? 0);

const std2 = Number(edudata?.['10TH STD - BELOW 12TH STD']?.Edu_Quali_Percentage ?? 0);
const std2_c = Number(edudata?.['10TH STD - BELOW 12TH STD']?.Edu_Quali_Count ?? 0);

const std3 = Number(edudata?.['12TH STD']?.Edu_Quali_Percentage ?? 0);
const std3_c = Number(edudata?.['12TH STD']?.Edu_Quali_Count ?? 0);

const std4 = Number(edudata?.['BELOW 5TH STD']?.Edu_Quali_Percentage ?? 0);
const std4_c = Number(edudata?.['BELOW 5TH STD']?.Edu_Quali_Count ?? 0);

const std5 = Number(edudata?.['GRADUATE']?.Edu_Quali_Percentage ?? 0);
const std5_c = Number(edudata?.['GRADUATE']?.Edu_Quali_Count ?? 0);

const std6 = Number(edudata?.['ILLITERATE']?.Edu_Quali_Percentage ?? 0);
const std6_c = Number(edudata?.['ILLITERATE']?.Edu_Quali_Count ?? 0);

const std7 = Number(edudata?.['POST GRADUATE & ABOVE']?.Edu_Quali_Percentage ?? 0);
const std7_c = Number(edudata?.['POST GRADUATE & ABOVE']?.Edu_Quali_Count ?? 0);

const f1 = Number(famdata?.['1 or 2']?.Fam_Percentage ?? 0);
const f2 = Number(famdata?.['3 or 4']?.Fam_Percentage ?? 0);
const f3 = Number(famdata?.['5 and more']?.Fam_Percentage ?? 0);

const olabel = occdata.map(d => d.Occ);
const oper = occdata.map(d=> d.Occ_Percentage);

const o1 = Number(occdata?.[0]?.Occ_Percentage ?? 0);
const o1_c = Number(occdata?.[0]?.Occ_Count ?? 0);

const o2 = Number(occdata?.[1]?.Occ_Percentage ?? 0);
const o2_c = Number(occdata?.[1]?.Occ_Count ?? 0);

const o3 = Number(occdata?.[2]?.Occ_Percentage ?? 0);
const o3_c = Number(occdata?.[2]?.Occ_Count ?? 0);

const o4 = Number(occdata?.[3]?.Occ_Percentage ?? 0);
const o4_c = Number(occdata?.[3]?.Occ_Count ?? 0);

const o5 = Number(occdata?.[4]?.Occ_Percentage ?? 0);
const o5_c = Number(occdata?.[4]?.Occ_Count ?? 0);

const o6 = Number(occdata?.[5]?.Occ_Percentage ?? 0);
const o6_c = Number(occdata?.[5]?.Occ_Count ?? 0);

const i1 = Number(incdata?.[0]?.value ?? 0);
const i1_c = Number(incdata?.[0]?.count ?? 0);

const i2 = Number(incdata?.[1]?.value ?? 0);
const i2_c = Number(incdata?.[1]?.count ?? 0);

const i3 = Number(incdata?.[2]?.value ?? 0);
const i3_c = Number(incdata?.[2]?.count ?? 0);

const i4 = Number(incdata?.[3]?.value ?? 0);
const i4_c = Number(incdata?.[3]?.count ?? 0);

const i5 = Number(incdata?.[4]?.value ?? 0);
const i5_c = Number(incdata?.[4]?.count ?? 0);

const i6 = Number(incdata?.[5]?.value ?? 0);
const i6_c = Number(incdata?.[5]?.count ?? 0);

const base = Number(basedata?.[0]?.total_count ?? 0);
const base_p = (base / base) * 100;

const we = Number(wedata?.[0]?.Average ?? 0);

const ilabel = incdata;

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

    const sortedGOptions = [...genderOptions].sort((a,b) => {
      if (a.label === "All") return -1;
      if (b.label === "All") return 1;

      return a.label.localeCompare(b.label);
    })
   


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
                <div className="w-[24%] text-center flex justify-center items-center">
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

        <div className={`${showGauge ? "" : "hidden"} w-[23%] text-center flex justify-center items-center`} >
                        <span class="w-1/4 text-lg font-medium text-[#012150]" id="base">n={base}</span>   
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

<div className="w-[65%] h-[90%] overflow-scroll">
    {/* <!-- Table --> */}
    <div className="w-full h-[90%]" id="wrapper">

        <table id="Table" className="w-full bg-white text-sm text-left rtl:text-right">
            <thead className=" text-white bg-white sticky top-0">
                <tr className="border-2 border-white bg-[#012150]">
                    <th className=" px-3 py-3 border-2 border-white text-center text-[1.25rem] min-w-[15w]"
                        >Type of Respondent</th>
                    <th className=" px-3 py-3 border-2 border-white text-center text-[1.25rem] min-w-[15w]"
                        >No. of Interviews</th>
                    <th className=" px-3 py-3 border-2 border-white text-center text-[1.25rem] min-w-[15w]"
                        >Proportion</th>
                </tr>
            </thead>
            <tbody>
                <tr className="border-2 border-[#838281]/30 bg-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 font-semibold text-lg px-3 py-1 " >Gender</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1 font-semibold text-center" id="tbase">{base}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1 font-semibold text-center" id="tpro">{base_p}%</td>
                </tr>
                <tr className="border-2 border-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 ">Female</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="female_c">{female_c}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="female_p">{female_p}%</td>
                </tr>
                <tr className="border-2 border-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 ">Male</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="male_c">{male_c}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="male_p">{male_p}%</td>
                </tr>
                <tr className="border-2 border-[#838281]/30 bg-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 font-semibold text-lg px-3 py-1" >Age Group</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1 font-semibold text-center" id="tbase2">{base}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1 font-semibold text-center" id="tpro2">{base_p}%</td>
                </tr>
                <tr className="border-2 border-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 ">21 - 29 Years</td>
                    {/* <!-- <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 " >400</td> --> */}
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="21_c">{age1_c}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="21_p">{age1}%</td>
                </tr>
                <tr className="border-2 border-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 ">30 - 39 Years</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="30_c">{age2_c}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="30_p">{age2}%</td>
                </tr>
                <tr className="border-2 border-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 ">40 - 59 Years</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="40_c">{age3_c}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="40_p">{age3}%</td>
                </tr>
                <tr className="border-2 border-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 ">60 & above Years</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="59_c">{age4_c}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="59_p">{age4}%</td>
                </tr>
                <tr className="border-2 border-[#838281]/30 bg-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 font-semibold text-lg px-3 py-1 " >Education</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1 font-semibold text-center" id="tbase3">{base}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1 font-semibold text-center" id="tpro3">{base_p}%</td>
                </tr>
                <tr className="border-2 border-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 ">Illiterate</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="illiterate_c">{std6_c}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="illiterate_p">{std6}%</td>
                </tr>
                <tr className="border-2 border-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 ">Below 5<sup>th</sup> std</td>
                <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="belowfive_c">{std4_c}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="belowfive_p">{std4}%</td>
                </tr>
                <tr className="border-2 border-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 ">5<sup>th</sup> Std - Below 10<sup>th</sup> std</td>
                <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="belowfive_c">{std1_c}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="belowfive_p">{std1}%</td>
                </tr>
                <tr className="border-2 border-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 ">10<sup>th</sup> Std - Below 12<sup>th</sup> std</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="tentotwelve_c">{std2_c}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="tentotwelve_p">{std2}%</td>
                </tr>
                <tr className="border-2 border-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 "> 12<sup>th</sup> std</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="twelve_c">{std3_c}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="twelve_p">{std3}%</td>
                </tr>
                <tr className="border-2 border-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 "> Graduate</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="grad_c">{std5_c}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="grad_p">{std5}%</td>
                </tr>
                <tr className="border-2 border-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 "> Post Graduate & above</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="gradabove_c">{std7_c}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="gradabove_p">{std7}%</td>
                </tr>
                <tr className="border-2 border-[#838281]/30 bg-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 font-semibold text-lg px-3 py-1" >Occupation</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1 font-semibold text-center" id="tbase1">{base}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1 font-semibold text-center" id="tpro1">{base_p}%</td>
                </tr>
                    {/* <!-- <tr className="border-2 border-[#838281]/30">
                        <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 ">Land owning farmers</td>
                        <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 ">400</td>
                        <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 ">236</td>
                    </tr> --> */}
                <tr className="border-2 border-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 ">Other self employed</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="s_c">{o5_c}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="s_p">{o5}%</td>
                </tr>
                <tr className="border-2 border-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 ">Daily Worker (other than agriculture and allied activities) </td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="dw_c">{o4_c}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="dw_p">{o4}%</td>
                </tr>
                <tr className="border-2 border-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 ">Homemaker</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="hm_c">{o6_c}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="hm_p">{o6}%</td>
                </tr>
                <tr className="border-2 border-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 ">Salaried Employee</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="se_c">{o3_c}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="se_p">{o3}%</td>
                </tr>
                <tr className="border-2 border-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 ">Retired Person</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="rp_c">{o1_c}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="rp_p">{o1}%</td>
                </tr>
                <tr className="border-2 border-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 ">Others (Unemployed,student etc)</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="o_c">{o2_c}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="o_p">{o2}%</td>
                </tr>
               
               
                <tr className="border-2 border-[#838281]/30 bg-[#838281]/30">
                    <th className="min-w-[8vw] border-l-2 border-[#838281]/30 font-semibold text-lg px-3 py-1 " >Monthly Income</th>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1 font-semibold text-center" id="tbase4">{base}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1 font-semibold text-center" id="tpro4">{base_p}%</td>
                </tr>
                <tr className="border-2 border-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 ">Less than Rs.5 thousand</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="5">{i1_c}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="5p">{i1}%</td>
                </tr>
                <tr className="border-2 border-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 ">Rs.5 thousand - Less than Rs.10 thousand</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="10">{i2_c}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="10p">{i2}%</td>
                </tr>
                <tr className="border-2 border-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 ">Rs.10 thousand - Less than Rs.25 thousand</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="25">{i3_c}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="25p">{i3}%</td>
                </tr>
                <tr className="border-2 border-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 ">Rs.25 thousand - Less than Rs.50 thousand</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="50">{i4_c}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="50p">{i4}%</td>
                </tr>
                <tr className="border-2 border-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 "> Rs.50 thousand - Less than Rs.1 Lakh</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="1">{i5_c}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="1p">{i5}%</td>
                </tr>
                <tr className="border-2 border-[#838281]/30">
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 "> Rs.1 Lakh and above</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="1l">{i6_c}</td>
                    <td className="min-w-[8vw] border-l-2 border-[#838281]/30 px-3 py-1.5 text-center" id="1lp">{i6}%</td>
                </tr>
            </tbody>
            {/* <!-- <tfoot>
                <tr class="border-2 border-bordergrey bg-[#838281]/30">
                    <td class="min-w-[8vw] border-l-2 border-[#838281] font-semibold text-xl px-3 py-1 bg-thcolor"> Total</td>
                    <td class="min-w-[8vw] border-l-2 border-[#838281] px-3 py-1 " id="tbase">400</td>
                    <td class="min-w-[8vw] border-l-2 border-[#838281] px-3 py-1 " id="tpro">236</td>
                </tr>
            </tfoot> --> */}
        </table>
    </div>
</div>
</div>
          </div>

          {/* <!-- Switvh two --> */}

          <div id="chart_contain" className={`${!showGauge ? "hidden" : ""} w-full h-full`} checked={!showGauge}
                    onChange={() => setShowGauge((prev) => !prev)}>
            <div className="w-full h-full overflow-scroll flex flex-wrap justify-center items-center gap-x-1 gap-y-8 py-3 bg-[#012150]/20"
                        style={{backgroundImage: `url(${img3})`,backgroundPosition: "center center",backgroundSize: "cover"}}>
                        <div className="w-[30vw] h-[40vh] flex flex-col justify-center items-center gap-4">
                            <p className="text-xl font-semibold text-[#012150]">Gender</p>
                            <div className="relative h-[90%]">
                                <img src={img4} alt="Male_Female"/>
                                <span className="absolute top-3 left-4" id="basem">{male_p}%</span>
                                <span className="absolute top-8 right-3" id="basef">{female_p}%</span>
                            </div>
                        </div>
                        <div className="w-[30vw] h-[40vh] flex flex-col justify-center items-center gap-4">
                            <p className="text-xl font-semibold text-[#012150]">Age Group</p>
                            <div className="relative h-[90%]">
                                <img src={img5} alt="AgeGroup"/>
                                <span className="absolute top-0 -left-5" id="21">{age1}%</span>
                                <span className="absolute top-48 -right-5" id="59">{age4}%</span>
                                <span className="absolute top-48 -left-5" id="40">{age3}%</span>
                                <span className="absolute top-0 -right-5" id="30">{age2}%</span>
                            </div>
                        </div>
                        <div className="w-[30vw] h-[40vh] relative flex flex-col justify-center items-center gap-4">
                            <p className="text-xl font-semibold text-[#012150]">Education</p>
                            <img className="absolute -top-6 right-[25%] w-2/12" src={img9} alt=""/>
                            <div className="relative h-[90%]">
                                <img className="w-full" src={img6} alt="AgeGroup"/>
                                <span id="twelve" className="absolute top-2 left-[36.5%]">{std3}%</span>
                                <span id="tentotwelve" className="absolute top-3 right-[38%]">{std2}%</span>
                                <span id="gradabove" className="absolute top-[150px] left-[29%]">{std7}%</span>
                                <span id="belowfive" className="absolute top-[150px] right-[31%]">{std4}%</span>
                                <span id="fiveten" className="absolute top-[74px] right-[27%]">{std1}%</span>
                                <span id="grad" className="absolute top-[74px] left-[25.5%]">{std5}%</span>
                                <span id="illiterate" className="absolute top-44 right-[47%]">{std6}%</span>
                           </div>
                        </div>
                        <div className="w-[90vw] h-[60vh] relative flex flex-row justify-center items-start">
                            <div className="w-[30vw] h-[40vh] flex flex-col justify-center items-center gap-3">
                                <div className="w-full flex flex-row justify-center items-center gap-4">
                                    <img className="w-[10%]" src={img7} alt=""/>
                                    <p className="text-xl font-semibold text-[#012150]">Occupation</p>
                                </div>
                                <div className="w-full h-[90%]">
                                    {/* <!-- chart --> */}
                                    <div id="SemiBar" style={{height: "100%"}}>
                                        <Ochart 
                                        occ = {olabel}
                                        occ_p = {oper}/>
                                    </div>
                                </div>
                            </div>
                            <div className="w-[35vw] h-[40vh]">
                                <div className="w-full flex flex-row justify-center items-center gap-4">
                                    <img className="w-[10%]" src={img8} alt=""/>
                                    <p className="text-xl font-semibold text-[#012150]">Monthly Income</p>
                                </div>
                                <div className="w-full h-[80%] flex flex-row justify-center items-center">
                                    {/* <!-- chart --> */}
                                    <div className="w-full h-full">
                                        <div id="Pie1" style={{height: "100%"}}>
                                            <Ichart inc = {ilabel}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full  flex flex-row justify-center items-center z-30">
                                    <label
                                        className="bg-[#012150] flex flex-row justify-center items-center gap-1 p-[2px] rounded-lg">
                                        <img className="p-2" src={img10} alt=""/>
                                        <span className="p-2 font-semibold text-white" id="pro_avg">
                                            {we}
                                        </span>
                                        <span className="text-white font-semibold px-2">
                                            AVG
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <div className="w-[25vw] h-[40vh] flex flex-col justify-center items-center gap-4">
                                <p className="text-xl font-semibold">No. of Family Members</p>
                                <div className="relative h-[90%]">
                                    <img className="w-[75%]" src={img11} alt=""/>
                                    <span className="absolute top-3 left-[20%]" id="or2"> {f1}% </span>
                                    <span className="absolute top-28 left-[20%]" id="or3"> {f2}% </span>
                                    <span className="absolute top-52 left-[20%]" id="orm"> {f3}% </span>
                                </div>
                            </div>
                            <img className="w-full absolute bottom-0" src={img12} alt=""/>
                        </div>
                    </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 w-full">
        {/* <!-- Buttons to select --> */}
        <nav
          className="w-full flex justify-center items-center flex-wrap bg-[#012150] py-2 px-2"
        >
          <Link
            to="/pro"
            className="text-white text-[0.95rem] font-semibold px-3 py-2 border-4 border-white bg-[#c0860c] rounded-full -translate-y-7"
          >
            Profile Of Respondents
          </Link>
          <Link
            to="/ge"
           className="text-white text-[0.95rem] font-semibold px-3 py-1 border-r-2 border-white bg-[#012150]"
          >
            General Economic
          </Link>
          <Link
            to="/ee"
            className="text-white text-[0.95rem] font-semibold px-3 py-1 border-r-2 border-white bg-[#012150]"
          >
            Employment Economic
          </Link>
          <Link
            to="/pe"
            className="text-white text-[0.95rem] font-semibold px-3 py-1 border-r-2 border-white bg-[#012150]"
          >
            Price Economic
          </Link>
          <Link
            to="/ie"
            className="text-white text-[0.95rem] font-semibold px-3 py-1 border-r-2 border-white bg-[#012150]"
          >
            Income Economic
          </Link>
          <Link
            to="/os"
            className="text-white text-[0.95rem] font-semibold px-3 py-1 border-r-2 border-white bg-[#012150]"
          >
            Overall Spending
          </Link>
          <Link
            to="/es"
            className="text-white text-[0.95rem] font-semibold px-3 py-1 border-r-2 border-white bg-[#012150]"
          >
            Essential Spending
          </Link>
          <Link
            to="/nes"
            className="text-white text-[0.95rem] font-semibold px-3 py-1 border-r-2 border-white bg-[#012150]"
          >
            Non Essential Spending
          </Link>
          <Link
            to="/ies"
            className="text-white text-[0.95rem] font-semibold px-3 py-1 bg-[#012150]"
          >
            Inflation Expectations
          </Link>
        </nav>
      </div>
      </section>
    </>
    
  );
}
