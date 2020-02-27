import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, Input, InputGroup, InputGroupAddon, InputGroupText, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,} from 'reactstrap'
import axios from 'axios'
import { API_ENDPOINT } from '../../../AppConfig'
import strings from '../../../assets/Locals/locals'
import { saveUser } from "../../../Redux/Action/UserAction";
import { ReIntializeUser } from '../../../Redux/Action/UserAction'
import { bindActionCreators } from 'redux';
import close from '../../../assets/Images/close.png'
import { showSnack } from 'react-redux-snackbar';
import phonenubmer from '../../../assets/Images/Profile/phonenubmer.png'
import EGY from '../../../assets/Images/Countries/EGY.png'
import { countriesKeys } from '../../Profile/Countries'

class UnifiedNumber extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalunifiednumber: true,
            phoneVal: "",
            countryKey: '20',
            coundtryName: '',
            flagcountry: '',
            toggleKey: false,
            BTNClicked: false,
        }
        this.toggleunifiednumber = this.toggleunifiednumber.bind(this)
        this.toggleCountryKeys = this.toggleCountryKeys.bind(this)
    }

    toggleCountryKeys() {
        this.setState(prevState => ({
            toggleKey: !prevState.toggleKey
        }));
    }

    toggleunifiednumber() {
        this.setState(prevState => ({
            modalunifiednumber: !prevState.modalunifiednumber
        }));
        this.props.openModalunifiednum()
    }

    addPhoneNumber = () => {
        let uri = `${API_ENDPOINT}/user/updateInfo`;
        let data = new FormData()
        data.append("eventsPhones", JSON.stringify([
            {
                "phone": this.state.phoneVal,
                "countryCode": this.state.countryKey,
                "country": this.state.coundtryName
            },
        ]))
        data.append("type", this.props.user.type)

        axios.put(uri, data, {
            headers: {
                Authorization: `Bearer ${this.props.token}`,
                'Accept-Language': this.props.appLanguage
            }
        }).then(res => {
            console.log("Request is success")
            this.toggleunifiednumber()
        }).catch(error => {
            console.log("Request is bad", error.response)
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

    handleChangePhone = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            this.setState({ phoneVal: e.target.value })
        }
    }

    render() {
        return (
            <div>
                <Modal className="profileModal profileModal-styleunifiednumber" style={{ direction: this.props.appLanguage === "ar" ? "rtl" : "ltr" }} isOpen={this.state.modalunifiednumber} toggle={this.toggleunifiednumber}>
                    <ModalHeader className={this.props.appLanguage === "ar" ? "pb-0 modalheaderar" : "pb-0 modalheaderen"} toggle={this.toggleunifiednumber}>
                        {strings.unifiednumber}
                        <img src={close} alt="close" className="closeModal" onClick={this.toggleunifiednumber} />
                    </ModalHeader>
                    <ModalBody>
                        <div className="text-center mt-3 mb-5">
                            <img src={phonenubmer} alt="phonenubmer" />
                        </div>
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
                                                        <DropdownItem onClick={() => this.setState({ countryKey: element.value, coundtryName: element.countryCode, flagcountry: element.flag }, () => console.log("country Code", this.state.coundtryName, this.state.countryKey))} key={index} value={element.value}>
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
                            <div>
                                <Button onClick={this.addPhoneNumber} className="btn-block styleBTN mt-5">{strings.saveBTN}</Button>
                            </div>
                        </div>
                        {(this.state.BTNClicked && !this.state.phoneVal) &&
                            <span className="mt-3 erroMSGAuthen"> {strings.phoneNumber}</span>
                        }
                        {(this.state.BTNClicked && this.state.phoneVal && !this.state.countryKey) &&
                            <span className="mt-3 erroMSGAuthen"> {strings.phoneCode}</span>
                        }
                    </ModalBody>
                </Modal>
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
        ReIntializeUser
    }
    , dispatch
)
export default connect(mapStateToProps, mapDispatchToProps)(UnifiedNumber);