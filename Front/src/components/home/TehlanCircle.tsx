// @flow
import * as React from 'react';
import techCircleReverse from "../../assets/images/techcirclesreversce.webp";
import thlnd from "../../assets/images/thlnd.webp";

type Props = {

};
export const TehlanCircle = (props: Props) => {
    return (
        <section className={" md:mt-40 flex items-center justify-center md:h-80vh md:w-160vh"} style={{
            backgroundImage:`url(${techCircleReverse})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition:"center",

        }}>
            <img src={thlnd}  className={"w-124vh mb-24"} alt=""/>

        </section>
    );
};