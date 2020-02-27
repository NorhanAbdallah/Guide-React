import React from 'react'
import './Profile.css'
import { connect } from 'react-redux';
import { Row, Col, Container, Modal, ModalHeader, ModalBody, Input, InputGroup, InputGroupAddon, InputGroupText, Button, Form, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, FormGroup, Label } from 'reactstrap'
import date from '../../assets/Images/Profile/date.jpeg'
import img1 from '../../assets/Images/Profile/img1.png'
import img2 from '../../assets/Images/Profile/img2.png'
import img3 from '../../assets/Images/Profile/img3.png'
import img4 from '../../assets/Images/Profile/img4.png'
import img5 from '../../assets/Images/Profile/img5.png'
import img6 from '../../assets/Images/Profile/img6.png'
import img7 from '../../assets/Images/Profile/img7.png'
import img8 from '../../assets/Images/Profile/img8.png'
import strings from '../../assets/Locals/locals'
import axios from 'axios'
import { API_ENDPOINT } from '../../AppConfig'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import { saveUser } from "../../Redux/Action/UserAction";
import { ReIntializeUser } from '../../Redux/Action/UserAction'
import { bindActionCreators } from 'redux';
import { showSnack } from 'react-redux-snackbar';
import close from '../../assets/Images/close.png'
import Moment from 'react-moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Payment from '../Auth/payment'
import Branches from '../UserProfile/Branches/Branches'
import ServicesList from '../UserProfile/ServicesList/ServicesList'
import Summary from '../UserProfile/Summary/Summary'
import Slider from '../UserProfile/Slider/Slider'
import SocialLinks from '../UserProfile/SocialLinks/SocialLinks'
import RatesandComments from '../UserProfile/RatesandComments/RatesandComments'
import Statistics from '../UserProfile/Statistics/Statistics'
import WorkingHours from '../UserProfile/WorkingHours/WorkingHours'
import UnifiedNumber from '../UserProfile/UnifiedNumber/UnifiedNumber'


