import * as React from "react";
import { isMobile } from "react-device-detect";
import { useNavigate } from 'react-router-dom';
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
const DEFAULT_OPTION = {
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
};
async function sendPostRequest(body: any, endPoint: string): Promise<AxiosResponse> {

  let response = await axios.post(
    endPoint,
    body,
    DEFAULT_OPTION,
  );
  return response;
}

async function sendGetRequest(endPoint: string): Promise<AxiosResponse> {
  let response = await axios.get(
    endPoint,
    DEFAULT_OPTION,
  );
  return response;
}

export default function History() {
  // this.state = {
  //   lands: []
  // };
  const [Lands, setLands] = React.useState<any[]>();
  var navigate = useNavigate();
  function closeInfoBack() {
    navigate("/marketplace", { replace: true });
  };
  useEffect(() => {
    let vInterval = 70, hInterval = 50, baseTop = 200, baseLeft = 50, baseWindowHeight = 890, baseWindowWidth = 1400, baseWidth = 100, baseHeight = 20;

    const svgTitle = document.getElementById('svgTitle');
    if (svgTitle != null) {

      svgTitle.style.top = 20 + 'px';
      svgTitle.style.left = baseLeft + 'px';
    }

    const svgSearch = document.getElementById('svgSearch');
    if (svgSearch != null) {
      svgSearch.style.top = 20 + 'px';
      svgSearch.style.right = 190 + 'px';
    }

    const terms = document.getElementById('terms');
    if (terms != null) {
      terms.style.bottom = 35 + 'px';
      terms.style.left = 50 + 'px';
    }
    const privacy = document.getElementById('privacy');
    if (privacy != null && terms != null) {
      privacy.style.bottom = 35 + 'px';
      let rect = terms.getBoundingClientRect();
      privacy.style.left = rect["right"] + 50 + 'px';
      //console.log(rect);
    }
    const copyright = document.getElementById('copyright');
    if (copyright != null) {
      copyright.style.bottom = 35 + 'px';
      copyright.style.right = 75 + 'px';
    }

    sendGetRequest("http://main.sabt.shankayi.ir/api/query_lands/0x62a6ede1f2f7d71af29255f5").then(request => {
      let landsTable: any[]=[]
      for (let index = 0; index < request.data.length; index++) {
        let landItem = request.data[index].title;
        landsTable.push(<div className="flex items-stretch pt-6 text-left w-full">
        <svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.5 0.57735C6.1188 0.220085 6.8812 0.220085 7.5 0.57735L11.9952 3.17265C12.614 3.52992 12.9952 4.19017 12.9952 4.9047V10.0953C12.9952 10.8098 12.614 11.4701 11.9952 11.8274L7.5 14.4226C6.8812 14.7799 6.1188 14.7799 5.5 14.4226L1.00481 11.8274C0.386007 11.4701 0.00480938 10.8098 0.00480938 10.0953V4.9047C0.00480938 4.19017 0.386007 3.52992 1.00481 3.17265L5.5 0.57735Z" fill="#26A17B" />
        </svg>
        <div id="HistoryLandName" className="pl-5 text-left w-[88%]">
        {landItem}
        </div>
        <div id="HistoryButton" className="pl-5 text-right">
          View Land
        </div>
      </div>)
      }
      setLands(landsTable);
    }
    );
  }, []);
  
  return ( <div id="infoBack1" className="bg-black flex h-screen overflow-hidden absolute top-0 left-0 w-screen duration-300 pt-24">
      <svg id="svgTitle" width="162" height="21" viewBox="0 0 162 21" fill="white" xmlns="http://www.w3.org/2000/svg" className="bg-black p-4 absolute text-white no-underline duration-300 rounded-l-md text-xs left-50 top-20">
        <path d="M9.51196 0V3.75963H6.71704V16.6962H2.79168V3.75963H0V0H9.51196Z" fill="white" />
        <path d="M23.6521 3.73644V6.4484H29.2484V10.1517H23.6521V12.8869H29.2484V16.6962H19.7266V0H29.2484V3.73644H23.6521Z" fill="white" />
        <path d="M52.8544 0V16.6962H48.9289V10.2246H44.5791V20.2039H40.667V0H44.5791V6.34232H48.9289V0H52.8544Z" fill="white" />
        <path d="M68.3366 12.4193H64.5273V16.6961H68.3366V12.4193Z" fill="white" />
        <path d="M89.2076 12.8869V16.6962H80.3853V0H84.3108V12.8869H89.2076Z" fill="white" />
        <path d="M107.577 0H104.282L97.7505 16.6995H101.921L103.605 12.3498H108.211L109.845 16.6995H114.112L107.577 0ZM105.041 8.49399L105.92 6.17322L106.772 8.49399H105.041Z" fill="white" />
        <path d="M136.649 0V16.6962H133.215L127.104 7.20763L127.22 16.6962H123.282V0H126.869L132.83 9.18359L132.747 0H136.649Z" fill="white" />
        <path d="M159.672 2.337C158.131 0.782088 156.085 0.0162354 153.608 0.0162354H143.241V16.7158H153.002C154.09 16.7508 155.179 16.6393 156.237 16.3843C157.093 16.1466 157.9 15.7593 158.621 15.2404C159.687 14.4793 160.55 13.4684 161.134 12.2964C161.715 11.09 162.011 9.76631 162 8.42737C162 5.93089 161.214 3.89191 159.672 2.337ZM147.1 3.79577H153.124C154.726 3.79577 155.919 4.19361 156.771 5.01251C157.623 5.83141 158.044 6.92881 158.044 8.42405C158.044 9.84966 157.647 10.9471 156.841 11.7394C156.035 12.5318 154.948 12.9296 153.509 12.9296H147.084L147.1 3.79577Z" fill="white" />
      </svg>
      <svg id="closeInfoBack1" onClick={closeInfoBack} width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-[10%] w-full items-center">
        <path d="M8.5 8.875L9.91421 10.2892L8.5 11.7034L7.08579 10.2892L8.5 8.875ZM16.6642 3.53921L9.91421 10.2892L7.08579 7.46079L13.8358 0.710786L16.6642 3.53921ZM7.08579 10.2892L0.335786 3.53921L3.16421 0.710786L9.91421 7.46079L7.08579 10.2892Z" fill="white" />
      </svg>
      <svg id="svgSearch" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="bg-black p-4 absolute text-white no-underline duration-300 rounded-l-md text-xs">
        <circle cx="8" cy="8" r="7" stroke="#26A17B" strokeWidth="2" />
        <path d="M17 17L14 14" stroke="#26A17B" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <a id="terms" className="bg-black p-4 absolute text-white no-underline duration-300 rounded-l-md text-xs  left-50 bottom-35">Terms of Service</a>
      <a id="privacy" className="bg-black p-4 absolute text-white no-underline duration-300 rounded-l-md text-xs">Privacy Policy</a>
      <a id="copyright" className="bg-black p-4 absolute text-white no-underline duration-300 rounded-l-md text-xs right-75 bottom-35">Copyrights © 2021</a>
      {/* <a id="login">Login</a> */}
      <div id="HistoryContainer" className="flex flex-col h-auto mx-48 pb-24 text-left text-white w-full top-[20%]">
        <div id="HR1" className="pb-8 text-left">
          <svg id="bigPerson" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="left-0">
            <path d="M29.6593 34.5098C29.0895 32.7379 27.8341 31.1721 26.0876 30.0554C24.3412 28.9386 22.2013 28.3333 20 28.3333C17.7987 28.3333 15.6588 28.9386 13.9124 30.0554C12.1659 31.1721 10.9105 32.7379 10.3407 34.5098" stroke="#26A17B" strokeWidth="2" />
            <circle cx="20" cy="16.6667" r="5" stroke="#26A17B" strokeWidth="2" strokeLinecap="round" />
            <rect x="4.33301" y="4.33333" width="31.3333" height="31.3333" rx="3" stroke="#26A17B" strokeWidth="2" />
          </svg>
          <div id="personIdHistory">
            0xxxx..x
          </div>
          <div id="personCompleteIdContainer" className="flex">
            <div id="personCompleteIdHistory" className="mr-2">
              0xxxxxxxxxxxxx
            </div>
            <div>
              <svg id="attachementIcon" width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.58333 15.3333H6.70834C4.59124 15.3333 2.875 13.6171 2.875 11.5V11.5C2.875 9.38291 4.59124 7.66666 6.70833 7.66666H9.58333" stroke="#26A17B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15.3337 11.5H7.66699" stroke="#26A17B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.4167 15.3333H16.2917C18.4088 15.3333 20.125 13.6171 20.125 11.5V11.5C20.125 9.38291 18.4088 7.66666 16.2917 7.66666H13.4167" stroke="#26A17B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

          </div>
        </div>

        <div id="HR2" className="flex flex-col items-stretch h-full pb-8 text-left">
          <div id="History Number">
            Owned Lands:
          </div>
          <div id="line" className="border-white border-solid border-b h-1 mt-5 mb-6 w-full">

          </div>

          <div id="HistoryList" className="h-full overflow-y-scroll">
          {Lands}
          </div>
        </div>

      </div>


    </div>);
}

