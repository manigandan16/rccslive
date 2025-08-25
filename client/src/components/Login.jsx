import React, { useEffect, useState , useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import img from "../assets/images/leaves.png";
import img2 from "../assets/images/money.png";
import img3 from "../assets/images/blue.svg";
import img4 from "../assets/images/orange.svg";
import img5 from "../assets/images/white.png";
import img6 from "../assets/images/RBI.png";
import img7 from "../assets/images/HansaResearch.png";

export default function Login() {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);


    const handleLogin = async () => {
        const email = document.getElementById("username").value;
        const password = document.getElementById("password").value;
    
        try {
            const res = await axios.post("http://localhost:5000/login", {
                email,
                password
            });
    
            if (res.data.success) {
                navigate("/intro");
            }
        } catch (err) {
            alert("Login failed: " + (err.response?.data || "Server error"));
        }
    };
    

    return(
        <>
        <section className="font-Inria w-[100vw] h-[100vh] bg-[#012150] relative flex justify-center items-center">
        
        <img className="absolute w-[18%] top-[18%] left-[20%]" src={img} alt=""/>
        <img className="absolute w-[18%] top-[45%] right-[20%] rotate-180" src={img} alt=""/>
        <img className="absolute w-[18%] top-[58%] right-[30%] " src={img2} alt=""/>
        <img className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[36%] blur-md " src={img3} alt=""/>
        <img className="absolute top-[50.5%] left-[50.5%] translate-x-[-50%] translate-y-[-50%] w-[35%]" src={img4} alt=""/>
        <img className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[30%]" src={img5} alt=""/>

        
        <div className=" w-[70%] flex flex-col justify-center items-center gap-7 z-50">

            <img className="w-1/4" src={img6} alt=""/>

            <div className="flex justify-center items-center flex-col gap-4">
                <p className="uppercase text-2xl font-semibold">login</p>

                <div className="w-full relative bg-[#c0860c] rounded-full flex justify-start items-center flex-row">
                    <span className="p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                            <g fill="none" fillRule="evenodd">
                                <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                                <path fill="#fff" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2M8.5 9.5a3.5 3.5 0 1 1 7 0a3.5 3.5 0 0 1-7 0m9.758 7.484A7.99 7.99 0 0 1 12 20a7.99 7.99 0 0 1-6.258-3.016C7.363 15.821 9.575 15 12 15s4.637.821 6.258 1.984" />
                            </g>
                        </svg>
                    </span>
                    <input className=" p-2 bg-transparent outline-none text-black" type="email" name="" id="username"/>
                </div>
                <div className="w-full relative bg-[#c0860c] rounded-full flex justify-start items-center flex-row">
                    <span className="p-2">
                        <svg width="32" height="32" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="22.5" cy="22.5" r="22.5" fill="white"/>
                            <path d="M22.5 29.7918C23.2736 29.7918 24.0154 29.4845 24.5624 28.9376C25.1094 28.3906 25.4167 27.6487 25.4167 26.8752C25.4167 26.1016 25.1094 25.3598 24.5624 24.8128C24.0154 24.2658 23.2736 23.9585 22.5 23.9585C21.7265 23.9585 20.9846 24.2658 20.4376 24.8128C19.8906 25.3598 19.5833 26.1016 19.5833 26.8752C19.5833 27.6487 19.8906 28.3906 20.4376 28.9376C20.9846 29.4845 21.7265 29.7918 22.5 29.7918ZM31.25 16.6668C32.0236 16.6668 32.7654 16.9741 33.3124 17.5211C33.8594 18.0681 34.1667 18.8099 34.1667 19.5835V34.1668C34.1667 34.9404 33.8594 35.6822 33.3124 36.2292C32.7654 36.7762 32.0236 37.0835 31.25 37.0835H13.75C12.9765 37.0835 12.2346 36.7762 11.6876 36.2292C11.1406 35.6822 10.8333 34.9404 10.8333 34.1668V19.5835C10.8333 18.8099 11.1406 18.0681 11.6876 17.5211C12.2346 16.9741 12.9765 16.6668 13.75 16.6668H15.2083V13.7502C15.2083 11.8163 15.9766 9.96163 17.344 8.59418C18.7115 7.22672 20.5661 6.4585 22.5 6.4585C23.4576 6.4585 24.4057 6.6471 25.2904 7.01354C26.1751 7.37998 26.9789 7.91708 27.656 8.59418C28.3331 9.27127 28.8702 10.0751 29.2366 10.9598C29.6031 11.8444 29.7917 12.7926 29.7917 13.7502V16.6668H31.25ZM22.5 9.37516C21.3397 9.37516 20.2269 9.8361 19.4064 10.6566C18.5859 11.477 18.125 12.5898 18.125 13.7502V16.6668H26.875V13.7502C26.875 12.5898 26.4141 11.477 25.5936 10.6566C24.7731 9.8361 23.6603 9.37516 22.5 9.37516Z" fill="#C0860C"/>
                            </svg>
                    </span>
                    <input className="pr-10 p-2 bg-transparent outline-none text-black" type={showPassword ? "text" : "password"} name="" id="password"/>
                    <span
  className="p-2 absolute right-0 cursor-pointer" id="showPassword"
  onClick={() => setShowPassword(!showPassword)}
>
  {showPassword ? (
    // 👁️ Eye open icon
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path fill="#fff" d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5" />
</svg>
  ) : (
    // 👁️‍🗨️ Eye closed icon
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="#fff" d="M12 6a9.77 9.77 0 0 1 9 6a9.77 9.77 0 0 1-9 6a9.77 9.77 0 0 1-9-6a9.77 9.77 0 0 1 9-6m0-2a11.94 11.94 0 0 0-11 8a11.94 11.94 0 0 0 11 8a11.94 11.94 0 0 0 11-8a11.94 11.94 0 0 0-11-8Zm0 5a3 3 0 1 1-3 3a3 3 0 0 1 3-3Z" />
    </svg>
  )}
</span>
                    <span onClick={handleLogin} className="p-2 bg-[#c0860c] absolute -right-[20%] rounded-full pointing" id="sumbit_btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                            <path fill="#fff" d="M2 16A14 14 0 1 0 16 2A14 14 0 0 0 2 16m6-1h12.15l-5.58-5.607L16 8l8 8l-8 8l-1.43-1.427L20.15 17H8Z" />
                            <path fill="none" d="m16 8l-1.43 1.393L20.15 15H8v2h12.15l-5.58 5.573L16 24l8-8z" />
                        </svg>
                    </span>
                </div>

            </div>


            <img  src={img7} alt=""/>

        </div>
    </section>
        </>
    );
}