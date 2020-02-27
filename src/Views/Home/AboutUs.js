import React from "react";
import axios from "axios";
import { API_ENDPOINT } from "../../AppConfig";
import { Col, Row } from 'reactstrap'
import HomeAboutUs from "../../assets/Images/HomeAboutUs.png"
import { connect } from 'react-redux';
import Strings from "../../assets/Locals/locals"

let animate=`data-aos="fade-right"
data-aos-easing="ease-in-sine"
data-aos-delay="400"`
export  class AboutUs extends React.Component {
    constructor(props) {
        super(props);
        this.state =
            {
                Desc:null ,
            }
    }
    componentWillMount=()=> {
        axios.get(`${API_ENDPOINT}/companies`).then(res => {
            this.setState({Desc:res})
        })
    }
    DisplayDesc = (Desc) => {
        return (
            <div className = {this.props.lang=== "ar"? "text-right p-1" : "p-1" }>
                <h2 className="w-90 font-weight-bolder py-2 MainPhotoTitle">
                    {Strings.AboutUs}
                </h2>
                <p className=" w-90  my-2 line-height-mine ">
                    {this.props.lang === "ar" ? Desc.data.data[0].aboutUs.ar : Desc.data.data[0].aboutUs.en}
                </p>
            </div>
        )
    }
    render() {
        return (
            <div>
                {this.state.Desc?
            <Row className=" bg-green  MEDIA_COLUMN_REVERSE  pt-3 mb-4 align-items-center text-white">
                <Col xs ="0" lg ="1"></Col>
                <Col xs="12" md="6" lg="7" data-aos={this.props.lang==="en"?"fade-right":"fade-left"} data-aos-delay="400">
                    {this.state.Desc && this.DisplayDesc(this.state.Desc)}
                </Col>
                <Col xs="12" md="6" lg="4" data-aos={this.props.lang==="en"?"fade-left":"fade-right"}  data-aos-delay="400">
                    <img className="img-fluid " id="bottom_0" alt= "ContactUs" title="" src={HomeAboutUs} />
                </Col>
          
             
            </Row>
            :null}
            </div>
        )
    }
}
const mapStateToProps = state => {

    return {
        lang: state.HeaderReducer.appLanguage,
    }
}
export default (connect(mapStateToProps, null))(AboutUs);
