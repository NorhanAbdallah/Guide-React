import React, { Component } from 'react';

import { Col, Row, Button, InputGroup, InputGroupAddon, Input, Container } from 'reactstrap'
import { API_ENDPOINT } from '../../../AppConfig.js'
import String from '../../../assets/Locals/locals';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './Details.css';
class Details extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
    }
  }
  

  componentWillMount() {
    console.log("dataa from details :: ", this.props.DetailsData)
    if (this.props.DetailsData) {
      this.setState({
        data: this.props.DetailsData
      }, () => {
        ;
      })
    }
  }
  render() {

    return (

      this.state.data.map((element, index) => {
        console.log("index ??? ", index, this.state.data.length)
        return (
          <div>
            {element.text && element.image ?
              <Row className="py-4">
                <Col lg="4" md="4"  className="ContentImg">
                  
                  <img src={`${API_ENDPOINT}${element.image}`} alt="image"/>
                </Col>
                <Col lg="8" md="4" className="textContent">
                    <p style={{ textAlign: this.props.lang === "ar" ? 'right' : 'left' }} className="px-4">{element.text}</p>
                </Col>
                {index < (this.state.data.length - 1) ?
                   <Col xs="12" md="12" lg="12">
                     <div style={{ backgroundColor:"rgb(234, 227, 227)", height: '2px', width: '100%' }} className="my-3"></div>
                   </Col>
                   : null}
              </Row>
              // <Row  className="RowContent">
              //   <Col lg="4" xs="12" sm="12" md="6" className="" style={{overFlow:'hiddden'}}>
              //     <div className="ContentImg">
              //       <img src={`${API_ENDPOINT}${element.image}`} style={{ borderRadius: '20px', }}
              //        />
              //       </div>
              //       </Col>
                
              //   <Col lg="8" xs="12" sm="12" md="6" className="textContent">
              //     <p style={{ textAlign: this.props.lang === "ar" ? 'right' : 'left' }} className="px-4">{element.text}</p>
              //   </Col>
              //   {index < (this.state.data.length - 1) ?
              //     <Col xs="12" md="12" lg="12">
              //       <div style={{ backgroundColor:"rgb(234, 227, 227)", height: '2px', width: '100%' }} className="my-3"></div>
              //     </Col>
              //     : null}
              // </Row>

              :
              <Row>

                <Col xs="12" lg="12" md="12">
                  <p style={{ textAlign: this.props.lang === "ar" ? 'right' : 'left' }} className="px-4">{element.text}</p>

                </Col>
                {index < (this.state.data.length - 1) ?
                <Col xs="12" md="12" lg="12">
                  <div style={{ backgroundColor: "rgb(234, 227, 227)", height: '2px', width: '100%' }} className="my-3"></div>

                </Col>
                :null}
              </Row>

            }
          </div>
        )
      })
    )
  }

}

const mapStateToProps = state => {
  return {
    lang: state.HeaderReducer.appLanguage,
    token: state.UserReducer.token,
  }
}
const mapDispatchToProps = dispatch => bindActionCreators(
  {

  }
  , dispatch
)

export default connect(mapStateToProps, mapDispatchToProps)(Details);