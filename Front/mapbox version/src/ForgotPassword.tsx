import * as React from "react";
import { isMobile } from "react-device-detect";
import { useNavigate } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { useEffect } from "react";

async function sendPostRequest(body: any, endPoint: string): Promise<AxiosResponse> {
  let response = await axios.post(
    endPoint,
    body,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response;
}

export default function ForgotPassword() {
  var navigate = useNavigate();

  async function forgotBtnOnClick(){
    let body;
    const emailInput = document.getElementById('emailInput') as HTMLInputElement;
    if (emailInput != null) {
      
      let email = emailInput.value;
      if (email.includes("@")) {
        body = { email: email.toString() };
        let endPoint = 'https://teh.land/api/add_user';
        let resp = await sendPostRequest(body, endPoint);
        console.log(resp);
      }
    }
  }
  async function backBtnOnClick(){

  }

  useEffect(() => {


    



  }, []);
  return (<div id="infoBack1" className="bg-black flex h-screen absolute top-0 left-0 w-screen duration-300 overflow-hidden">
      <div id="forgotBack" className="absolute top-[100px] -right-[126px]">
        <svg width="651" height="773" viewBox="0 0 651 773" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M776.229 198.009C776.229 150.464 739.995 97.8934 695.667 81.2718L503.32 8.98725C471.326 -2.99575 418.903 -2.99575 386.909 8.98725L194.562 81.6583C150.234 98.2799 114 150.85 114 198.009V485.215C114 530.827 144.066 590.742 180.685 618.187L346.435 742.269C400.786 783.244 490.214 783.244 544.565 742.269L710.314 618.187C746.934 590.742 777 530.827 777 485.215V349.15" fill="url(#paint0_linear_0_1)"/>
        <path d="M279.674 271.507C279.674 251.456 264.372 229.285 245.651 222.275L164.419 191.79C150.907 186.737 128.767 186.737 115.256 191.79L34.0233 222.438C15.3023 229.448 0 251.619 0 271.507V392.631C0 411.868 12.6977 437.136 28.1628 448.71L98.1628 501.04C121.116 518.32 158.884 518.32 181.837 501.04L251.837 448.71C267.302 437.136 280 411.868 280 392.631V335.248" fill="url(#paint1_linear_0_1)"/>
        <path d="M170.5 329.604V372.229" stroke="url(#paint2_linear_0_1)" strokeWidth="31" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M170.5 272.771C154.871 272.771 142.083 285.558 142.083 301.187C142.083 316.817 154.871 329.604 170.5 329.604C186.129 329.604 198.916 316.817 198.916 301.187" stroke="url(#paint3_linear_0_1)" strokeWidth="31" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M292.549 253.163C292.549 235.687 279.194 216.364 262.854 210.254L191.954 183.685C180.161 179.28 160.838 179.28 149.045 183.685L78.1456 210.396C61.806 216.506 48.4502 235.829 48.4502 253.163V358.731C48.4502 375.497 59.5327 397.52 73.0306 407.608L134.126 453.217C154.16 468.278 187.124 468.278 207.157 453.217L268.253 407.608C281.751 397.52 292.834 375.497 292.834 358.731V308.718" stroke="url(#paint4_linear_0_1)" strokeWidth="31" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
        <linearGradient id="paint0_linear_0_1" x1="445.5" y1="0" x2="445.5" y2="773" gradientUnits="userSpaceOnUse">
        <stop stopColor="#171717"/>
        <stop offset="1" stopColor="#171717" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="paint1_linear_0_1" x1="140" y1="188" x2="140" y2="514" gradientUnits="userSpaceOnUse">
        <stop stopColor="#171717"/>
        <stop offset="1" stopColor="#171717" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="paint2_linear_0_1" x1="171" y1="329.604" x2="171" y2="372.229" gradientUnits="userSpaceOnUse">
        <stop stopColor="#26A17B"/>
        <stop offset="1" stopColor="#390065"/>
        </linearGradient>
        <linearGradient id="paint3_linear_0_1" x1="170.5" y1="272.771" x2="170.5" y2="329.604" gradientUnits="userSpaceOnUse">
        <stop stopColor="#26A17B"/>
        <stop offset="1" stopColor="#390065"/>
        </linearGradient>
        <linearGradient id="paint4_linear_0_1" x1="170.642" y1="180.381" x2="170.642" y2="464.512" gradientUnits="userSpaceOnUse">
        <stop stopColor="#26A17B"/>
        <stop offset="1" stopColor="#390065" stopOpacity="0.51"/>
        </linearGradient>
        </defs>
        </svg>
      </div>
      
      <div className="absolute left-[50px] bottom-[35px]">
      <a id="terms" className="bg-black p-4 text-white no-underline duration-300 rounded-l-md text-xs">Terms of Service</a>
    <a id="privacy" className="bg-black p-4 text-white no-underline duration-300 rounded-l-md text-xs ml-8">Privacy Policy</a>

      </div>
      <a id="copyright" className="bg-black p-4 absolute text-white no-underline duration-300 rounded-l-md text-xs right-[75px] bottom-[35px]">Copyrights © 2021</a>

      <div id="forgotContainer" className="flex flex-col absolute text-left text-white duration-1000 top-[25vh] left-[14vw] w-[21vw] min-w-[300px]">
        <div id="LR1" className="pb-12 text-primary text-2xl">
        Forget Password
        </div>
        <input id="emailInput" placeholder="Enter your Email" className="bg-transparent border-white border-solid border-b pb-1 pl-1 pt-8 text-white outline-hidden	">
        </input>

        <div id="forgotBtn" onClick={forgotBtnOnClick} className="rounded cursor-pointer table-cell my-8 py-2 text-center align-middle w-full h-12 bg-primary">
        Reset Password
        </div>

        <div id="backLink" onClick={backBtnOnClick} className="flex mx-auto text-center">
          <div id="backBtn">
            Back
          </div>
        </div>

      </div>

    </div>);
}