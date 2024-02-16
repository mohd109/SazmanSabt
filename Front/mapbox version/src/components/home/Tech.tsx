// @flow
import * as React from 'react';
import Prosecss from "../../assets/images/processor.webp"
import Prosecss2 from "../../assets/images/item2.webp"
type Props = {

};
export const TechItems = (props: Props) => {
    return (
        <section className={"w-full relative flex flex-col justify-center items-center font-Gilroy-Light text-xl" }>
            <TechItem1/>
            <div className={"flex "}>
                <TechItem2/>
                <TechItem3/>
                <TechItem4/>
            </div>
        </section>
    );
};
export const TechItem1 = (props: Props) => {
    return (
        <div className={"flex flex-col items-center justify-center relative w-261px relative right-16 -top-20"}>
            <span className={"ml-12"}>Metahuman</span>
            <span className={"ml-20 mt-2"}>
                <svg width="7" height="45" viewBox="0 0 7 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.833333 41.5C0.833333 42.9728 2.02724 44.1667 3.5 44.1667C4.97276 44.1667 6.16667 42.9728 6.16667 41.5C6.16667 40.0272 4.97276 38.8333 3.5 38.8333C2.02724 38.8333 0.833333 40.0272 0.833333 41.5ZM3 0V41.5H4V0H3Z" fill="white"/>
                    </svg>
            </span>
            <span className={"-mt-4"}>
                <img src={Prosecss} alt=""/>
            </span>
        </div>
    );
};
export const TechItem2 = (props: Props) => {
    return (
        <div className={"flex flex-col items-center justify-center :relative md:w-261px w-32 -top-24" }>
            <span className={"ml-12"}>Hyperledger Fabric</span>
            <span className={"ml-20 mt-2"}>
                <svg width="7" height="45" viewBox="0 0 7 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.833333 41.5C0.833333 42.9728 2.02724 44.1667 3.5 44.1667C4.97276 44.1667 6.16667 42.9728 6.16667 41.5C6.16667 40.0272 4.97276 38.8333 3.5 38.8333C2.02724 38.8333 0.833333 40.0272 0.833333 41.5ZM3 0V41.5H4V0H3Z" fill="white"/>
                    </svg>
            </span>
            <span className={"-mt-6"}>
                <img src={Prosecss2} width={199} alt=""/>
            </span>
        </div>
    );
};
export const TechItem3 = (props: Props) => {
    return (
        <div className={"flex flex-col items-center justify-center relative w-261px relative  right-10" }>
            <span className={"ml-12"}>Laser scanning</span>
            <span className={"ml-20 mt-2"}>
                <svg width="7" height="45" viewBox="0 0 7 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.833333 41.5C0.833333 42.9728 2.02724 44.1667 3.5 44.1667C4.97276 44.1667 6.16667 42.9728 6.16667 41.5C6.16667 40.0272 4.97276 38.8333 3.5 38.8333C2.02724 38.8333 0.833333 40.0272 0.833333 41.5ZM3 0V41.5H4V0H3Z" fill="white"/>
                    </svg>
            </span>
            <span className={"-mt-4"}>
                <img src={Prosecss2} width={151} alt=""/>
            </span>
        </div>
    );
};
export const TechItem4 = (props: Props) => {
    return (
        <div className={"flex flex-col items-center justify-center relative w-261px -top-28 right-20" }>
            <span className={"ml-12"}>Unreal engine 5</span>
            <span className={"ml-20 mt-2"}>
                <svg width="7" height="45" viewBox="0 0 7 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.833333 41.5C0.833333 42.9728 2.02724 44.1667 3.5 44.1667C4.97276 44.1667 6.16667 42.9728 6.16667 41.5C6.16667 40.0272 4.97276 38.8333 3.5 38.8333C2.02724 38.8333 0.833333 40.0272 0.833333 41.5ZM3 0V41.5H4V0H3Z" fill="white"/>
                    </svg>
            </span>
            <span className={"-mt-4"}>
                <img src={Prosecss} width={192} alt=""/>
            </span>
        </div>
    );
};
