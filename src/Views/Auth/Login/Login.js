import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, InputGroupAddon, InputGroupText, Form } from 'reactstrap';
import '../Auth.css'
import { Field, reduxForm } from 'redux-form'
import validate from './ValidationLogin'
import strings from '../../../assets/Locals/locals'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios'
import { API_ENDPOINT } from '../../../AppConfig'
import { saveUser } from "../../../Redux/Action/UserAction";
import { showSnack } from 'react-redux-snackbar';
import FacebookLogin from 'react-facebook-login';
import firebase from "firebase"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import close from '../../../assets/Images/close.png'
import Payment from '../payment'


firebase.initializeApp({
    apiKey: "AIzaSyAtWhpgPtQ1Puw8M3sUJnneNGrcAguVZOk",
    authDomain: "guide-app-website.firebaseapp.com",
})

const renderField = ({ appLanguage, changeType, icone, className, input, label, type, meta: { touched, error } }) => (
    <div style={{ marginBottom: "15px" }}>
        <div className="d-flex inputShadow">
            <input {...input} placeholder={label} type={type} className={className} style={{width: "100%"}} />
            {icone &&
                <InputGroupAddon addonType="append">
                    <InputGroupText className={appLanguage === "ar" ? "Authaddonar" : "Authaddonen"}>
                        <i className={icone} onClick={changeType} style={{ cursor: icone === 'fa fa-eye' || icone === "fa fa-eye-slash" ? "pointer" : "" }}></i>
                    </InputGroupText>
                </InputGroupAddon>
            }
        </div>
        <div>
            {touched && ((error && <span className={appLanguage === "ar" ? "erroMSGAuthar" : "erroMSGAuthen"}> {appLanguage === "ar" ? error.ar : error.en}</span>))}
        </div>
    </div >
)

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: true,
            changeType: false,
            checked: false
        }
        this.toggle = this.toggle.bind(this)
    }

    changeTypeFun = () => {
        this.setState({ changeType: !this.state.changeType })
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
        this.props.openPageLogin()
    }

    loginRequest(values) {
        let uri = `${API_ENDPOINT}/signin`;
        axios.post(uri, values, {
            headers: {
                'Accept-Language': this.props.appLanguage,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            this.props.saveUser(res.data.token, res.data.user, this.state.checked);
            this.setState(prevState => ({
                modal: !prevState.modal
            }));
        }).catch(error => {
            console.log("errors are", error.response)
            if (!error.response) {
                this.props.showSnack('myUniqueId', {
                    label: this.props.appLanguage === 'en' ? 'Network Error' : 'خطأ فى الاتصال بالانترنت',
                    timeout: 7000,
                    button: { label: this.props.appLanguage === 'en' ? 'LogIn' : ' تسجيل الدخول' }
                });
            } else if (error.response.status === 404) {
                this.props.showSnack('myUniqueId', {
                    label: this.props.appLanguage === 'en' ? 'Password or email is not correct' : 'البريد الالكترونى او كلمة المرور غير صحيحة',
                    timeout: 7000,
                    button: { label: this.props.appLanguage === 'en' ? 'LogIn' : ' تسجيل الدخول' }
                });
            } else if (error.response.status === 400) {
                this.props.showSnack('myUniqueId', {
                    label: error.response.data.errors,
                    timeout: 7000,
                    button: { label: this.props.appLanguage === 'en' ? 'LogIn' : ' تسجيل الدخول' }
                });
            } else if (error.response.status === 422) {
                this.props.showSnack('myUniqueId', {
                    label: error.response.data.errors,
                    timeout: 7000,
                    button: { label: this.props.appLanguage === 'en' ? 'LogIn' : ' تسجيل الدخول' }
                });
            } else if (error.response.status === 403) {
                this.props.showSnack('myUniqueId', {
                    label: error.response.data.errors,
                    timeout: 7000,
                    button: { label: this.props.appLanguage === 'en' ? 'LogIn' : ' تسجيل الدخول' }
                });
            }
        })
    }

    onSubmit = (values) => {
        values.type = this.props.flagStatus === "business" ? "BUSINESS" : "CLIENT"
        this.loginRequest(values)
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
            if (user) this.SignedByTwitter(user)
        })
    }

    render() {
        console.log("this.props.user.paid", this.props.user)
        strings.setLanguage(this.props.appLanguage)
        const { handleSubmit, submitting } = this.props

        const responseFacebook = (response) => {
            this.responseFacebook(response)
        }

        return (
            <div className="LoginView">
                {/* <Button color="danger" onClick={this.toggle}>Click</Button> */}
                <Modal className="styleAuthModal styleAuthLoginModal" style={{ direction: this.props.appLanguage === "ar" ? "rtl" : "ltr" }} isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle} className="pb-0">
                        <h2 className="AuthGreenTitle">{strings.login}</h2>
                        <img src={close} alt="close" className="closeModal" onClick={this.toggle} />
                    </ModalHeader>
                    <ModalBody className="specialWidth specialWidthLogin pt-0">
                        <h2 className="mb-4 AuthOrangeTitle">{this.props.userStatus}</h2>
                        <Form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                            <Field
                                className={this.props.appLanguage === "ar" ? "AuthInputar" : "AuthInputen"}
                                name="username"
                                type="text"
                                component={renderField}
                                label={strings.username}
                                icone="fa fa-user"
                                appLanguage={this.props.appLanguage}
                            />
                            <Field
                                className={this.props.appLanguage === "ar" ? "AuthInputar" : "AuthInputen"}
                                name="password"
                                type={this.state.changeType ? "text" : "password"}
                                component={renderField}
                                label={strings.password}
                                icone={this.state.changeType ? "fa fa-eye-slash" : "fa fa-eye"}
                                changeType={this.changeTypeFun}
                                appLanguage={this.props.appLanguage}
                            />

                            <div className="d-flex stylecheckBox">
                                {/* <Field
                                    id="rememberme"
                                    type="checkbox"
                                    component={renderField}
                                    name="checklogin"
                                /> */}
                                <input type="checkbox" id="checklogin" />
                                <label onClick={() => this.setState({ checked: !this.state.checked })} for="checklogin"></label>
                                <span for="checklogin" className="AuthGreenTitle">{strings.rememberme}</span>
                            </div>
                            <Button disabled={submitting} className="btn-block styleBTN mt-0">
                                {strings.loginBTN}
                            </Button>
                        </Form>
                        <p className="text-danger forgetPass">
                            <span>
                                {strings.forgetPassword}
                            </span>
                        </p>

                        {this.props.flagStatus !== "business" &&
                            <p className="text-center socialLinks">
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
                            </p>}
                    </ModalBody>
                </Modal>
                {(this.props.token && this.props.user && !this.props.user.paid) && <Payment />}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        appLanguage: state.HeaderReducer.appLanguage,
        token: state.UserReducer.token,
        user: state.UserReducer.user
    }
}
const mapDispatchToProps = dispatch => bindActionCreators(
    {
        saveUser,
        showSnack,
        
    }
    , dispatch
)
export default reduxForm({
    form: 'Login',
    validate
})(connect(mapStateToProps, mapDispatchToProps)(Login));
