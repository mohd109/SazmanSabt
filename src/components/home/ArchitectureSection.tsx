// @flow
import * as React from 'react';
import {Architecture} from "./Architecture";

type Props = {

};
export const ArchitectureSection = (props: Props) => {
    return (
        <section className={"w-full  flex  md:mt-60 mt-8"}>
            <aside className={"hidden md:block w-10% -rotate-90 text-xl font-Gilroy-Light text-white mt-20"}>Architecture</aside>
            <section className={"md:w-45%"}>
                <article className={"w-full relative mt-10"}>
                    <div className={"text-secondary text-128 font-Gilroy-ExtraBold flex flex-col absolute top-0 z-10"}>
                        <span>TEH</span>
                        <span>LAND</span>
                    </div>
                    <div className={"flex flex-col gap-10  absolute top-0 z-20 p-8 ml-11"}>
                        <span className={"font-Gilroy-Bold text-white text-lg"}>Solution</span>
                        <span className={"text-primary md:text-50px text-2xl  uppercase tracking-completeS font-Gilroy-Light"}>Architecture</span>
                    </div>
                </article>
            </section>
            <section className={"w-45%"}>
                <Architecture/>
            </section>
        </section>
    );
};