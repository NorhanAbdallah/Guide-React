import React from 'react';
import {
    Card, CardImg, CardBody,
    CardTitle, CardSubtitle, Button
} from 'reactstrap';
import './Card.css'
import { Link } from 'react-router-dom'
import String from '../../../assets/Locals/locals'
import { API_ENDPOINT } from '../../../AppConfig';
class ServicesCard extends React.Component {
    render() {
        let Restaurant = this.props.restaurant
        console.log("Resturant  : ", Restaurant)
        return (
            <div id="servicesCard">
                <Card>
                    <div className="postion-relative" style={{ minHeight: '245px', backgroundColor: '#52A318', borderRadius: '30px' }}>
                        {Restaurant.logo !== "" &&
                            <CardImg top width="100%" src={Restaurant.logo !== "" ? API_ENDPOINT + Restaurant.logo : ""} alt="Card image cap" />
                        }
                        <div className="contentOnImage">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div className="ratingService"> <p>  <i class="fas fa-star"></i> {Restaurant.rate}</p> </div>
                                <div style={{ display: 'block' }}>
                                    {this.props.user && <div className="heartService" style={{ color: Restaurant.favourite ? '#E02C2E' : '#9E9E9E' }}
                                        onClick={() => this.props.HeartClicked(Restaurant)}> <i class="fas fa-heart"></i> </div>}
                                    <a href={`tel:${Restaurant.phone}`}> <div className="phoneService"> <i class="fas fa-phone-alt"></i> </div> </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <CardBody>
                        <CardTitle> <div className="serviceCardTitle"> <h4> {Restaurant.activityName} </h4> <h6> 12ك.م </h6> </div> </CardTitle>
                        <CardSubtitle><p style={{ textAlign: this.props.lang === 'en' && 'left' }}> <span> {String.timeWorking} </span> {Restaurant.workHours.length === 0 ? String.noWorking :
                            Restaurant.workHours.map((time, index) => <span className="timeCard"> {time + ' '} </span>)} </p></CardSubtitle>

                        {console.log("id of resturant : ", Restaurant)}
                        {Restaurant ?
                            < div id="serviceCardBTN" >
                                {Restaurant.type === "EVENT" ?
                                    <Link to={{ pathname: '/Guide/EventDetails', state: { Restaurant: Restaurant } }} className="greenBTN">
                                        <Button color="primary" className="btn-block"> {String.show}
                                        </Button>
                                    </Link>
                                    : null}
                                {Restaurant.type === 'GENERAL_TRADING' ?
                                    <Link to={{ pathname: '/Guide/ServiceDetails', state: { Restaurant: Restaurant } }} className="greenBTN">
                                        <Button color="primary" className="btn-block"> {String.show}
                                        </Button>
                                    </Link> : null
                                }
                                {Restaurant.type === 'ELECTRONIC_TRADING' ?

                                    <Link to={{ pathname: "/Guide/ElectronicDetails", state: { Restaurant: Restaurant } }} className="greenBTN">
                                        <Button color='primary' className="btn-block "> {String.show}</Button>
                                    </Link>
                                    : null
                                }


                            </div>
                            : null}
                    </CardBody>
                </Card>
            </div >
        )
    }
}
export default (ServicesCard);