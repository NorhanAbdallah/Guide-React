import React from 'react';
import String from '../../../assets/Locals/locals'
import { Col, Row } from "reactstrap";
import StarRatingComponent from 'react-star-rating-component';
import axios from "axios";
import { API_ENDPOINT } from '../../../AppConfig';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { showSnack } from 'react-redux-snackbar';

class Rate extends React.Component {
    constructor() {
        super();
        this.state = {
            rating: 1
        };
    }
    onStarClick(nextValue, prevValue, name) {
        this.setState({ rating: nextValue }, () => this.AddRate());
    }

    AddRate() {
        if (this.props.token) {
            let uri = `${API_ENDPOINT}/rate`
            let token = `Bearer ${this.props.token}`
            let data = {
                rate: this.state.rating,
                businessId: this.props.service.id
            }
            axios.post(uri, data, {
                headers: {
                    Authorization: token
                }
            }).then(response => {
                console.log("RATTTEDD", response.data)
                this.props.showSnack('myUniqueId', {
                    label: String.rateSuccess,
                    timeout: 7000,
                    button: { label: this.props.lang === 'en' ? 'Rating' : 'التقييم' }
                });
            }).catch(err => {
                this.props.showSnack('myUniqueId', {
                    label: err.response.data.errors,
                    timeout: 7000,
                    button: { label: this.props.lang === 'en' ? 'Rating' : 'التقييم' }
                });
            })
        } else {
            this.props.showSnack('myUniqueId', {
                label: String.rateError,
                timeout: 7000,
                button: { label: this.props.lang === 'en' ? 'Rating' : 'التقييم' }
            });
        }
    }

    render() {
        let lang = this.props.lang
        let service = this.props.service
        return (
            <div style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }} >
                <Row className="rateContainer" data-aos="fade-up">
                    <Col xl="2" md="0"></Col>
                    <Col xl="4" md="6" className={lang === 'ar' ? "firstcolRateAR" : "firstcolRateEN"}>
                        <h5 className="ratethis"> {service.type === 'EVENT' ? String.rateEvent : service.type === 'GENERAL_TRADING' ?
                            String.rateGeneral : String.rateElectronic}  </h5>
                        <div className="rateus border-radius">
                            <StarRatingComponent
                                name="commentRating"
                                editing={this.props.token ? true : false}
                                renderStarIcon={() => <span> <i class="fas fa-star"></i> </span>}
                                starCount={5}
                                value={this.state.rating}
                                onStarClick={this.onStarClick.bind(this)}
                            />
                        </div>
                        <h6 className="ratepeople mb-4"> <span> 97% <span> {String.peopleRate} </span> </span> </h6>
                    </Col>
                    <Col xl="4" md="6" className="text-center">
                        <div className="rateCircle mx-auto mb-2"> <h2> {service.rate} </h2> </div>
                        <StarRatingComponent
                            name="commentRating"
                            editing={false}
                            renderStarIcon={() => <span> <i class="fas fa-star"></i> </span>}
                            starCount={5}
                            value={service.rate}
                        />
                        <h6 className="my-2">  <span>{service.rate} <span> {String.from} </span> 5 </span> </h6>
                        <h6 className="mb-4"> 19 تقييمات </h6>
                    </Col>
                    <Col xl="2" md="0"></Col>
                </Row>
            </div>
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
        showSnack
    }
    , dispatch
)

export default connect(mapStateToProps, mapDispatchToProps)(Rate);
// export default (Rate);


