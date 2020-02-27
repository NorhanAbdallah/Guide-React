import React, { Component } from 'react';
import { Col, Row, Button, InputGroup, InputGroupAddon, Input, Container } from 'reactstrap'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { changeLang } from '../../../Redux/Action/LoginAction'
import String from "../../assets/Locals/locals.js";
import "../../Reasource/Reasource.css"
import { API_ENDPOINT } from '../../AppConfig.js'
import axios from 'axios'
// import Logo from "../../assets/Images/LOGO2.png";
import Logo from "../../assets/Images/Mask Group 32.png";
import {init} from '../../Redux/Action/SocketAction.js'
import cookie from 'react-cookies'
import {localStorageUser} from "../../AppConfig.js"

import './Footer.css';
class Footer extends Component {
  lang = () => {
    if (this.props.lang === "ar") {
      this.props.changeLang("en")
    } else {
      this.props.changeLang("ar")
    }
  }

  state = {
    // en: "EN",
    // ar: "AR",
    // lang: "EN",
    departments: [],
    CompanyData:[],
    btn: { FACEBOOK: "fab fa-facebook-f" , INSTAGRAM: "fab fa-instagram", LINKEDIN: "fab fa-linkedin-in" , TWITTER: "fab fa-twitter" }   
  }

  Fech_company() {
    // this.props.showLoading();
    let uri = `${API_ENDPOINT}/companies`
    let token = `Bearer ${this.props.token}`

    axios.get(uri, {
        headers: {
        }
    })
        .then(response => {
            console.log("CompanyData response", response.data.data[0])
            this.setState({
              CompanyData: response.data.data[0]
            })
            // this.props.hideLoading();
        })
        .catch(error => {
            console.log("CompanyData error", error)
        })
}

  UNSAFE_componentWillMount() {
    let currentlang = this.props.lang
    this.setState({ currentlang: currentlang })
    this.Fech_company()


    // let guideuser = sessionStorage.guideuser;
    // let user = cookie.load('guideuser');
    console.log("userdataaaaout",this.props.user,sessionStorage.guideuser)
  
    {sessionStorage.guideuser && 
      console.log("userdataaaa",sessionStorage.guideuser)
      this.props.init()
      }
    
  }

  

  render() {

   

console.log("companydataaaaaa",this.state.CompanyData.phones)
    String.setLanguage(this.props.lang);
 
    return (
      <footer style={{
        direction: this.props.lang === "ar" ? "rtl" : "ltr", width: "100%",
        position:"relative",bottom:"0",
      }}>
      <Container fluid>
          <Row id="Fotterrow" className="pt-3 mt-5" style={{ textAlign: this.props.lang === "ar" ? "right" : "left", /*backgroundColor: "rgb(247, 247, 247)" */ }}>


            <Col lg="4" md="4" className=" text-center mt-2 py-3"  >
              <div>
                <p className="mb-3" style={{fontSize:"1.2rem",fontWeight:"bold",color:"#4E4E4E"}}>{String.contactus}</p>
              </div>
              <div id="div_social_btns">

                {this.state.CompanyData.socialLinks && this.state.CompanyData.socialLinks.map((element, index) => {
                  return (
                    <div id="sociallinks_div" style={{display: "inline-block" }} >
                      <div >
                        {index <= 3 &&
                      <a href={element.value} target="_blank">
                     
                        <Button id="socialbtns"  className="SocialBtns_ExternalFile"style={{ borderColor: "#52A318", borderRadius: "17%",}}>
                          <i className={this.state.btn[element.key]} style={{ color: 'white' }}></i>
                        </Button>
                        </a >
                        }
                      </div>
                    </div>
                  )
                })}
              </div>
            </Col>


            <Col lg="4" md="4" className="py-2" style={{ direction: "ltr", textAlign: "center" }} >

              <div className="contactFooter">
                <div className="d-flex" id="div_social_btns">
                  <div className="mr-3">
                    <i className="fas fa-phone-alt" style={{ color: "#347704" }}></i>
                  </div>
                  <div>
                  {this.state.CompanyData.phones && this.state.CompanyData.phones.map((element, index) => {
                                 
                                    return (
                                      <p style={{color:"#4E4E4E"}}>  {element}</p>
                                    )
                                })}
                </div>
                </div>

                <div className="d-flex " id="div_social_btns">
                  <div className="mr-3 ">
                    <i class="fas fa-envelope" style={{ color: "#347704" }}></i>
                  </div>
                  <div>
                  {this.state.CompanyData.emails && this.state.CompanyData.emails.map((element, index) => {
                                 
                                 return (
                                  <p style={{color:"#4E4E4E"}}>{element}</p> 
                                 )
                             })}
                  </div>
                </div>

                <div className="d-flex" id="div_social_btns">
                  <div className="mr-3">
                    <i className="fas fa-map-marker-alt" style={{ color: "#347704" }}></i>
                  </div>
                  <div>
                    <p className="text-left" style={{wordBreak:"break-all",color:"#4E4E4E"}}>{this.state.CompanyData.address}</p>
                  </div>
                </div>

              </div>
             
            </Col>


            <Col lg="4" md="4" className="text-center  mt-2" id="footercontainer" >
              <div>
                <img  id="footerlogo" className="img-fluid" src={Logo} alt="logo" />
              </div>
            </Col>

          </Row>
         
       </Container>
        </footer>
    )
  }
}
const mapStateToProps = state => {
  return {
    lang: state.HeaderReducer.appLanguage,
    user: state.UserReducer.user
    // screenType: state.login.screentype
  }
}
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    init
    // changeLang,
    // showLoading,
    // hideLoading
  }
  , dispatch
)
export default connect(mapStateToProps, mapDispatchToProps)(Footer);