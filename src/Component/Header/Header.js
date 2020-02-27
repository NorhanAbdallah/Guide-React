import React from 'react';
import {
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Collapse, Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,


} from 'reactstrap';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import '../../Reasource/Reasource.css'
import String from "../../assets/Locals/locals.js";
import Logo from "../../assets/Images/LOGO2.png";
import Subheader from "../Subheader/Subheader.js";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeLanguage } from "../../Redux/Action/HeaderAction";
import { logOut } from "../../Redux/Action/UserAction";
import EnterPage from '../../Views/Auth/EnterPage'
import { ReIntializeUser } from '../../Redux/Action/UserAction'
import { localStorageCurrentLanguage } from '../../AppConfig'
import cookie from 'react-cookies'
import { API_ENDPOINT } from '../../AppConfig.js'
import axios from 'axios'
import './Header.css';
class Example extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            modallocales: false,
            modal: false,
            isTop: true,
            defaultlang: this.props.lang,
            dropdownOpennotf: false,
            dropdownOpenlang: false,
            showflag: false,
            en: "EN",
            ar: "AR",
            modal: false,
            toggleMenuMobile: false,
            isOpen: false,
            openAuth: false,
            btn: [ { class: "fas fa-heart", id: "favbtn", url: "/Guide/Favourites" },{ class: "fas fa-user", id: "userbtn", url: '' }],
            updated: true,
            //subheader
            categories: [],
            company: [],
            electronic: [],
            events: [],
            SmallScreen: false,
            handelshow:false
        };
        this.togglelocales = this.togglelocales.bind(this);
        this.modal = this.modal.bind(this);
        this.togglenotf = this.togglenotf.bind(this);
        this.togglelang = this.togglelang.bind(this);
        this.toggleMenuMobile = this.toggleMenuMobile.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    toggleMenuMobile() {
        this.setState(prevState => ({
            toggleMenuMobile: !prevState.toggleMenuMobile,
            showflag: !this.state.showflag
        }));
    }

    togglelocales() {
        this.setState(prevState => ({
            modallocales: !prevState.modallocales
        }));
    }
    togglenotf() {
        this.setState({
            dropdownOpennotf: !this.state.dropdownOpennotf
        });
    }
    togglelang() {
        this.setState({
            dropdownOpenlang: !this.state.dropdownOpenlang
        });
    }
    togglelogout = () => {
        this.setState(prevState => ({
            modal: !prevState.modal,
        }));
    }


    modal() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    sendLogout = () => {
        this.props.logOut();
        this.props.ReIntializeUser(null, null)
        // this.setState({redirect:true})
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            if (this.state.showflag) {
            this.setState({ showflag: false })
            }
        }
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
        //   if (this.state.handelshow) {
        //     this.setState({ handelshow: false })
        //     }
        
    }
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
                    // console.log("dataaaaaaaaa in response1", company.data.data[0].electronicTradingCategory.name, company.data.data[0].eventCategory.name)
                    this.setState({

                        categories: categores.data.data,
                        company: company.data.data[0],
                        electronic: company.data.data[0].electronicTradingCategory.name,
                        events: company.data.data[0].eventCategory.name


                    });
                }, () => { console.log("dataaaaaaaaa in response2", this.state.electronic, this.state.events) })
            )
            .catch(error => { });
    }
    componentWillMount() {
        this.Fetch()
    }
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        window.addEventListener('scroll', () => {
            const isTop = window.scrollY < 50;
            if (isTop !== true) {
                this.setState(
                    {
                        isScrolled: true
                    }
                )
            } else {
                this.setState(
                    {
                        isScrolled: false
                    }
                )
            }
        })
    }


    redirect(language) {
        this.setState({ defaultlang: language })

    }
    showsubheader = () => {
        this.setState({ showflag:!this.state.showflag })
    }
    toggle = () => {
        this.setState({ isOpen: !this.state.isOpen })
    }
    openAuthentication = () => {
        this.setState({ openAuth: !this.state.openAuth })
    }

    render() {
        if (this.props.token && this.state.updated) {
            let usrstate = this.state.btn
            usrstate[1].url = this.props.user.type === "CLIENT" ? "/Guide/EditProfile" : "/Guide/Profile"
            this.setState({btn: usrstate, updated: false})
        }
        if (this.state.redirect) {
            return (
                <Redirect to='/Guide' />
            )
        }

        String.setLanguage(this.props.lang);

        let Headertitle = [{ name: String.main }, { name: String.services }, { name: String.aboutus }, { name: String.contactus }]


        if (this.props.lang === "ar") {
            // document.title = "Guide Wepsite"
            String.setLanguage('ar');
            if (this.props.lang !== this.state.defaultlang) {
                //console.log("testlangageprevious", this.state.defaultlang, "testlanguagecurrent", this.props.lang)
                this.Fetch()
                this.redirect("ar")
            }
        }
        else {
            // document.title = "Guide Wepsite"
            String.setLanguage('en');
            if (this.props.lang !== this.state.defaultlang) {
                //console.log("testlangageprevious", this.state.defaultlang, "testlanguagecurrent", this.props.lang)
                this.Fetch()
                this.redirect("en")
            }
        }

        const closelogout = <button className={this.props.lang === "ar" ? "close" : "closeEn"} onClick={this.modal}>&times;</button>;


        return (
            <div id="mainheader" style={{
                direction: this.props.lang === "ar" ? "rtl" : "ltr", backgroundColor: this.state.isScrolled ? "white" : "white",
                position: "fixed", zIndex: "500", width: "100%", top: "0px",/*height:"16%"*/

            }}
            >
                <Navbar light expand="md">
                    <NavbarBrand style={{ marginRight: this.props.lang === "ar" ? ".5rem" : "", marginLeft: this.props.lang === "en" ? "5rem" : "" }} > <img className="headerLogo" src={Logo} alt="logo" /></NavbarBrand>

                    {/* //////////////////////////////////////////////////////////////////////////////////////// */}
                    {/* smallscreen login & lang_btn*/}
                    <div className="header-smallscreen mt-3"  >
                        <h6 className="mx-2">

                            <UncontrolledDropdown>
                                <DropdownToggle nav className="pt-0">
                                    <Button id="langbtn" >
                                        <p style={{ color: 'green', margin: "0px", marginBottom: ".2rem", fontWeight: "bold", fontSize: "17px"}}>
                                            {this.props.lang === "ar" ? "AR" : "EN"}
                                            <i className="fa fa-chevron-down" style={{ color: 'green', marginLeft: ".2rem", fontSize: "11px" }}></i>
                                        </p>
                                    </Button>

                                </DropdownToggle>
                                <DropdownMenu className={this.props.lang === "ar" ? "box-arrow box-arrowar" : "box-arrow box-arrowen"} style={{
                                    right: this.props.lang === "en" ? "auto" : "auto", left: this.props.lang === "ar" ? "auto" : ".3rem",
                                    textAlign: this.props.lang === "en" ? "left" : "right", minWidth: "4rem", borderRadius: "10%"
                                }}>
                                    <DropdownItem onClick={() => { this.setState({ lang: this.props.lang ==="en" ? "ar" : "en" }) 
                                    this.props.changeLanguage(this.props.lang === "en" ? 'ar' : 'en')
                                
                                }} >
                                        <span style={{ fontSize: "17px" }} onClick={() => this.props.changeLanguage(this.props.lang === "en" ? 'ar' : 'en')} style={{ color: 'green', fontWeight: "bold", fontSize: "17px"}}>
                                            {this.props.lang === "en" ? this.state.ar : this.state.en}
                                        </span>
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>


                        </h6>
                        <h6>
                            <Modal style={{ marginTop: "8%", zIndex: "1000000" , borderRadius : "100px"}}
                   
                             isOpen={this.state.modal} toggle={this.togglelogout}>
                                            <ModalHeader 
                                            style={{ direction: this.props.lang === "ar" ? "rtl" : "ltr" , width: "100%" , }} 
                                            className ="justify-content-center"
                                            stoggle={this.modal} close={closelogout}>
                                                <h2 className ="text-success">
                                                {String.logout}
                                                </h2>
                                                </ModalHeader>

                                <ModalBody 
                                className = "text-muted d-flex font-weight-bold" 
                                style=
                                {{ direction: this.props.lang === "ar" ? "rtl" : "ltr" }}>
                                    <h3>{String.confirmationdelete}</h3>
                                    </ModalBody>
                                <ModalFooter style={{ direction: this.props.lang === "en" ? "rtl" : "ltr" }}>

                                    <Button style={{ marginLeft: this.props.lang === "en" ? "1rem" : "" }} 
                                    color="danger" onClick={this.modal}>{String.CancelBTN}</Button>

                                    <div className=" btn greenBTN ">
                                    <button  className ="btn text-white" onClick={() => {
                                        this.sendLogout()
                                        this.modal()
                                    }}>{String.confirm}</button>{' '}
                                    </div>



                                </ModalFooter>
                            </Modal>

                            <Button onClick={() => this.props.token ? this.modal() : this.setState({ openAuth: !this.state.openAuth })} id="loginbtn" style={{ marginBottom: ".2rem", fontWeight: "bold" }}>
                                <p style={{ color: 'white', margin: "0px", marginBottom: ".2rem", fontWeight: "bold", fontSize: "17px" }}>
                                    {this.props.token ? <i class="fas fa-sign-out-alt" style={{ color: 'white' }}></i> : <i class="fas fa-sign-in-alt" style={{ color: 'white' }}></i>}
                                </p>
                            </Button></h6>
                    </div>
                    {/* ///////////////////////////////////////////////////////////////////////////////////////////////////// */}
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className={this.props.lang === "ar" ? "ml-auto mr-4 pr-2" : "mr-auto ml-4 pl-2"} navbar>
                            {Headertitle.map((element, index) => {

                                return (
                                    <div id="items">

                                        {(element.name === "الخدمات" || element.name === "Services") ?
                                        
                                            <NavItem id="header_navitem"  className={this.props.lang === "ar" ? "pl-3" : "pr-3"} >

                                                 {!this.state.showflag&&
                                                <span id="onhover" onClick={() => { this.showsubheader() }} className="header-largescreen" style={{ color: "#9E9E9E", fontWeight: "bold", fontSize: "17px",cursor: "pointer" }} > {element.name} 
                                                    <i id="onhover" className="fa fa-chevron-down" style={{ color: '#9E9E9E', marginRight: this.props.lang === "ar" ? ".6rem" : "", marginLeft: this.props.lang === "en" ? ".6rem" : "", fontSize: "11px" }}></i>
                                                </span>
                            }
                                                {this.state.showflag&&
                                                <span id="onhover"  className="header-largescreen" style={{ color: "#9E9E9E", fontWeight: "bold", fontSize: "17px",cursor: "pointer" }} > {element.name} 
                                                    <i id="onhover" className="fa fa-chevron-down" style={{ color: '#9E9E9E', marginRight: this.props.lang === "ar" ? ".6rem" : "", marginLeft: this.props.lang === "en" ? ".6rem" : "", fontSize: "11px" }}></i>
                                                </span>
                            }
                                                <UncontrolledDropdown className="header-DropdownMenu">
                                                    <DropdownToggle id="onhover" nav className="pt-0" onClick={() => { this.setState({ SmallScreen: true }) }} >

                                                        <span  style={{ color: "#9E9E9E", fontWeight: "bold", fontSize: "17px", cursor: "pointer" }} > {element.name}
                                                            <i  className="fa fa-chevron-down" style={{ color: '#9E9E9E', marginRight: this.props.lang === "ar" ? ".6rem" : "", marginLeft: this.props.lang === "en" ? ".6rem" : "", fontSize: "11px" }}></i>
                                                        </span>

                                                    </DropdownToggle>
                                                    <DropdownMenu style={{
                                                        right: this.props.lang === "en" ? "auto" : "auto", left: this.props.lang === "ar" ? "auto" : ".3rem",
                                                        textAlign: this.props.lang === "en" ? "left" : "right", border: "none"
                                                    }}>
                                                        <DropdownItem >

                                                            {this.state.company && this.state.categories &&
                                                                <Subheader Company={this.state.company} Category={this.state.categories} />
                                                            }
                                                        </DropdownItem>

                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                                {/* </Link> */}
                                            </NavItem>
                                            :

                                            <NavItem className={this.props.lang === "ar" ? "pl-3" : "pr-3"}>
                                                {/* /Guide/ContactUs */}
                                                {element.name === "من نحن" || element.name === "About Us" ?
                                                    // <Link to="/">
                                                    <Link id="header_navitem" to="/Guide/AboutUs">
                                                        <span id="onhover" style={{ color: "#9E9E9E", fontWeight: "bold", fontSize: "17px" }} > {element.name}</span>
                                                    </Link>
                                                    : element.name === "تواصل معنا" || element.name === "Contact Us" ?
                                                        <Link id="header_navitem" to="/Guide/ContactUs">
                                                            <span id="onhover" style={{ color: "#9E9E9E", fontWeight: "bold", fontSize: "17px" }} > {element.name}</span>
                                                        </Link> :
                                                        <Link id="header_navitem" to="/Guide">
                                                            <span id="onhover" style={{ color: "#9E9E9E", fontWeight: "bold", fontSize: "17px" }} > {element.name}</span>
                                                        </Link>
                                                }
                                            </NavItem>
                                        }
                                    </div>
                                )
                            })}

                        </Nav>
                        <div id="btnsdiv" >
                            <div id="btnsrow" style={{direction:this.props.lang==="en"?"rtl":""}}>
                               
                                <div style={{ direction: "ltr" }} className="header-largescreen">

                                    <UncontrolledDropdown style={{top:".1rem"}}>
                                        <DropdownToggle  nav className="pt-0">
                                            <Button id="langbtn" >
                                                <p style={{ color: 'green', margin: "0px", marginBottom: ".2rem", fontWeight: "bold", fontSize: "17px"}}>
                                                    {this.props.lang === "ar" ? "AR" : "EN"}
                                                    <i className="fa fa-chevron-down" style={{ color: 'green', marginLeft: ".2rem", fontSize: "11px" }}></i>
                                                </p>
                                            </Button>

                                        </DropdownToggle>
                                        <DropdownMenu className={this.props.lang === "ar" ? "box-arrow box-arrowar" : "box-arrow box-arrowen"} style={{
                                            right: this.props.lang === "en" ? "auto" : "auto", left: this.props.lang === "ar" ? "auto" : ".3rem",
                                            textAlign: this.props.lang === "en" ? "left" : "right", minWidth: "4rem", borderRadius: "10%",
                                        }}>
                                            <DropdownItem onClick={() => { this.setState({ lang: this.props.lang === "en" ? "ar" : "en" }) 
                                         this.props.changeLanguage(this.props.lang === "en" ? 'ar' : 'en') }} >
                                                <span style={{ fontSize: "17px" }}  style={{ color: 'green', fontWeight: "bold", fontSize: "17px" }}>
                                                    {this.props.lang === "en" ? this.state.ar : this.state.en}
                                                </span>
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
                                {this.props.token && this.state.btn.map((element, index) => {
                                    return (
                                        <div id="headericons" className="px-1">
                                            <Link to={element.url}>
                                                <Button id={element.id} style={{ marginBottom: ".2rem" }}>
                                                    <i className={element.class} style={{ color: 'white', position: "relative", top: "3px" }}></i>
                                                </Button>
                                            </Link >
                                        </div>
                                    )
                                })}
                                <Button className="mx-2 LoginSpan_ExternalFile" onClick={() => this.props.token ? this.modal() : this.setState({ openAuth: !this.state.openAuth })} id="loginbtn" style={{ marginBottom: ".2rem", fontWeight: "bold",letterSpacing: this.props.lang==="en"?null:null }}>
                                        <p style={{ color: 'white', margin: "0px", marginBottom: ".2rem", fontWeight: "bold", display: "flex", alignItems: "center" }}>
                                        <span className="mt-1 " style={{ fontSize: "17px", paddingLeft: this.props.lang === "ar" ? "8px" : "", paddingRight: this.props.lang === "en" ? "8px" : "" }} > {this.props.token ? String.logout : String.login}</span>
                                            <i className="fas fa-user px-2" style={{ color: 'white' }}></i>
                                            {/* تسجيل الدخول */}
                                           
                                        </p>
                                    </Button>


                            </div>
                        </div>
                    </Collapse>

                </Navbar>
             
                {this.state.showflag && !this.state.SmallScreen &&
                
                    <div ref={this.setWrapperRef}>
                        <Subheader Company={this.state.company} Category={this.state.categories} />
                    </div>
                }
                {this.state.openAuth && <EnterPage openEnterPage={this.openAuthentication} />}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        lang: state.HeaderReducer.appLanguage,
        isLogged: state.UserReducer.logged,
        currentUser: state.UserReducer.user,
        token: state.UserReducer.token,
        user: state.UserReducer.user
    }
}
const mapDispatchToProps = dispatch => bindActionCreators(
    {
        changeLanguage,
        logOut,
        ReIntializeUser,
    },
    dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(Example);
