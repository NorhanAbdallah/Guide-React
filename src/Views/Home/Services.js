import React from "react";
import Strings from "../../assets/Locals/locals";
import { API_ENDPOINT } from "../../AppConfig.js";
import axios from "axios";
import { Col, Row } from "reactstrap";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
export class Services extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      company: [],
      lang: this.props.lang
    };
  }
  DisplayDisc = (company) => {
    return (
      <Col
        sm="12"
        lg="4"
        className = "servicesHome align-items-center">
        <Col xs ="0" sm = "0" md = "0" xl = "3"></Col>
        {this.props.lang==="en"?
        <Col xs ="12" lg = "11" md = "11" xl ="9"
        data-aos="fade-right"
           data-aos-easing="ease-in-sine">
            <h2 className= "MainPhotoTitle " style={{ color: "#347704" }}>
            {Strings.ServicesTitle}
          </h2>
          <p className="text-muted w-90 line-height-mine ">
            {this.props.lang === "ar" ? company[0].service.ar : company[0].service.en}
          </p>
        </Col>
        :
        <Col xs ="12" lg = "11" md = "11" xl ="9"
        data-aos="fade-left"
           data-aos-easing="ease-in-sine">
            <h2 className= "MainPhotoTitle " style={{ color: "#347704" }}>
            {Strings.ServicesTitle}
          </h2>
          <p className="text-muted w-90 line-height-mine ">
            {this.props.lang === "ar" ? company[0].service.ar : company[0].service.en}
          </p>
        </Col>
    }
      </Col>
    );
  };
  Fetch() {
    let company = `${API_ENDPOINT}/companies`;
    let categores = `${API_ENDPOINT}/category`;
    axios
      .all([
        axios.get(company, { headers: { "Accept-Language": this.props.lang } }),
        axios.get(categores, {
          headers: { "Accept-Language": this.props.lang }
        })
      ])
      .then(
        axios.spread((company, categores) => {
          this.setState({
            categories: categores.data.data,
            company: company.data.data
          });
        })
      )
      .catch(error => { });
  }
  DisplayStaticService(res) {
    return (
      <Col lg="2" sm="12" className="text-center" >
        <Row>
            <Col xs="6" lg="12" className="home-category border-radius "  data-aos="zoom-in"  data-aos-delay="400">
            <Link
            className="text-decoration-none"
            to={{
              pathname: "/Guide/services",
              state: {
                categoryId: 0, categoryName: res[0].eventCategory.name.ar,
                categoryNameEN: res[0].eventCategory.name.en, serviceType: 'EVENT'
              }
            }}
          >
              <img
                src={`${API_ENDPOINT}${res[0].eventCategory.eventImage}`}
                className="img-fluid border-radius "
                alt="services's photo"
              />
              <p className="text-gold mt-2 font-weight-bold">
                {" "}
                {this.props.lang === "en"
                  ? res[0].eventCategory.name.en
                  : res[0].eventCategory.name.ar
                }
              </p>
              </Link>
            </Col>
       
          <Col xs="6" lg="12" className="home-category"  data-aos="zoom-in"  data-aos-delay="400">
          <Link
            className="text-decoration-none  "
            to={{
              pathname: "/Guide/services",
              state: {
                categoryId: 0, categoryName: res[0].electronicTradingCategory.name.ar,
                categoryNameEN: res[0].electronicTradingCategory.name.en, serviceType: 'ELECTRONIC_TRADING'
              }
            }} >
              <img
                src={`${API_ENDPOINT}${res[0].electronicTradingCategory.electronicImage}`}
                className="img-fluid border-radius "
                alt="services's photo"
              />
              <p className="text-gold mt-2 font-weight-bold">
                {this.props.lang === "en"
                  ? res[0].electronicTradingCategory.name.en
                  : res[0].electronicTradingCategory.name.ar}
              </p>
              </Link>
            </Col>
        </Row>
      </Col>
    );
  }
  DisplayServices(category) {
    return (
      <Col sm="12" lg="6" className=" row text-center" data-aos="fade-up" data-aos-delay="400">
        {category.map((element, index) => {
          return (

            <Col
              xl="4"
              sm="6"
              xs="6"
              className="text-center home-service border-radius "
              key={index}
              data-aos="fade-up"

            >
              <Link
                className="text-decoration-none"
                to={{
                  pathname: "/Guide/departments",
                  state: { categoryId: element.id, categoryName: element.name, serviceType: 'GENERAL_TRADING' }
                }}
              >
                <img
                  src={`${API_ENDPOINT}${element.image}`}
                  className="img-fluid  p-4 border-radius "
                  alt="services's photo"
                />
                <p className="mt-2 text-muted font-weight-bold">
                  {element.name}
                </p>
              </Link>
            </Col>
          );
        })}
      </Col>
    );
  }
  componentWillMount() {
    this.Fetch();
  }
  render() {
    if (this.state.lang !== this.props.lang) {
      this.setState({ lang: this.props.lang }, () => {
        this.Fetch();
      });
    }
    return (
      <Row className={this.props.lang === "ar" ? " bg_Home_Services_ar justify-content-center text-right" : " bg_Home_Services_en text-left"}>
        {this.state.company.length > 0 && this.DisplayDisc(this.state.company)}
        {this.state.categories.length > 0 && this.DisplayServices(this.state.categories)}
        {this.state.company.length > 0 && this.DisplayStaticService(this.state.company)}
      </Row>
    );
  }
}
const mapStateToProps = state => {

  return {
    lang: state.HeaderReducer.appLanguage,
  }
}
export default (connect(mapStateToProps, null))(Services);
