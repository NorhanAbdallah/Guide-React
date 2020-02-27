import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, Form, Input } from 'reactstrap';
import './Auth.css'
// import validate from './ValidationLogin'
import strings from '../../assets/Locals/locals'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios'
import { API_ENDPOINT } from '../../AppConfig'
import { saveUser } from "../../Redux/Action/UserAction";
import { showSnack } from 'react-redux-snackbar';
import { ReIntializeUser } from '../../Redux/Action/UserAction'

class Payment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: true,
            cardnumVal: '',
            dateVal: '',
            ccvVal: '',
            btnclicked: false
        }
        this.toggle = this.toggle.bind(this)
    }

    handleChangecardnum = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            this.setState({ cardnumVal: e.target.value })
        }
    };

    handleChangedateexpire = (e) => {
        // const re = /^((0[0-9])|(1[0-2]))(\/)\d{2}$/;
        // if (e.target.value === '' || re.test(e.target.value)) {
        this.setState({ dateVal: e.target.value })
        // }
    };

    handleChangeCCV = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            this.setState({ ccvVal: e.target.value })
        }
    };

    changeBTNState = () => {
        this.setState({ btnclicked: true })
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    editInfo() {
        let uri = `${API_ENDPOINT}/user/updateInfo`;
        let data = new FormData()
        if (this.props.endDate) {
            data.append("toDate", this.props.endDate)
        }
        if (this.props.startDate) {
            data.append("fromDate", this.props.startDate)
        }
        data.append("type", this.props.user.type)
        axios.put(uri, data, {
            headers: {
                Authorization: `Bearer ${this.props.token}`,
                'Accept-Language': this.props.appLanguage
            }
        }).then(res => {
            console.log("USERRR", res.data)
            this.props.ReIntializeUser(this.props.token, res.data)
            this.props.saveUser(this.props.token, res.data, localStorage.getItem('remebermestate') === 'false' ? false : true)
            this.toggleto()
        }).catch(err => console.log("USERRR err", err.response))
    }

    paymentRequest = () => {
        let uri = `${API_ENDPOINT}/card`;
        let data = {
            cardNumber: this.state.cardnumVal,
            cvc: this.state.ccvVal,
            expireDate: this.state.dateVal
        }
        console.log("request before")
        axios.post(uri, data, {
            headers: {
                'Accept-Language': this.props.appLanguage,
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.props.token}`,

            }
        }).then(res => {
            this.editInfo()
            let user = this.props.user
            user.paid = true

            this.props.saveUser(this.props.token, user, localStorage.getItem("remebermestate") === 'false' ? false : true);
            this.setState(prevState => ({
                modal: !prevState.modal
            }));
        }).catch(error => {
            console.log("Bad request")
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

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.state.dateVal && this.state.ccvVal && this.state.cardnumVal) { this.paymentRequest() }
        else { }
    }

    UNSAFE_componentWillMount() {
        console.log("success request1", this.props.token, this.props.user, localStorage.getItem("remebermestate") === 'false' ? false : true)
    }

    render() {
        console.log("success request", this.props.token, this.props.user, localStorage.getItem("remebermestate") === 'false' ? false : true)
        return (
            <div className="paymentview">
                <Modal className="styleAuthModal stylePaymentModal" style={{ direction: this.props.appLanguage === "ar" ? "rtl" : "ltr" }} isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle} className={this.props.appLanguage === "ar" ? "pb-0 modalheaderar" : "pb-0 modalheaderen"}>
                        <h2 className="AuthGreenTitle">{strings.payment}</h2>
                    </ModalHeader>
                    <ModalBody className="pt-0">
                        <h4><span>{this.props.user.priceRegistration}</span> ريال</h4>
                        <h6>{strings.annualsubs}</h6>
                        <Form onSubmit={this.handleSubmit}>
                            <div>
                                <Input maxLength="16" type="text" name="cardnum" placeholder={strings.cardnumber} value={this.state.cardnumVal} onChange={(e) => this.handleChangecardnum(e)} />
                                {(!this.state.cardnumVal && this.state.btnclicked) && <span className={this.props.appLanguage === "ar" ? "erroMSGAuthar" : "erroMSGAuthen"}>{strings.cardnumbererror}</span>}
                            </div>

                            <div>
                                <Input type="text" name="cardnum" placeholder={strings.expiredata} value={this.state.dateVal} onChange={(e) => this.handleChangedateexpire(e)} />
                                {(!this.state.dateVal && this.state.btnclicked) && <span className={this.props.appLanguage === "ar" ? "erroMSGAuthar" : "erroMSGAuthen"}>{strings.dateexpireerror}</span>}
                            </div>

                            <div>
                                <Input maxLength="3" type="text" name="cardnum" placeholder={strings.ccv} value={this.state.ccvVal} onChange={(e) => this.handleChangeCCV(e)} />
                                {(!this.state.ccvVal && this.state.btnclicked) && <span className={this.props.appLanguage === "ar" ? "erroMSGAuthar" : "erroMSGAuthen"}>{strings.ccverror}</span>}
                            </div>

                            <Button type="submit" onClick={this.changeBTNState} className="btn-block styleBTN mt-0">
                                {strings.payBTN}
                            </Button>
                        </Form>
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
export default (connect(mapStateToProps, mapDispatchToProps)(Payment));