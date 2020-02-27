import React from 'react';
import { Container, Col, Row } from "reactstrap"
import "../../Reasource/Reasource.css"
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import '../../Reasource/Reasource.css'
import String from "../../assets/Locals/locals.js";
import facebook from "../../assets/Images/face_aboutus.png"
import whats from "../../assets/Images/whatsapp_aboutus.png"
import twitter from "../../assets/Images/twitter_aboutus.png"
import insta from "../../assets/Images/insta_aboutus.png"
import linkedin from "../../assets/Images/linkedin_aboutus.png"
import youtube from "../../assets/Images/youtube_aboutus.png"
import { Link } from 'react-router-dom'
import { API_ENDPOINT } from '../../AppConfig.js'
import axios from 'axios'
class AboutUs extends React.Component {
    state = {
        CompanyData: [],
        sociallinks: [],
    }


    Fech_company(lang) {
        // this.props.showLoading();
        let uri = `${API_ENDPOINT}/companies`
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

    componentWillMount() {
        this.Fech_company(this.props.lang)
    }

    CreateView(social) {
        let uri = `${API_ENDPOINT}/counter`
        let data = {
            type: "SOCIAL",
            businessId: this.props.businessId,
            socialType: social,
        }
        axios.post(uri, data)
            .then(res => console.log("SUCCESS", res))
    }

    render() {

        String.setLanguage(this.props.lang);
        return (
            <div>
                <Row  style={{overflow:'hidden'}}>
                    <Col lg="12"  id={this.props.fromcontact ? "aboutus_main_fromcontact" : "aboutus_main"} className="py-3 d-flex"  >


                        <a data-aos="fade-up-left" data-aos-delay="350"
                        href={this.state.sociallinks[4] ? this.state.sociallinks[4].key === "YOUTUBE" ? this.state.sociallinks[4].value : "" : ""} target="_blank"
                        >
                            <img src={youtube} alt="youtube" style={{ width: "44px" }} />
                        </a>

                        <a data-aos="fade-up-left"  data-aos-delay="300"
                         href={this.state.sociallinks[2] ? this.state.sociallinks[2].key === "LINKEDIN" ? this.state.sociallinks[2].value : "" : ""} target="_blank">
                            <img src={linkedin} alt="linkedin" style={{ width: "44px" }} />
                        </a>
                        <a data-aos="fade-up-left"  data-aos-delay="250"
                        href={this.state.sociallinks[1] ? this.state.sociallinks[1].key === "INSTAGRAM" ? this.state.sociallinks[1].value : "" : ""} target="_blank"
                            onClick={() => {
                                if (this.props.view) this.CreateView('INSTAGRAM')
                            }}>
                            <img src={insta} alt="insta" style={{ width: "44px" }} />
                        </a>
                        <a data-aos="fade-up-left"  data-aos-delay="200"
                        href={this.state.sociallinks[3] ? this.state.sociallinks[3].key === "TWITTER" ? this.state.sociallinks[3].value : "" : ""} target="_blank"
                            onClick={() => {
                                if (this.props.view) this.CreateView('TWITTER')
                            }}>
                            <img src={twitter} alt="twitter" style={{ width: "44px" }} />
                        </a>
                        <a data-aos="fade-up-left"  data-aos-delay="150"
                        href={"https://wa.me/" + this.state.CompanyData.phones} target="_blank"
                            onClick={() => {
                                if (this.props.view) this.CreateView('WHATSAPP')
                            }}>
                            <img src={whats} alt="whats" style={{ width: "44px" }} />
                        </a>
                        <a data-aos="fade-up-left"  data-aos-delay="100"
                        href={this.state.sociallinks[0] ? this.state.sociallinks[0].key === "FACEBOOK" ? this.state.sociallinks[0].value : "" : ""} target="_blank"
                            onClick={() => {
                                if (this.props.view) this.CreateView('FACEBOOK')
                            }}>
                            <img src={facebook} alt="facebook" style={{ width: "44px" }} />
                        </a>
                    </Col>
                </Row>

            </div>
        )
    }
}
const mapStateToProps = state => {

    return {
        lang: state.HeaderReducer.appLanguage,
        // token:  state.userInfo.token
    }

}
const mapDispatchToProps = dispatch => bindActionCreators(
    {

    }
    , dispatch
)

export default (connect(mapStateToProps, mapDispatchToProps))(AboutUs);
