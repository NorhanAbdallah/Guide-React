import React from 'react'
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import './Auth.css'
import userimg from '../../assets/Images/user.png'
import bunsinesimg from '../../assets/Images/busines.png'
import logologin from '../../assets/Images/logologin.png'
import strings from '../../assets/Locals/locals'
import { connect } from 'react-redux';
import Login from './Login/Login'
import UserRegister from './Registration/UserRegistration'
import BusinessRegisteration from './Registration/businessRegisterationHome'
import close from '../../assets/Images/close.png'

class EnterPageTwo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: true,
            pageStatus: this.props.pageStatus,
            userStatus: '',
            flagStatus: null,
        }
        this.toggle = this.toggle.bind(this)
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
        this.props.openPageTwo()
    }

    render() {
        strings.setLanguage(this.props.appLanguage)
        return (
            <div className="EnterPageTwoView">
                {/* <Button color="danger" onClick={this.toggle}>Click</Button> */}

                {(this.props.flag === "login" && this.state.flagStatus) && <Login userStatus={this.state.userStatus} flagStatus={this.state.flagStatus} openPageLogin={this.props.openPageTwo} />}

                {(this.props.flag === "register" && this.state.flagStatus === "user") &&
                    <UserRegister userStatus={this.state.userStatus} flagStatus={this.state.flagStatus} openPageLogin={this.props.openPageTwo} />}

                {(this.props.flag === "register" && this.state.flagStatus === "business") &&
                    <BusinessRegisteration userStatus={this.state.userStatus} flagStatus={this.state.flagStatus} openPageLogin={this.props.openPageTwo} />}


                <Modal className="styleAuthModal" style={{ direction: this.props.appLanguage === "ar" ? "rtl" : "ltr" }} isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle} className="pb-0">
                        <img src={logologin} alt="logologin" />
                        <img src={close} alt="close" className="closeModal" onClick={this.toggle} />
                    </ModalHeader>
                    <ModalBody className="specialWidth">
                        <h2 className="AuthGreenTitle">{this.state.pageStatus}</h2>
                        <div className="EnterPageBody">
                            <div onClick={() => this.setState({ userStatus: strings.user, flagStatus: 'user', modal: false })}>
                                <div className="AuthGreenBox mb-3">
                                    <img src={userimg} alt="userimg" />
                                </div>
                                <div className="AuthGreenTitle">
                                    <h3>{strings.user}</h3>
                                </div>
                            </div>
                            <div onClick={() => this.setState({ userStatus: strings.business, flagStatus: 'business', modal: false })}>
                                <div className="AuthOrangeBox mb-3">
                                    <img src={bunsinesimg} alt="bunsinesimg" />
                                </div>
                                <div className="AuthOrangeTitle">
                                    <h3>{strings.business}</h3>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        appLanguage: state.HeaderReducer.appLanguage
    }
}

export default connect(mapStateToProps, null)(EnterPageTwo);