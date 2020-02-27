import React from "react";
import axios from "axios";
import { API_ENDPOINT } from "../../AppConfig";
import { Redirect } from 'react-router-dom';
import { Col, Row, Container, Button } from "reactstrap";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import logo from "../../assets/Images/logo.png";
import String from "../../assets/Locals/locals.js"
class DisplayingData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      BusinessId: [],
      Ads: []
    };
  }
  componentWillMount() {
    console.log("the Response Came user", this.props.user)

    let userId = this.props.user.id 
    axios
      .get(`${API_ENDPOINT}/favourite?user=${userId}`)
      .then(res => {
        this.setState({ BusinessId: res.data.data });
      })
      .catch(err => console.log("the Response Came with err", err.response) );
  }
  HandleDelete = (id , businessId )=> {
    let url = `${API_ENDPOINT}/favourite`;
    let NewData = this.state.BusinessId.filter(fav => fav.id !== id);
    let data = {
      businessId: businessId
    };
    axios
      .delete(url, {
        headers: {
              Authorization:`Bearer ${this.props.token}`
        } ,data
      })
        .then(
            res => this.setState({ BusinessId: NewData })
      ).catch(error => {
        console.log("errrrrrrrrrrr" , error ) 
        console.log("errrrrrrrrrrr" , error.response ) 
    })
  };
  DisplayData = () => {
    let BusinessId = this.state.BusinessId;
    return BusinessId.map((element, index) => {
      return (
        <Col
          xs="12"
          md="6"
          lg="6"
          xl ="4"
          className="border-radius  d-flex align-items-stretch justify-content-around my-3 "
          key  ={index}
        >
    
          <div className ="card border-radius p-3 position-relative card_Container">
            <div className ="Rate_Container border-radius bg-white text-gold text-center px-3">
              <p>
                <i className="fas fa-star float-left mt-1 px-1 "></i>
                {BusinessId[index].businessId.rate}
              </p>
            
            </div>
            <img
              src={ element.businessId.logo?`${API_ENDPOINT}${element.businessId.logo}`:logo}
              className="card-img-top cardImageHeight border-radius w-100 "
              alt="Item "
            />
            <div
              className={
                this.props.lang === "en"
                  ? "text-left cardBody border-none"
                  : "text-right cardBody border-none"
              }
            >
              <h5 className="card-title">
                  {element.businessId.name}
              </h5>
              <Row>
                <Col
                  xs="12"
                  lg="6"
                  onClick={() => this.HandleDelete(element.id , element.businessId.id)}
                >
                  <Button className="btn-danger text-white btn border-radius w-100 mt-4">
                    <i className="fas fa-trash-alt fa-x"></i>
                  </Button>
                </Col>
                <Col xs="12" lg="6  ">
                <a href ={`tel:${element.businessId.phone}`} className ="text-white greenBTN">
                      <div>
                      <Button className="btn text-white btn border-radius w-100 mt-4 ">
                       <i className="fas fa-phone fa-x"></i>
                       </Button>
                      </div>
                  </a>
                </Col>
              </Row>
            </div>
          </div>
          
        </Col>
      );
    });
  };
  render() {
    return (
      <div>
      <Row className="my-5 px-3 ">
        {this.state.BusinessId.length > 0 && this.DisplayData()}   
        {!this.props.token && <Redirect to="/Guide" /> }
      </Row>

       <Row className="my-5 px-3 d-flex align-items-end justify-content-center ">
        {this.state.BusinessId.length <= 0 &&  <h4 className="noData" >{String.noitems}</h4>}
      </Row>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
      lang: state.HeaderReducer.appLanguage,
      user: state.UserReducer.user,
      token: state.UserReducer.token,
  }
}
export default connect(mapStateToProps, null)(DisplayingData);
