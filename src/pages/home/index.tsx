import * as React from 'react';
import './home.css';
// SVG Start
import {LogoType,LogoImage} from "../../components/base/svg/Logo"
import {HeaderIcon} from "../../components/base/svg/SearchIcons"
import {ConnectWallet} from "../../components/base/button"
import HeaderBackgroundImage from "../../assets/images/header.webp";
import ImmersiveBackground from "../../assets/images/Immersive.webp";
import TechBlur from "../../assets/images/techblur.webp";
import techCircle from "../../assets/images/techcircles.webp";
import techCircleReverse from "../../assets/images/techcirclesreversce.webp";
import numberOne from "../../assets/images/unreal.webp";
import numberTwo from "../../assets/images/gamer.webp";
import numberThree from "../../assets/images/three.webp";
import thlnd from "../../assets/images/thlnd.webp";
import fluidball from "../../assets/images/fluidball.webp";
import roadmapblur from "../../assets/images/roadmapblur.webp";
import {LearnMoreArrowRight} from "../../components/base/more";
import {One, Two,Three} from "../../components/base/numbers";
import {Architecture} from "../../components/home/Architecture";
import {TechItems} from "../../components/home/Tech";
import {Economy} from "../../components/home/Economy";
import {Discord, Facebook, Instagram, Twitter} from "../../components/base/svg/socials";
import {FooterLogoText} from "../../components/base/svg/footerLogoText";
// SVG End
import FAQ from "../../components/home/faq";
import {Navigation} from "./navigation";
import {Footer} from "../../components/layouts/footer";
import {Header} from "../../components/layouts/header";
import {Overview} from "../../components/home/overview";
import { BlueEqual} from "../../components/home/blueequal";
import {Econs} from "../../components/home/econs";
import {Gap} from "../../components/home/gap";
import {ArchitectureSection} from "../../components/home/ArchitectureSection";
import {TechSection} from "../../components/home/TechSection";
import {TokenEconomy} from "../../components/home/TokenEconomy";
import {TehlanCircle} from "../../components/home/TehlanCircle";
import {FaqSection} from "../../components/home/FaqSection";
import {Roadmap} from "../../components/home/Roadmap";
export const Home = () => {
    const [tab1, setTab1] = React.useState(true);
    const handlerTabClickOne = () =>{
        setTab1(!tab1);
    }
    return (
        <div>
            <Header/>
                <main className={"bg-black"}>
                    <BlueEqual/>
                   <Overview/>
                    <Econs/>
                    <Gap/>
                    <ArchitectureSection/>
                    <TechSection/>
                    <TokenEconomy/>
                    <TehlanCircle/>
                    <FaqSection/>
                    <Roadmap/>
            </main>
            <Footer/>
        </div>
    );
};
