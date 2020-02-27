import React from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import './Auth.css'
import loginImg from '../../assets/Images/login.png'
import registerImg from '../../assets/Images/register.png'
import logologin from '../../assets/Images/logologin.png'
import strings from '../../assets/Locals/locals'
import EnterPageTwo from './EnterPageTwo'
import { connect } from 'react-redux';
import close from '../../assets/Images/close.png'

class EnterPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: true,
            pageStatus: '',
            flag: null
        }
        this.toggle = this.toggle.bind(this)
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
        this.props.openEnterPage()
    }

    render() {
        strings.setLanguage(this.props.appLanguage)
        return (
            <div className="EnterPageView">
                {this.state.flag && <EnterPageTwo pageStatus={this.state.pageStatus} flag={this.state.flag} openPageTwo={this.props.openEnterPage} />}
                {/* <Button color="danger" onClick={this.toggle}>Click</Button> */}
                <Modal className="styleAuthModal" style={{ direction: this.props.appLanguage === "ar" ? "rtl" : "ltr" }} isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle} className="pb-0">
                        <img src={logologin} alt="logologin" />
                        <img src={close} alt="close" className="closeModal" onClick={this.toggle} />
                    </ModalHeader>
                    <ModalBody className="specialWidth mt-3">
                        <div className="EnterPageBody">
                            <div onClick={() => this.setState({ pageStatus: strings.login, flag: "login", modal: false })}>
                                <div className="AuthGreenBox mb-3">
                                    <img src={loginImg} alt="loginImg" />
                                </div>
                                <div className="AuthGreenTitle">
                                    <h3>{strings.login}</h3>
                                </div>
                            </div>
                            <div onClick={() => this.setState({ pageStatus: strings.registeration, flag: "register", modal: false })}>
                                <div className="AuthOrangeBox mb-3">
                                    <img src={registerImg} alt="registerImg" />
                                </div>
                                <div className="AuthOrangeTitle">
                                    <h3>{strings.registeration}</h3>
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

export default connect(mapStateToProps, null)(EnterPage);