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
import face from '../../../assets/Images/Profile/face.png'
import google from '../../../assets/Images/Profile/google.png'
import insta from '../../../assets/Images/Profile/insta.png'
import twitter from '../../../assets/Images/Profile/twitter.png'
import whatsapp from '../../../assets/Images/Profile/whatsapp.png'
import { showLoading, hideLoading } from 'react-redux-loading-bar'

class SocialLinks extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modaltwo: true,
            specialarabic: '',
            specialenglish: '',
            socialObject: {
                FACEBOOK: null,
                INSTAGRAM: null,
                TWITTER: null,
                WHATSAPP: null,
                GOOGLE: null
            },
        }
        this.toggletwo = this.toggletwo.bind(this)
    }

    toggletwo() {
        this.setState(prevState => ({
            modaltwo: !prevState.modaltwo
        }));
        this.props.openModalTwo()
    }

    UNSAFE_componentWillMount() {
        let social = this.props.user.socialLinks
        let object = this.state.socialObject
        for (let i = 0; i < social.length; i++) {
            let key = social[i].key
            let value = social[i].value
            object[`${key}`] = value

        }
        this.setState({ socialObject: object })
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

    editSociallinks = () => {
        this.props.showLoading()
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
            this.props.hideLoading()
            this.props.ReIntializeUser(this.props.token, res.data)
            this.props.saveUser(this.props.token, res.data, localStorage.getItem('remebermestate') === 'false' ? false : true)
            this.toggletwo()
            this.props.showSnack('myUniqueId', {
                label: this.props.appLanguage === 'en' ? 'Successful Updated' : 'تم التعديل بنجاح',
                timeout: 7000,
                // button: { label: this.props.appLanguage === 'en' ? 'LogIn' : ' تسجيل الدخول' }
            })
        })
    }

    render() {
       
        strings.setLanguage(this.props.appLanguage)
        return (
            <div>
                <Modal className="profileModal profileModal-styleprofcardtwo" style={{ direction: this.props.appLanguage === "ar" ? "rtl" : "ltr" }} isOpen={this.state.modaltwo} toggle={this.toggletwo}>
                    <ModalHeader className={this.props.appLanguage === "ar" ? "pb-0 modalheaderar mb-4" : "pb-0 modalheaderen mb-4"} toggle={this.toggletwo}>
                        {strings.profcardtwo}
                        <img src={close} alt="close" className="closeModal" onClick={this.toggletwo} />
                    </ModalHeader>
                    <ModalBody>
                        <div className="profcardtwo">
                            <InputGroup>
                                <Input placeholder={strings.faceLink} value={this.state.socialObject.FACEBOOK} onChange={this.handleChangefacelink} />
                                <InputGroupAddon addonType="append">
                                    <InputGroupText><img src={face} alt="icon" /></InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                        <div className="profcardtwo">
                            <InputGroup>
                                <Input placeholder={strings.twitterLink} value={this.state.socialObject.TWITTER} onChange={this.handleChangetwitterlink} />
                                <InputGroupAddon addonType="append">
                                    <InputGroupText><img src={twitter} alt="icon" /></InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                        <div className="profcardtwo">
                            <InputGroup>
                                <Input placeholder={strings.googleplusLink} value={this.state.socialObject.GOOGLE} onChange={this.handleChangegooglelink} />
                                <InputGroupAddon addonType="append">
                                    <InputGroupText><img src={google} alt="icon" /></InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                        <div className="profcardtwo">
                            <InputGroup>
                                <Input placeholder={strings.instagramLink} value={this.state.socialObject.INSTAGRAM} onChange={this.handleChangeinstagramlink} />
                                <InputGroupAddon addonType="append">
                                    <InputGroupText><img src={insta} alt="icon" /></InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                        <div className="profcardtwo">
                            <InputGroup>
                                <Input placeholder={strings.whatsLink} value={this.state.socialObject.WHATSAPP} onChange={this.handleChangewhatslink} />
                                <InputGroupAddon addonType="append">
                                    <InputGroupText><img src={whatsapp} alt="icon" /></InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                        <div>
                            <Button onClick={this.editSociallinks} className="btn-block styleBTN">{strings.saveBTN}</Button>
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
        showLoading,
        hideLoading,
        ReIntializeUser
    }
    , dispatch
)
export default connect(mapStateToProps, mapDispatchToProps)(SocialLinks);