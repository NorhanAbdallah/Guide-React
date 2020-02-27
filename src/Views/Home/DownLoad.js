import React from "react";
import { Row, Col } from "reactstrap";
import Download1 from "../../assets/Images/Download1.png";
import Download2 from "../../assets/Images/Download-2.png";
import String from "../../assets/Locals/locals.js";
import { connect } from 'react-redux';
import AppleBtn from "../../assets/Images/Aboutus/AppStore.png"
import GooglePlayBtn from "../../assets/Images/Aboutus/googleplay.png"
export function Download(props) {
  return (
    <Row className={props.lang === "ar" ? " flex-row-reverse" : " flex-row-reverse "} >
      <Col xs="0" lg="1" xl="2"></Col>
      <Col
        lg="2"
        xs="3"
        data-aos="fade-left" data-aos-delay="400"
        className={props.lang === "ar" ? "second-photo text-right " : "second-photo text-left"}
      >
        <img
          src={Download2}
          alt="Apps"
          title=""
          className="img-fluid"
        />
      </Col>
      <Col
        lg="2"
        xs="2"
        data-aos="zoom-in" data-aos-delay="400"
        className={props.lang === "ar" ? "first-photo text-right" : "text-left first-photo"}
      >
        <img
          src={Download1}
          alt="Apps"
          title=""
          className="img-fluid"
        />
      </Col>
      <Row className="mx-0 bg-Download py-3">
        <Col xs="7" lg="6" className="px-4">
          <Row className="justify-content-center">
            <Col xs="12" className="text-center flex-row-reverse"  data-aos="fade-right" data-aos-delay="400">
              <h2 className={props.lang === "ar" ? "mb-4 MainDownloadTitle font-weight-bolder text-white" : " mb-4 MainDownloadTitle   text-white  font-weight-bolder"} >
                {String.Download}
              </h2>
            </Col>
            <Col xs="12" lg="5" md="7"  >
              <a href="https://play.google.com/store/apps/details?id=com.newconcept.guide">
                <img src={GooglePlayBtn} id="google" className="img-fluid" title="" alt="google play" />
              </a>
            </Col>
            <Col xs="12" lg="5" md="7">
              <a href="#">
                <img src={AppleBtn} id="appstore" className="img-fluid" title="" alt="App Store" />
              </a>
            </Col>
          </Row>
        </Col>
      </Row>
    </Row>
  );
}
const mapStateToProps = state => {
  return {
    lang: state.HeaderReducer.appLanguage,
  }
}
export default (connect(mapStateToProps, null))(Download);
