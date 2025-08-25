import React, { useEffect, useState , useMemo } from "react";
import { Link } from "react-router-dom";
import img from "../assets/images/RBI.png";
import img3 from "../assets/images/LandingBackground.png"
import img4 from "../assets/images/Rectangle 277.png"
import img5 from "../assets/images/Group 48.png"
import img6 from "../assets/images/Rectangle 270.png"
import img7 from "../assets/images/Rectangle 276.png"
import img8 from "../assets/images/image.png"

export default function Intro(){
    return(
        <>
        <section class=" w-[100vw] h-[100vh] font-Inria" style={{ background: `url(${img3}) no-repeat`, backgroundSize: 'cover'}} >
        <div class="w-full h-full flex justify-start items-center ">
            <div class="w-full h-[80vh] grid grid-rows-1 grid-cols-[50%_20%_25%] justify-start items-center">
                {/* <!-- Box Gradient --> */}
                <div class="z-[55] relative bg-gradient-to-r from-[#012150] to-[#C0860C] h-[70%] row-start-1 row-end-[-1] col-start-1 col-end-3 flex justify-start items-center">
                    <div class="absolute top-[-15%] left-0 grid grid-rows-1 grid-cols-1 justify-center items-center">
                        <div class="row-start-1 row-end-2 col-start-1 col-end-2" >
                            <img src={img4} alt=""/>
                        </div>
                        <div class="w-[90%] row-start-1 row-end-2 col-start-1 col-end-2 flex justify-center items-center">
                            <img class="" src={img} alt=""/>
                        </div>
                    </div>
                    <div class="w-[80%] text-[2rem] font-Inria font-bold text-center text-white pl-[2rem] relative">
                        
                        <p>Rural Consumer Confidence Survey</p> 
                        <p>(RCCS)</p>
                        <p>Round - 2025</p>

                        <Link to="/rccs" class="p-1 bg-[#012150;] rounded-full absolute right-[15%] top-[50%]" >
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 28 28"><path fill="#fff" d="M2 14C2 7.373 7.373 2 14 2s12 5.373 12 12s-5.373 12-12 12S2 20.627 2 14m12.22-5.03a.75.75 0 0 0 0 1.06l3.22 3.22H8.75a.75.75 0 0 0 0 1.5h8.69l-3.22 3.22a.75.75 0 1 0 1.06 1.06l4.5-4.5a.75.75 0 0 0 0-1.06l-4.5-4.5a.75.75 0 0 0-1.06 0"/></svg>
                        </Link>

                    </div>
                    <div class="absolute -bottom-[3.75rem] right-36">
                        <img class="w-3/4" src={img5} alt=""/>
                    </div>
                </div>
                {/* <!-- Hexagon Shapes --> */}
                 <div class="relative row-start-1 row-end-2 col-start-2 col-end-4 grid  grid-rows-1 grid-cols-1 justify-center items-center" >
                    <img class="w-[100%] row-start-1 row-end-[-1] col-start-1 col-end-[-1] z-40 " src={img6} alt=""/>
                    <img class="w-[90%] row-start-1 row-end-[-1] col-start-1 col-end-[-1] z-50 translate-x-9" src={img7} alt=""/>
                    <img class="w-[75%] row-start-1 row-end-[-1] col-start-1 col-end-[-1] z-[60] translate-x-[15%] " src={img8} alt=""/>
                 </div>
            </div>
        </div>
    </section>
        </>
    );
};