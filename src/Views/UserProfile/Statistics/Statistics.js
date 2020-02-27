import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Container, Modal, ModalHeader, ModalBody, Input, InputGroup, InputGroupAddon, InputGroupText, Button, Form, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, FormGroup, Label } from 'reactstrap'
import axios from 'axios'
import { API_ENDPOINT } from '../../../AppConfig'
import strings from '../../../assets/Locals/locals'
import { saveUser } from "../../../Redux/Action/UserAction";
import { ReIntializeUser } from '../../../Redux/Action/UserAction'
import { bindActionCreators } from 'redux';
import close from '../../../assets/Images/close.png'
import { showSnack } from 'react-redux-snackbar';
import { showLoading, hideLoading } from 'react-redux-loading-bar'

class Statistics extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalsix: true,
            cardSixData: null,
        }
        this.togglesix = this.togglesix.bind(this)
    }

    togglesix() {
        this.setState(prevState => ({
            modalsix: !prevState.modalsix
        }));
        this.props.openModalSix()
    }
    UNSAFE_componentWillMount() {
        let currentlang = this.props.appLanguage
        this.setState({ currentlang: currentlang,})
        this.getCardSixData(this.props.appLanguage)
    }

    getCardSixData(lang) {
        this.props.showLoading()
        let uri = `${API_ENDPOINT}/counter/${this.props.user.id}`
        axios.get(uri, {
            headers: {
                'Accept-Language': lang
            }
        }).then(response => {
            this.props.hideLoading()
            this.setState({ cardSixData: response.data })
        })
    }

    render() {
       
        strings.setLanguage(this.props.appLanguage)
        return (
            <div>
                <Modal className="profileModal profileModal-styleprofcardsix" style={{ direction: this.props.appLanguage === "ar" ? "rtl" : "ltr" }} isOpen={this.state.modalsix} toggle={this.togglesix}>
                    <ModalHeader className={this.props.appLanguage === "ar" ? "pb-0 modalheaderar mb-4" : "pb-0 modalheaderen mb-4"} toggle={this.togglesix}>
                        {strings.profcardsix}
                        <img src={close} alt="close" className="closeModal" onClick={this.togglesix} />
                    </ModalHeader>
                    <ModalBody>
                        <Container>
                            <Row>
                                <Col lg="4" md="4" sm="12" xs="12">
                                    <div className="profcardsix">
                                        <div className="centercardprof">
                                            <div className="profcardsix-title">
                                                <span>{strings.conversationsnumber}</span>
                                            </div>
                                            <div className="profcardsix-icon specialicon">
                                                <i class="far fa-comment-alt"></i>
                                            </div>
                                            <div className="profcardsix-number">
                                                <span>{this.state.cardSixData && this.state.cardSixData.chat}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col lg="4" md="4" sm="12" xs="12">
                                    <div className="profcardsix" style={{ backgroundColor: "#FE934B" }}>
                                        <div className="centercardprof">
                                            <div className="profcardsix-title">
                                                <span>{strings.viewsnumber}</span>
                                            </div>
                                            <div className="profcardsix-icon specialicon">
                                                <i class="fas fa-eye"></i>
                                            </div>
                                            <div className="profcardsix-number">
                                                <span>{this.state.cardSixData && this.state.cardSixData.veiws}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col lg="4" md="4" sm="12" xs="12">
                                    <div className="profcardsix" style={{ backgroundColor: "#FF5A64" }}>
                                        <div className="centercardprof">
                                            <div className="profcardsix-icon">
                                                <i class="fas fa-map-marker-alt"></i>
                                            </div>
                                            <div className="profcardsix-number">
                                                <span>{this.state.cardSixData && this.state.cardSixData.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col lg="4" md="4" sm="12" xs="12">
                                    <div className="profcardsix" style={{ backgroundColor: "#FA7F2B" }}>
                                        <div className="centercardprof">
                                            <div className="profcardsix-title">
                                                <span>{strings.clickwebsite}</span>
                                            </div>
                                            <div className="profcardsix-icon specialicon">
                                                <i class="fas fa-globe"></i>
                                            </div>
                                            <div className="profcardsix-number">
                                                <span>{this.state.cardSixData && this.state.cardSixData.site}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col lg="4" md="4" sm="12" xs="12">
                                    <div className="profcardsix" style={{ backgroundColor: "#01A54F" }}>
                                        <div className="centercardprof">
                                            <div className="profcardsix-title">
                                                <span>{strings.contactsnumber}</span>
                                            </div>
                                            <div className="profcardsix-icon specialicon">
                                                <i class="fas fa-mobile-alt"></i>
                                            </div>
                                            <div className="profcardsix-number">
                                                <span>{this.state.cardSixData && this.state.cardSixData.calls}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col lg="4" md="4" sm="12" xs="12">
                                    <div className="profcardsix" style={{ backgroundColor: "#3A559F" }}>
                                        <div className="centercardprof">
                                            <div className="profcardsix-icon">
                                                <i className="fab fa-facebook-f"></i>
                                            </div>
                                            <div className="profcardsix-number">
                                                <span>{this.state.cardSixData && this.state.cardSixData.socialLinks[1].value}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col lg="4" md="4" sm="12" xs="12">
                                    <div className="profcardsix" style={{ backgroundColor: "#1BD741" }}>
                                        <div className="centercardprof">
                                            <div className="profcardsix-icon">
                                                <i class="fab fa-whatsapp"></i>
                                            </div>
                                            <div className="profcardsix-number">
                                                <span>{this.state.cardSixData && this.state.cardSixData.socialLinks[0].value}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col lg="4" md="4" sm="12" xs="12">
                                    <div className="profcardsix" style={{ backgroundColor: "#E24BB3" }}>
                                        <div className="centercardprof">
                                            <div className="profcardsix-icon">
                                                <i class="fab fa-instagram"></i>
                                            </div>
                                            <div className="profcardsix-number">
                                                <span>{this.state.cardSixData && this.state.cardSixData.socialLinks[4].value}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col lg="4" md="4" sm="12" xs="12">
                                    <div className="profcardsix" style={{ backgroundColor: "#50ABF1" }}>
                                        <div className="centercardprof">
                                            <div className="profcardsix-icon">
                                                <i class="fab fa-twitter"></i>
                                            </div>
                                            <div className="profcardsix-number">
                                                <span>{this.state.cardSixData && this.state.cardSixData.socialLinks[2].value}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Container>

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
        showLoading,
        hideLoading,
        ReIntializeUser
    }
    , dispatch
)
export default connect(mapStateToProps, mapDispatchToProps)(Statistics);