// @flow 
import * as React from 'react';

type Props = {
    customClass?:string;
    text:string;
    handlerClick?:any;
};
export const ConnectWallet = (props: Props) => {
    const {customClass,text,handlerClick} = props;
    return (
        <>
            <button
            className={customClass + " bg-primary rounded-btn text-white font-Gilroy-Bold py-2 px-4"}
            onClick={handlerClick}
            >
                {text}
            </button>
        </>
    );
};