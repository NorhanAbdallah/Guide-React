import React from 'react';
import { Container, Col, Row, Input } from "reactstrap";
import String from '../../../assets/Locals/locals'
import ServicesCard from '../Card/Card'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from "axios";
import { API_ENDPOINT } from '../../../AppConfig';
import Location from './Location.js'
import { Redirect } from 'react-router-dom';

class Restaurants extends React.Component {
    state = {
        categoryName: this.props.location.state ? this.props.location.state.categoryName : '',
        departmentId: this.props.location.state ? this.props.location.state.departmentId : '',
        catrgoryType: 'GENERAL_TRADING',
        restaurants: [],
        noService: false,
        prevLang: this.props.lang,
        searchInput: null,

        countries: [],
        countryId: null,

        cities: [],
        cityId: null,

        lat: null,
        longitude: null
    }
    componentWillMount() {
        // Bashandy add to start at every page from top
        window.scrollTo({
            top: 0,
            left: 0,
            // behavior: 'smooth'
        });
    }
    componentDidMount() {
        this.fetchDepartment(this.props.location.state.categoryIdHome)
        // Bashandy add to start at every page from top
        window.scrollTo({
            top: 0,
            left: 0,
            // behavior: 'smooth'
        });
        let type = this.props.location.state && this.props.location.state.serviceType ? this.props.location.state.serviceType : 'GENERAL_TRADING'
        this.setState({ catrgoryType: type }, () => this.GetRestaurant())
        if (type !== 'GENERAL_TRADING') {
            if (this.props.lang === 'en') {
                this.setState({ categoryName: this.props.location.state.categoryNameEN })
            }
        }
        this.GetCountries()
    }
    fetchDepartment(id){
        let uri = `${API_ENDPOINT}/category/${id}`
        console.log("test request", uri)
        axios.get(uri, {
            headers: {
                'Accept-Language': this.props.lang
            }
        }).then(response => {
            console.log("dataaaaaaaaaaa",response.data,this.props.lang,this.props.lang==="ar")
            this.setState({ GeneralNameEN:response.data.name.en, GeneralName:response.data.name.ar })

        }
        )
    }
    GetRestaurant(name, countryId, cityId) {
        window.scrollTo({
            top: 0,
            left: 0,
            // behavior: 'smooth'
        });
        console.log("user take place", this.props.user)
        // console.log("user take place", JSON.parse(this.props.user))
        let uri = ``, type = this.state.catrgoryType,
            user = this.props.user
        if (type === 'GENERAL_TRADING') {
            if (user) {
                if (this.props.location.state.fromHeader) {
                    let categoryId = this.props.location.state.categoryId
                    this.setState({ categoryId: this.props.location.state.categoryId })
                    uri = `${API_ENDPOINT}/allUsers?categoryId=${categoryId}&user=${user.id}`
                } else {
                    uri = `${API_ENDPOINT}/allUsers?subCategoryId=${this.state.departmentId}&user=${user.id}`
                }
            } else {
                if (this.props.location.state.fromHeader) {
                    let categoryId = this.props.location.state.categoryId
                    this.setState({ categoryId: this.props.location.state.categoryId })
                    uri = `${API_ENDPOINT}/allUsers?categoryId=${categoryId}`
                } else {
                    uri = `${API_ENDPOINT}/allUsers?subCategoryId=${this.state.departmentId}`
                }
            }

        } else {
            if (user) {
                uri = `${API_ENDPOINT}/allUsers?type=${type}&user=${user.id}`
            } else {
                uri = `${API_ENDPOINT}/allUsers?type=${type}`
            }
        }

        if (name) uri += `&activityName=${name}`
        if (countryId && countryId !== '-1') uri += `&countryId=${countryId}`
        if (cityId && cityId !== '-1') uri += `&cityId=${cityId}`

        console.log("URIIIREST", uri, type)
        axios.get(uri, {
            headers: {
                'Accept-Language': this.props.lang
            }
        }).then(response => {
            console.log("URIIIREST response", response.data)

            if (type === 'GENERAL_TRADING') {
                // if(response.data.data.length===0){
                //     this.fetchDepartment(this.props.location.state.categoryIdHome)
                // }
                this.setState({ restaurants: response.data.data, categoryName: response.data.data.length > 0 ? response.data.data[0].subCategoryId.categoryId.name : this.state.categoryName, noService: true })
            } else {
                this.setState({ restaurants: response.data.data, noService: true })
            }
        }).catch(error => {
            console.log("ErrorTakePlace", error)
            console.log("ErrorTakePlace", error.response)
        })
    }

    GetCountries() {
        let uri = `${API_ENDPOINT}/country`
        axios.get(uri, {
            headers: {
                'Accept-Language': this.props.lang
            }
        }).then(response => this.setState({ countries: response.data.data }))
    }
    GetCities(Id) {
        let uri = `${API_ENDPOINT}/city?countryId=${Id}`
        axios.get(uri, {
            headers: {
                'Accept-Language': this.props.lang
            }
        }).then(response => this.setState({ cities: response.data.data, countryId: Id }))
    }

