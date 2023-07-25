// @flow
import * as React from 'react';
import roadmapblur from "../../assets/images/roadmapblur.webp";

type Props = {

};
export const Roadmap = (props: Props) => {
    return (
        <section className={"flex  relative mt-40 "}>
            <section className={"h-57 w-57 "} style={{
                backgroundImage:`url(${roadmapblur})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                height:"60vh",
                width:"60vh"
            }}>
            </section>
            <section className={"text-white flex items-center  md:absolute w-full  justify-between "}>
                <aside className="hidden md:block md:w-10% -rotate-90 text-xl font-Gilroy-Light ">Roadmap</aside>
                <section className={" flex flex-col gap-10 pr-20"}>
                                <span className={"mt-32 font-Gilroy-Light text-primary text-50px  uppercase tracking-completeS px-4"}>
                                    ROADMAP
                                </span>
                    <div className={"grid md:grid-cols-5 mt-10 px-6 gap-10 w-full"}>
                        <div className={"flex flex-col gap-6 text-white"}>
                                        <span className={"font-Gilroy-Bold text-xl"}>
                                            Q3 2021
                                        </span>
                            <ul className={"list-disc md:pl-10 pl-6 text-lg font-Gilroy-Light"}>
                                <li>Token Economy</li>
                                <li>Business Development</li>
                                <li>Game story design</li>
                                <li>Team Development</li>
                            </ul>
                        </div>
                        <div className={"flex flex-col gap-6 text-white"}>
                                        <span className={"font-Gilroy-Bold text-xl"}>
                                           Q1 2022
                                        </span>
                            <ul className={"list-disc md:pl-10 pl-6 text-lg font-Gilroy-Light"}>
                                <li>R&D for VR and Metaverse</li>
                                <li> Enterprise Blockchain Backend</li>
                                <li>Digital Twin Integration</li>
                            </ul>
                        </div>
                        <div className={"flex flex-col gap-6 text-white"}>
                                        <span className={"font-Gilroy-Bold text-xl"}>
                                          Q2 2022
                                        </span>
                            <ul className={"list-disc md:pl-10 pl-6 text-lg font-Gilroy-Light"}>
                                <li>Public Land Sale</li>
                                <li>Game Demo</li>
                            </ul>
                        </div>
                        <div className={"flex flex-col gap-6 text-white"}>
                                        <span className={"font-Gilroy-Bold text-xl"}>
                                          Q3 2022
                                        </span>
                            <ul className={"list-disc md:pl-10 pl-6 text-lg font-Gilroy-Light"}>
                                <li>Integration to NFT Marketplace</li>
                            </ul>
                        </div>
                        <div className={"flex flex-col gap-6 text-white"}>
                                        <span className={"font-Gilroy-Bold text-xl"}>
                                          Q2 2023
                                        </span>
                            <ul className={"list-disc md:pl-10 pl-6 text-lg font-Gilroy-Light"}>
                                <li>TehLand Smart Glove and VR Glass</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </section>
            <div className="clear-both"></div>
        </section>
    );
};