import React from 'react';
import { Container, Col, Row } from "reactstrap"
import "../../Reasource/Reasource.css"
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import '../../Reasource/Reasource.css'
import String from "../../assets/Locals/locals.js";
import { logOut } from "../../Redux/Action/UserAction";
import { API_ENDPOINT } from '../../AppConfig.js'
import axios from 'axios'
import aboutus_logo from "../../assets/Images/Aboutus/AboutUsLogo.png"
import Socialdiv from "../../Component/SocialLinks/sociallinks.js"
class AboutUs extends React.Component {
    state = {
        CompanyData: [],
        sociallinks: [],
        imgs: []
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
        let imgs = [{ srcimg: "facebook" , id: "facebook" }, { srcimg: "whats" , id: "whats" }, { srcimg: "twitter", id: "twitter" }, { srcimg: "insta", id: "insta" }, { srcimg: "linkedin", id: "linkedin" }, { srcimg: "youtube", id: "youtube" }]
        String.setLanguage(this.props.lang);
        return (
            <div>

               
                <Container fluid>

                    <Row>
                        <Col xs="12" lg="12" md="12" data-aos="zoom-in"
                            className="py-5 bg-Aboutus d-flex align-items-end justify-content-center ">
                            <h1 className="text-white mb-0" style={{fontWeight:"bold"}}>
                                {String.aboutus}
                            </h1>
                        </Col>
                    </Row>
                    <div className="mb-5 mt-5 text-center">

                    <img  data-aos="zoom-in"  className="aboutus_logo" style={{width:"20%"}} src={aboutus_logo} alt="logo" />
                    </div>
                  
                    <Container className="mb-5">
                        {this.state.CompanyData.aboutUs &&
                            <Row className="mb-5 mt-5 text-center ">

                                <Col lg="12" id="aboutus_main" className="px-4 py-2" data-aos="zoom-in" data-aos-delay="500">
                                    <p style={{ fontSize: "25px"}} >
                                        {this.props.lang === "ar" ? this.state.CompanyData.aboutUs.ar : this.state.CompanyData.aboutUs.en}

                                    </p>
                                </Col>
                            </Row>
                        }

                        <Socialdiv/>
                        
                    </Container>

                </Container>
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
        // changeLanguage,
        logOut,
    }
    , dispatch
)

export default (connect(mapStateToProps, mapDispatchToProps))(AboutUs);
