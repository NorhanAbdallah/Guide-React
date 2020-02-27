import React from 'react';
import { Modal, ModalHeader, ModalBody, InputGroupAddon, InputGroupText, Form, Row, Container, Col, Input, InputGroup, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Field, reduxForm } from 'redux-form'
import validate from './ValidationRegister'
import strings from '../../../assets/Locals/locals'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios'
import { API_ENDPOINT } from '../../../AppConfig'
import { saveUser } from "../../../Redux/Action/UserAction";
import { countriesKeys } from './Countries'
import { showSnack } from 'react-redux-snackbar';
import EGY from '../../../assets/Images/Countries/EGY.png'
import FacebookLogin from 'react-facebook-login';
import firebase from "firebase"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import close from '../../../assets/Images/close.png'

// firebase.initializeApp({
//     apiKey: "AIzaSyAtWhpgPtQ1Puw8M3sUJnneNGrcAguVZOk",
//     authDomain: "guide-app-website.firebaseapp.com",
// })

const renderField = ({ appLanguage, changeType, icone, className, input, label, type, meta: { touched, error } }) => (
    <div style={{ marginBottom: "15px" }}>
        <div className="d-flex inputShadow">
            <Input {...input} placeholder={label} type={type} className={className} />
            {icone &&
                <InputGroupAddon addonType="append">
                    <InputGroupText className={appLanguage === "ar" ? "Authaddonar" : "Authaddonen"}>
                        <i className={icone} onClick={changeType} style={{ cursor: icone === 'fa fa-eye' || icone === "fa fa-eye-slash" ? "pointer" : "" }}></i>
                    </InputGroupText>
                </InputGroupAddon>
            }
        </div>
        <div>
            {touched && ((error && <span className={appLanguage === "ar" ? "erroMSGAuthar" : "erroMSGAuthen"} > {appLanguage === "ar" ? error.ar : error.en}</span>))}
        </div>
    </div >
)

