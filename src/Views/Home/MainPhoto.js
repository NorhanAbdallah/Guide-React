import React from "react";
import "../../Reasource/Reasource.css";
import strings from "../../assets/Locals/locals";
import { Col, Row, Button } from "reactstrap";
import { connect } from 'react-redux';

export function MainPhoto (props){
  return (
    <Row
      className={
        props.lang === "en"
          ? "align-items-center MainPhoto flex-row-reverse mb-5"
          : "align-items-center MainPhoto text-right mb-5"
      }
    >
      <Col lg ="1" xs ="0"></Col>
      <Col xs ="5" sm="0" md ="5" lg="4" className ="text-white">
        <h1 className="py-3 MainPhotoTitle" data-aos="zoom-in">{strings.MainPhotoTitle}</h1>
      </Col>
    </Row>
  );
}
const mapStateToProps = state => {

  return {
    lang: state.HeaderReducer.appLanguage,
  }
}
export default (connect(mapStateToProps, null))(MainPhoto);