class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            allCity: [],
            allArea: [],
            startDate: '',
            endDate: '',
            modalto: false,
            modalfrom: false,
            modalone: false,
            modaltwo: false,
            modalthree: false,
            modalfour: false,
            modalfive: false,
            modalsix: false,
            modalseven: false,
            modaleight: false,
            modalMap: false,
            modalMapIndex: 0,
            cardSixData: null,
            cardFiveData: [],
            modalunifiednumber: false,
            phoneVal: "",
            countryKey: '20',
            coundtryName: '',
            flagcountry: '',
            toggleKey: false,
            BTNClicked: false,
            currentlang: '',
            specialarabic: '',
            specialenglish: '',
            faceLink: '',
            twitterLink: '',
            googleplusLink: '',
            instagramLink: '',
            whatsLink: '',
            arrayslider: this.props.user.slider,
            serviceImage: null,
            productImage: null,
            offerImage: null,
            foodImage: null,
            imagePreviewservice: null,
            imagePreviewfood: null,
            imagePreviewoffer: null,
            imagePreviewproduct: null,
            workHoursarray: this.props.user.workHours,
            workTime: [{ title: `` }],
            allBranches: [],
            branchname: '',
            branchphone: '',
            areaId: '',
            buildingNumber: '',
            street: '',
            longitude: "50.0518109",
            latitude: "30.0518109",
            allareas: [],
            branches: [],
            socialObject: {
                FACEBOOK: null,
                INSTAGRAM: null,
                TWITTER: null,
                WHATSAPP: null,
                GOOGLE: null
            },

            check_service: false,
            check_product: false,
            check_offer: false,
            check_idea: false,
            check_food: false,
            latitude: null,
            longitude: null,
            position: {
                lat: 30.0540657,
                lng: 31.2055333
            }
        }
        this.handleLocationChange = this.handleLocationChange.bind(this);
        this.getMyLocation = this.getMyLocation.bind(this)
        this.togglefrom = this.togglefrom.bind(this)
        this.toggleto = this.toggleto.bind(this)
        this.toggleone = this.toggleone.bind(this)
        this.toggletwo = this.toggletwo.bind(this)
        this.togglethree = this.togglethree.bind(this)
        this.togglefour = this.togglefour.bind(this)
        this.togglefive = this.togglefive.bind(this)
        this.togglesix = this.togglesix.bind(this)
        this.toggleseven = this.toggleseven.bind(this)
        this.toggleeight = this.toggleeight.bind(this)
        this.toggleMap = this.toggleMap.bind(this)
        this.toggleunifiednumber = this.toggleunifiednumber.bind(this)
        this.toggleCountryKeys = this.toggleCountryKeys.bind(this)
    }

    handleChangestartdate = date => { this.setState({ startDate: date }) };

    handleChangeenddate = date => { this.setState({ endDate: date }); };

    togglefrom() {
        this.setState(prevState => ({
            modalfrom: !prevState.modalfrom
        }));
    }

    toggleto() {
        this.setState(prevState => ({
            modalto: !prevState.modalto
        }));
    }

    toggleone() {
        this.setState(prevState => ({
            modalone: !prevState.modalone
        }));
    }

    toggletwo() {
        this.setState(prevState => ({
            modaltwo: !prevState.modaltwo
        }));
    }

    togglethree() {
        this.setState(prevState => ({
            modalthree: !prevState.modalthree
        }));
    }

    togglefour() {
        this.setState({ modalfour: !this.state.modalfour });
    }

    togglefive() {
        this.setState(prevState => ({
            modalfive: !prevState.modalfive
        }));
    }

    togglesix() {
        this.setState(prevState => ({
            modalsix: !prevState.modalsix
        }));
    }

    toggleseven() {
        this.setState(prevState => ({
            modalseven: !prevState.modalseven
        }));
    }

    toggleeight() {
        this.setState(prevState => ({
            modaleight: !prevState.modaleight
        }));
    }

    toggleMap(index) {
        this.setState(prevState => ({
            modalMap: !prevState.modalMap,
            modalMapIndex: index
        }));
    }

    toggleunifiednumber() {
        this.setState(prevState => ({
            modalunifiednumber: !prevState.modalunifiednumber
        }));
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

    UNSAFE_componentWillMount() {

       

        this.getMyLocation()

        // Bashandy add to start at every page from top
        window.scrollTo({
            top: 0,
            left: 0,
            // behavior: 'smooth'
        });
        // handleChangefacelink
        console.log("all users=>", this.props.user)
        // Social Links =======>Bashandy
        let social = this.props.user.socialLinks
        let object = this.state.socialObject
        for (let i = 0; i < social.length; i++) {
            let key = social[i].key
            let value = social[i].value
            object[`${key}`] = value

        }
        this.getcity(this.props.user.countryId.id)
        console.log("social links", object)
        this.setState({ socialObject: object })

        let currentlang = this.props.appLanguage
        this.setState({ currentlang: currentlang, specialarabic: this.props.user.aboutUs.ar, specialenglish: this.props.user.aboutUs.en })
        this.getCardFiveData(this.props.appLanguage)
        this.getAllBranches(this.state.currentlang)
        this.getCardSixData(this.props.appLanguage)
    }

    getCardFiveData(lang) {
        let uri = `${API_ENDPOINT}/comment?businessId=${this.props.user.id}`
        axios.get(uri, {
            headers: {
                'Accept-Language': lang
            }
        }).then(response => {
            this.setState({ cardFiveData: response.data.data })
        })
    }

    deleteComment = (id, index) => {
        let uri = `${API_ENDPOINT}/comment/${id}`

        let x = this.state.cardFiveData.splice(index, 1)
        let newarr = []
        for (let i = 0; i < this.state.cardFiveData.length; i++) {
            if (this.state.cardFiveData[i] === x) { }
            else {
                newarr.push(this.state.cardFiveData[i])
            }
        }
        this.setState({ cardFiveData: newarr })

        axios.delete(uri, {
            headers: {
                'Accept-Language': this.props.appLanguage,
                Authorization: `Bearer ${this.props.token}`,
            }
        }).then(response => {
            this.togglefive()
        })
    }

    getCardSixData(lang) {
        let uri = `${API_ENDPOINT}/counter/${this.props.user.id}`
        axios.get(uri, {
            headers: {
                'Accept-Language': lang
            }
        }).then(response => {
            this.setState({ cardSixData: response.data })
        })
    }



    handleChangeSpecialEnglish = (e) => {
        console.log("about us ar which", e.which)
        if (!((e.which >= 48 && e.which <= 57) || (e.which >= 97 && e.which <= 122) || (e.which >= 65 && e.which <= 90) || (e.which === 32) || (e.which === 13))) {
            e.preventDefault();
            this.setState({
                specialenglish: e.target.value
            });
        }
    };

    handleChangeSpecialArabic(event) {
        console.log("about us ar which", event.which)
        if (!((event.which >= 48 && event.which <= 57) || (event.which >= 1571 && event.which <= 1610) || (event.which === 32) || (event.which === 13))) {
            event.preventDefault();
            this.setState({
                specialarabic: event.target.value
            });
        }

    };

    toggleCountryKeys() {
        this.setState(prevState => ({
            toggleKey: !prevState.toggleKey
        }));
    }

    editAboutUs = () => {
        let uri = `${API_ENDPOINT}/user/updateInfo`;
        let data = new FormData()
        data.append("aboutUs", JSON.stringify({ ar: this.state.specialarabic, en: this.state.specialenglish }))
        data.append("type", this.props.user.type)
        axios.put(uri, data, {
            headers: {
                Authorization: `Bearer ${this.props.token}`,
                'Accept-Language': this.props.appLanguage
            }
        }).then(res => {
            this.props.ReIntializeUser(this.props.token, res.data)
            this.props.saveUser(this.props.token, res.data, localStorage.getItem('remebermestate') === 'false' ? false : true)
            this.togglefour()
        })
    }

    updateWorkTime = () => {
        let uri = `${API_ENDPOINT}/user/updateInfo`;
        let data = new FormData()
        if (this.state.workTime) {
            for (let i = 0; i < this.state.workTime.length; i++) {
                this.state.workHoursarray.push(this.state.workTime[i].title)
            }

        }
        data.append("workHours", JSON.stringify(this.state.workHoursarray))
        data.append("type", this.props.user.type)
        axios.put(uri, data, {
            headers: {
                Authorization: `Bearer ${this.props.token}`,
                'Accept-Language': this.props.appLanguage
            }
        }).then(res => {
            this.props.ReIntializeUser(this.props.token, res.data)
            this.props.saveUser(this.props.token, res.data, localStorage.getItem('remebermestate') === 'false' ? false : true)
            this.toggleeight()
            this.setState({ workTime: [{ title: `` }] })
        })
    }

    handleChangeworkTime = (e, index) => {
        let variable = this.state.workTime
        variable[index] = { title: e.target.value }
        this.setState({ workTime: variable });
    }

    editSociallinks = () => {
        let uri = `${API_ENDPOINT}/user/updateInfo`;
        let data = new FormData()
        data.append("socialLinks", JSON.stringify([
            { key: "FACEBOOK", value: this.state.socialObject.FACEBOOK },
            { key: "INSTAGRAM", value: this.state.socialObject.INSTAGRAM },
            { key: "TWITTER", value: this.state.socialObject.TWITTER },
            { key: "WHATSAPP", value: this.state.socialObject.WHATSAPP },
            { key: "GOOGLE", value: this.state.socialObject.GOOGLE },
        ]))
        data.append("type", this.props.user.type)
        axios.put(uri, data, {
            headers: {
                Authorization: `Bearer ${this.props.token}`,
                'Accept-Language': this.props.appLanguage
            }
        }).then(res => {
            this.props.ReIntializeUser(this.props.token, res.data)
            this.props.saveUser(this.props.token, res.data, localStorage.getItem('remebermestate') === 'false' ? false : true)
            this.toggletwo()
        })
    }

    deleteImage = (index) => {
        let x = this.state.arrayslider.splice(index, 1)
        let newarr = []
        for (let i = 0; i < this.state.arrayslider.length; i++) {
            if (this.state.arrayslider[i] === x) { }
            else {
                newarr.push(this.state.arrayslider[i])
            }
        }
        this.setState({ arrayslider: newarr })
    }

    addImage = (event) => {
        if (event.target.files.length > 0) {
            let file = event.target.files[0]
            let array = this.state.arrayslider
            array.push(file)
            this.setState({ arrayslider: array })
        }
    }

    addserviceImage = (e) => {
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({
                file: file,
                serviceImage: file.name,
                imagePreviewservice: reader.result
            });
        }
        if (file) {
            reader.readAsDataURL(file)
        }
    }

    addproductImage = (e) => {
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({
                file: file,
                productImage: file.name,
                imagePreviewproduct: reader.result
            });
        }
        if (file) {
            reader.readAsDataURL(file)
        }
    }

    addofferImage = (e) => {
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({
                file: file,
                offerImage: file.name,
                imagePreviewoffer: reader.result
            });
        }
        if (file) {
            reader.readAsDataURL(file)
        }
    }

    addfoodImage = (e) => {
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({
                file: file,
                foodImage: file.name,
                imagePreviewfood: reader.result
            });
        }
        if (file) {
            reader.readAsDataURL(file)
        }
    }

    cardOneRequest = () => {
        let uri = `${API_ENDPOINT}/user/updateInfo`;
        let data = new FormData()

        let oldImages = []
        console.log("all slider", this.state.arrayslider)
        if (this.state.arrayslider.length > 0) {
            for (let i = 0; i < this.state.arrayslider.length; i++) {
                if (typeof this.state.arrayslider[i] !== 'object') {
                    // Added By Bashandy
                    oldImages.push(this.state.arrayslider[i])
                } else {
                    data.append("slider", this.state.arrayslider[i])
                }
            }
            // Added By Bashandy
            data.append('slider', JSON.stringify(oldImages))
        }
        data.append("type", this.props.user.type)
        axios.put(uri, data, {
            headers: {
                Authorization: `Bearer ${this.props.token}`,
                'Accept-Language': this.props.appLanguage
            }
        }).then(res => {
            this.props.ReIntializeUser(this.props.token, res.data)
            this.props.saveUser(this.props.token, res.data, localStorage.getItem('remebermestate') === 'false' ? false : true)
            this.toggleone()
        })
    }
    addBranch = () => {
        let object = this.state.branches
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
            console.log("add branch", res)
            this.toggleseven()
        }).catch(error => {
            console.log("error", error)
            console.log("error", error.response)

        })
    }

    getAllBranches(lang) {
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
        })
    }

    handleChangefacelink = e => {
        let obj = this.state.socialObject
        obj['FACEBOOK'] = e.target.value
        this.setState({ socialObject: obj });
    }
    handleChangetwitterlink = e => {
        let obj = this.state.socialObject
        obj['TWITTER'] = e.target.value
        this.setState({ socialObject: obj });
    }
    handleChangegooglelink = e => {
        let obj = this.state.socialObject
        obj['GOOGLE'] = e.target.value
        this.setState({ socialObject: obj });
    }
    handleChangeinstagramlink = e => {
        let obj = this.state.socialObject
        obj['INSTAGRAM'] = e.target.value
        this.setState({ socialObject: obj });
    }
    handleChangewhatslink = e => {
        let obj = this.state.socialObject
        obj['WHATSAPP'] = e.target.value
        this.setState({ socialObject: obj });
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
    handleMulti = e => {
        let working = this.state.workTime
        working.push({ title: `` })
        this.setState({ workTime: working })
    }
    handleLocationChange({ position }) {
        // Set new location
        let index = this.state.modalMapIndex
        console.log("Handle position", index, position.lat, position.lng)
        let obj = this.state.branches
        if (obj[index]) {
            obj[index].branchPosition.lat = position.lat
            obj[index].branchPosition.lng = position.lng
            console.log("Handle position", index, obj, position.lat, position.lng)
            this.setState({ position, branches: obj });
            console.log("Handle position", position.lat, position.lng)
        }
    }
    handleLocation = (loc) => {
        let newPosition = this.state.position
        newPosition.lat = loc.lat
        newPosition.lng = loc.lng
        this.setState({ newPosition });
        console.log("handlelat", loc, "position", newPosition)

    }

    add_idea_details(name) {
        return (

            <div className="profcardthree-listservices mt-3">
                <h5>{name} </h5>
                <Container>
                    <Row className="mb-3">

                        <Col lg="12" md="12" sm="12" xs="12" className="px-2">
                            <textarea placeholder={strings.ideadescription}></textarea>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }

    deleteBranch = (index, id) => {
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
            // this.togglefive()
            console.log("success www")
        }).catch(error => console.log("errors are", error.response))
    }


    render() {
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

        let lang = this.props.appLanguage
        if (lang === 'ar') {
            require('moment/locale/ar')
        } else {
            require('moment/locale/en-au')
        }
        if (!this.props.token) {
            return (
                <Redirect to="/Guide" />
            )
        }
        if (this.state.currentlang !== this.props.appLanguage) {
            this.setState({ currentlang: this.props.appLanguage }, () => {
                this.getCardFiveData(this.state.currentlang)
                this.getAllBranches(this.state.currentlang)
            })
        }
        strings.setLanguage(this.props.appLanguage)
        console.log("socialllllllll=>", this.props.user)
        return (
            <div className="profileView">
                <div className="profileView-header d-flex">
                    <div>
                        <div className="profileView-header-title">
                            {/* <h2>اسم النشاط باللغه العربيه</h2>
                            <h4>اسم النشاط باللغه الانجليزيه</h4> */}
                            <h2>{this.props.user && this.props.user.activityName.ar}</h2>
                            <h4>{this.props.user && this.props.user.activityName.en}</h4>
                        </div>
                        <div className="profileView-header-data">
                            <Button className="editprofile mx-2"><Link to="/Guide/conversations" style={{ textDecoration: 'none' }}>{strings.conversations}&nbsp;&nbsp;&nbsp;<i class="far fa-comment-dots"></i></Link></Button>
                            <Button onClick={this.toggleunifiednumber} className="unifiednumber">{strings.unifiednumber} <i className="fa fa-pen"></i></Button>
                            <Button className="editprofile mx-2"><Link to="/Guide/EditProfile" style={{ textDecoration: 'none' }}>{strings.editprofile}&nbsp;&nbsp;&nbsp;<i className="fa fa-user"></i></Link></Button>
                            <Button className="views"><i className="fa fa-eye"></i> ( {this.state.cardSixData && this.state.cardSixData.veiws} )</Button>
                        </div>
                    </div>
                </div>
                <Container fluid>
                    <Row>

                        <Col style={{ display: this.props.user.type === "EVENT" ? "block" : "none" }} lg="6" md="6" sm="12" xs="12">
                            <div className="profile-cardBody" style={{ backgroundImage: "linear-gradient(270deg, #fd9046, #fb8332)" }} onClick={this.togglefrom}>
                                <div className="profile-cardBody-img">
                                    <i style={{ color: "#fff" }} class="fas fa-calendar-alt fa-5x"></i>
                                    {/* <img src={date} alt="imgprof" /> */}
                                </div>
                                <div className="profile-cardBody-title">
                                    <h4 style={{ color: "#fff" }}>{strings.startevent}</h4>
                                </div>
                            </div>
                        </Col>

                        <Col style={{ display: this.props.user.type === "EVENT" ? "block" : "none" }} lg="6" md="6" sm="12" xs="12">
                            <div className="profile-cardBody" style={{ backgroundImage: "linear-gradient(270deg, #3f870b, #4e9e16)" }} onClick={this.toggleto}>
                                <div className="profile-cardBody-img">
                                    <i style={{ color: "#fff" }} class="fas fa-calendar-alt fa-5x"></i>
                                    {/* <img src={date} alt="imgprof" /> */}
                                </div>
                                <div className="profile-cardBody-title">
                                    <h4 style={{ color: "#fff" }}>{strings.endevent}</h4>
                                </div>
                            </div>
                        </Col>

                        <Col xl="3" lg="4" md="6" sm="12" xs="12">
                            <div className="profile-cardBody" onClick={this.togglefour}>
                                <div className="profile-cardBody-img">
                                    <img src={img4} alt="imgprof" />
                                </div>
                                <div className="profile-cardBody-title">
                                    <h4>{strings.profcardfour}</h4>
                                </div>
                            </div>
                        </Col>


                        {/* //////////////////////////////////////////////////// */}
                        <Col xl="3" lg="4" md="6" sm="12" xs="12">
                            <div className="profile-cardBody" onClick={this.togglethree}>
                                <div className="profile-cardBody-img">
                                    <img src={img3} alt="imgprof" />
                                </div>
                                <div className="profile-cardBody-title">
                                    <h4>{strings.profcardthree}</h4>
                                </div>
                            </div>
                        </Col>
                        {/* ///////////////////////////////////////////////////// */}


                        <Col xl="3" lg="4" md="6" sm="12" xs="12">
                            <div className="profile-cardBody" onClick={this.toggletwo}>
                                <div className="profile-cardBody-img">
                                    <img src={img2} alt="imgprof" />
                                </div>
                                <div className="profile-cardBody-title">
                                    <h4>{strings.profcardtwo}</h4>
                                </div>
                            </div>
                        </Col>
                        <Col xl="3" lg="4" md="6" sm="12" xs="12">
                            <div className="profile-cardBody" onClick={this.toggleone}>
                                <div className="profile-cardBody-img">
                                    <img src={img1} alt="imgprof" />
                                </div>
                                <div className="profile-cardBody-title">
                                    <h4>{strings.profcardone}</h4>
                                </div>
                            </div>
                        </Col>


                        <Col style={{ display: this.props.user.type === "EVENT" ? "none" : "block" }} xl="3" lg="4" md="6" sm="12" xs="12">
                            <div className="profile-cardBody" onClick={this.toggleeight}>
                                <div className="profile-cardBody-img">
                                    <img src={img8} alt="imgprof" />
                                </div>
                                <div className="profile-cardBody-title">
                                    <h4>{strings.profcardeight}</h4>
                                </div>
                            </div>
                        </Col>
                        <Col style={{ display: this.props.user.type === "GENERAL_TRADING" ? "block" : "none" }} xl="3" lg="4" md="6" sm="12" xs="12">
                            <div className="profile-cardBody" onClick={this.toggleseven}>
                                <div className="profile-cardBody-img">
                                    <img src={img7} alt="imgprof" />
                                </div>
                                <div className="profile-cardBody-title">
                                    <h4>{strings.profcardseven}</h4>
                                </div>
                            </div>
                        </Col>
                        <Col style={{ display: this.props.user.type === "EVENT" ? "none" : "block" }} xl="3" lg="4" md="6" sm="12" xs="12">
                            <div className="profile-cardBody" style={{ backgroundImage: "linear-gradient(270deg, #5080b1, #004e8c)" }} onClick={this.togglesix}>
                                <div className="profile-cardBody-img">
                                    <img src={img6} alt="imgprof" />
                                </div>
                                <div className="profile-cardBody-title">
                                    <h4 style={{ color: "#fff" }}>{strings.profcardsix}</h4>
                                </div>
                            </div>
                        </Col>
                        <Col style={{ display: this.props.user.type === "EVENT" ? "none" : "block" }} xl={this.props.user.type === "ELECTRONIC_TRADING" ? "6" : "3"} lg={this.props.user.type === "ELECTRONIC_TRADING" ? "12" : "4"} md={this.props.user.type === "ELECTRONIC_TRADING" ? "12" : "6"} sm="12" xs="12">
                            <div className="profile-cardBody" style={{ backgroundImage: "linear-gradient(270deg, #fd9046, #fb8332)" }} onClick={this.togglefive}>
                                <div className="profile-cardBody-img">
                                    <img src={img5} alt="imgprof" />
                                </div>
                                <div className="profile-cardBody-title">
                                    <h4 style={{ color: "#fff" }}>{strings.profcardfive}</h4>
                                </div>
                            </div>
                        </Col>


                    </Row>
                </Container>
                {this.state.modalseven && <Branches openModalSeven={this.toggleseven} />}
                {this.state.modalthree && <ServicesList openModalService={this.togglethree} />}
                {this.state.modalfour && <Summary openModalFour={this.togglefour} />}
                {this.state.modalone && <Slider openModalOne={this.toggleone} />}
                {this.state.modalfive && <RatesandComments openModalFive={this.togglefive} />}
                {this.state.modaltwo && <SocialLinks openModalTwo={this.toggletwo} />}
                {this.state.modalsix && <Statistics openModalSix={this.togglesix} />}
                {this.state.modaleight && <WorkingHours openModalEight={this.toggleeight} />}
                {this.state.modalunifiednumber && <UnifiedNumber openModalunifiednum={this.toggleunifiednumber} />}
                <Modal className="profileModal" style={{ marginTop: "120px" }} isOpen={this.state.modalfrom} toggle={this.togglefrom}>
                    <ModalBody>
                        <div className="custom-date">
                            {
                                this.state.startDate ? <Moment format="YYYY-MM-DD">{this.state.startDate}</Moment> :
                                    <Moment format="YYYY-MM-DD">{this.props.user.fromDate}</Moment>
                            }
                        </div>
                        <div className="selectDateAuth">
                            <DatePicker minDate={new Date()} selected={this.state.startDate} onChange={(date) => this.handleChangestartdate(date)} />
                            {(this.state.BTNClicked && !this.state.startDate) &&
                                <span className={this.props.appLanguage === "ar" ? "erroMSGAuthar" : "erroMSGAuthen"}> {strings.startdate}</span>
                            }
                        </div>

                        <div>
                            <Button onClick={this.togglefrom} className="btn-block styleBTN">{strings.saveBTN}</Button>
                        </div>
                    </ModalBody>
                </Modal>

                {/* Modal to date */}
                <Modal className="profileModal" style={{ marginTop: "120px" }} isOpen={this.state.modalto} toggle={this.toggleto}>
                    <ModalBody>
                        <div className="custom-date" style={{ marginBottom: "25px" }}>
                            {
                                this.state.endDate ? <Moment format="YYYY-MM-DD">{this.state.endDate}</Moment> :
                                    <Moment format="YYYY-MM-DD">{this.props.user.toDate}</Moment>
                            }
                        </div>
                        <div className="selectDateAuth">
                            <DatePicker minDate={new Date(this.props.user.fromDate)} selected={this.state.endDate} onChange={(date) => this.handleChangeenddate(date)} />
                            {(this.state.BTNClicked && !this.state.endDate) &&
                                <span className={this.props.appLanguage === "ar" ? "erroMSGAuthar" : "erroMSGAuthen"}> {strings.enddate}</span>
                            }
                        </div>

                        <div>
                            <Button onClick={this.toggleto} className="btn-block styleBTN">{strings.saveBTN}</Button>
                        </div>
                    </ModalBody>
                </Modal>
                {(this.state.startDate || this.state.endDate) && <Payment startDate={this.state.startDate} endDate={this.state.endDate} />}
            </div >
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
        ReIntializeUser
    }
    , dispatch
)
export default connect(mapStateToProps, mapDispatchToProps)(Profile);