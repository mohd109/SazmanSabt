// @flow
import * as React from 'react';
import {LearnMoreArrowRight} from "../base/more";
import {Economy} from "./Economy";

type Props = {

};
export const TokenEconomy = (props: Props) => {
    return (
        <section className={"md:flex items-center justify-between gap-40 items-center md:mt-52"}>
            <aside className={"hidden md:block w-10%  -rotate-90 text-xl font-Gilroy-Light text-white"}>Token Economy</aside>
            <div className="md:w-45% md:flex flex-col text-white px-4">
                                <span className={"font-Gilroy-Bold text-xl w-full block "}>
                                Solution
                                </span>
                <span className={" text-primary md:text-50px text-3xl block uppercase tracking-completeS font-Gilroy-Light mt-8"}>
                                Token
                                </span>
                <span className={" text-primary md:text-50px text-3xl block uppercase tracking-completeS font-Gilroy-Light md:-mt-4"}>
                                Economy
                                </span>
                <p className={"font-Gilroy-Light text-lg mt-10 w-full"}>
                    TehLand is profit-for-all platform. It doesn’t matter if you’re a gamer, freelancer or a business, you can earn in TehLand. by gaming, selling products or contributing to the environment.
                </p>
                <div className={"relative text-center w-full w-155px mt-16"}>
                    <LearnMoreArrowRight />
                    <span className={"text-white text-lg font-Gilroy-Light absolute top-0 bg-transparent w-full right-2"}>LEARN MORE</span>
                </div>
            </div>
            <div className="md:w-45% w-full">
                <Economy/>
            </div>
        </section>
    );
};