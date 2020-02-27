import React from 'react'
import { Input, Row, Col, InputGroupAddon, InputGroupText, Form, Container, InputGroup, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalBody } from 'reactstrap';
import { Field, reduxForm } from 'redux-form'
import validate from './ValidationRegister'
import strings from '../../../assets/Locals/locals'
import axios from 'axios'
import { API_ENDPOINT } from '../../../AppConfig'
import { countriesKeys } from './Countries'
import { saveUser } from "../../../Redux/Action/UserAction";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EGY from '../../../assets/Images/Countries/EGY.png'
import plus from '../../../assets/Images/plus.png'

const renderField = ({ appLanguage, children, changeType, icone, className, input, label, type, meta: { touched, error } }) => (

    <div style={{ marginBottom: type === "select" ? "" : "15px" }}>
        <div className={type === "file" ? "" : "d-flex inputShadow"}>
            {type === "select" ?
                <select {...input} placeholder={label} type={type} className={className}  >
                    {children}
                </select> :
                type === "file" ?
                    <Input type="file" name="file" id="exampleFile" onChange={changeType} />
                    :
                    <Input {...input} placeholder={label} type={type} className={className} />
            }
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

class ElectronicRegistration extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            changeTypeFunOne: false,
            changeTypeFunTwo: false,
            imagePreviewUrl: null,
            fileSelected: null,
            allCountries: [],
            countrySelected: '',
            phoneVal: "",
            countryKey: '20',
            coundtryName: '',
            toggleKey: false,
            BTNClicked: false,
            specialarabic: '',
            specialenglish: '',
            currentlang: '',
            rules: null,
            checked: false,
        }
        this.toggleCountryKeys = this.toggleCountryKeys.bind(this)
        this.toggleRules = this.toggleRules.bind(this)
    }

    toggleRules() {
        this.setState(prevState => ({
            modalRules: !prevState.modalRules
        }));
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

    handleChangeCountry = (event) => {
        this.setState({ countrySelected: event.target.value });
    }

    handleChangeimg = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({
                file: file,
                fileSelected: file.name,
                imagePreviewUrl: reader.result
            });
        }
        if (file) {
            reader.readAsDataURL(file)
        }
    }

    handleChangeSpecialEnglish = e => {
        const re = /^[a-zA-Z\s]+$/;
        if (e.target.value === '' || re.test(e.target.value))
            this.setState({
                specialenglish: e.target.value
            });
    };

    handleChangeSpecialArabic = e => {
        const re = /^[ا-ي\s]+$/;
        if (e.target.value === '' || re.test(e.target.value))
            this.setState({
                specialarabic: e.target.value
            });
    };

    getCountries(lang) {
        let uri = `${API_ENDPOINT}/country`;
        axios.get(uri, {
            headers: {
                'Accept-Language': lang
            }
        }).then(res => {
            this.setState({ allCountries: res.data.data });
        }).catch(err => {
        })
    }

    onSubmit = (values) => {
        if (this.state.checked) {
            let data = new FormData()
            data.append("type", "ELECTRONIC_TRADING")
            data.append("username", values.username)
            data.append("password", values.password)
            data.append("email", values.email)
            data.append("phone", this.state.phoneVal)
            data.append("countryCode", this.state.countryKey)
            data.append("countryId", this.state.countrySelected)
            // data.append("activityName", JSON.stringify({ ar: values.shoparabic, en: values.shopenglish }))
            data.append("activityName", JSON.stringify({ ar: this.state.specialarabic, en: this.state.specialenglish }))
            data.append("logo", this.state.imagePreviewUrl)
            // for (let pair of data.entries()) {
            //     console.log("values from on submit fn:" + pair[0] + "_" + pair[1])
            // }

            this.props.GetData(data)
        }
    }

    getRules(lang) {
        let uri = `${API_ENDPOINT}/companies`
        axios.get(uri, {
            headers: {
                'Accept-Language': lang
            }
        }).then(response => {
            this.setState({ rules: response.data.data[0].conditionsAndRulesText })
        })
    }

    UNSAFE_componentWillMount() {
        let currentlang = this.props.appLanguage
        this.setState({ currentlang: currentlang })
        this.getCountries(this.props.appLanguage)
        this.getRules(this.props.appLanguage)
    }

    handleChangePhone = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            this.setState({ phoneVal: e.target.value })
        }
    }

    render() {

        if (this.state.currentlang !== this.props.appLanguage) {
            this.setState({ currentlang: this.props.appLanguage }, () => {
                this.getCountries(this.state.currentlang)
                this.getRules(this.props.appLanguage)
            })
        }
        strings.setLanguage(this.props.appLanguage)
        const { handleSubmit } = this.props

        return (
            <div className="ElectronicRegistrationView">
                <Form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                    <Container fluid>
                        <Row>
                            {this.state.fileSelected ?
                                <Col lg="12" className="mb-3">
                                    <div className="text-center" style={{ position: "relative" }}>
                                        <img src={this.state.imagePreviewUrl} width="75" />
                                        <i onClick={() => this.setState({ fileSelected: null })} style={{ position: "absolute", color: "red", top: "-5px", cursor: "pointer" }} className="fa fa-times"></i>
                                    </div>
                                </Col>
                                :
                                <Col lg="12">

                                    <label className="custom-file-upload AuthOrangeTitle mb-2">
                                        <img src={plus} alt="plus" className="d-block mx-auto" width="26" />
                                        {strings.enterlogo}
                                    </label>

                                    <Field
                                        component={renderField}
                                        type="file"
                                        name="logoSign"
                                        changeType={(event) => this.handleChangeimg(event)}
                                        appLanguage={this.props.appLanguage}
                                    />
                                </Col>
                            }
                        </Row>
                        <Row style={{ marginBottom: "15px" }}>
                            <Col lg="6" md="12" sm="12" sm="12">
                                <Row>
                                    <Col lg="6" md="12" sm="12" sm="12" style={{ marginBottom: "15px" }}>
                                        {/* <Field
                                            className="GeneralAuthInput"
                                            name="shoparabic"
                                            type="text"
                                            component={renderField}
                                            label={strings.arabicshop}
                                            appLanguage={this.props.appLanguage}
                                        /> */}
                                        <div className="specialLabelStyle">
                                            {/* <label style={{ display: this.state.specialarabic ? "none" : "" }} className={this.props.appLanguage === "ar" ? "labelar" : "labelen"}>{strings.arabicshop} <span>*</span></label> */}
                                            <div className="inputShadow">
                                                <Input placeholder={strings.arabicshop} value={this.state.specialarabic} onChange={this.handleChangeSpecialArabic} typ="text" name="shoparabic" className="GeneralAuthInput" />
                                            </div>
                                            {(this.state.BTNClicked && !this.state.specialarabic) &&
                                                <span className={this.props.appLanguage === "ar" ? "erroMSGAuthar" : "erroMSGAuthen"}> {strings.shoparabicerror}</span>
                                            }
                                        </div>
                                    </Col>
                                    <Col lg="6" md="12" sm="12" sm="12" style={{ marginBottom: "15px" }}>
                                        {/* <Field
                                            className="GeneralAuthInput"
                                            name="shopenglish"
                                            type="text"
                                            component={renderField}
                                            label={strings.englishshop}
                                            appLanguage={this.props.appLanguage}
                                        /> */}
                                        <div className="specialLabelStyle">
                                            {/* <label style={{ display: this.state.specialenglish ? "none" : "" }} className={this.props.appLanguage === "ar" ? "labelar" : "labelen"}>{strings.englishshop} <span>*</span></label> */}
                                            <div className="inputShadow">
                                                <Input placeholder={strings.englishshop} value={this.state.specialenglish} onChange={this.handleChangeSpecialEnglish} typ="text" name="shopenglish" className="GeneralAuthInput" />
                                            </div>
                                            {(this.state.BTNClicked && !this.state.specialenglish) &&
                                                <span className={this.props.appLanguage === "ar" ? "erroMSGAuthar" : "erroMSGAuthen"}> {strings.shopenglisherror}</span>
                                            }
                                        </div>
                                    </Col>
                                    <Col lg="12" md="12" sm="12" sm="12" style={{ marginBottom: "15px" }}>
                                        <Field className="GeneralAuthInput"
                                            name="country"
                                            type="select"
                                            appLanguage={this.props.appLanguage}
                                            onChange={this.handleChangeCountry}
                                            value={this.state.countrySelected}
                                            component={renderField}>
                                            <option selected disabled value={''}>{strings.countryOp}</option>
                                            {
                                                this.state.allCountries.map((country, index) => {
                                                    return (
                                                        <option value={country.id} key={index}>
                                                            {country.name}
                                                        </option>
                                                    )
                                                })
                                            }
                                        </Field>
                                        <div className={this.props.appLanguage === 'ar' ? "arrowDown" : "arrowDownEN"} > <i class="fas fa-chevron-down"></i> </div>
                                    </Col>
                                    <Col lg="12" md="12" sm="12" sm="12" style={{ marginBottom: "15px" }}>
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
                                </Row>
                            </Col>
                            <Col lg="6" md="12" sm="12" sm="12" >
                                <Row className={this.props.appLanguage === "ar" ? "verticleBorderar" : "verticleBorderen"}>
                                    <Col lg="12" md="12" sm="12" xs="12">
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
                                    <Col lg="12" md="12" sm="12" xs="12">
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
                                    <Col lg="6" md="12" sm="12" xs="12">
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
                                    <Col lg="6" md="12" sm="12" xs="12" className="removeSpecialMargin">
                                        <Field
                                            className={this.props.appLanguage === "ar" ? "AuthInputar" : "AuthInputen"}
                                            name="confirmpassword"
                                            type={this.state.changeTypeFunTwo ? "text" : "password"}
                                            component={renderField}
                                            label={strings.confpassworderror}
                                            icone={this.state.changeTypeFunTwo ? "fa fa-eye-slash" : "fa fa-eye"}
                                            changeType={this.changeTypeFunTwo}
                                            appLanguage={this.props.appLanguage}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg="12" className="agreecheckbox">
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <Input onClick={() => this.setState({ checked: !this.state.checked })} addon type="checkbox" />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <label style={{ cursor: "pointer" }} onClick={this.toggleRules}>{strings.agreecheckbox}</label>
                                </InputGroup>
                                {(this.state.BTNClicked && !this.state.checked) &&
                                    <span className={this.props.appLanguage === "ar" ? "erroMSGAuthar mt-0 mx-4" : "erroMSGAuthen mt-0 mx-4"}>{strings.errorchecked}</span>
                                }
                            </Col>
                        </Row>
                        <button className="btn-block styleBTN" onClick={this.ButtonChange}>{strings.register}</button>
                    </Container>
                </Form>
                <Modal className="styleRules" style={{ direction: this.props.appLanguage === "ar" ? "rtl" : "ltr" }} isOpen={this.state.modalRules} toggle={this.toggleRules}>
                    <ModalBody className="specialWidth d-flex">
                        {(this.state.rules && (this.props.appLanguage === "ar" ? this.state.rules.ar : this.state.rules.en))}
                    </ModalBody>
                </Modal>
            </div>
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
        saveUser
    }
    , dispatch
)
export default reduxForm({
    form: 'ElectronicRegistration',
    validate
})(connect(mapStateToProps, mapDispatchToProps)(ElectronicRegistration));