import React from 'react';
import { Container, Col, Row, Button } from "reactstrap";
import String from '../../../assets/Locals/locals'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from "axios";
import { API_ENDPOINT } from '../../../AppConfig';
import SocialLinks from '../../../Component/SocialLinks/sociallinks'
import Rate from './Rate'
import Comments from './Comments'
import './ServiceDetails.css';
import { Link } from 'react-router-dom';

import Chat from '../Chat.js'
class EventDetails extends React.Component {
    state = {
        event: null,
        prevLang: this.props.lang,
        SliderIndex: 0,

    }
    componentWillMount() {
        let eventId = this.props.location.state.Restaurant.id
        this.GEtEvent(eventId)
        this.CreateView('VIEW', eventId)
    }
    GEtEvent(Id) {
        console.log("hello from get event")
        let uri = `${API_ENDPOINT}/userInfoWeb?userId=${Id}`
        axios.get(uri, {
            headers: {
                'Accept-Language': this.props.lang
            }
        }).then(response => {
            console.log("mmmmm : ",response.data.user)

            this.setState({ event: response.data.user })
        })
        .catch(error=>{
            console.log("errrr ::: ",error.response)
        })
    }
    CreateView(type, eventId) {
        let uri = `${API_ENDPOINT}/counter`
        let data = {}
        if (eventId) {
            data = {
                type: type,
                businessId: eventId,
            }
        } else {
            data = {
                type: type,
                businessId: this.state.event.id,
            }
        }

        axios.post(uri, data)
            .then(res => console.log("SUCCESS", res))
            .catch(err => console.log("ERRORRR", data))
    }
    prevSlide = (arr) => {

        if (this.state.SliderIndex === 0) {
          this.setState({
            SliderIndex: arr.length - 1,
          })
          console.log("SlideIndex from prev 1:: ", this.state.SliderIndex);
        }
        else {
          this.setState({
            SliderIndex: this.state.SliderIndex - 1
          })
          console.log("SlideIndex from prev 2 :: ", this.state.SliderIndex);
        }
      }
      nextSlide = (arr) => {
        console.log("arr length :: ", arr.length, this.state.SliderIndex)
        if (this.state.SliderIndex < arr.length - 1) {
    
          console.log("SlideIndex from next1 :: ", this.state.SliderIndex);
          this.setState({
            SliderIndex: this.state.SliderIndex + 1,
          })
        }
        else {
          this.setState({
            SliderIndex: 0,
          })
          // this.SlideIndex = 0;
          console.log("SlideIndex from next2 :: ", this.state.SliderIndex);
        }
    
      }
    
