import * as React from "react";
import { isMobile } from "react-device-detect";
import './RegisterAndLogin.css';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import sha256 from 'crypto-js/sha256';
import { useEffect } from "react";
import { login,logout } from './user';

const DEFAULT_OPTION = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true
};

async function sendPostRequest(body: any, endPoint: string): Promise<AxiosResponse> {
  let response = await axios.post(
    endPoint,
    body,
    DEFAULT_OPTION
  );
  return response;
}

export default function RegisterAndLogin() {

  var navigate = useNavigate();

  function onlyNumbers(str) {
    return /^[0-9]+$/.test(str);
  }

  async function RegisterOnClick(){
    let body;
    const registerInput = document.getElementById('registerInput') as HTMLInputElement;
    if (registerInput != null) {
      const registerInput1 = document.getElementById('registerInput1') as HTMLInputElement;
      if (registerInput1 != null) {
        const registerInput2 = document.getElementById('registerInput2') as HTMLInputElement;
        if (registerInput2 != null) {
          const RegisterPasswordInput = document.getElementById('RegisterPasswordInput') as HTMLInputElement;
          if (RegisterPasswordInput != null) {
            let countryCode, PhoneNumber, email, pass;

            email = registerInput.value;
            countryCode = registerInput1.value;
            PhoneNumber = registerInput2.value;
            pass = RegisterPasswordInput.value;

            if (!email.includes("@")) {

              //message: please enter the email correctly
            }
            else if (email.includes("@") && onlyNumbers(PhoneNumber)) {

              body = { phone_number: countryCode.toString().replace('+', '00') + PhoneNumber.toString(), email: email.toString(), password: sha256(pass).toString() };
              //message: please enter the email correctly
            }
            console.log(sha256(pass).toString());

            let endPoint = 'http://main.sabt.shankayi.ir/api/add_user';
            let resp = await sendPostRequest(body, endPoint);
          }
        }
      }
    }
  }

  async function LoginOnClick(){
    let body;
        const loginInput = document.getElementById('loginInput') as HTMLInputElement;
        if (loginInput != null) {
          const passwordInput = document.getElementById('passwordInput') as HTMLInputElement;
          if (passwordInput != null) {
            let usr, pass;
            usr = loginInput.value;
            pass = passwordInput.value;
            if (usr.includes("@")) {
              body = { user_name: '', email: usr, password: sha256(pass).toString() };
            }
            else {
              body = { user_name: usr, email: '', password: sha256(pass).toString() };
            }
            login(body).then((resp) => {if(resp.status==200){
              localStorage.setItem('user',resp.data);
              navigate("/marketplace", { replace: true })

            } });
          }
        }
  }
  async function registerButtonOnClick(){
    const registerLogoBack = document.getElementById('registerLogoBack') as HTMLInputElement;
    if (registerLogoBack != null) {
      registerLogoBack.style.top = '16vh';
    }
    const registerLogo = document.getElementById('registerLogo') as HTMLInputElement;
    if (registerLogo != null) {
      registerLogo.style.top = '23vh';
    }
    const RegisterContainer = document.getElementById('RegisterContainer') as HTMLInputElement;
    if (RegisterContainer != null) {
      RegisterContainer.style.top = '23vh';
    }
    //hide login
    const loginLogo = document.getElementById('loginLogo') as HTMLInputElement;
    if (loginLogo != null) {
      loginLogo.style.top = 100 + '%';
    }
    const loginLogoBack = document.getElementById('loginLogoBack') as HTMLInputElement;
    if (loginLogoBack != null) {
      loginLogoBack.style.top = 100 + '%';
    }
    const LoginContainer = document.getElementById('LoginContainer') as HTMLInputElement;
    if (LoginContainer != null) {
      LoginContainer.style.top = 100 + '%';
    }
  }

  async function loginButtonOnClick(){
    const registerLogoBack = document.getElementById('registerLogoBack') as HTMLInputElement;
    if (registerLogoBack != null) {
      registerLogoBack.style.top = 100 + '%';
    }
    const registerLogo = document.getElementById('registerLogo') as HTMLInputElement;
    if (registerLogo != null) {
      registerLogo.style.top = 100 + '%';
    }
    const RegisterContainer = document.getElementById('RegisterContainer') as HTMLInputElement;
    if (RegisterContainer != null) {
      RegisterContainer.style.top = 100 + '%';
    }
    //show login
    const loginLogo = document.getElementById('loginLogo') as HTMLInputElement;
    if (loginLogo != null) {
      loginLogo.style.top = '7vh';
    }
    const loginLogoBack = document.getElementById('loginLogoBack') as HTMLInputElement;
    if (loginLogoBack != null) {
      loginLogoBack.style.top = '7vh';
    }
    const LoginContainer = document.getElementById('LoginContainer') as HTMLInputElement;
    if (LoginContainer != null) {
      LoginContainer.style.top = '25vh';
    }
  }

  

  useEffect(() => {
  
  }, []);
  return (<div id="infoBack1"  className="bg-black flex h-screen  overflow-hidden absolute top-0 left-0 w-screen duration-300 pt-24">
    <svg id="svgTitle" width="162" height="21" viewBox="0 0 162 21" fill="white" xmlns="http://www.w3.org/2000/svg"  className="bg-black p-4 absolute text-white no-underline duration-300 rounded-l-md text-xs left-50 top-20">
      <path d="M9.51196 0V3.75963H6.71704V16.6962H2.79168V3.75963H0V0H9.51196Z" fill="white" />
      <path d="M23.6521 3.73644V6.4484H29.2484V10.1517H23.6521V12.8869H29.2484V16.6962H19.7266V0H29.2484V3.73644H23.6521Z" fill="white" />
      <path d="M52.8544 0V16.6962H48.9289V10.2246H44.5791V20.2039H40.667V0H44.5791V6.34232H48.9289V0H52.8544Z" fill="white" />
      <path d="M68.3366 12.4193H64.5273V16.6961H68.3366V12.4193Z" fill="white" />
      <path d="M89.2076 12.8869V16.6962H80.3853V0H84.3108V12.8869H89.2076Z" fill="white" />
      <path d="M107.577 0H104.282L97.7505 16.6995H101.921L103.605 12.3498H108.211L109.845 16.6995H114.112L107.577 0ZM105.041 8.49399L105.92 6.17322L106.772 8.49399H105.041Z" fill="white" />
      <path d="M136.649 0V16.6962H133.215L127.104 7.20763L127.22 16.6962H123.282V0H126.869L132.83 9.18359L132.747 0H136.649Z" fill="white" />
      <path d="M159.672 2.337C158.131 0.782088 156.085 0.0162354 153.608 0.0162354H143.241V16.7158H153.002C154.09 16.7508 155.179 16.6393 156.237 16.3843C157.093 16.1466 157.9 15.7593 158.621 15.2404C159.687 14.4793 160.55 13.4684 161.134 12.2964C161.715 11.09 162.011 9.76631 162 8.42737C162 5.93089 161.214 3.89191 159.672 2.337ZM147.1 3.79577H153.124C154.726 3.79577 155.919 4.19361 156.771 5.01251C157.623 5.83141 158.044 6.92881 158.044 8.42405C158.044 9.84966 157.647 10.9471 156.841 11.7394C156.035 12.5318 154.948 12.9296 153.509 12.9296H147.084L147.1 3.79577Z" fill="white" />
    </svg>

    <div id="loginLogoBack" className="duration-1000 absolute right-[10vw] top-[7vh] w-[43vw] h-[93vh]">
      <svg id="infinitySVG" className="w-full h-full object-contain" viewBox="0 0 590 517" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M560.608 214.652L489.099 271.815C480.117 279.054 469.643 284.217 458.421 286.937C447.2 289.656 435.505 289.866 424.168 287.55L380.848 278.722L379.918 322.923C379.681 334.447 376.921 345.767 371.833 356.083C366.746 366.4 359.453 375.462 350.471 382.631L205.426 498.578C191.655 509.544 174.6 515.58 156.963 515.729L80.456 516.29C68.485 516.437 56.6263 513.835 45.7904 508.684C34.9544 503.532 25.4297 495.969 17.9478 486.575C10.432 477.208 5.15228 466.251 2.51416 454.547C-0.123955 442.842 -0.05014 430.702 2.72974 419.057L20.1003 344.518C24.1627 327.363 33.8119 312.075 47.5308 301.056L192.576 185.11C201.547 177.928 211.993 172.81 223.177 170.119C234.361 167.429 246.01 167.23 257.304 169.536L300.624 178.365L301.587 134.137C301.816 122.611 304.572 111.288 309.66 100.971C314.749 90.6527 322.046 81.5918 331.034 74.4284L402.544 17.2652C412.071 9.69216 423.226 4.432 435.142 1.89487C447.057 -0.642216 459.41 -0.387834 471.239 2.63804L528.559 17.4142C545.15 21.7476 559.915 31.3429 570.641 44.7608C581.367 58.1787 587.475 74.6952 588.048 91.8325L589.837 151C590.182 163.168 587.725 175.238 582.657 186.276C577.588 197.314 570.044 207.023 560.608 214.652ZM438.784 206.311L507.692 151.226L506.015 96.4225L452.926 82.7154L384.017 137.8L382.79 194.926L438.784 206.311ZM155.044 433.128L297.894 318.936L299.087 261.837L243.127 250.425L100.277 364.617L84.1538 433.651L155.044 433.128Z" fill="#0E0E0E" />
      </svg>
    </div>
    <div id="loginLogo" className="duration-1000 absolute right-[10vw] top-[7vh] w-[43vw] h-[93vh]">
      <img id="loginBoy" className="w-full h-full object-contain" src={process.env.PUBLIC_URL + "/rl.webp"}>
      </img>
    </div>

    <div id="registerLogoBack" className="duration-1000 absolute right-[13vw] top-full w-[44vw] h-auto">
      <svg width="637" height="637" viewBox="0 0 637 637" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="318.5" cy="318.5" r="214.5" fill="#212121" />
        <circle opacity="0.8" cx="318.5" cy="318.5" r="260" stroke="#212121" strokeWidth="13" />
        <circle opacity="0.5" cx="318.5" cy="318.5" r="312" stroke="#212121" strokeWidth="13" />
      </svg>

    </div>
    <div id="registerLogo" className="duration-1000 absolute right-[25vw] top-full w-[19vw] h-auto">
      <img id="registerBoy" className="w-full h-full object-contain" src={process.env.PUBLIC_URL + "/ll.webp"}>
      </img>
    </div>


    <div className="absolute left-[50px] bottom-[35px]">
      <a id="terms" className="bg-black p-4 text-white no-underline duration-300 rounded-l-md text-xs">Terms of Service</a>
    <a id="privacy" className="bg-black p-4 text-white no-underline duration-300 rounded-l-md text-xs ml-8">Privacy Policy</a>

      </div>
      <a id="copyright" className="bg-black p-4 absolute text-white no-underline duration-300 rounded-l-md text-xs right-[75px] bottom-[35px]">Copyrights © 2021</a>

    <div id="LoginContainer" className= "flex flex-col absolute text-left text-white duration-1000 left-[14vw] top-[25vh] min-w-[20vw]">
      <div id="LR1" className="pb-12 text-primary text-2xl">
        Login
      </div>
      <input id="loginInput" placeholder="Email / Username" className="bg-transparent border-white border-solid border-b pb-1 pl-1 pt-8 text-white outline-hidden	"/>

      <input id="passwordInput" type="password" placeholder={"Password"} className="bg-transparent border-white border-solid border-b pb-1 pl-1 pt-8 text-white outline-hidden	" />


      <div id="LoginBtn" onClick={LoginOnClick} className="rounded cursor-pointer table-cell mt-8 pt-2 text-center align-middle w-full h-12 bg-primary">
        Sign in
      </div>

      <div id="forgotPassword" className="text-center mt-[10%]"  >
        Forgot Password?
      </div>

      <div id="registerLink" className="cursor-pointer flex mx-auto text-center mt-5">
        <div>
          Don’t have an account yet?
        </div>

        <div id="registerButton" className="pl-1 text-primary" onClick={registerButtonOnClick}>
          Register
        </div>
      </div>

    </div>

    <div id="RegisterContainer" className="flex flex-col absolute text-left text-white left-[14vw] bottom-full duration-1000 w-[21vw] min-w-[300px]">
      <div id="LR1" className="pb-12 text-primary text-2xl">
        Register
      </div>
      <input id="registerInput" placeholder="Email"  className="bg-transparent border-white border-solid border-b px-1 py-4 text-white outline-hidden	"/>

      <div id="phoneContainer" className="flex items-stretch w-full">

        <div id="phoneChild2" className="flex flex-col pr-1 max-w-[15%]">
          <input id="registerInput2" placeholder="+1"  className="bg-transparent border-white border-solid border-b px-1 py-4 text-white outline-hidden	"/>
        </div>

        <div id="phoneChild1" className="flex flex-col pr-1 w-[115%]">
          <input id="registerInput1" placeholder="Phone Number" className="bg-transparent border-white border-solid border-b px-1 py-4 text-white outline-hidden	" />
        </div>

      </div>

      <input id="RegisterPasswordInput" type="password" placeholder={"Password"}  className="bg-transparent border-white border-solid border-b px-1 py-4 text-white outline-hidden	" />

      <div id="termsAndServices" className="flex flex-col text-center my-5">
        <div>
          By signing up, you agree to our
        </div>
        <div id="termsAndServices2" className="text-gray-600 ">
          Terms&Condition and Privacy Policy
        </div>
      </div>

      <div id="RegisterBtn" onClick={RegisterOnClick} className="rounded cursor-pointer table-cell my-6 py-2 text-center align-middle w-full h-12 bg-primary">
        Register
      </div>


      <div id="loginLink" className="cursor-pointer flex mx-auto text-center">
        <div>
          Already have an account?
        </div>

        <div id="loginButton" className="pl-1 text-primary" onClick={loginButtonOnClick}>
          Sign in
        </div>
      </div>

    </div>


  </div>);
}


