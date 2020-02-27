import React from 'react';
import { Container, Col, Row, Form, Button } from "reactstrap"
import Header from "../../Component/Header/Header.js"
import Footer from "../../Component/Footer/footer.js"
// import LOGO from "../../assets/Images/About_Us.png"
import "../../Reasource/Reasource.css"
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import '../../Reasource/Reasource.css'
import String from "../../assets/Locals/locals.js";
import { changeLanguage } from "../../Redux/Action/HeaderAction";
import { logOut } from "../../Redux/Action/UserAction";
import Inputs from "./Inputs";
import validate from "./validation";
import RenderField from "../../Component/Fields/fields";
import { Field, reduxForm ,reset} from "redux-form";
import { Link } from 'react-router-dom'
import { API_ENDPOINT } from '../../AppConfig.js'
import axios from 'axios'
import Sociallinks from "../../Component/SocialLinks/sociallinks.js"
import { showSnack } from 'react-redux-snackbar';
import './ContactUs.css'
import Player from '../Animation/play.js'
class ContactUs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            CompanyData: [],
            sociallinks: [],
            imgs: [],
           
        }
        // this.handleKeyPress = this.handleKeyPress.bind(this)

    }


    Fech_company(lang) {
        // this.props.showLoading();
        let uri = `${API_ENDPOINT}/companies`
        let token = `Bearer ${this.props.token}`
        axios.get(uri, {
            headers: {
                "Accept-Language": lang
            }
        })
            .then(response => {
                console.log("CompanyData response aboutus", response.data.data[0])
                this.setState({
                    CompanyData: response.data.data[0],
                    sociallinks: response.data.data[0].socialLinks
                })
                // this.props.hideLoading();
            })
            .catch(error => {
                console.log("CompanyData error", error)

            })
    }
    Add_Complain(data) {
        let uri = `${API_ENDPOINT}/contact-us`
        axios.post(uri, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.props.token}`,
                'Accept-Language': this.props.lang
            }
        })
            .then(response => {
                 this.props.reset()
                this.props.showSnack('myUniqueId', {
                    label: this.props.lang === "en" ? "Message Sent" : "تم ارسال",
                    timeout: 7000,
                    button: { label: this.props.lang === 'en' ? 'Message Sent' : ' تم الارسال' }
                })
                // console.log("add event Submit response:", response.data)
                // this.setState({ redirect: true })

            }).catch(error => {
                console.log("in error", error.response)
                if (error.response.status === 422) {
                    for (let i = 0; i < error.response.data.errors.length; i++) {
                        this.props.showSnack('myUniqueId', {
                            label: error.response.data.errors[i].msg,
                            timeout: 7000,
                            button: { label: this.props.lang === 'en' ? 'Add mohamed' : ' أضافة شكوي ' }
                        })
                    }
                }
            })
    }

    onSubmit = (values) => {
        console.log("Values:", values)
        let data = {
            fullName: values.fullName,
            email: values.email,
            phone: values.phonenum,
            notes: values.notes
        }
        this.Add_Complain(data)
    }
    componentWillMount() {
        // Bashandy add to start at every page from top
        window.scrollTo({
            top: 0,
            left: 0,
            // behavior: 'smooth'
          });
        this.Fech_company(this.props.lang)
    }
    render() {
        const { handleSubmit, submitting ,reset} = this.props
        let imgs = [{ srcimg: "facebook", id: "facebook" }, { srcimg: "whats", id: "whats" }, { srcimg: "twitter", id: "twitter" }, { srcimg: "insta", id: "insta" }, { srcimg: "linkedin", id: "linkedin" }, { srcimg: "youtube", id: "youtube" }]
        String.setLanguage(this.props.lang);
        return (
            <div>
                <Container fluid  >
                    <Row>
                        {/* <div id="bg-Contactus_div"  > */}
                        <Col xs="12" lg="12" md="12" data-aos="zoom-in" style={{ backgroundColor: "#52A318" }}
                            className="py-5 bg-Contactus d-flex align-items-end justify-content-center ">
                            <h2 className="text-white" style={{ marginBottom: "5rem" }}>
                                {String.contactus}
                            </h2>
                        </Col>
                        {/* </div>   */}
                    </Row>
                    <Container style={{ zIndex: "100", position: "relative", bottom: "100px" }}>
                        <Row data-aos="fade-left" data-aos-delay="400" data-aos-duration="500" className="text-center " id="contactus_main">
                            <Col lg="7" id={this.state.lang === "ar" ? "contactus_right_ar" : "contactus_right_en"} >
                                <p style={{ fontSize: "28px", color: "#347704", fontWeight: "bold" }}>{String.any_problems}</p>
                                <Form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                                    <Row className="px-4 ">
                                        {
                                            Inputs.map((element, index) => {
                                                return (
                                                    <Col
                                                        xs={element.size.xs}
                                                        lg={element.size.lg}
                                                        md={element.size.md}
                                                    >
                                                        <Field key={index}
                                                            type={element.type}
                                                            name={element.name}
                                                            lang={this.props.lang}
                                                            component={RenderField}
                                                            inputType={element.inputType}
                                                            className="text-muted"
                                                            placeholder={this.props.lang === "ar" ?
                                                                element.placeholder.ar :
                                                                element.placeholder.en
                                                            }
                                                        />
                                                    </Col>
                                                )
                                            })
                                        }
                                        <Col lg="12" xs="12" className={this.props.lang === "ar" ? "text-right" : "text-left"}>
                                            <Button className={" btn_contactus_send btn_contactus_send_ExternalFile d-block w-100 mb-4 mx-auto border-radius "}>
                                                {this.props.lang === "ar" ? "ارسال" : "Send"}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                            <Col data-aos="fade-down" lg="5" id="contactus_left" >
                                <p style={{ fontSize: "25px", color: "#FA7F2B", fontWeight: "bold" }}>{String.contactusoptions}</p>
                                <p style={{ fontWeight: "500", marginBottom: "2.5rem" }}>{this.state.CompanyData.emails}</p>
                                <p style={{ fontWeight: "500", marginBottom: "2rem" }}>{String.callus}</p>

                                <Button className={"btn_contactus_call d-block  mb-4 mx-auto  "}>
                                    {this.props.lang === "ar" ? this.state.CompanyData.phones + "+" : "+" + this.state.CompanyData.phones}
                                </Button>
                               

                                <hr id="left_hr" />
                                <p style={{ fontWeight: "500", marginBottom: "2rem" }}>{String.through}</p>
                                <Sociallinks fromcontact={true} />
                            </Col>
                        </Row>
                    </Container>
                </Container>
            </div>
        )
    }
}

const mapStateToProps = state => {
    console.log("tokennnnnn", state.UserReducer.token)
    return {
        lang: state.HeaderReducer.appLanguage,
        token: state.UserReducer.token,
    }

}
const mapDispatchToProps = dispatch => bindActionCreators(
    {
        changeLanguage,
        logOut,
        showSnack,
    }
    , dispatch
)
export default reduxForm({
    form: 'ContactUs',
    validate
})(connect(mapStateToProps, mapDispatchToProps)(ContactUs));


