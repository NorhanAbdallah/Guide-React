import React from 'react'
import './Profile.css'
import { connect } from 'react-redux';
import { Row, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Button, Form, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import strings from '../../assets/Locals/locals'
import axios from 'axios'
import { API_ENDPOINT } from '../../AppConfig'
import EGY from '../../assets/Images/Countries/EGY.png'
import { countriesKeys } from './Countries'
import { Field, reduxForm } from 'redux-form'
import validate from './ValidationProfile'
import { saveUser } from "../../Redux/Action/UserAction";
import { ReIntializeUser } from '../../Redux/Action/UserAction'
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom'
import { showSnack } from 'react-redux-snackbar';
import {init} from '../../Redux/Action/SocketAction.js'

const renderField = ({ appLanguage, changeType, icone, className, input, label, type, meta: { touched, error } }) => (
    <div style={{ marginBottom: "20px" }}>
        <div className={className}>
            <Input {...input} placeholder={label} type={type} className={className} />
            {icone &&
                <InputGroupAddon addonType="append">
                    <InputGroupText>
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

class EditProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            changeTypeFunOne: false,
            changeTypeFunTwo: false,
            changeTypeFunThree: false,
            phoneVal: "",
            countryKey: '20',
            coundtryName: '',
            flagcountry: '',
            toggleKey: false,
            BTNClicked: false,
            redirect: false
        }
        this.toggleCountryKeys = this.toggleCountryKeys.bind(this)
    }

    changeTypeFunOne = () => {
        this.setState({ changeTypeFunOne: !this.state.changeTypeFunOne })
    }

    changeTypeFunTwo = () => {
        this.setState({ changeTypeFunTwo: !this.state.changeTypeFunTwo })
    }
    changeTypeFunThree = () => {
        this.setState({ changeTypeFunThree: !this.state.changeTypeFunThree })
    }

    ButtonChange = () => {
        this.setState({ BTNClicked: true })
    }

    handleChangePhone = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            this.setState({ phoneVal: e.target.value })
        }
    }

    toggleCountryKeys() {
        this.setState(prevState => ({
            toggleKey: !prevState.toggleKey
        }));
    }

    editProfile(values) {
        let uri = `${API_ENDPOINT}/user/updateInfo`;
        axios.put(uri, values, {
            headers: {
                Authorization: `Bearer ${this.props.token}`,
                'Accept-Language': this.props.appLanguage
            }
        }).then(res => {
            this.setState({ redirect: true })
            this.props.ReIntializeUser(this.props.token, res.data)
            this.props.saveUser(this.props.token, res.data, localStorage.getItem('remebermestate') === 'false' ? false : true)
        }).catch(error => {
            console.log("error is",error.response)
            if (error.response.status === 403) {
                this.props.showSnack('myUniqueId', {
                    label: error.response.data.errors,
                    timeout: 7000,
                    button: { label: this.props.appLanguage === 'en' ? 'LogIn' : ' تسجيل اشتراك' }
                });
            }
            else{
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
            })
        }
            
        })
    }
    componentWillMount = () => {
        let guideuser = sessionStorage.guideuser;
        // {guideuser && 
          console.log("userdataaaainprofile",guideuser)
          this.props.init()
        //   }
        this.setState({phoneVal: this.props.user.phone})
        let object ={};
           object.name = this.props.user.name;
           object.email = this.props.user.email;
           object.phone = this.props.user.phone;
           object.countryCode = this.props.user.countryCode;
           
           this.props.initialize(object);
       
      };
    onSubmit = (values) => {
        let data = new FormData()
        data.append("type", this.props.user.type)
        data.append("name", values.name)
        data.append("email", values.email)
        data.append("phone", this.state.phoneVal)
        data.append("countryCode", this.state.countryKey)
        data.append("currentPassword", values.password)
        data.append("newPassword", values.newpassword)
        this.editProfile(data)
    }

    render() {

        if (this.state.redirect && this.props.user.type === "CLIENT") {
            return (
                <Redirect to="/Guide" />
            )
        }
        else if (this.state.redirect) {
            return (
                <Redirect to="/Guide/Profile" />
            )
        }
        // if (!this.props.token) {
        //     return (
        //         <Redirect to="/Guide" />
        //     )
        // }
        strings.setLanguage(this.props.appLanguage)
        const { handleSubmit, submitting } = this.props

        return (
            this.props.user &&
            <div className="editProfile">
                <div className="editProfile-BG"></div>
                <div className="editprofile-body">
                    <h2>{strings.editprofile}</h2>
                    {!this.props.token &&  <Redirect to="/Guide" />}
                    <Form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                        <div className="editProfile-form">
                            <Container fluid>
                                <Row>
                                    <Col lg="12">
                                        <Field
                                            className={this.props.appLanguage === "ar" ? "inputar" : "inputen"}
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
                                            className={this.props.appLanguage === "ar" ? "inputar" : "inputen"}
                                            name="email"
                                            type="text"
                                            component={renderField}
                                            label={strings.email}
                                            icone="fa fa-envelope"
                                            changeType={this.changeTypeFun}
                                            appLanguage={this.props.appLanguage}
                                        />
                                    </Col>
                                    <Col lg="6" md="6" sm="12" xs="12" style={{ marginBottom: "20px" }}>
                                        <div>
                                            <InputGroup className={this.props.appLanguage === "ar" ? "inputar" : "inputen"} style={{ borderRadius: "15px" }}>
                                                <Input type="text" name="phone" value={this.state.phoneVal} onChange={this.handleChangePhone} placeholder={strings.phone} />
                                                <InputGroupAddon addonType="prepend" >
                                                    <InputGroupText>
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
                                            <span className="mt-3 erroMSGAuthen"> {strings.phoneNumber}</span>
                                        }
                                        {(this.state.BTNClicked && this.state.phoneVal && !this.state.countryKey) &&
                                            <span className="mt-3 erroMSGAuthen"> {strings.phoneCode}</span>
                                        }
                                    </Col>
                                    <Col lg="12">
                                        <Field
                                            className={this.props.appLanguage === "ar" ? "inputar" : "inputen"}
                                            name="password"
                                            type={this.state.changeTypeFunOne ? "text" : "password"}
                                            component={renderField}
                                            label={strings.profpassword}
                                            icone={this.state.changeTypeFunOne ? "fa fa-eye-slash" : "fa fa-eye"}
                                            changeType={this.changeTypeFunOne}
                                            appLanguage={this.props.appLanguage}
                                        />
                                    </Col>
                                    <Col lg="6" md="6" sm="12" xs="12">
                                        <Field
                                            className={this.props.appLanguage === "ar" ? "inputar" : "inputen"}
                                            name="newpassword"
                                            type={this.state.changeTypeFunTwo ? "text" : "password"}
                                            component={renderField}
                                            label={strings.newpassword}
                                            icone={this.state.changeTypeFunTwo ? "fa fa-eye-slash" : "fa fa-eye"}
                                            changeType={this.changeTypeFunTwo}
                                            appLanguage={this.props.appLanguage}
                                        />
                                    </Col>
                                    <Col lg="6" md="6" sm="12" xs="12">
                                        <Field
                                            className={this.props.appLanguage === "ar" ? "inputar" : "inputen"}
                                            name="confirmpassword"
                                            type={this.state.changeTypeFunThree ? "text" : "password"}
                                            component={renderField}
                                            label={strings.confpassword}
                                            icone={this.state.changeTypeFunThree ? "fa fa-eye-slash" : "fa fa-eye"}
                                            changeType={this.changeTypeFunThree}
                                            appLanguage={this.props.appLanguage}
                                        />
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                        <button className="btn-block styleBTN" onClick={this.ButtonChange} >{strings.saveBTN}</button>
                    </Form >


                </div>
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
        init,
        saveUser,
        ReIntializeUser,
        showSnack
    }
    , dispatch
)
export default reduxForm({
    form: 'EditProfile',
    validate
})(connect(mapStateToProps, mapDispatchToProps)(EditProfile));