    getLocation = (location) => {
        console.log("LOCATIONNNN", location)
        if (location) {
            this.setState({ lat: location.latitude, longitude: location.longitude }, () =>
                console.log("LATTT", this.state.lat, this.state.longitude)
            )
        }

    }

    getNearest() {
        let type = this.state.catrgoryType
        let uri = `${API_ENDPOINT}/nearest?type=${type}`
        let data = {
            longitude: this.state.longitude,
            latitude: this.state.lat,
        }
        axios.post(uri, data, {
            headers: {
                'Accept-Language': this.props.lang
            }
        }).then(response => {
            let services = response.data, target = []
            if (type === 'EVENT') {
                target = response.data
            } else {
                for (let i = 0; i < services.length; i++) {
                    target.push(services[i].user)
                }
            }
            this.setState({ restaurants: target })
            console.log("NEARRRST", response.data, uri)
        })
    }
    HeartClicked = (service) => {
        console.log("SERVICEEE", service.id)
        if (service.favourite) {
            this.RemoveFavourite(service.id)
        } else {
            this.AddFavourite(service.id)
        }
    }

    AddFavourite = (Id) => {
        console.log("hi remove favourite",Id)
        if (this.props.token) {
            let uri = `${API_ENDPOINT}/favourite`
            let token = `Bearer ${this.props.token}`
            let data = {
                businessId: Id,
            }
            axios.post(uri, data, {
                headers: {
                    'Accept-Language': this.props.lang,
                    Authorization: token
                }
            }).then(response => {
                console.log("FAVVVV", response.data)
                this.changeFavourite(Id)
            }).catch(error => {
                console.log("FAVVVV", error.response)
            })
        }
    }
    RemoveFavourite = (Id) => {
        if (this.props.token) {
            let uri = `${API_ENDPOINT}/favourite`
            let token = `Bearer ${this.props.token}`
            let data = {
                businessId: Id,
            }
            axios.delete(uri, {
                headers: {
                    'Accept-Language': this.props.lang,
                    Authorization: token
                }, data
            }).then(response => {
                console.log("FAVVVV", response.data)
                this.changeFavourite(Id)
            })
        }
    }

