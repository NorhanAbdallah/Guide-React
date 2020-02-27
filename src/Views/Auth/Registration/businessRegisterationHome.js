import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, Input, FormGroup, Row, Col, Container } from 'reactstrap';
import '../Auth.css'
import { reduxForm } from 'redux-form'
import validate from './ValidationRegister'
import EventsRegistration from './EventsRegistration'
import ElectronicRegistration from './ElectronicRegistration'
import GeneralRegistration from './GeneralRegistration'
import strings from '../../../assets/Locals/locals'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios'
import { API_ENDPOINT } from '../../../AppConfig'
import { saveUser } from "../../../Redux/Action/UserAction";
import { showSnack } from 'react-redux-snackbar';
import close from '../../../assets/Images/close.png'
import Payment from '../payment'

class BusinessRegisteration extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: true,
            selectVal: 'events',
            openPayment: false
        }
        this.toggle = this.toggle.bind(this)
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        // this.signupUserRequest=this.signupUserRequest.bind(this)
    }

    handleChangeSelect(event) {
        this.setState({ selectVal: event.target.value });
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
        this.props.openPageLogin()
    }

    signupUserRequest = (values) => {
        console.log("REGISTERsignnnn vall", values)
        let uri = `${API_ENDPOINT}/signup`;
        axios.post(uri, values, {
            headers: {
                'Accept-Language': this.props.appLanguage,
            }
        }).then(res => {
            console.log("REGISTERsignnnn SUCC", res.data)
            if (res.data.user.type === "EVENT") {
                this.setState({ openPayment: true });
            }
            this.props.saveUser(res.data.token, res.data.user, true);
            this.setState({ modal: false });
           
        }).catch(error => {
            console.log("REGISTERsignnnn err", error.response)
            if (error.response) {
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
            }

        })
    }

    render() {
        strings.setLanguage(this.props.appLanguage)
        return (
            <div className="BusinessRegisterationView">
                {/* <Button color="danger" onClick={this.toggle}>Click</Button> */}
                <Modal className="styleAuthModal RegisterSpecialWidth" style={{ direction: this.props.appLanguage === "ar" ? "rtl" : "ltr" }} isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle} className="pb-0 mb-0">
                        <h2 className="AuthGreenTitle mb-2">{strings.registeration}</h2>
                        <img src={close} alt="close" className="closeModal" onClick={this.toggle} />
                    </ModalHeader>
                    <ModalBody className="pt-0">
                        <Container fluid>
                            <Row>
                                <Col xl="3" lg="3" md="4" sm="8" xs="8" className="mx-auto">
                                    <FormGroup>
                                        <Input type="select" name="select" id="exampleSelect" className="selectRegister"
                                            value={this.state.selectVal} onChange={this.handleChangeSelect}>
                                            <option value="events">{strings.events}</option>
                                            <option value="electronic">{strings.electronic}</option>
                                            <option value="general">{strings.general}</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Container>
                        {this.state.selectVal === 'events' && <EventsRegistration GetData={this.signupUserRequest} />}
                        {this.state.selectVal === 'electronic' && <ElectronicRegistration GetData={this.signupUserRequest} />}
                        {this.state.selectVal === 'general' && <GeneralRegistration GetData={this.signupUserRequest} />}
                        {this.state.openPayment && <Payment />}
                    </ModalBody>
                </Modal >
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
        showSnack
    }
    , dispatch
)
export default reduxForm({
    form: 'BusinessRegisteration',
    validate
})(connect(mapStateToProps, mapDispatchToProps)(BusinessRegisteration));