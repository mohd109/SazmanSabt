// @flow
import * as React from 'react';

type Props = {
    width:number;
    height:number;
};
export const HeaderIcon = (props: Props) => {
    const {width,height} =props;
    return (
        <>
            <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="7" stroke="#26A17B" strokeWidth="2"/>
                <path d="M20 20L17 17" stroke="#26A17B" strokeWidth="2" strokeLinecap="round"/>
            </svg>

        </>
    );
};