// @flow
import * as React from 'react';
import {Navigation} from "../../pages/home/navigation";
import HeaderBackgroundImage from "../../assets/images/header.webp";
import {LogoImage, LogoType} from "../base/svg/Logo";

type Props = {

};
export const Header = (props: Props) => {
    return (

        <section id={"headerWapper"} className={"bg-header"}>
            {/*<nav className={"flex justify-between items-center px-20 py-10"}>*/}
            {/*    <div>*/}
            {/*        <a href={"/"}><LogoType width={161} height={21}/></a>*/}
            {/*    </div>*/}
            {/*    <div>*/}
            {/*        <ul className={"text-white font-Gilroy-Bold text-base flex gap-10"}>*/}
            {/*            <li><a href="/">Home</a></li>*/}
            {/*            <li><a href="/">Play</a></li>*/}
            {/*            <li><a href="/#/marketplace">Marketplace</a></li>*/}
            {/*            <li><a href="/">Docs</a></li>*/}
            {/*            <li><a href="/">Event</a></li>*/}
            {/*            <li><a href="/">Blog</a></li>*/}
            {/*            <li><a href="/">Contact</a></li>*/}
            {/*        </ul>*/}
            {/*    </div>*/}
            {/*    <div className={"flex justify-center gap-10 items-center"}>*/}
            {/*        <span>*/}
            {/*            <HeaderIcon width={24} height={24} />*/}
            {/*        </span>*/}
            {/*        <a href={"/#/rl"} className={"font-Gilroy-Bold text-base text-white"}>*/}
            {/*            Login*/}
            {/*        </a>*/}
            {/*        <span>*/}
            {/*            <ConnectWallet  text={"Connect Wallet"} />*/}
            {/*        </span>*/}
            {/*    </div>*/}
            {/*</nav>*/}
            <Navigation />
            <section style={{
                backgroundImage:`url(${HeaderBackgroundImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }} className={"md:pt-50rem pt-10 w-full h-80 md:h-full relative "}>
                {/*<section style={{backgroundImage:`url("../../assets/images/header.webp")`}} className={"h-96"}>*/}
                <div className={"flex flex-col  justify-center items-center absolute top-0 text-center w-full mt-40"}>
                    <LogoImage  customClass={"md:w-222px md:h-80px w-117.22px h-41.65px"}/>
                    <LogoType  customClass={"mt-6 w-258px h-32.13px md:w-500 md:h-80px "}  />
                    <span className={"text-white md:tracking-header tracking-headerMobile font-Gilroy-Light "}>
                            A world of infinite extent
                        </span>
                </div>
            </section>
        </section>
    );
};