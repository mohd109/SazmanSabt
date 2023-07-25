// @flow 
import * as React from 'react';

type Props = {
    text:string;
    customeClass?:string;
};
export const TextArrows = (props: Props) => {
    const {text,customeClass} = props;
    return (
        <>
            <div className={customeClass}>
                <span>
                <svg width="52" height="50" viewBox="0 0 52 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d_331_265)">
                <path d="M25.1 18.6L27.7 18.6L33.54 26.32L30.14 26.32L26.46 21.44L22.38 26.32L18.94 26.32L25.1 18.6ZM25.1 28.36L27.7 28.36L33.54 36.08L30.14 36.08L26.46 31.2L22.38 36.08L18.94 36.08L25.1 28.36Z" fill="white"/>
                </g>
                <defs>
                <filter id="filter0_d_331_265" x="0.940002" y="0.600098" width="50.6" height="53.48" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset/>
                <feGaussianBlur stdDeviation="9"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_331_265"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_331_265" result="shape"/>
                </filter>
                </defs>
                </svg>
            </span>
                <span className={"font-Gilroy-Medium text-white text-lg -my-1"}>
                {text}
                </span>
                <span className={"rotate-180"}>
                <svg width="52" height="50" viewBox="0 0 52 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d_331_265)">
                <path d="M25.1 18.6L27.7 18.6L33.54 26.32L30.14 26.32L26.46 21.44L22.38 26.32L18.94 26.32L25.1 18.6ZM25.1 28.36L27.7 28.36L33.54 36.08L30.14 36.08L26.46 31.2L22.38 36.08L18.94 36.08L25.1 28.36Z" fill="white"/>
                </g>
                <defs>
                <filter id="filter0_d_331_265" x="0.940002" y="0.600098" width="50.6" height="53.48" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset/>
                <feGaussianBlur stdDeviation="9"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_331_265"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_331_265" result="shape"/>
                </filter>
                </defs>
                </svg>
            </span>
            </div>
        </>
    );
};