// @flow
import * as React from 'react';
import {LearnMoreArrowRight} from "../base/more";

type Props = {

};
export const Gap = (props: Props) => {
    return (
        <div>
            <section className={"flex justify-between items-center mt-24"}>
                <aside className={"hidden md:block w-10%   -rotate-90 text-xl font-Gilroy-Light text-white -mt-52"}>Gap</aside>
                <section className={"md:w-90% w-full flex gap-y-4 flex-col justify-center items-center  font-Gilroy-Light text-primary md:text-50px text-2xl text-center  uppercase tracking-completeS"}>
                    <span>A complete ecosystem</span>
                    <span>connected to the</span>
                    <span>real world by both</span>
                    <span>data and economy</span>
                </section>
            </section>
            <section className={"flex flex-col container mx-auto items-center justify-center -mt-6"}>
                <div className={"relative text-center w-155px mt-14"}>
                    <LearnMoreArrowRight />
                    <span className={"text-white text-lg font-Gilroy-Light absolute top-0 bg-transparent w-full right-2"}>LEARN MORE</span>
                </div>
            </section>
        </div>
    );
};