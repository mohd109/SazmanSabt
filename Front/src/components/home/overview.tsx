// @flow
import * as React from 'react';
import {LearnMoreArrowRight} from "../base/more";
import {One, Three, Two} from "../base/numbers";
import numberOne from "../../assets/images/unreal.webp";
import numberTwo from "../../assets/images/gamer.webp";
import numberThree from "../../assets/images/three.webp";

type Props = {

};
export const Overview = (props: Props) => {
    return (
        <section className={"md:flex items-center gap-4 mt-10"}>
            <aside className={"hidden md:block md:w-10%  -rotate-90 text-xl font-Gilroy-Light text-white"}>Overview</aside>
            <div className={"flex flex-col w-full md:w-45%"}>
                        <span className={"text-white font-Gilroy-Bold md:text-xl md:-mt-10 -mt-8"}>
                                Building a gaming ecosystem that’s truly
                        </span>
                <span className={"text-primary md:text-67 text-36 font-Gilroy-Light tracking-widest mt-8"}>
                            ECONOMICALLY
                        </span>
                <span className={"text-primary md:text-69 text-36 font-Gilroy-Light tracking-widest md:mt-4 -mt-2 "}>
                            SUSTAINABLE
                        </span>
                <span className={"font-Gilroy-Bold text-xl text-white mt-8 px-4"}>
                            Eco-loop
                        </span>
                <span className={"text-white font-Gilroy-Light text-lg mt-2 px-4"}>
                            An economical loop d
                        </span>
                <span className={"text-white font-Gilroy-Light text-lg px-4"}>
                            esigned to be a win-win.
                        </span>
                <div className={"pl-10 md:pl-0"}>
                    <div className={"relative text-center w-155px  mt-10"}>
                        <LearnMoreArrowRight />
                        <span className={"text-white text-lg font-Gilroy-Light absolute top-0 bg-transparent w-full right-2"}>LEARN MORE</span>
                    </div>
                </div>
            </div>
            <div className={"md:w-45% w-full flex flex-col md:gap-10 gap-10"}>
                <article className={"md:flex md:gap-12"}>
                    <div className={"flex relative md:w-250 w-full px-4 md:px-0"}>
                                    <span className={"text-white text-base font-Gilroy-Light  text-22px pt-4"}>
                                        Immersive realistic 3D environment using Unreal Engine 5
                                    </span>
                        <span className={"absolute md:right-0 right-4 "}><One/></span>
                    </div>
                    <div className={"md:w-250 w-full px-4 py-6 md:py-0"}>
                        <img src={numberOne} width={250} className={"w-full"}    alt=""/>
                    </div>
                </article>
                <article className={"md:flex flex-row-reverse md:gap-12"}>
                    <div className={"flex relative md:w-250 w-full px-4"}>
                                    <span className={"text-white text-base font-Gilroy-Light  text-22px -mt-2 relative z-20"}>
                                        A complete ecosystem for Businesses, Content providers, Programmers, and Gamers
                                    </span>
                        <span className={"absolute right-0 z-10 -mt-2"}><Two/></span>
                    </div>
                    <div className={"md:w-250 w-full py-6 px-4"}>
                        <img src={numberTwo} width={250}  className={"w-full"}  alt=""/>
                    </div>
                </article>
                <article className={"md:flex gap-12"}>
                    <div className={"flex relative md:w-250 w-full pt-4 px-4"}>
                                    <span className={"text-white text-base font-Gilroy-Light  text-22px pt-4"}>
                                       Based on real-world data, connected to the real world
                                    </span>
                        <span className={"absolute right-0"}><Three/></span>
                    </div>
                    <div className={"md:w-250 w-full py-6 px-4"}>
                        <img src={numberThree} width={250} className={"w-full"}   alt=""/>
                    </div>
                </article>
            </div>
        </section>
    );
};