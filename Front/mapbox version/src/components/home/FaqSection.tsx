// @flow
import * as React from 'react';
import fluidball from "../../assets/images/fluidball.webp";
import FAQ from "./faq";
import {LearnMoreArrowRight} from "../base/more";

type Props = {

};
export const FaqSection = (props: Props) => {
    return (
        <section className={"flex flex-row-reverse relative mt-20"}>
            <section className={"h-60vh w-60vh "} style={{
                backgroundImage:`url(${fluidball})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
            }}>
            </section>
            <section className={"text-white md:flex gap-20 absolute w-full h-auto items-center  justify-between top-48"}>
                <aside className="hidden md:block w-10%  -rotate-90 text-xl font-Gilroy-Light text-white">FAQ</aside>
                <div className="md:w-45% w-full">
                    <FAQ/>
                </div>
                <div className="md:w-45% flex flex-col my-10 md:my-0 px-4">
                                    <span className={"font-Gilroy-Light text-primary text-50px  uppercase tracking-completeS md:-mt-6"}>
                                        FAQ
                                    </span>
                    <span className={"text-xl font-Gilroy-Light md:mt-14"}>
                                        NO QUESTIONS REMAIN
                                    </span>
                    <span className={"text-xl font-Gilroy-Light"}>
                                        UNANSWERED IN TEHLAND
                                    </span>
                    <div className={"relative text-center w-155px mt-24"}>
                        <LearnMoreArrowRight />
                        <span className={"text-white text-lg font-Gilroy-Light absolute top-0 bg-transparent w-full right-2"}>LEARN MORE</span>
                    </div>
                </div>
            </section>
        </section>
    );
};