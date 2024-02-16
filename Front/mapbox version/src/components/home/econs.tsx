// @flow 
import * as React from 'react';
import ImmersiveBackground from "../../assets/images/Immersive.webp";
import {LearnMoreArrowRight} from "../base/more";

type Props = {
    
};
export const Econs = (props: Props) => {
    return (
        <section className={"relative w-full md:mt-40"}>
            <section className={"md:h-57 md:w-57 h-96"} style={{
                backgroundImage:`url(${ImmersiveBackground})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
            }}>
            </section>
            <section className={"md:absolute top-0 w-full flex items-center justify-center md:h-57"}>
                <aside className={"hidden md:block w-10% -rotate-90 text-xl font-Gilroy-Light text-white -mt-52"}>Econs</aside>
                <div className={"hidden md:block flex flex-col w-45%"}>

                </div>
                <div className={"md:w-45% w-full flex flex-col  text-white font-Gilroy-Light"}>
                                    <span className={"text-primary text-50px  uppercase tracking-widest px-4"}>
                                        Immersive 3D
                                    </span>
                    <span className={"font-Gilroy-Bold mt-6 px-4"}>
                                        Being a more immersive
                                    </span>
                    <span className={"font-Gilroy-Bold px-4"}>
                                        and all-compassing virtual world.
                                    </span>
                    <p className={"mt-8 md:pr-80 px-4"}>
                        TehLand is built based on real spatial data in Unreal Engine 5. It’s runnable in both PC and VR mode, and the mobile version is being developed. Using new technologies in Unreal Engine 5, TehLand is an immersive world without any limitation on geographical bounds.
                    </p>
                    <div className={"relative text-center w-155px mt-14"}>
                        <LearnMoreArrowRight />
                        <span className={"text-white text-lg font-Gilroy-Light absolute top-0 bg-transparent w-full right-2"}>LEARN MORE</span>
                    </div>

                </div>
            </section>
        </section>
    );
};