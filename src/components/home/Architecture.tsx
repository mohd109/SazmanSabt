// @flow 
import * as React from 'react';
import {CirclesBetweenSide, CirclesInSide, CirclesOutSide} from "../base/svg/Circles";
import archworld from "../../assets/images/archworld.webp"
import {TextArrows} from "../base/textArrows";
type Props = {
    
};
export const Architecture = (props: Props) => {
    return (
        <>
            <section className={"hidden md:block w-full  relative  flex flex-col items-center justify-center"}>
                <div className={"absolute top-0 z-10"}>
                    <CirclesOutSide/>
                </div>
                <div className={"absolute top-8 z-20"}><CirclesBetweenSide/></div>
                {/*<TextArrows customeClass={"right-0"} text={"Gamer"}/>*/}
                <div className={"absolute top-14 z-30"}><CirclesInSide/></div>
                {/*<TextArrows text={"Content Provider"}/>*/}
                <div className={"absolute top-28 z-10"}><img src={archworld} className={"bg-transparent"} alt=""/></div>
            </section>

        </>
    );
};