    changeFavourite(id) {
        let singleObject = this.state.restaurants.filter(rest => rest.id === id)
        let object = this.state.restaurants
        let index = 0
        for (let i = 0; i < this.state.restaurants.length; i++) {
            let element = this.state.restaurants[i]
            if (element.id === id) {
                index = i
            }
        }
        let service = singleObject[0]
        service.favourite = !service.favourite
        singleObject[0] = service
        object[index] = singleObject[0]
        this.setState({ restaurants: object },() => console.log("restttt", this.state.restaurants, index, singleObject[0]) )
    }
    render() {
        String.setLanguage(this.props.lang)
        let type = this.state.catrgoryType
        console.log("TYPEE", type)

        if (this.state.prevLang !== this.props.lang) {
            this.GetRestaurant()
            this.GetCountries()
            this.GetCities(this.state.countryId)
            if (type !== 'GENERAL_TRADING') {
                if (this.props.lang === 'en') {
                    this.setState({ categoryName: this.props.location.state.categoryNameEN })
                } else {
                    this.setState({ categoryName: this.props.location.state.categoryName })
                }
            }else{
                if (this.props.lang === 'en') {
                    this.setState({ categoryName: this.state.GeneralNameEN })
                } else {
                    this.setState({ categoryName: this.state.GeneralName })
                }
            }
            this.setState({ prevLang: this.props.lang })
        }
        console.log("NAMEEEE 111",  this.props.location.state.categoryName)
        if (this.props.location.state) {
            if (this.state.catrgoryType !== this.props.location.state.serviceType && this.props.location.state.serviceType) {
                this.setState({ catrgoryType: this.props.location.state.serviceType }, () =>
                    this.GetRestaurant())
                    console.log("NAMEEEE 222",  this.props.location.state.categoryName, )
                if ( this.props.location.state.serviceType !== 'GENERAL_TRADING') {
                    if (this.props.lang === 'en') {
                        this.setState({ categoryName: this.props.location.state.categoryNameEN })
                    } else {
                        this.setState({ categoryName: this.props.location.state.categoryName })
                    }
                }
            }
            else if (this.props.location.state.categoryId) {
                if (this.state.categoryId !== this.props.location.state.categoryId) {
                   
                    this.setState({
                        categoryId: this.props.location.state.categoryId,
                        categoryName: this.props.location.state.categoryName
                    }, () =>
                        this.GetRestaurant())
                }
            }

        }

        return (
            <Container fluid style={{ direction: this.props.lang === 'ar' ? 'rtl' : 'ltr', textAlign: 'right' }}>
                <Row className="postion-relative">
                    <Col xs="12" lg="12" md="12"  data-aos="zoom-in" data-aos-duration="400"
                        className=" py-5 bg-Services d-flex align-items-end justify-content-center">
                        <h2 className="text-white mb-5">
                            {/* {type === 'GENERAL_TRADING' ? this.state.categoryName : type === 'EVENT' ? String.events : String.electronicshops} */}
                            {this.state.categoryName}
                        </h2>
                    </Col>
                </Row>

                <Row className="searchServices" data-aos="zoom-in">
                    <Col xl="10" lg="11" md="11" className="searchContainer">
                        {type === 'ELECTRONIC_TRADING' ?
                            <Row id="searchRow">
                                <Col lg="6" md="6"> <div className="postion-relative">
                                    <Input type="text" placeholder={String.seacrh} onChange={(e) => {
                                        this.setState({ searchInput: e.target.value })
                                        this.GetRestaurant(e.target.value, this.state.countryId, this.state.cityId)
                                    }}> </Input>
                                    <span className="searchIcon" style={{ left: this.props.lang === 'ar' && '5%', right: this.props.lang === 'en' && '5%' }}> <i class="fas fa-search"></i> </span>  </div> </Col>
                                <Col lg="6" md="6">
                                <Input className="select-wrapper" type="select" onChange={(e) => {
                                        this.GetCities(e.target.value)
                                        this.GetRestaurant(this.state.searchInput, e.target.value, this.state.cityId)
                                    }}>
                                        <option value={-1}> {String.country} </option>
                                        {this.state.countries.map((country, index) => (
                                            <option value={country.id}> {country.name} </option>
                                        ))}
                                    </Input>
                                    <div className={this.props.lang === 'ar' ? "arrowDown" : "arrowDownEN"} style={{ top: '15px' }}> <i class="fas fa-chevron-down"></i> </div>
                                </Col>

                            </Row> :
                            <Row id="searchRow">
                                <Col lg="5" md="4"> <div className="postion-relative">
                                    <Input type="text" placeholder={String.seacrh} onChange={(e) => {
                                        this.setState({ searchInput: e.target.value })
                                        this.GetRestaurant(e.target.value, this.state.countryId, this.state.cityId)
                                    }}> </Input>
                                    <span className="searchIcon" style={{ left: this.props.lang === 'ar' && '7%', right: this.props.lang === 'en' && '7%' }}> <i class="fas fa-search"></i> </span>  </div> </Col>
                                <Col lg="3" md="3">

                                    <Input className="select-wrapper" type="select" onChange={(e) => {
                                        this.GetCities(e.target.value)
                                        this.GetRestaurant(this.state.searchInput, e.target.value, this.state.cityId)
                                    }}>
                                        <option value={-1}> {String.country} </option>
                                        {this.state.countries.map((country, index) => (
                                            <option value={country.id}> {country.name} </option>
                                        ))}
                                    </Input>
                                    <div className={this.props.lang === 'ar' ? "arrowDown" : "arrowDownEN"} style={{ top: '15px' }}> <i class="fas fa-chevron-down"></i> </div>
                                </Col>
                                <Col lg="3" md="3">
                                    <Input type="select" onChange={(e) => {
                                        this.setState({ cityId: e.target.value })
                                        this.GetRestaurant(this.state.searchInput, this.state.countryId, e.target.value)
                                    }}>
                                        <option value={-1}> {String.city} </option>
                                        {this.state.cities.map((city, index) => (
                                            <option value={city.id}> {city.name} </option>
                                        ))}
                                    </Input>
                                    <div className={this.props.lang === 'ar' ? "arrowDown" : "arrowDownEN"} style={{ top: '15px' }}> <i class="fas fa-chevron-down"></i> </div>
                                </Col>
                                <Col lg="1" md="2" className="px-0 text-center" onClick={() => this.getNearest()}> <div id="userbtn" className="locationBtn"> <i class="fas fa-map-marker-alt"></i></div> </Col>
                            </Row>

                        }

                    </Col>
                    {!this.state.lat && <Location getLocation={this.getLocation} />}
                </Row>
                <Row className="serviceRestaurant" style={{ margin: 'auto', minHeight: '300px' }} data-aos="zoom-in" >
                    {this.state.restaurants.length > 0 ? this.state.restaurants.map((item, index) => (
                        <Col md="4"> <ServicesCard restaurant={item} lang={this.props.lang} HeartClicked={this.HeartClicked} user={this.props.token ? true : false} /> </Col>
                    )) : this.state.noService && <h4 className="noData"> {String.noServices} </h4>}
                </Row>
                {!this.props.location.state && <Redirect to="/Guide" />}
            </Container>
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

export default connect(mapStateToProps, mapDispatchToProps)(Restaurants);
// export default (Restaurants);