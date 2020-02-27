import React from 'react';
import './ServiceDetails.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import String from '../../../assets/Locals/locals';
import { API_ENDPOINT } from '../../../AppConfig.js'
import { Col, Row, Button, InputGroup, InputGroupAddon, Input, Container } from 'reactstrap'
import axios from "axios";
import Carousel from 'nuka-carousel';
import Details from './Details.js'
import { Link } from 'react-router-dom';
import { showSnack } from 'react-redux-snackbar';
import a3lanImg from '../../../assets/Images/a3lan.png';
import SocialLinks from '../../../Component/SocialLinks/sociallinks'
import Rate from './Rate'
import Comments from './Comments'

let SlideIndex = 0;
class ServiceDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            change: false,
            serviceFlag: false,
            menuFlag: false,
            offerFlag: false,
            ideasFlag: false,
            productsFlag: false,
            userData: [],
            ServiceData: [],
            OfferData: [],
            IdeaData: [],
            ProductData: [],
            MenuData: [],
            AllBranches: [],
            SliderIndex: 0,
            USERbYiD: [],
            fav:false,
        }

    }
    IdeasContent() {
        this.setState({
            serviceFlag: false,
            menuFlag: false,
            offerFlag: false,
            ideasFlag: true,
            productsFlag: false,
        })

    }
    ProductContent() {
        this.setState({
            serviceFlag: false,
            menuFlag: false,
            offerFlag: false,
            ideasFlag: false,
            productsFlag: true,
        })
    }
    ServiceContent() {
        this.setState({
            serviceFlag: true,
            menuFlag: false,
            offerFlag: false,
            ideasFlag: false,
            productsFlag: false,
        })
    }
    MenuContent() {
        this.setState({
            serviceFlag: false,
            menuFlag: true,
            offerFlag: false,
            ideasFlag: false,
            productsFlag: false,
        })
    }
    OfferContent() {
        this.setState({
            serviceFlag: false,
            menuFlag: false,
            offerFlag: true,
            ideasFlag: false,
            productsFlag: false,
        })
    }

    componentWillMount = () => {

        window.scrollTo(0, 0);
        if (this.props.location.state.Restaurant && this.props.location.state.Restaurant.favourite) {
            this.setState({
                fav: true
            })
        }
        this.setState({
            DATA: this.props.location.state.Restaurant
        }, () => {
            this.getUserData();
            this.getServiceData();
            this.getAllBranches();  
        })
        this.CreateView('VIEW', this.props.location.state.Restaurant.id)

    }

    getUserData() {
        let id = this.state.DATA.id;
        let uri = `${API_ENDPOINT}/userInfoWeb?userId=${id}&removeLanguage=true`;
        axios.get(uri, {
            headers: {
                "Content-Type": 'application/json',
                Authorization: `Bearer ${this.props.token}`,
                "Accept-Language": this.props.lang,
            }
        })
            .then(response => {

                this.setState({
                    USERbYiD: response.data.user,
                }, () => { console.log("response of user ::: ", response.data.user,uri) })
            })
            .catch(error => {
                console.log("error :: ", error.response);
                // handel error 
                if (!error.response) {
                    this.props.showSnack('myUniqueId', {
                        label: String.NetworkError,
                        timeout: 7000,
                        button: { label: String.Retry }
                    })
                }
                else if (error.response.status === 422) {
                    for (let i = 0; i < error.response.data.errors.length; i++) {
                        console.log("in if error", error.response.data.errors[i].msg)
                        this.props.showSnack('myUniqueId', {
                            label: error.response.data.errors[i].msg,
                            timeout: 7000,
                            button: { label: String.Retry }
                        })
                    }

                }
                else {
                    this.props.showSnack('myUniqueId', {
                        label: error.response.data.errors,
                        timeout: 7000,
                        button: { label: String.Retry }
                    })
                }
            })
    }
    getServiceData() {

        let id = this.state.DATA.id;
        let uri = `${API_ENDPOINT}/service?user=${id}`
        console.log("urii ", uri);
        axios.get(uri, {
            headers: {
                'Accept-Language': this.props.lang,
            }
        }).then(response => {
            console.log("response :: ", response.data);
            this.setState({
                userData: response.data.data[0].user,
                OfferData: response.data.data[0].offer,
                ServiceData: response.data.data[0].service,
                IdeaData: response.data.data[0].idea,
                ProductData: response.data.data[0].product,
                MenuData: response.data.data[0].menu,
            }, () => {
                if (response.data.data[0].product.length > 0) {
                    this.setState({
                        productsFlag: true,
                    })
                }
                else if (response.data.data[0].idea.length > 0) {
                    this.setState({
                        ideasFlag: true,
                    })
                }
                else if (response.data.data[0].service.length > 0) {
                    this.setState({
                        serviceFlag: true,
                    })
                }
                else if (response.data.data[0].offer.length > 0) {
                    this.setState({
                        offerFlag: true,
                    })
                }
                else if (response.data.data[0].menu.length > 0) {
                    this.setState({
                        menuFlag: true,
                    })
                }
            })

        })
            .catch(error => {
                console.log("error :: ", error.response);
                // handel error 
                if (!error.response) {
                    this.props.showSnack('myUniqueId', {
                        label: String.NetworkError,
                        timeout: 7000,
                        button: { label: String.Retry }
                    })
                }
                else if (error.response.status === 422) {
                    for (let i = 0; i < error.response.data.errors.length; i++) {
                        console.log("in if error", error.response.data.errors[i].msg)
                        this.props.showSnack('myUniqueId', {
                            label: error.response.data.errors[i].msg,
                            timeout: 7000,
                            button: { label: String.Retry }
                        })
                    }

                }
                else {
                    this.props.showSnack('myUniqueId', {
                        label: error.response.data.errors,
                        timeout: 7000,
                        button: { label: String.Retry }
                    })
                }
            })
    }
    getAllBranches() {
        let uri = `${API_ENDPOINT}/branch`

        axios.get(uri, {
            headers: {
                'Accept-Language': this.props.lang,
            }
        }).then(response => {
            console.log("response in get all branches:: ", response.data.data);
            this.setState({
                AllBranches: response.data.data,
            })
        })
            .catch(error => {
                console.log("error in get all branches::", error.response);
                // handel error 
                if (!error.response) {
                    this.props.showSnack('myUniqueId', {
                        label: String.NetworkError,
                        timeout: 7000,
                        button: { label: String.Retry }
                    })
                }
                else if (error.response.status === 422) {
                    for (let i = 0; i < error.response.data.errors.length; i++) {
                        console.log("in if error", error.response.data.errors[i].msg)
                        this.props.showSnack('myUniqueId', {
                            label: error.response.data.errors[i].msg,
                            timeout: 7000,
                            button: { label: String.Retry }
                        })
                    }

                }
                else {
                    this.props.showSnack('myUniqueId', {
                        label: error.response.data.errors,
                        timeout: 7000,
                        button: { label: String.Retry }
                    })
                }

            })
    }
    AddFav() {

        let uri = `${API_ENDPOINT}/favourite`
        let token = `Bearer ${this.props.token}`
        let data = {
            businessId: this.state.DATA.id
        }
        console.log("data====> ", data, uri, token);
        if (token) {
            axios.post(uri, data, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                    'Accept-Language': this.props.lang,
                }
            })
                .then(response => {
                    console.log("response of fav ::", response.data);
                    this.setState({
                        fav: true
                    })
                })
                .catch(error => {
                    console.log("error :: ", error.response);
                    if (!error.response) {
                        this.props.showSnack('myUniqueId', {
                            label: String.NetworkError,
                            timeout: 7000,
                            button: { label: String.Retry }
                        })
                    }
                    else if (error.response.status === 401) {
                        this.props.showSnack('myUniqueId', {
                            label: String.LoginFirst,
                            timeout: 7000,
                            button: { label: String.Retry }
                        })
                    }
                    else if (error.response.status === 422) {
                        for (let i = 0; i < error.response.data.errors.length; i++) {
                            console.log("in if error", error.response.data.errors[i].msg)
                            this.props.showSnack('myUniqueId', {
                                label: error.response.data.errors[i].msg,
                                timeout: 7000,
                                button: { label: String.Retry }
                            })
                        }

                    }
                    else {
                        this.props.showSnack('myUniqueId', {
                            label: error.response.data.errors,
                            timeout: 7000,
                            button: { label: String.Retry }
                        })
                    }
                })
        }
    }
    RemoveFav() {

        let uri = `${API_ENDPOINT}/favourite`
        let token = `Bearer ${this.props.token}`
        let data = {
            businessId: this.state.DATA.id
        }
        console.log("data====> ", data, uri, token);
        if (token) {
            axios.delete(uri, {
                headers: {
                    'Accept-Language': this.props.lang,
                    Authorization: token
                }, data
            })
                .then(response => {
                    console.log("response of fav ::", response.data);
                    this.setState({
                        fav: false
                    })
                })
                .catch(error => {
                    console.log("error :: ", error.response);
                    if (!error.response) {
                        this.props.showSnack('myUniqueId', {
                            label: String.NetworkError,
                            timeout: 7000,
                            button: { label: String.Retry }
                        })
                    }
                    else if (error.response.status === 401) {
                        this.props.showSnack('myUniqueId', {
                            label: String.LoginFirst,
                            timeout: 7000,
                            button: { label: String.Retry }
                        })
                    }
                    else if (error.response.status === 422) {
                        for (let i = 0; i < error.response.data.errors.length; i++) {
                            console.log("in if error", error.response.data.errors[i].msg)
                            this.props.showSnack('myUniqueId', {
                                label: error.response.data.errors[i].msg,
                                timeout: 7000,
                                button: { label: String.Retry }
                            })
                        }

                    }
                    else {
                        this.props.showSnack('myUniqueId', {
                            label: error.response.data.errors,
                            timeout: 7000,
                            button: { label: String.Retry }
                        })
                    }
                })
        }
    }
    prevSlide = (arr) => {

        if (this.state.SliderIndex === 0) {
            this.setState({
                SliderIndex: arr.length - 1,
            })
            // this.SlideIndex = arr.length - 1;
            console.log("SlideIndex from prev 1:: ", this.state.SliderIndex);

        }
        else {
            this.setState({
                SliderIndex: this.state.SliderIndex - 1
            })
            // this.SlideIndex = this.SlideIndex - 1;
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
            // this.SlideIndex = this.SlideIndex + 1;
        }
        else {
            this.setState({
                SliderIndex: 0,
            })
            // this.SlideIndex = 0;
            console.log("SlideIndex from next2 :: ", this.state.SliderIndex);
        }

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
                businessId: this.state.DATA.id,
            }
        }

        axios.post(uri, data)
            .then(res => console.log("SUCCESS", res))
            .catch(err => console.log("ERRORRR", data))
    }


    render() {
        String.setLanguage(this.props.lang)
        console.log("received data :: ", this.state.USERbYiD ? this.state.USERbYiD : null, this.props.lang, this.state.USERbYiD.length)
        console.log("received data00222 :: ", this.state.userData ? this.state.userData : null, this.props.lang)
        return (
            <div>
                <div className=" ServiceDetailsSlider" >
                    {console.log("slider data  :: ", this.state.USERbYiD.slider ? this.state.USERbYiD.slider.length : null)}

                    {this.state.USERbYiD.slider && this.state.USERbYiD.slider.length > 0 ?
                        <div className="SliderImage">
                            {this.state.USERbYiD.slider ?
                                console.log("ssss :::", this.state.USERbYiD.slider[this.state.SliderIndex], this.state.SliderIndex)
                                : null}
                            {this.state.USERbYiD.slider ?
                                <img data-aos="fade-up-right" src={`${API_ENDPOINT}${this.state.USERbYiD.slider[this.state.SliderIndex]}`} alt="Slider Image" className="" style={{ height: '100% !important', width: '100%' }} />
                                : null}
                            <div className="">
                                <Link onClick={() => { this.prevSlide(this.state.USERbYiD.slider) }}><i className="fas fa-chevron-left SliderArrowsleft"></i></Link>
                                <Link onClick={() => { this.nextSlide(this.state.USERbYiD.slider) }} ><i className="fas fa-chevron-right SliderArrowsRight"></i></Link>
                            </div>

                        </div>
                        : null}
                </div>
                {/* <Container> */}
                <div className="ContainerStyle">

                    {/* Start of title */}
                    <div className="py-3 px-5  ServiceTitle" data-aos="flip-down" data-aos-duration="300">

                        <div className="ServiceTitleContent">
                            <h3 style={{ color: "green" }}>{this.state.USERbYiD && this.state.USERbYiD.activityName ?
                                (this.props.lang === "ar" ? this.state.USERbYiD.activityName.ar : this.state.USERbYiD.activityName.en)

                                : String.NoActivityName}</h3>
                            <i className={this.props.lang === "en" ? "fas fa-star ml-4 " : "fas fa-star mr-4 "} style={{ color: '#FA7F2B' }}></i>
                            <h5 style={{ color: '#FA7F2B' }}>{this.state.USERbYiD.rate}</h5>
                        </div>
                        <div>
                            <a href={`tel:${this.state.USERbYiD.phone}`} onClick={() => this.CreateView('CALL')}> <i className="fa fa-phone-alt mx-2 p-3" style={{ backgroundColor: '#F2F2F2', borderRadius: '50%', padding: '10px', color: 'green' }}></i></a>
                            {this.state.fav === false ?
                                <Link onClick={() => { this.AddFav() }}>
                                    <i className="far fa-heart mx-2 p-3" style={{ backgroundColor: '#F2F2F2', borderRadius: '50%', padding: '10px', color: "red" }}></i>
                                </Link>
                                :
                                <Link onClick={() => { this.RemoveFav() }}><i className="fas fa-heart mx-2 p-3" style={{ backgroundColor: '#F2F2F2', borderRadius: '50%', padding: '10px', color: "red" }}></i></Link>}
                        </div>

                    </div>
                    {/* End of title */}

                    {/* kalmt about Us (hatzhr iza kan el type= ELECTRONIC_TRADING) */}

                    <h4 style={{ color: '#FA7F2B', float: this.props.lang === "ar" ? 'right' : 'left' }} className="pt-4 px-5 mt-5">{String.Aboutus}</h4>
                    :
                        <div style={{ float: this.props.lang === "ar" ? 'right' : 'left' }} className="pt-4 px-5 mt-5"></div>


                    {/* ******************* */}
                    <div className="clr "></div>
                    {/* Start of About Us */}
                    <div data-aos="zoom-in" style={{ backgroundColor: '#F5F5F5', borderRadius: '20px' }} className="px-5 py-4 my-5 ">
                        <p style={{ textAlign: this.props.lang === "ar" ? 'right' : 'left' }}>
                            {this.state.USERbYiD.length > 0 && this.state.USERbYiD.aboutUs !== "" ?
                                (this.props.lang === "ar" ? this.state.USERbYiD.aboutUs.ar : this.state.USERbYiD.aboutUs.en)
                                : String.NOABOUTUS}
                        </p>
                    </div>
                    {/* End of About Us */}

                    <div style={{ backgroundColor: "#F5F5F5", height: '2px', width: '100%' }} className="my-3"></div>

                    {/* Services buttons ( hatzhar iza kan fyh service asln yr kda el button m4 hyzhar) */}
                    {/* rl div di fyhe 3 agat (row-> service buttons) ( row-> fyh 2 col(a3lan aw branches)(services)) */}
                    <div data-aos="fade-up" data-aos-delay="400">
                        <Row className="px-4 " >
                            {this.state.ProductData.length > 0 ?
                                <Link className="px-4 py-2 mx-2 my-4 btn1" style={{ borderRadius: '20px', fontSize: '22px', border: 'none', textDecoration: 'none', color: this.state.productsFlag === true ? 'white' : '#777', backgroundColor: this.state.productsFlag === true ? "#3E860B" : '#F5F5F5' }} onClick={() => this.ProductContent()}>{String.ProductList}</Link>
                                : null}
                            {this.state.IdeaData.length > 0 ?
                                <Link className="px-4 py-2 mx-2 my-4 btn2" style={{ borderRadius: '20px', fontSize: '22px', border: 'none', textDecoration: 'none', color: this.state.ideasFlag === true ? 'white' : '#777', backgroundColor: this.state.ideasFlag === true ? "#3E860B" : '#F5F5F5' }} onClick={() => this.IdeasContent()}>  {String.IdeasList} </Link>
                                : null}
                            {this.state.ServiceData.length > 0 ?
                                <Link className="px-4 py-2 mx-2 my-4 btn2" style={{ borderRadius: '20px', fontSize: '22px', border: 'none', textDecoration: 'none', color: this.state.serviceFlag === true ? 'white' : '#777', backgroundColor: this.state.serviceFlag === true ? "#3E860B" : '#F5F5F5' }} onClick={() => this.ServiceContent()}>  {String.ServicesList} </Link>
                                : null}
                            {this.state.OfferData.length > 0 ?
                                <Link className="px-4 py-2 mx-2 my-4 btn2" style={{ borderRadius: '20px', fontSize: '22px', border: 'none', textDecoration: 'none', color: this.state.offerFlag === true ? 'white' : '#777', backgroundColor: this.state.offerFlag === true ? "#3E860B" : '#F5F5F5' }} onClick={() => this.OfferContent()}>  {String.OffersList} </Link>
                                : null}
                            {this.state.MenuData.length > 0 ?
                                <Link className="px-4 py-2 mx-2 my-4 btn2" style={{ borderRadius: '20px', fontSize: '22px', border: 'none', textDecoration: 'none', color: this.state.menuFlag === true ? 'white' : '#777', backgroundColor: this.state.menuFlag === true ? "#3E860B" : '#F5F5F5' }} onClick={() => this.MenuContent()}>  {String.MenuList} </Link>
                                : null}
                        </Row>

                        {/* el condition da 3l4an lw el services array =[] ,  y3rd el a3lan bs aw el branches (col-12) */}
                        {this.state.IdeaData.length > 0 ||
                            this.state.MenuData.length > 0 ||
                            this.state.OfferData.length > 0 ||
                            this.state.ProductData.length > 0 ||
                            this.state.ServiceData.length > 0 ?
                            <Row >
                                {this.state.productsFlag === true ||
                                    this.state.menuFlag === true ||
                                    this.state.offerFlag === true ||
                                    this.state.serviceFlag === true ||
                                    this.state.ideasFlag === true ?
                                    <Col lg="7" xs="12" md="12" style={{ backgroundColor: '#F5F5F5', height: 'auto !important', width: 'auto', borderRadius: '20px', }} className="px-4 py-4 my-4 serviceContent">
                                        <div style={{}}>
                                            {console.log("ccccccc >>", this.state.MenuData)}
                                            {console.log("menu >>", this.menuFlag)}
                                            {console.log("offer >>", this.offerFlag)}
                                            {console.log("service >>", this.serviceFlag)}
                                            {console.log("product >>", this.productsFlag)}
                                            {console.log("idea >>", this.ideasFlag)}
                                            {this.state.productsFlag === true &&
                                                this.state.ProductData.length > 0 ?
                                                <Details DetailsData={this.state.ProductData} />
                                                : null}
                                            {this.state.menuFlag === true &&
                                                this.state.MenuData.length > 0 ?
                                                <Details DetailsData={this.state.MenuData} />
                                                : null}

                                            {this.state.offerFlag === true &&
                                                this.state.OfferData.length > 0 ?
                                                <Details DetailsData={this.state.OfferData} />
                                                : null}

                                            {this.state.serviceFlag === true &&
                                                this.state.ServiceData.length > 0 ?
                                                <Details DetailsData={this.state.ServiceData} />
                                                : null}
                                            {this.state.ideasFlag === true &&
                                                this.state.IdeaData.length > 0 ?
                                                <Details DetailsData={this.state.IdeaData} />
                                                :
                                                null
                                            }
                                        </div>
                                    </Col>
                                    : null}

                                {/*Hna ha3rd el branches iza kan general trading aw a3lan iza kan ELECTRONIC_TRADING   */}
                                <Col lg="5" xs="12" md="12">
                                    <div style={{ background: 'linear-gradient(45deg, #FA7F2B, #FF9A56)', borderRadius: '20px' }} className="mx-5  ">
                                        <h3 style={{ textAlign: 'center', color: 'white' }} className="pt-4">{String.Branches}</h3>
                                        <div style={{ backgroundColor: 'white', overflow: 'scroll', height: '500px' }} className="pt-4 pb-1 mx-1">
                                            {this.state.AllBranches.length > 0 ?
                                                this.state.AllBranches.map((element, index) => {
                                                    return (
                                                        <Row className="px-4" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                            <Col lg="10" xs="10" md="10">
                                                                <Row>
                                                                    <Col lg="12" xs="12" md="12" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                        <h5>{element.name ? element.name : String.NoName}</h5>
                                                                        <h5>Distance</h5>

                                                                    </Col>
                                                                    <Col lg="12" xs="12" md="12">{element.buildingNumber + " " + String.street + " " + element.street + ' , ' + String.AREA + " " + element.areaId.name + " " + String.CITY + " " + element.areaId.cityId.name}</Col>

                                                                </Row>
                                                            </Col>
                                                            <Col lg="2" xs="2" md="2" className="">
                                                                <a href={`tel:${element.phone}`}>  <i className="fa fa-phone-alt  p-2" style={{ borderRadius: '20px', padding: '5px', color: 'green', border: '1px solid #f5f5f5' }}></i></a>

                                                                <i class="fas fa-map-marker-alt my-2  p-2" style={{ borderRadius: '20px', padding: '5px', color: 'orange', border: '1px solid #f5f5f5' }}></i>

                                                            </Col>

                                                            <Col xs="12" md="12" lg="12">
                                                                <div style={{ backgroundColor: "rgb(234, 227, 227)", height: '2px', width: '100%' }} className="my-3"></div>

                                                            </Col>

                                                        </Row>
                                                    )
                                                })

                                                : null}
                                        </div>

                                        <img />
                                    </div>


                                </Col>

                            </Row>
                            :


                            <div className="a3lanAndBranchDiv" style={{ margin: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                                <div style={{ background: 'linear-gradient(45deg, #FA7F2B, #FF9A56)', borderRadius: '20px' }}
                                    className="  branchesDivOnly">
                                    <h3 style={{ textAlign: 'center', color: 'white' }} className="pt-4">{String.Branches}</h3>
                                    <div style={{ backgroundColor: 'white', overflow: 'scroll', height: '100% !important' }} className="pt-4 pb-1 mx-auto branchesContent">
                                        {this.state.AllBranches.length > 0 ?
                                            this.state.AllBranches.map((element, index) => {
                                                return (
                                                    <Row className="px-4" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Col lg="10" xs="10" md="10">
                                                            <Row>
                                                                <Col lg="12" xs="12" md="12" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    <h5>{element.name ? element.name : String.NoName}</h5>
                                                                    <h5>Distance</h5>

                                                                </Col>
                                                                <Col lg="12" xs="12" md="12">{element.buildingNumber + " " + String.street + " " + element.street + ' , ' + String.AREA + " " + element.areaId.name + " " + String.CITY + " " + element.areaId.cityId.name}</Col>

                                                            </Row>
                                                        </Col>
                                                        <Col lg="2" xs="2" md="2" className="">
                                                            <a href={`tel:${element.phone}`} >  <i className="fa fa-phone-alt  p-2" style={{ borderRadius: '20px', padding: '5px', color: 'green', border: '1px solid #f5f5f5' }}></i></a>

                                                            <i class="fas fa-map-marker-alt my-2  p-2" style={{ borderRadius: '20px', padding: '5px', color: 'orange', border: '1px solid #f5f5f5' }}></i>

                                                        </Col>

                                                        <Col xs="12" md="12" lg="12">
                                                            <div style={{ backgroundColor: "rgb(234, 227, 227)", height: '2px', width: '100%' }} className="my-3"></div>

                                                        </Col>

                                                    </Row>
                                                )
                                            })

                                            : null}
                                    </div>


                                </div>



                            </div>
                        }
                    </div>

                    <div className="ServiceDetailsWorkingHours py-4 px-5 my-5">
                        <Row>
                            <Col lg="4" md="12" xs="12" className="ServiceDetailsWorkingHoursPart1"
                                style={{ textAlign: this.props.lang === "ar" ? "right" : 'left' }}>
                                <i className={this.props.lang === "ar" ? "fa fa-clock ml-3 fa-2x" : "fa fa-clock mr-3 fa-2x"}
                                    style={{ color: '#40880C' }} ></i>
                                <h4 style={{ fontSize: '30px' }}>{String.WorkingHours}</h4>
                            </Col>
                            <Col lg="8" md="12" xs="12" style={{ textAlign: 'center', fontSize: '20px', color: '#9E9E9E' }}>
                                {this.state.USERbYiD.workHours && this.state.USERbYiD.workHours.length > 0 ?
                                    this.state.USERbYiD.workHours.map((element, index) => {
                                        console.log("workinghoursdata",this.state.USERbYiD.workHours)
                                        return (
                                            <div>
                                                {element}
                                            </div>
                                        )
                                    }) : String.NoWorkingHours}
                            </Col>
                        </Row>
                    </div>
                    <SocialLinks businessId={this.state.DATA.id} view={true} />
                    <Rate service={this.state.DATA} />
                    <Comments service={this.state.DATA.id} />
                </div>
                {/* </Container> */}
            </div>
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
        showSnack
    }
    , dispatch
)

export default connect(mapStateToProps, mapDispatchToProps)(ServiceDetails);

