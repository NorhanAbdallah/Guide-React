import React from 'react'
import { Input, Row, Col, InputGroupAddon, InputGroupText, Form, Container, InputGroup, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalBody } from 'reactstrap';
import { Field, reduxForm } from 'redux-form'
import validate from './ValidationRegister'
import strings from '../../../assets/Locals/locals'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Moment from 'react-moment';
import axios from 'axios'
import { API_ENDPOINT } from '../../../AppConfig'
import { saveUser } from "../../../Redux/Action/UserAction";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { countriesKeys } from './Countries'
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

class EventsRegistration extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            changeTypeFunOne: false,
            changeTypeFunTwo: false,
            startDate: '',
            endDate: '',
            BTNClicked: false,
            imagePreviewUrl: null,
            fileSelected: null,
            allCountries: [],
            allCities: [],
            countrySelected: '',
            citySelected: '',
            phoneVal: "",
            countryKey: '20',
            coundtryName: '',
            toggleKey: false,
            specialarabic: '',
            specialenglish: '',
            currentlang: '',
            checked: false,
            currentDate: '',
            modalRules: false,
            rules: null
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

    handleChangestartdate = date => { this.setState({ startDate: date }) };

    handleChangeenddate = date => { this.setState({ endDate: date }); };

    changeTypeFunOne = () => {
        this.setState({ changeTypeFunOne: !this.state.changeTypeFunOne })
    }

    changeTypeFunTwo = () => {
        this.setState({ changeTypeFunTwo: !this.state.changeTypeFunTwo })
    }
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

    getCities(lang) {
        let uri = ''
        uri = `${API_ENDPOINT}/city?countryId=${this.state.countrySelected}`;
        axios.get(uri, {
            headers: {
                'Accept-Language': lang
            }
        }).then(res => {
            this.setState({ allCities: res.data.data });
        }).catch(err => {
        })
    }

    handleChangeCountry = (event) => {

        this.setState({ countrySelected: event.target.value, citySelected: '' }, () => {
            this.getCities(this.props.appLanguage)
            let data = {
                city: '',
                country: this.state.countrySelected,
                username: this.state.username,
                email: this.state.email,
                password: this.state.password,
                confirmpassword: this.state.confirmpassword
            }
            this.props.initialize(data)
        });
    }

    handleChangeCity = (event) => {
        this.setState({ citySelected: event.target.value });
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

    onSubmit = (values) => {
       
        if (this.state.checked) {
            let data = new FormData()
            data.append("type", "EVENT")
            data.append("username", values.username)
            data.append("password", values.password)
            data.append("email", values.email)
            data.append("phone", this.state.phoneVal)
            data.append("countryCode", this.state.countryKey)
            data.append("countryId", this.state.countrySelected)
            data.append("cityId", this.state.citySelected)
            // data.append("activityName", JSON.stringify({ ar: values.eventarabic, en: values.eventenglish }))
            data.append("activityName", JSON.stringify({ ar: this.state.specialarabic, en: this.state.specialenglish }))
            data.append("fromDate", this.state.startDate)
            data.append("toDate", this.state.endDate)
            data.append("logo", this.state.imagePreviewUrl)
            // for (let pair of data.entries()) {s
            //     console.log("values from on submit fn:" + pair[0] + "_" + pair[1])
            // }
            console.log("CHECKEDD", this.state.checked)
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

        var now = new Date();
        // var year = now.getFullYear();
        // var month = now.getMonth() + 1;
        // var day = now.getDate();
        this.setState({ currentDate: now })
    }

    ButtonChange = () => {
        this.setState({ BTNClicked: true })
    }

    handleChangePhone = (e) => {
        console.log("this.state.phoneVal", this.state.phoneVal)
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            this.setState({ phoneVal: e.target.value })
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



    render() {

        if (this.state.currentlang !== this.props.appLanguage) {
            this.setState({ currentlang: this.props.appLanguage }, () => {
                this.getCountries(this.state.currentlang)
                this.getCities(this.state.currentlang)
                this.getRules(this.props.appLanguage)
            })
        }
        strings.setLanguage(this.props.appLanguage)
        const { handleSubmit } = this.props

        return (
            <div className="EventsRegistrationView">
                <Form  onSubmit={handleSubmit(this.onSubmit.bind(this))}>
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
                            <Col lg="6" md="12" sm="12" sm="12" >
                                <Row>
                                    <Col lg="6" md="12" sm="12" sm="12" style={{ marginBottom: "15px" }}>
                                        {/* <Field
                                            className="GeneralAuthInput"
                                            name="eventarabic"
                                            type="text"
                                            component={renderField}
                                            label={strings.arabicevent}
                                            appLanguage={this.props.appLanguage}
                                        /> */}
                                        <div className="specialLabelStyle">
                                            {/* <label style={{ display: this.state.specialarabic ? "none" : "" }} className={this.props.appLanguage === "ar" ? "labelar" : "labelen"}>{strings.arabicevent} <span>*</span></label> */}
                                            <div className="inputShadow required">
                                                <Input placeholder={strings.arabicevent} onChange={this.handleChangeSpecialArabic} value={this.state.specialarabic} typ="text" name="eventarabic" className="GeneralAuthInput" />
                                            </div>

                                            {(this.state.BTNClicked && !this.state.specialarabic) &&
                                                <span className={this.props.appLanguage === "ar" ? "erroMSGAuthar" : "erroMSGAuthen"}> {strings.eventarabicerror}</span>
                                            }
                                        </div>
                                    </Col>
                                    <Col lg="6" md="12" sm="12" sm="12" style={{ marginBottom: "15px" }}>
                                        {/* <Field
                                            className="GeneralAuthInput"
                                            name="eventenglish"
                                            type="text"
                                            component={renderField}
                                            label={strings.englishevent}
                                            appLanguage={this.props.appLanguage}
                                        /> */}
                                        <div className="specialLabelStyle">
                                            {/* <label style={{ display: this.state.specialenglish ? "none" : "" }} className={this.props.appLanguage === "ar" ? "labelar" : "labelen"}>{strings.englishevent} <span>*</span></label> */}
                                            <div className="inputShadow">
                                                <Input placeholder={strings.englishevent} value={this.state.specialenglish} onChange={this.handleChangeSpecialEnglish} typ="text" name="eventenglish" className="GeneralAuthInput" />
                                            </div>

                                            {(this.state.BTNClicked && !this.state.specialenglish) &&
                                                <span className={this.props.appLanguage === "ar" ? "erroMSGAuthar" : "erroMSGAuthen"}> {strings.eventenglisherror}</span>
                                            }
                                        </div>
                                    </Col>
                                    <Col lg="6" md="12" sm="12" sm="12" style={{ marginBottom: "15px" }}>
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
                                    <Col lg="6" md="12" sm="12" sm="12" style={{ marginBottom: "15px" }}>
                                        <Field className="GeneralAuthInput"
                                            name="city"
                                            type="select"
                                            appLanguage={this.props.appLanguage}
                                            onChange={this.handleChangeCity}
                                            value={this.state.citySelected}
                                            component={renderField}>
                                            <option selected value={''}>{strings.cityOp}</option>
                                            {
                                                this.state.allCities.map((city, index) => {
                                                    return (
                                                        <option value={city.id} key={index}>
                                                            {city.name}
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
                                    <Col lg="12" md="12" sm="12" sm="12" >
                                        <Row>
                                            <Col lg="4" md="12" sm="12" xs="12">
                                                <div className="AuthGreenTitle pt-2 d-flex mb-2">{strings.eventtime}</div>
                                            </Col>
                                            <Col lg="4" md="6" sm="12" xs="12" className="mb-2">
                                                <div className="custom-date" style={{ marginBottom: "15px" }}>
                                                    {
                                                        this.state.startDate ? <Moment format="YYYY-MM-DD">{this.state.startDate}</Moment> : <h6><i className="fa fa-calendar-week mx-2"></i>{strings.startevent}</h6>
                                                    }
                                                </div>
                                                <div className="selectDateAuth">
                                                    <DatePicker selected={this.state.startDate} minDate={new Date()} onChange={(date) => this.handleChangestartdate(date)} />
                                                    {(this.state.BTNClicked && !this.state.startDate) &&
                                                        <span className={this.props.appLanguage === "ar" ? "erroMSGAuthar" : "erroMSGAuthen"}> {strings.startdate}</span>
                                                    }
                                                </div>
                                                {(this.state.BTNClicked && this.state.endDate && this.state.startDate > this.state.endDate) && <span className={this.props.appLanguage === "ar" ? "erroMSGAuthar mt-0" : "erroMSGAuthen mt-0"}>{strings.startdateerror}</span>}

                                                {/* {(this.state.BTNClicked && this.state.startDate && this.state.startDate < this.state.currentDate) && <span className={this.props.appLanguage === "ar" ? "erroMSGAuthar mt-0" : "erroMSGAuthen mt-0"}>{strings.startdateerror}</span>} */}
                                            </Col>
                                            <Col lg="4" md="6" sm="12" xs="12">
                                                <div className="custom-date" style={{ marginBottom: "25px" }}>
                                                    {
                                                        this.state.endDate ? <Moment format="YYYY-MM-DD">{this.state.endDate}</Moment> :
                                                            <h6><i className="fa fa-calendar-week mx-2"></i> {strings.endevent}</h6>
                                                    }
                                                </div>
                                                <div className="selectDateAuth">
                                                    <DatePicker selected={this.state.endDate} minDate={new Date(this.state.startDate)} onChange={(date) => this.handleChangeenddate(date)} disabled={this.state.startDate === "" ? true : false} />
                                                    {(this.state.BTNClicked && !this.state.endDate) &&
                                                        <span className={this.props.appLanguage === "ar" ? "erroMSGAuthar" : "erroMSGAuthen"}> {strings.enddate}</span>
                                                    }
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg="6" md="12" sm="12" sm="12">
                                <Row className={this.props.appLanguage === "ar" ? "verticleBorderar" : "verticleBorderen"}>
                                    <Col lg="12" md="12" sm="12" xs="12">
                                        <Field
                                            className={this.props.appLanguage === "ar" ? "AuthInputar" : "AuthInputen"}
                                            name="username"
                                            type="text"
                                            component={renderField}
                                            label={strings.username}
                                            onChange={(e) => this.setState({ username: e.target.value })}
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
                                            onChange={(e) => this.setState({ email: e.target.value })}
                                            icone="fa fa-envelope"
                                            appLanguage={this.props.appLanguage}
                                        />
                                    </Col>
                                    <Col lg="12" md="12" sm="12" xs="12">
                                        <Field
                                            className={this.props.appLanguage === "ar" ? "AuthInputar" : "AuthInputen"}
                                            name="password"
                                            type={this.state.changeTypeFunOne ? "text" : "password"}
                                            component={renderField}
                                            label={strings.password}
                                            icone={this.state.changeTypeFunOne ? "fa fa-eye-slash" : "fa fa-eye"}
                                            changeType={this.changeTypeFunOne}
                                            onChange={(e) => this.setState({ password: e.target.value })}
                                            appLanguage={this.props.appLanguage}
                                        />
                                    </Col>
                                    <Col lg="12" md="12" sm="12" xs="12" className="removeSpecialMargin">
                                        <Field
                                            className={this.props.appLanguage === "ar" ? "AuthInputar" : "AuthInputen"}
                                            name="confirmpassword"
                                            type={this.state.changeTypeFunTwo ? "text" : "password"}
                                            component={renderField}
                                            label={strings.confpassword}
                                            icone={this.state.changeTypeFunTwo ? "fa fa-eye-slash" : "fa fa-eye"}
                                            changeType={this.changeTypeFunTwo}
                                            appLanguage={this.props.appLanguage}
                                            onChange={(e) => this.setState({ confirmpassword: e.target.value })}
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
    form: 'EventsRegistration',
    validate
})(connect(mapStateToProps, mapDispatchToProps)(EventsRegistration));