class UserRegistration extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: true,
            changeTypeFunOne: false,
            changeTypeFunTwo: false,
            phoneVal: "",
            BTNClicked: false,
            countryKey: '20',
            coundtryName: '',
            flagcountry: '',
            toggleKey: false
        }
        this.toggle = this.toggle.bind(this)
        this.toggleCountryKeys = this.toggleCountryKeys.bind(this)
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
        this.props.openPageLogin()
    }

    toggleCountryKeys() {
        this.setState(prevState => ({
            toggleKey: !prevState.toggleKey
        }));
    }

    ButtonChange = () => {
        this.setState({ BTNClicked: true })
    }

    changeTypeFunOne = () => {
        this.setState({ changeTypeFunOne: !this.state.changeTypeFunOne })
    }

    changeTypeFunTwo = () => {
        this.setState({ changeTypeFunTwo: !this.state.changeTypeFunTwo })
    }

    signupUserRequest(values) {
        let uri = `${API_ENDPOINT}/signup`;
        axios.post(uri, values, {
            headers: {
                'Accept-Language': this.props.appLanguage,
                // 'Content-Type': 'application/json'
            }
        }).then(res => {
            this.props.saveUser(res.data.token, res.data.user);
            this.setState(prevState => ({
                modal: !prevState.modal
            }));
        }).catch(error => {
            error.response.data.errors.map((item) => {
                if (!error.response) {
                    this.props.showSnack('myUniqueId', {
                        label: this.props.appLanguage === 'en' ? 'Network Error' : 'خطأ فى الاتصال بالانترنت',
                        timeout: 7000,
                        button: { label: this.props.appLanguage === 'en' ? 'Signup' : ' تسجيل اشتراك' }
                    });
                }
                else if (error.response.status === 404) {
                    this.props.showSnack('myUniqueId', {
                        label: this.props.appLanguage === 'en' ? 'Password or email is not correct' : 'البريد الالكترونى او كلمة المرور غير صحيحة',
                        timeout: 7000,
                        button: { label: this.props.appLanguage === 'en' ? 'Signup' : ' تسجيل اشتراك' }
                    });
                }
                else if (error.response.status === 400) {
                    this.props.showSnack('myUniqueId', {
                        label: item.msg,
                        timeout: 7000,
                        button: { label: this.props.appLanguage === 'en' ? 'Signup' : ' تسجيل اشتراك' }
                    });
                }
                else if (error.response.status === 422) {
                    this.props.showSnack('myUniqueId', {
                        label: item.msg,
                        timeout: 7000,
                        button: { label: this.props.appLanguage === 'en' ? 'Signup' : ' تسجيل اشتراك' }
                    });
                }
                else if (error.response.status === 403) {
                    this.props.showSnack('myUniqueId', {
                        label: item.msg,
                        timeout: 7000,
                        button: { label: this.props.appLanguage === 'en' ? 'LogIn' : ' تسجيل اشتراك' }
                    });
                }
            })
        })
    }

    onSubmit = (values) => {
        let data = new FormData()
        values.type = this.props.flag === "business" ? "BUSINESS" : "CLIENT"
        data.append("name", values.name)
        data.append("username", values.username)
        data.append("phone", this.state.phoneVal)
        data.append("email", values.email)
        data.append("password", values.password)
        data.append("type", values.type)
        data.append("countryCode", this.state.countryKey)
        this.signupUserRequest(data)
    }

    handleChangePhone = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            this.setState({ phoneVal: e.target.value })
        }
    }

    responseFacebook(response) {
        let uri = `${API_ENDPOINT}/socialLogin`;
        let data = {
            userId: response.userID,
            name: response.name,
            signupType: "FACEBOOK"
        }
        axios.post(uri, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            this.props.saveUser(res.data.token, res.data.user, true);
            this.setState(prevState => ({
                modal: !prevState.modal
            }));
        })
        // console.log("resposne is", response)
    }

    SignedByTwitter(user) {
        let uri = `${API_ENDPOINT}/socialLogin`;
        let data = {
            userId: user.uid,
            name: user.displayName,
            signupType: "TWITTER"
        }
        axios.post(uri, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            console.log("responseTWITTER", res)
            this.props.saveUser(res.data.token, res.data.user, true);
            this.setState(prevState => ({
                modal: !prevState.modal
            }));
        })
    }

    uiConfig = {
        signInFlow: "popup",
        signInOptions: [
            firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
            signInSuccess: () => false
        }
    }

    componentDidMount = () => {
        firebase.auth().signOut()
        firebase.auth().onAuthStateChanged(user => {
            this.setState({ isSignedIn: !!user })
            if(user) this.SignedByTwitter(user)
        })
    }

    render() {

        strings.setLanguage(this.props.appLanguage)
        const { handleSubmit } = this.props

        const responseFacebook = (response) => {
            this.responseFacebook(response)
        }

        return (
            <div className="UserRegistrationView">
                {/* <Button color="danger" onClick={this.toggle}>Click</Button> */}
                <Modal className="styleAuthModal styleAuthModalWidth" style={{ direction: this.props.appLanguage === "ar" ? "rtl" : "ltr" }} isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle} className="mb-0 pb-0 AuthGreenTitle">
                        <h2>{strings.registeration}</h2>
                        <img src={close} alt="close" className="closeModal" onClick={this.toggle} />
                    </ModalHeader>
                    <ModalBody>
                        <h2 className="mb-4 text-center">{strings.user}</h2>
                        <div>
                            <Form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                                <Container fluid>
                                    <Row>
                                        <Col lg="6" md="6" sm="12" xs="12">
                                            <Field
                                                className={this.props.appLanguage === "ar" ? "AuthInputar" : "AuthInputen"}
                                                name="name"
                                                type="text"
                                                component={renderField}
                                                label={strings.name}
                                                icone="fa fa-user"
                                                appLanguage={this.props.appLanguage}
                                            />
                                        </Col>
                                        <Col lg="6" md="6" sm="12" xs="12">
                                            <Field
                                                className={this.props.appLanguage === "ar" ? "AuthInputar" : "AuthInputen"}
                                                name="username"
                                                type="text"
                                                component={renderField}
                                                label={strings.username}
                                                icone="fa fa-user"
                                                appLanguage={this.props.appLanguage}
                                            />
                                        </Col>
                                        <Col lg="6" md="6" sm="12" xs="12">
                                            <Field
                                                className={this.props.appLanguage === "ar" ? "AuthInputar" : "AuthInputen"}
                                                name="email"
                                                type="text"
                                                component={renderField}
                                                label={strings.email}
                                                icone="fa fa-envelope"
                                                appLanguage={this.props.appLanguage}
                                            />
                                        </Col>
                                        <Col lg="6" md="6" sm="12" xs="12" style={{marginBottom: "30px"}}>
                                            <div className="inputShadow selectCountryKey">
                                                <InputGroup>
                                                    <Input type="text" className={this.props.appLanguage === "ar" ? "AuthInputar" : "AuthInputen"} name="phone" value={this.state.phoneVal} onChange={this.handleChangePhone} placeholder={strings.phone} />
                                                    <InputGroupAddon addonType="prepend" >
                                                        <InputGroupText className={this.props.appLanguage === "ar" ? "Authaddonar" : "Authaddonen"}>
                                                            <Dropdown isOpen={this.state.toggleKey} toggle={this.toggleCountryKeys}>
                                                                <DropdownToggle>
                                                                    {this.state.coundtryName ? <span>{this.state.coundtryName} <img src={this.state.flagcountry} alt="flagcountry" /></span> :
                                                                        <span>
                                                                            EG <img src={EGY} alt="EG" />
                                                                        </span>}
                                                                </DropdownToggle>
                                                                <DropdownMenu style={{ top: this.props.appLanguage === "ar" ? "" : "auto" }}>
                                                                    {countriesKeys.map((element, index) => {
                                                                        return (
                                                                            <DropdownItem onClick={() => this.setState({ countryKey: element.value, coundtryName: element.countryCode, flagcountry: element.flag })} key={index} value={element.value}>
                                                                                {element.countryCode} <img src={element.flag} alt={element.countryCode} />
                                                                            </DropdownItem>
                                                                        )
                                                                    }
                                                                    )}
                                                                </DropdownMenu>
                                                            </Dropdown>
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                            </div>
                                            {(this.state.BTNClicked && !this.state.phoneVal) &&
                                                <span className="erroMSGAuthen"> {strings.phoneNumber}</span>
                                            }
                                            {(this.state.BTNClicked && this.state.phoneVal && !this.state.countryKey) &&
                                                <span className="erroMSGAuthen"> {strings.phoneCode}</span>
                                            }
                                        </Col>
                                        <Col lg="6" md="6" sm="12" xs="12">
                                            <Field
                                                className={this.props.appLanguage === "ar" ? "AuthInputar" : "AuthInputen"}
                                                name="password"
                                                type={this.state.changeTypeFunOne ? "text" : "password"}
                                                component={renderField}
                                                label={strings.password}
                                                icone={this.state.changeTypeFunOne ? "fa fa-eye-slash" : "fa fa-eye"}
                                                changeType={this.changeTypeFunOne}
                                                appLanguage={this.props.appLanguage}
                                            />
                                        </Col>
                                        <Col lg="6" md="6" sm="12" xs="12">
                                            <Field
                                                className={this.props.appLanguage === "ar" ? "AuthInputar" : "AuthInputen"}
                                                name="confirmpassword"
                                                type={this.state.changeTypeFunTwo ? "text" : "password"}
                                                component={renderField}
                                                label={strings.confpassword}
                                                icone={this.state.changeTypeFunTwo ? "fa fa-eye-slash" : "fa fa-eye"}
                                                changeType={this.changeTypeFunTwo}
                                                appLanguage={this.props.appLanguage}
                                            />
                                        </Col>
                                        <Col lg="12">
                                            <button className="btn-block styleBTN" onClick={this.ButtonChange} >{strings.register}</button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Form>
                        </div>
                        <p className="text-center mt-3 socialLinks d-flex">
                            <span className="mr-4 pt-2" style={{ fontWeight: "700", fontSize: "20px" }}>
                                {strings.registerby}
                            </span>
                            <StyledFirebaseAuth
                                uiConfig={this.uiConfig}
                                firebaseAuth={firebase.auth()}
                            />
                            <FacebookLogin
                                appId="443119196610324"
                                autoLoad={false}
                                fields="name,email,picture"
                                callback={responseFacebook}
                            />
                        </p>
                    </ModalBody>
                </Modal>
            </div >
        )
    }
}

const mapStateToProps = state => {
    return {
        appLanguage: state.HeaderReducer.appLanguage,
    }
}
const mapDispatchToProps = dispatch => bindActionCreators(
    {
        saveUser,
        showSnack
    }
    , dispatch
)
export default reduxForm({
    form: 'UserRegistration',
    validate
})(connect(mapStateToProps, mapDispatchToProps)(UserRegistration));