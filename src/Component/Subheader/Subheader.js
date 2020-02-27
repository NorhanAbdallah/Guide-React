import React, { Component } from 'react';
import { Row, Col, ModalHeader, Button, Modal, ModalFooter, ModalBody, Container } from 'reactstrap';
import { Link } from 'react-router-dom'
// import { sendLogout ,langauge} from '../../../redux/Action/LoginAction';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import '../../Reasource/Reasource.css'
import String from "../../assets/Locals/locals.js";
import { changeLanguage } from "../../Redux/Action/HeaderAction";
import { logOut } from "../../Redux/Action/UserAction";
import Logo from "../../assets/Images/logo.png"
import { API_ENDPOINT } from '../../AppConfig.js'
import axios from 'axios'
class Subheader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isTop: true,
        };

    }

    
    showsubheader = () => {
        this.setState({ showflag: !this.state.showflag })
    }
    componentWillMount() {
        this.setState({ showflag:true })
    }
    // componentDidMount() {
    //     document.addEventListener('scroll', () => {
    //         const isTop = window.scrollY < 1;
    //         if (isTop !== this.state.isTop) {
    //             this.setState({ isTop })
    //         }
    //     });
    // }


    render() {
        const { Company, Category } = this.props;
        
        console.log("eventdata", Company,Category)

        String.setLanguage(this.props.lang);
        return (
            <div>
            {this.state.showflag&&
            <div className="header" id="new-header" style={{
                minHeight: "4rem",
                backgroundColor: "#347704",
                color: "white",
                width: "100%",
            }}>
                <Container fluid style={{paddingTop:"0.25rem"}}>
                    <Row className=" subheaderContent" style={{ direction: this.props.lang === "ar" ? "rtl" : "ltr" }} >

                        <Col className="  py-2" lg="12" >

                            <ul >
                                {Category.map((element, index) => {

                                    return (


                                        <li className=" py-2" >
                                            <Link to={{
                                                pathname: "/Guide/services",
                                                state: { categoryId: element.id, categoryName: element.name, serviceType: 'GENERAL_TRADING', fromHeader: true }
                                            }} id="subheader_link">
                                                <span onClick={this.showsubheader} style={{ color: "white", fontWeight: "bold", fontSize: "17px" }} > {element.name}</span>
                                            </Link>
                                        </li>


                                    )
                                })}

                                <li className="py-2" >
                                {Company.electronicTradingCategory&&
                                    <Link to={{
                                        pathname: "/Guide/services",
                                        state: {
                                            categoryId: 0, categoryName: Company.electronicTradingCategory.name.ar,
                                            categoryNameEN:Company.electronicTradingCategory.name.en, serviceType: 'ELECTRONIC_TRADING'
                                        }
                                    }} id="subheader_link">
                                        <span onClick={this.showsubheader} style={{ color: "#FFC60B", fontWeight: "bold", fontSize: "17px" }} > {this.props.lang === "ar" && Company.electronicTradingCategory.name.ar}
                                            {this.props.lang === "en" && Company.electronicTradingCategory.name.en}
                                        </span>

                                    </Link>
                                }
                                </li>
                                <li className="py-2" >
                               { Company.eventCategory&&
                                    <Link to={{
                                        pathname: "/Guide/services",
                                        state: {
                                            categoryId: 0, categoryName:Company.eventCategory.name.ar,
                                            categoryNameEN:Company.eventCategory.name.en, serviceType: 'EVENT'
                                        }
                                    }} id="subheader_link">
                                        <span onClick={this.showsubheader} style={{ color: "#FFC60B", fontWeight: "bold", fontSize: "17px" }} > {this.props.lang === "ar" && Company.eventCategory.name.ar}
                                            {this.props.lang === "en" && Company.eventCategory.name.en}
                                        </span>
                                    </Link>
                               }
                                </li>


                            </ul>

                        </Col>


                    </Row>
                </Container>
            </div>
            }
            </div>

        );
    }
}

const mapStateToProps = state => {

    return {
        lang: state.HeaderReducer.appLanguage,
        // token:  state.userInfo.token
    }

}
const mapDispatchToProps = dispatch => bindActionCreators(
    {
        changeLanguage,
        logOut,
    }
    , dispatch
)

export default (connect(mapStateToProps, mapDispatchToProps))(Subheader);