import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import Home from './Views/Home/Home'
import Header from './Component/Header/Header.js'
import Subheader from "./Component/Subheader/Subheader.js"
import { connect } from 'react-redux';
import './App.css'
import Footer from "./Component/Footer/footer.js"
import AboutUs from "./Views/AboutUs/aboutUs.js"
import Restaurants from './Views/Services/Restaurants/Restaurants'
import EventDetails from './Views/Services/ServiceDetails/EventDetails'
import ServiceDetails from './Views/Services/ServiceDetails/ServiceDetails'
import ElectronicDetails from './Views/Services/ServiceDetails/ElectronicDetails'
import Departments from './Views/Services/Departments/Departments'
import Favourites from "./Views/Favourites/Favourites"
import Favourit from "./Views/Favourites/Favourite"
import ContactUs from "./Views/ContactUs/ContactUs.js"
import Profile from './Views/Profile/Profile'
import EditProfile from './Views/Profile/EditProfile'
import Conversations from './Views/Conversations/conversations'
import { localStorageCurrentLanguage } from './AppConfig'
import cookie from 'react-cookies'
import { ReIntializeUser } from './Redux/Action/UserAction'
import { bindActionCreators } from 'redux';
import animi from "./Views/Animation/animation.js"
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Cube } from 'styled-loaders-react'

// import { init } from './Redux/Action/SocketAction.js'
class App extends React.Component {
  
  UNSAFE_componentWillMount() {
    

    let user = sessionStorage.guideuser;
    // this.props.init(user.id)
    if (!localStorage.getItem(localStorageCurrentLanguage)) {
      localStorage.setItem(localStorageCurrentLanguage, 'ar');
    }
    if (localStorage.getItem("remebermestate")) {
      if (localStorage.getItem("remebermestate") === 'false') {
        let token = sessionStorage.guideusertoken;
        let user = sessionStorage.guideuser;
        console.log("USERAPP", user)
        if (token) {
          this.props.ReIntializeUser(token, JSON.parse(user))
        }
      } else {
        let token = cookie.load('guideusertoken');
        let user = cookie.load('guideuser');
        if (token) {
          this.props.ReIntializeUser(token, user)
        }
      }
    } else {
      let token = cookie.load('guideusertoken');
      let user = cookie.load('guideuser');
      if (token) {
        this.props.ReIntializeUser(token, user)
      }
    }
  }

  componentDidMount(){
    AOS.init();

  }

  render() {
    
    return (
      <BrowserRouter>
        <Header />
        <div className={this.props.appLanguage === "ar" ? "AR" : "EN"} style={{ direction: this.props.appLanguage === 'en' ? 'ltr' : 'rtl' }}>
          <Route exact path="/Guide" component={Home} />
          <Route exact path="/Guide/Header" component={Header} />
          <Route exact path="/Guide/Subheader" component={Subheader} />
          <Route exact path="/Guide/departments" component={Departments} />
          <Route exact path="/Guide/services" component={Restaurants} />
          <Route exact path="/Guide/EventDetails" component={EventDetails} />
          <Route exact path="/Guide/ServiceDetails" component={ServiceDetails} />
          <Route exact path="/Guide/ElectronicDetails" component={ElectronicDetails} />
          <Route exact path="/Guide/Footer" component={Footer} />
          <Route exact path="/Guide/AboutUs" component={AboutUs} />
          <Route exact path="/Guide/Favourites" component={Favourites} />
          <Route exact path="/Guide/Favourites/:id" component={Favourit} />
          <Route exact path="/Guide/ContactUs" component={ContactUs} />
          <Route exact path="/Guide/Favourites/:id" component={Favourit} />
          <Route exact path="/Guide/Profile" component={Profile} />
          <Route exact path="/Guide/EditProfile" component={EditProfile} />
          <Route exact path="/Guide/conversations" component={Conversations} />
        </div>
        <Footer />
      </BrowserRouter>
    )
  }
}

const mapStateToProps = state => {
  return {
    appLanguage: state.HeaderReducer.appLanguage,
    token: state.UserReducer.token
  }
}
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    ReIntializeUser,
    // init
  }
  , dispatch
)
export default connect(mapStateToProps, mapDispatchToProps)(App);