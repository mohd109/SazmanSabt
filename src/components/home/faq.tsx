import "./faq.scss";
import React from "react";
import cx from "classnames";
import Collapse from "@kunukn/react-collapse";

class FAQ extends React.Component {
    state = {
        isOpen1: true,
        isOpen2: false,
        isOpen3: false,
        isOpen4: false,
        isOpen5: false,
        spy3: {}
    };

    render() {
        return (
            <div className={"px-4 block"}>
                <article>
                   <button className={cx("app__toggle", {"app__toggle--active": this.state.isOpen1 })} onClick={() => this.toggle1(1)} >
                       <span className="app__toggle-text">Can gamers make money?</span>
                   </button>
                   <Collapse isOpen={this.state.isOpen1} className={"app__collapse app__collapse--gradient " +(this.state.isOpen1 ? "app__collapse--active" : "")}>
                       <div className="app__content">
                           Since each item is an NFT, it has a different stat, thus it can be more effective than other copies with the same upgrade level. So, TehLand has a P2P trade capability for its items. Basically, any gamer can get an item, play with it and sell it at a higher price.
                       </div>
                   </Collapse>
               </article>
                <article>
                    <button className={cx("app__toggle ", {"app__toggle--active": this.state.isOpen2 })} onClick={() => this.toggle2(2)} >
                        <span className="app__toggle-text text-left">How can programmers and content providers make money?</span>
                    </button>
                    <Collapse isOpen={this.state.isOpen2} className={"app__collapse app__collapse--gradient " +(this.state.isOpen2 ? "app__collapse--active" : "")}>
                        <div className="app__content">
                            TehLand has a unique feature, which is integrating freelancers and companies in the process of importing physical businesses into our metaverse. Basically, programmers and content providers can produce blueprints, codes, and content as 3D models or ready-to-play environments in Unreal Engine 5 to help business to enter, develop or grow in TehLand Metaverse.
                        </div>
                    </Collapse>
                </article>
                <article>
                    <button className={cx("app__toggle ", {"app__toggle--active": this.state.isOpen3 })} onClick={() => this.toggle3(3)} >
                        <span className="app__toggle-text text-left">Is TehLand limited in times of the day? </span>
                    </button>
                    <Collapse isOpen={this.state.isOpen3} className={"app__collapse app__collapse--gradient " +(this.state.isOpen3 ? "app__collapse--active" : "")}>
                        <div className="app__content">
                            No, TehLand is open 24/7 and all businesses can operate at any time.
                        </div>
                    </Collapse>
                </article>
                <article>
                    <button className={cx("app__toggle ", {"app__toggle--active": this.state.isOpen4 })} onClick={() => this.toggle4(4)} >
                        <span className="app__toggle-text text-left">What does the enterprise blockchain do?  </span>
                    </button>
                    <Collapse isOpen={this.state.isOpen4} className={"app__collapse app__collapse--gradient " +(this.state.isOpen4 ? "app__collapse--active" : "")}>
                        <div className="app__content">
                            Using enterprise blockchain will speed up the transactions and decrease the transaction fee at the same time.
                        </div>
                    </Collapse>
                </article>
                <article>
                    <button className={cx("app__toggle ", {"app__toggle--active": this.state.isOpen5 })} onClick={() => this.toggle5(5)} >
                        <span className="app__toggle-text text-left">How businesses can interact with their virtual counterpart? </span>
                    </button>
                    <Collapse isOpen={this.state.isOpen5} className={"app__collapse app__collapse--gradient " +(this.state.isOpen5 ? "app__collapse--active" : "")}>
                        <div className="app__content">
                            There is a management panel for importing and editing the products. In order to change their land environment, they can resubmit the Unreal Engine 5 project to TehLand.
                        </div>
                    </Collapse>
                </article>
            </div>
        );
    }

    toggle1 = index => {
        let collapse = "isOpen" + index;
        this.setState(prevState => ({ [collapse]: !prevState[collapse] }));
        this.setState({isOpen2 : false})
        this.setState({isOpen3 : false})
        this.setState({isOpen4 : false})
        this.setState({isOpen5 : false})
        // this.setState(prevState => ({ [collapse]: !prevState[collapse] }));
    };
    toggle2 = index => {
        let collapse = "isOpen" + index;
        this.setState(prevState => ({ [collapse]: !prevState[collapse] }));
        this.setState({isOpen1 : false})
        this.setState({isOpen3 : false})
        this.setState({isOpen4 : false})
        this.setState({isOpen5 : false})
        // this.setState(prevState => ({ [collapse]: !prevState[collapse] }));
    };
    toggle3 = index => {
        let collapse = "isOpen" + index;
        this.setState(prevState => ({ [collapse]: !prevState[collapse] }));
        this.setState({isOpen1 : false})
        this.setState({isOpen2 : false})
        this.setState({isOpen4 : false})
        this.setState({isOpen5 : false})
        // this.setState(prevState => ({ [collapse]: !prevState[collapse] }));
    };
    toggle4 = index => {
        let collapse = "isOpen" + index;
        this.setState(prevState => ({ [collapse]: !prevState[collapse] }));
        this.setState({isOpen1 : false})
        this.setState({isOpen2 : false})
        this.setState({isOpen3 : false})
        this.setState({isOpen5 : false})
        // this.setState(prevState => ({ [collapse]: !prevState[collapse] }));
    };
    toggle5 = index => {
        let collapse = "isOpen" + index;
        this.setState(prevState => ({ [collapse]: !prevState[collapse] }));
        this.setState({isOpen1 : false})
        this.setState({isOpen2 : false})
        this.setState({isOpen3 : false})
        this.setState({isOpen4 : false})
        // this.setState(prevState => ({ [collapse]: !prevState[collapse] }));
    };
}

export default FAQ;
