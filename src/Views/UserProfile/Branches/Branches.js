import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, Input, InputGroup, InputGroupAddon, InputGroupText, Button, Form, FormGroup, Label } from 'reactstrap'
import axios from 'axios'
import { API_ENDPOINT } from '../../../AppConfig'
import strings from '../../../assets/Locals/locals'
import { saveUser } from "../../../Redux/Action/UserAction";
import { ReIntializeUser } from '../../../Redux/Action/UserAction'
import { bindActionCreators } from 'redux';
import close from '../../../assets/Images/close.png'
import { showSnack } from 'react-redux-snackbar';
import Autocomplete from '../../../Component/placesautocomplete/placesautocomplete'
import LocationPicker from 'react-location-picker';
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import Payment from '../../Auth/payment'

class Branches extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            allCity: [],
            allArea: [],
            modalseven: true,
            modalMap: false,
            modalMapIndex: 0,
            currentlang: '',
            allBranches: [],
            branchname: '',
            branchphone: '',
            areaId: '',
            buildingNumber: '',
            street: '',
            allareas: [],
            branches: [],
            longitude: "50.0518109",
            latitude: "30.0518109",
            latitude: null,
            longitude: null,
            position: {
                lat: 30.0540657,
                lng: 31.2055333
            },
            payment:false
        }
        this.handleLocationChange = this.handleLocationChange.bind(this);
        this.getMyLocation = this.getMyLocation.bind(this)
        this.toggleseven = this.toggleseven.bind(this)
        this.toggleMap = this.toggleMap.bind(this)
    }
    getAllArea(id, lang) {
        let uri = `${API_ENDPOINT}/area?cityId=${id}`

        axios.get(uri, {
            headers: {
                'Accept-Language': lang,
                Authorization: `Bearer ${this.props.token}`,
            }
        }).then(response => {
            this.setState({ allArea: response.data.data })
        })
    }


    toggleseven() {
        this.setState(prevState => ({
            modalseven: !prevState.modalseven
        }));
        this.props.openModalSeven()
    }

    toggleMap(index) {
        this.setState(prevState => ({
            modalMap: !prevState.modalMap,
            modalMapIndex: index
        }));
    }

    handleLocationChange({ position }) {
        // Set new location
        let index = this.state.modalMapIndex
        let obj = this.state.branches
        if (obj[index]) {
            obj[index].branchPosition.lat = position.lat
            obj[index].branchPosition.lng = position.lng
            this.setState({ position, branches: obj });
        }
    }

    getMyLocation() {
        const location = window.navigator && window.navigator.geolocation
        if (location) {
            location.getCurrentPosition((position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                })
            }, (error) => {
                this.setState({ latitude: 'err-latitude', longitude: 'err-longitude' })
            })
        }
    }

    getcity(id, lang) {
        let uri = `${API_ENDPOINT}/city?countryId=${id}`
        axios.get(uri, {
            headers: {
                'Accept-Language': lang
            }
        }).then(response => {
            this.setState({ allCity: response.data.data })
        })
    }

    UNSAFE_componentWillMount() {
        this.getMyLocation()
        this.getcity(this.props.user.countryId.id)
        let currentlang = this.props.appLanguage
        this.setState({ currentlang: currentlang })
        this.getAllBranches(this.state.currentlang)
    }

    handleBranch = (e, i, name) => {
        let obj = this.state.branches
        console.log("dddddd", obj, i, name)
        if (name === "branchCity") {
            console.log("dddddd", Number(e.target.value))
            this.getAllArea(Number(e.target.value), this.props.lang)
            obj[i][`${name}`].id = Number(e.target.value)
            obj[i][`${name}`].name = e.target.name
        }
        else if (name === "branchArea") {
            obj[i][`${name}`].id = e.target.value
            obj[i][`${name}`].name = e.target.name
        } else {
            obj[i][`${name}`] = e.target.value
        }
        this.setState({ branches: obj })

    }
    addBranch = () => {
        this.props.showLoading()
        let object = this.state.branches
        if (object.length > 0) {
            console.log("send Branch", object)
            let arrBranches = []
            for (let i = 0; i < object.length; i++) {
                let branch = {
                    id: object[i].id,
                    name: object[i].branchName,
                    phone: object[i].branchPhoneno,
                    cityId: object[i].branchCity.id,
                    areaId: object[i].branchArea.id,
                    street: object[i].branchStreet,
                    buildingNumber: object[i].branchBuildingNo,
                    longitude: object[i].branchPosition.lat,
                    latitude: object[i].branchPosition.lng,
                }
                arrBranches.push(branch)

            }
            let uri = `${API_ENDPOINT}/branch`;
            let data = {
                branches: arrBranches
            }
            axios.post(uri, data, {
                headers: {
                    Authorization: `Bearer ${this.props.token}`,
                    'Accept-Language': this.props.appLanguage,
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                console.log("add branch success", res,res.data.message)
                if(res.data.message){
                    console.log("add branch success in if", res)
                    this.setState({payment:true})
                    this.toggleseven()
                   
                }else{
                   
                    this.props.showSnack('myUniqueId', {
                        label: this.props.appLanguage === 'en' ? 'Successful Updated' : 'تم التعديل بنجاح',
                        timeout: 7000,
                        // button: { label: this.props.appLanguage === 'en' ? 'LogIn' : ' تسجيل الدخول' }
                    })
                }
                
                this.props.hideLoading()
            }).catch(error => {
                console.log("add branch error", error.response)

            })
        }
        else{
            this.toggleseven()
        }
    }
    getAllBranches(lang) {
        this.props.showLoading()
        let uri = `${API_ENDPOINT}/branch?user=${this.props.user.id}`
        axios.get(uri, {
            headers: {
                'Accept-Language': lang
            }
        }).then(response => {
            let object = response.data.data
            let array = this.state.branches
            for (let i = 0; i < object.length; i++) {
                let obj = {
                    id: object[i].id,
                    branchName: object[i].name,
                    branchPhoneno: object[i].phone,
                    branchArea: { name: object[i].areaId.name, id: object[i].areaId.id },
                    branchCity: { name: object[i].areaId.cityId.name, id: object[i].areaId.cityId.id },
                    branchStreet: object[i].street,
                    branchBuildingNo: object[i].buildingNumber,
                    branchPosition: { lat: object[i].latitude, lng: object[i].longitude }
                }
                array.push(obj)
            }
            // this.setState({branches:array})
            console.log("allBranches", response.data.data)
            this.setState({ allBranches: response.data.data, branches: array })
            this.props.hideLoading()
        })
    }

    deleteBranch = (index, id) => {
        this.props.showLoading()
        let uri = `${API_ENDPOINT}/branch/${id}`
        let x = this.state.branches.splice(index, 1)
        let newarr = []
        for (let i = 0; i < this.state.branches.length; i++) {
            if (this.state.branches[i] === x) { }
            else {
                newarr.push(this.state.branches[i])
            }
        }
        this.setState({ branches: newarr })

        axios.delete(uri, {
            headers: {
                'Accept-Language': this.props.appLanguage,
                Authorization: `Bearer ${this.props.token}`,
            }
        }).then(response => {
            this.props.hideLoading()
            // this.togglefive()
            console.log("success www")
        }).catch(error => console.log("errors are", error.response))
    }

    addNewBranch = e => {
        console.log("new Branch")
        let obj = {
            branchName: ``,
            branchPhoneno: ``,
            branchArea: { name: ``, id: `` },
            branchCity: { name: ``, id: `` },
            branchStreet: ``,
            branchBuildingNo: ``,
            branchPosition: { lat: ``, lng: `` }
        }
        let array = this.state.branches
        array.push(obj)
        this.setState({ branches: array })
    }

    render() {
        console.log("users",this.props.user)
        const defaultPosition = {
            lat: 30.0540657,
            lng: 31.2055333,
        };
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(displayLocationInfo);
        }
        function displayLocationInfo(position) {
            const lng = position.coords.longitude;
            const lat = position.coords.latitude;
        }
        const { latitude, longitude } = this.state
        if (latitude && longitude) {
            if (latitude !== defaultPosition.lat) {
                defaultPosition.lat = latitude
            }
            if (longitude !== defaultPosition.lng) {
                defaultPosition.lng = longitude
            }
        }
        if (this.state.position.lat && this.state.position.lng) {
            if (latitude !== this.state.position.lat) {
                defaultPosition.lat = this.state.position.lat
            }
            if (longitude !== this.state.position.lng) {
                defaultPosition.lng = this.state.position.lng
            }
        }
        if (this.state.currentlang !== this.props.appLanguage) {
            this.setState({ currentlang: this.props.appLanguage }, () => {
                this.getAllBranches(this.state.currentlang)
            })
        }
        if (this.state.currentlang !== this.props.appLanguage) {
            this.setState({ currentlang: this.props.appLanguage }, () => {
                this.getAllBranches(this.state.currentlang)
            })
        }
        strings.setLanguage(this.props.appLanguage)
        return (
            <div>
                {this.state.payment &&  <Payment />}
                <Modal className="profileModal profileModal-styleprofcardseven" style={{ direction: this.props.appLanguage === "ar" ? "rtl" : "ltr" }} isOpen={this.state.modalseven} toggle={this.toggleseven}>
                    <ModalHeader className={this.props.appLanguage === "ar" ? "pb-0 modalheaderar mb-4" : "pb-0 modalheaderen mb-4"} toggle={this.toggleseven}>
                        {strings.profcardseven}
                        <img src={close} alt="close" className="closeModal" onClick={this.toggleseven} />
                    </ModalHeader>
                    <ModalBody>

                        {this.state.branches.map((element, index) => {
                            return (
                                <Form>
                                    <i onClick={() => this.deleteBranch(index, element.id)} className="fas fa-times"></i>
                                    <InputGroup>
                                        <Input placeholder={strings.branchname} value={element.branchName} onChange={(e) => this.handleBranch(e, index, "branchName")} />
                                    </InputGroup>
                                    <InputGroup>
                                        <Input placeholder={strings.phone} value={element.branchPhoneno} onChange={(e) => this.handleBranch(e, index, "branchPhoneno")} />
                                        <InputGroupAddon addonType="prepend" className={this.props.appLanguage === "ar" ? "mr-2" : "ml-2"}>
                                            <InputGroupText><i onClick={() => this.toggleMap(index)} className="fas fa-map-marker-alt"></i></InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    <div className="profcardseven-address">
                                        <FormGroup style={{ width: "100%" }}>
                                            <Input value={element.branchCity.name} onChange={(e) => this.handleBranch(e, index, "branchCity")} type="select" name="select" id="exampleSelect">
                                                <option disabled selected value={''}>{strings.branchCity}</option>
                                                {this.state.allCity.map((city, index) => {
                                                    return (
                                                        <option key={index} value={city.id} name={city.name}>{city.name}</option>
                                                    )
                                                })}
                                            </Input>
                                        </FormGroup>
                                    </div>
                                    <div className="profcardseven-address">
                                        <FormGroup>
                                            <Input value={element.branchArea.name} onChange={(e) => this.handleBranch(e, index, "branchArea")} type="select" name="select" id="exampleSelect">
                                                <option disabled selected value={''}>{strings.area}</option>
                                                {this.state.allArea.map((branch, index) => {
                                                    return (
                                                        <option key={index} value={branch.id} name={branch.name}>{branch.name}</option>
                                                    )
                                                })}
                                            </Input>
                                        </FormGroup>
                                        <FormGroup>
                                            <InputGroup>
                                                <Input value={element.branchStreet} onChange={(e) => this.handleBranch(e, index, "branchStreet")} placeholder={strings.street} />
                                            </InputGroup>
                                        </FormGroup>
                                        <FormGroup>
                                            <InputGroup>
                                                <Input value={element.branchBuildingNo} onChange={(e) => this.handleBranch(e, index, "branchBuildingNo")} placeholder={strings.buildingnum} />
                                            </InputGroup>
                                        </FormGroup>
                                    </div>
                                </Form>
                            )

                        })
                        }

                        <div className="stylefileinput-uploadPDF">
                            <label className="custom-file-upload" onClick={this.addNewBranch}><i className="fa fa-plus" ></i> {strings.addbranch}</label>
                        </div>
                        <div>
                            <Button onClick={this.addBranch} className="btn-block styleBTN">{strings.saveBTN}</Button>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal className="profileModal" isOpen={this.state.modalMap} toggle={this.toggleMap}>
                    <ModalBody>

                        <div style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>

                            <div className="text-center">
                                <Label className="text-center" style={{ color: "green", fontSize: "18px" }}>{strings.locationtitle}</Label>
                                <Autocomplete handleLocation={this.handleLocation} />

                                <LocationPicker
                                    zoom={14}
                                    containerElement={<div style={{ height: '90%' }} />}
                                    mapElement={<div style={{ height: '350px' }} />}
                                    defaultPosition={defaultPosition}
                                    onChange={this.handleLocationChange}
                                />
                            </div>
                        </div>
                        <div>
                            <Button onClick={this.toggleMap} className="btn-block styleBTN">{strings.saveBTN}</Button>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        appLanguage: state.HeaderReducer.appLanguage,
        token: state.UserReducer.token,
        user: state.UserReducer.user
    }
}
const mapDispatchToProps = dispatch => bindActionCreators(
    {
        saveUser,
        showSnack,
        ReIntializeUser,
        showLoading,
        hideLoading
    }
    , dispatch
)
export default connect(mapStateToProps, mapDispatchToProps)(Branches);