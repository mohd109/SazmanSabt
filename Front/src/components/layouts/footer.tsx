// @flow
import * as React from 'react';
import {LogoImage} from "../base/svg/Logo";
import {FooterLogoText} from "../base/svg/footerLogoText";
import {Discord, Facebook, Instagram, Twitter} from "../base/svg/socials";

type Props = {

};
export const Footer = (props: Props) => {
    return (
        <footer className={"bg-black md:px-40 "}>
            <div className={"container md:mx-auto"}>
                <section className={"md:flex  items-center justify-between  py-40  px-4"}>
                    <div className={"flex gap-2 py-6"}>
                        <div>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 3.00001V3.00001C19.6569 3.00001 21 4.34315 21 6.00001L21 8.14286C21 8.47698 21 8.64405 20.9234 8.76602C20.8834 8.82962 20.8296 8.8834 20.766 8.92336C20.644 9 20.477 9 20.1429 9L15 9M18 3.00001V3.00001C16.3431 3.00001 15 4.34315 15 6.00001L15 9M18 3.00001L7 3.00001C5.11438 3.00001 4.17157 3.00001 3.58579 3.58579C3 4.17158 3 5.11439 3 7.00001L3 21L6 20L9 21L12 20L15 21L15 9" stroke="#65308E" strokeWidth="2"/>
                                <path d="M7 7L11 7" stroke="#65308E" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M8 11H7" stroke="#65308E" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M7 15L10 15" stroke="#65308E" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <div className={"flex flex-col"}>
                                <span className={"font-Gilroy-Bold text-white text-xl"}>
                                    Subscribe to our newsletter️️
                                </span>
                                <p className={"text-white text-lg font-Gilroy-Light"}>
                                    Get the latest Metacube updates, sent straight to your inbox. No spam, only relevant content.
                                </p>
                        </div>
                    </div>
                    <div className={"flex flex-col "}>
                        <section className={"md:w-337px  relative"}>
                            <input type="text" className={"placeholder-holder w-full h-40px  rounded-10 pl-4 pr-32"} placeholder={"Enter your Email"}/>
                            <button className={"bg-primary text-white font-Gilroy-Medium h-40px text-lg px-8  text-center absolute top-0 right-0 rounded-newsletter "}>
                                Submit
                            </button>
                        </section>
                    </div>
                </section>


                <section className={"md:flex justify-between  md:gap-32  "}>
                    <div className={"flex flex-col items-center  "}>
                        <div><LogoImage width={100} height={80}/></div>
                        <div className={"mt-2"}><FooterLogoText/></div>
                    </div>
                    <div className={"text-white md:flex md:gap-32 text-left md:text-left my-10 md:mt-0 px-10"}>
                        <nav>
                                <span className={"font-Gilroy-Bold text-lg"}>
                                    Marketplace
                                </span>
                            <ul className={"mt-4 flex flex-col gap-2 font-Gilroy-Light"}>
                                <li><a href="">Gamers</a></li>
                                <li><a href="">Businesses</a></li>
                                <li><a href="">Freelancers</a></li>
                                <li><a href="">Added Value</a></li>
                                <li><a href="">Coverage</a></li>
                            </ul>
                        </nav>
                        <nav>
                            <span className={"font-Gilroy-Bold text-lg mt-10 md:mt-0 block"}>
                                Company
                            </span>
                            <ul className={"mt-4 flex flex-col gap-2  font-Gilroy-Light"}>
                                <li><a href="">About</a></li>
                                <li><a href="">Investor Relations</a></li>
                                <li><a href="">Agencis</a></li>
                            </ul>
                        </nav>
                        <nav>
                            <span className={"font-Gilroy-Bold text-lg mt-10 md:mt-0 block"}>
                                Support
                            </span>
                            <ul className={"mt-4 flex flex-col gap-2  font-Gilroy-Light"}>
                                <li><a href="">Contact</a></li>
                                <li><a href="">FAQ</a></li>
                            </ul>
                        </nav>
                    </div>
                    <div>
                        <div className={"text-white font-Gilroy-Light text-lg flex flex-col md:justify-end md:text-right text-center"}>
                            <span>Follow Us</span>
                        </div>
                        <div className={"flex gap-4 mt-2 items-center justify-center"}>
                            <a href=""><Discord/></a>
                            <a href=""><Twitter/></a>
                            <a href=""><Facebook/></a>
                            <a href=""><Instagram/></a>
                        </div>
                    </div>
                </section>




                <section  className={"md:flex  justify-between    py-10  text-white font-Gilroy-Light"}>
                    <div className={"flex justify-between gap-10 w-full"}>
                        <div className={"flex gap-10"}>
                            <a href="">Terms of Service</a>
                            <a href="">Privacy Policy</a>
                        </div>
                        <div className={"hidden md:block flex w-full gap-6"}>
                            <span>Create:</span>
                            <span className={"text-primary"}>iOFIN.TECH</span>
                        </div>
                    </div>
                    <div className={"flex  justify-between gap-10"}>
                            <span>
                                <select className={"bg-transparent border-none"}>
                                    <option value="/">EN</option>
                                    <option value="/">UT</option>
                                </select>
                            </span>
                        <span className={"text-primary font-Gilroy-Light"}>Copyrights © 2021</span>
                    </div>
                </section>





            </div>

        </footer>
    );
};