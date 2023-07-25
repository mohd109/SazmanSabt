// @flow
import * as React from 'react';
import './home.css';
import {LogoType,LogoImage} from "../../components/base/svg/Logo"
import {HeaderIcon} from "../../components/base/svg/SearchIcons"
import {ConnectWallet} from "../../components/base/button"
import {useState} from "react";
type Props = {

};
export const Navigation = (props: Props) => {
    const [toggleNav,setToggleNav] = useState(false);
    return (
        <nav className="bg-transparent border-gray-200 px-2 sm:px-4 lg:px-20 py-2.5 rounded ">
            <div className="container flex flex-wrap justify-between items-center mx-auto">
                <a href="#" className="flex items-center">
                    <LogoType width={161} height={21}/>
                </a>
                    <div className="flex md:order-2 items-center gap-2 md:gap-4 lg:gap-4">
                        <HeaderIcon width={24} height={24} />
                        <a href={"/#/rl"} className={"font-Gilroy-Bold text-base text-white"}>
                            Login
                        </a>
                        <button type="button" className=" focus:outline-none focus:ring-blue-300 md:mr-0 hidden md:block">
                            <ConnectWallet  text={"Connect Wallet"} />
                        </button>
                        <button data-collapse-toggle="navbar-cta" type="button" onClick={(e:any)=> setToggleNav(!toggleNav)}
                                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden  focus:outline-none "
                                aria-controls="navbar-cta" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                      clipRule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                    <div className={toggleNav ? " justify-between items-center w-full md:flex md:w-auto md:order-1":"hidden md:block"} id="navbar-cta">
                        <ul className="flex flex-col p-4 mt-4 bg-transparent rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-transparent ">
                            <li>
                                <a href="#"
                                   className="block py-2 pr-4 pl-3 text-white hover:bg-primary rounded md:hover:bg-transparent md:text-white md:p-0 "
                                   aria-current="page">Home</a>
                            </li>
                            <li>
                                <a href="#"
                                   className="block py-2 pr-4 pl-3 text-white rounded hover:bg-primary md:hover:bg-transparent  md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Play</a>
                            </li>
                            <li>
                                <a href="/#/marketplace"
                                   className="block py-2 pr-4 pl-3 text-white rounded hover:bg-primary md:hover:bg-transparent  md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Marketplace</a>
                            </li>
                            <li>
                                <a href="#"
                                   className="block py-2 pr-4 pl-3 text-white rounded hover:bg-primary md:hover:bg-transparent  md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Docs</a>
                            </li>
                            <li>
                                <a href="#"
                                   className="block py-2 pr-4 pl-3 text-white rounded hover:bg-primary md:hover:bg-transparent  md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Event</a>
                            </li>
                            <li>
                                <a href="#"
                                   className="block py-2 pr-4 pl-3 text-white rounded hover:bg-primary md:hover:bg-transparent  md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Blog</a>
                            </li>
                            <li>
                                <a href="#"
                                   className="block py-2 pr-4 pl-3 text-white rounded hover:bg-primary md:hover:bg-transparent  md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
                            </li>
                        </ul>
                    </div>
            </div>
        </nav>
        // <nav className="flex items-center justify-between flex-wrap bg-transparent p-6 ">
        //     <div className="flex items-center flex-shrink-0 text-white mr-6">
        //         <LogoType width={161} height={21}/>
        //     </div>
        //
        //     <div className="block lg:hidden">
        //         <button
        //             className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
        //             <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        //                 <title>Menu</title>
        //                 <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
        //             </svg>
        //         </button>
        //     </div>
        //     <div className="w-full lg:w-auto  block  md:gap-20 lg:gap-80  lg:flex lg:items-center   ">
        //         <div className="lg:flex-grow font-Gilroy-Bold">
        //             <a href="#responsive-header"
        //                className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white mr-4">
        //                 Home
        //             </a>
        //             <a href="#responsive-header"
        //                className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white mr-4">
        //                 Play
        //             </a>
        //             <a href="#responsive-header"
        //                className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white mr-4">
        //                 Marketplace
        //             </a>
        //             <a href="#responsive-header"
        //                className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white mr-4">
        //                 Docs
        //             </a>
        //             <a href="#responsive-header"
        //                className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white mr-4">
        //                 Event
        //             </a>
        //             <a href="#responsive-header"
        //                className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white mr-4">
        //                 Blog
        //             </a>
        //             <a href="#responsive-header"
        //                className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white mr-4">
        //                 Contact
        //             </a>
        //
        //         </div>
        //         <div className={"flex items-center gap-10"}>
        //              <HeaderIcon width={24} height={24} />
        //              <a href={"/#/rl"} className={"font-Gilroy-Bold text-base text-white"}>
        //                  Login
        //              </a>
        //              <button type="button" className=" focus:outline-none focus:ring-blue-300 md:mr-0">
        //                  <ConnectWallet  text={"Connect Wallet"} />
        //              </button>
        //         </div>
        //     </div>
        // </nav>
        )
};