    render() {
        String.setLanguage(this.props.lang)
        let event = this.state.event
        let number = 0, tragetNumber = 0
        if (event) number = event.eventsPhones.length / 3
        if (Number.isInteger(number)) tragetNumber = number * 3 - 3
        else tragetNumber = Math.floor(number) * 3

        if (this.state.prevLang !== this.props.lang) {
            this.GEtEvent(event.id)
            this.setState({ prevLang: this.props.lang })
        }

        return (
        
            event ?
            <div>
 <div className=" ServiceDetailsSlider" >
          {console.log("slider data  :: ", event.slider ? event.slider.length : null)}
          {event.slider && event.slider.length > 0 ?
            <div className="SliderImage">
            
              {event.slider.length>0 ?
                <img data-aos="fade-up-right" src={`${API_ENDPOINT}${event.slider[this.state.SliderIndex]}`} alt="Slider Image" className="" style={{ height: '100% !important', width: '100%' }} />
                : null}
              <div className="">
                <Link onClick={() => { this.prevSlide(event.slider) }}><i className="fas fa-chevron-left SliderArrowsleft"></i></Link>
                <Link onClick={() => { this.nextSlide(event.slider) }} ><i className="fas fa-chevron-right SliderArrowsRight"></i></Link>
              </div>
            </div>
            : null}
        </div>
                <Container fluid style={{
                    direction: this.props.lang === 'ar' ? 'rtl' : 'ltr',
                    textAlign: this.props.lang === 'ar' ? 'right' : 'left',
                    minHeight: '70vh'
                }}>
                    <Chat ChatTitle={this.state.event.activityName} id={this.state.event.id} />
                    {/* <Row className="postion-relative">
                        <Col xs="12" lg="12" md="12"
                            className="py-5 bg-Services d-flex align-items-end justify-content-center">
                            <h2 className="text-white mt-5">

                            </h2>
                        </Col>
                    </Row> */}
                    <Row style={{ position: 'relative', height: '70px' }}>
                        <Col xl="10" lg="11" md="11" className="searchContainer"  data-aos="zoom-in" data-aos-duration="300">
                            <Row id="searchRow">
                                <Col lg="11" md="10" xs="8">
                                    <h3 className="eventTitle"> {event.activityName} </h3>
                                    <h5 className="distanceDetails"> 12 ك.م </h5>
                                </Col>
                                <Col lg="1" md="2" xs="4" className="px-0 text-center" > <div id="userbtn" className="locationBtn" onClick={() => this.CreateView('LOCATION')}> <i class="fas fa-map-marker-alt"></i></div> </Col>

                            </Row>
                        </Col>
                    </Row>
                    {event.aboutUs &&
                        <Row data-aos="fade-up" data-aos-delay="400">
                            <Col md="12" > <h3 className="text-gold" style={{ padding: '0 10%' }}> {String.description} </h3> </Col>
                        </Row>
                    }
                    {event.aboutUs &&
                        <Row className="descriptonContainer" data-aos="fade-up" data-aos-delay="400">
                            <h5> {event.aboutUs} </h5>
                        </Row>
                    }
                    <Row> <div className="eventLine"> </div> </Row>
                    <Row style={{ margin: '0 6%' }} data-aos="fade-up" data-aos-delay="400">
                        <Col lg="1" md="2" xs="4" className="px-0 text-center" > <div id="userbtn" className="locationBtn"> <i class="fas fa-mobile-alt"></i> </div> </Col>
                        <Col lg="11" md="10" xs="8" className="px-0 py-2">
                            <h3 className="text-gold"> {String.phoneTitle} </h3> </Col>
                    </Row>
                    {event.eventsPhones.length > 0 &&
                        <Row className="descriptonContainer my-4" data-aos="fade-up" data-aos-delay="400">
                            {event.eventsPhones.map((phone, index) => (
                                <Col md="4" key={index} className="p-0">
                                    <a href={`tel:${phone.phone}`} style={{ textDecoration: 'none' }}
                                        onClick={() => this.CreateView('CALL')}>
                                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                            <div className="phoneDiv"> <div> <h5> {phone.phone} </h5>  </div>  <div>  <i className="fas fa-phone-square-alt"></i> </div></div>
                                            {(index + 1) % 3 !== 0 && <div className="phoneLine"></div>}
                                        </div>
                                    </a>
                                    {(index + 1 <= tragetNumber) && <div className="phoneLineBottom" > </div>}
                                </Col>
                            ))}
                        </Row>
                    }
                    <Row style={{ margin: '0 6%' }} data-aos="fade-up" data-aos-delay="400">
                        <Col md="12" > <div className="downloadEvent"> <i className="far fa-file-pdf"></i> <h4> {String.downloadPDF} </h4> </div> </Col>
                    </Row>
                    <div style={{ margin: '2% 8%' }}> <SocialLinks businessId={event.id} view={true} /> </div>
                    <Rate service={event} />
                    <Comments service={event.id} />
                </Container> </div> : <div style={{ minHeight: '70vh' }}>  </div>
   
    )
    }
}
const mapStateToProps = state => {
    return {
        lang: state.HeaderReducer.appLanguage,
        user: state.UserReducer.user,
        token: state.UserReducer.token,
    }
}
const mapDispatchToProps = dispatch => bindActionCreators(
    {

    }
    , dispatch
)

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails);
// export default (EventDetails);


