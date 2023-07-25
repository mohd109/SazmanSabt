// @flow
import * as React from 'react';
import techCircle from "../../assets/images/techcircles.webp";
import TechBlur from "../../assets/images/techblur.webp";
import {TechItems} from "./Tech";

type Props = {

};
export const TechSection = (props: Props) => {
    return (
        <section className={"md:mt-35rem mt-96 flex items-center justify-center !w-80 md:!w-full overflow-hidden md:overflow-inherit"} style={{
            backgroundImage:`url(${techCircle})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition:"center",
            height:"882px",
            width: "140vh"
        }}>
            <section className={"md:flex gap-4 items-center justify-center  text-white"}  style={{
                backgroundImage:`url(${TechBlur})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition:"center",
                height:"100%",
                width:"100%"

            }}>

                <div className={"hidden md:block md:w-10%   -rotate-90 text-xl font-Gilroy-Light text-white"}>Tech</div>
                <div className={"md:w-70% w-full"}>
                    <TechItems/>
                </div>
                <div className={"md:w-30% w-full"}>
                    <div className={"flex flex-col gap-10  justify-center -mt-10 ml-20"}>
                        <span className={"text-xl font-Gilroy-Bold"}>Solution</span>
                        <span className={"text-primary text-50px  uppercase tracking-completeS font-Gilroy-Light"}>Tech</span>
                    </div>
                </div>
            </section>
        </section>
    );
};