// @flow
import * as React from 'react';
import {TextArrows} from "../textArrows";

type Props = {

};
export const CirclesOutSide = (props: Props) => {
    return (
        <>
            <svg {...props} width="501" height="501" viewBox="0 0 501 501" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="250.5" cy="250.5" r="249.5" stroke="#261037" strokeWidth="2"/>
            </svg>

        </>
    );
};
export const CirclesBetweenSide = (props: Props) => {
    return (
        <>
                <span className={"relative"}>
                    <TextArrows customeClass={"flex flex-col w-16 items-center justify-center absolute right-48 -top-10 z-50"} text={"Business"}/>
                        <svg width="445" height="445" viewBox="0 0 445 445" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_d_331_186)">
                            <circle cx="222.5" cy="218.5" r="202.5" stroke="#502771" strokeWidth="2" shapeRendering="crispEdges"/>
                        </g>
                        <defs>
                            <filter id="filter0_d_331_186" x="0" y="0" width="445" height="445" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                <feMorphology radius="3" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_331_186"/>
                                <feOffset dy="4"/>
                                <feGaussianBlur stdDeviation="8"/>
                                <feComposite in2="hardAlpha" operator="out"/>
                                <feColorMatrix type="matrix" values="0 0 0 0 0.396078 0 0 0 0 0.188235 0 0 0 0 0.556863 0 0 0 0.7 0"/>
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_331_186"/>
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_331_186" result="shape"/>
                            </filter>
                        </defs>
                    </svg>
                    <TextArrows customeClass={"flex flex-col w-16 items-center justify-center absolute -right-2 top-40 z-50"} text={"Gamer"}/>
                    <TextArrows customeClass={"flex flex-col w-40 items-center justify-center absolute -left-12 top-60 z-50"} text={"Content Provider"}/>
            </span>
        </>
    );
};
export const CirclesInSide = (props: Props) => {
    return (
        <>
            <svg width="381" height="381" viewBox="0 0 381 381" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d_331_185)">
                    <circle cx="190.5" cy="190.5" r="161.5" stroke="#65308E" strokeWidth="2" shapeRendering="crispEdges"/>
                </g>
                <defs>
                    <filter id="filter0_d_331_185" x="0" y="0" width="381" height="381" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feMorphology radius="3" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_331_185"/>
                        <feOffset/>
                        <feGaussianBlur stdDeviation="12.5"/>
                        <feComposite in2="hardAlpha" operator="out"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0.396078 0 0 0 0 0.188235 0 0 0 0 0.556863 0 0 0 1 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_331_185"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_331_185" result="shape"/>
                    </filter>
                </defs>
            </svg>


        </>
    );
};
