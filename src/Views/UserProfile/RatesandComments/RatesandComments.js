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
import StarRatingComponent from 'react-star-rating-component';
import moment from 'moment';
import { showLoading, hideLoading } from 'react-redux-loading-bar'

class RatesandComments extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalfive: true,
            cardFiveData: [],
        }
        this.togglefive = this.togglefive.bind(this)
    }

    togglefive() {
        this.setState(prevState => ({
            modalfive: !prevState.modalfive
        }));
        this.props.openModalFive()
    }
    UNSAFE_componentWillMount() {
        let currentlang = this.props.appLanguage
        this.setState({ currentlang: currentlang, specialarabic: this.props.user.aboutUs.ar, specialenglish: this.props.user.aboutUs.en })
        this.getCardFiveData(this.props.appLanguage)
    }

    getCardFiveData(lang) {
        this.props.showLoading()
        let uri = `${API_ENDPOINT}/comment?businessId=${this.props.user.id}`
        axios.get(uri, {
            headers: {
                'Accept-Language': lang
            }
        }).then(response => {
            this.setState({ cardFiveData: response.data.data })
            this.props.hideLoading()
        })
    }

    deleteComment = (id, index) => {
        this.props.showLoading()
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
            this.props.hideLoading()
            // this.togglefive()
            this.props.showSnack('myUniqueId', {
                label: this.props.appLanguage === 'en' ? 'Successful Deleted' : 'تم الحذف بنجاح',
                timeout: 7000,
                // button: { label: this.props.appLanguage === 'en' ? 'LogIn' : ' تسجيل الدخول' }
            })
        })
    }

    render() {
        if (this.state.currentlang !== this.props.appLanguage) {
            this.setState({ currentlang: this.props.appLanguage }, () => {
                this.getCardFiveData(this.state.currentlang)
            })
        }
        strings.setLanguage(this.props.appLanguage)
        return (
            <div>
                <Modal className="profileModal profileModal-styleprofcardfive" style={{ direction: this.props.appLanguage === "ar" ? "rtl" : "ltr" }} isOpen={this.state.modalfive} toggle={this.togglefive}>
                    <ModalHeader className={this.props.appLanguage === "ar" ? "pb-0 modalheaderar" : "pb-0 modalheaderen"} toggle={this.togglefive}>
                        {strings.profcardfive}
                        <img src={close} alt="close" className="closeModal" onClick={this.togglefive} />
                    </ModalHeader>
                    <ModalBody>
                        {this.state.cardFiveData.length !== 0 ?
                            <div>
                                {
                                    this.state.cardFiveData.map((element, index) => {
                                        return (
                                            <div className="profcardfive" key={index}>
                                                <h6>{moment(element.createdAt).startOf('minute').fromNow()}</h6>
                                                <div className="profcardfive-box">
                                                    <div className="profcardfive-rating">
                                                        <h5>{strings.rateby} <span className="mx-1">{element.userId.username}</span>
                                                            <StarRatingComponent
                                                                name="commentRating"
                                                                editing={false}
                                                                renderStarIcon={() => <span> <i class="fas fa-star"></i> </span>}
                                                                starCount={5}
                                                                value={element.rate}
                                                            />
                                                        </h5>
                                                        <h5 style={{ color: "#FA7F2B", display: "flex" }}>{element.comment}</h5>
                                                    </div>
                                                    <div className="profcardfive-icon">
                                                        <i onClick={() => this.deleteComment(element.id, index)} className="fa fa-trash"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            : <p className="text-center mb-0">{strings.nocomments}</p>
                        }
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
export default connect(mapStateToProps, mapDispatchToProps)(RatesandComments);