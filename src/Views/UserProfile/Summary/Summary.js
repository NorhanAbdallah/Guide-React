import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap'
import axios from 'axios'
import { API_ENDPOINT } from '../../../AppConfig'
import strings from '../../../assets/Locals/locals'
import { saveUser } from "../../../Redux/Action/UserAction";
import { ReIntializeUser } from '../../../Redux/Action/UserAction'
import { bindActionCreators } from 'redux';
import close from '../../../assets/Images/close.png'
import { showSnack } from 'react-redux-snackbar';
import { showLoading, hideLoading } from 'react-redux-loading-bar'

class Summary extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalfour: true,
            specialarabic: '',
            specialenglish: '',
        }
        this.togglefour = this.togglefour.bind(this)
    }

    togglefour() {
        this.setState(prevState => ({
            modalfour: !prevState.modalfour
        }));
        
        this.props.openModalFour()
    }

    UNSAFE_componentWillMount() {
        this.setState({ specialarabic: this.props.user.aboutUs.ar, specialenglish: this.props.user.aboutUs.en })
    }

    editAboutUs = () => {
        this.props.showLoading()
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
            this.props.hideLoading()
            this.props.ReIntializeUser(this.props.token, res.data)
            this.props.saveUser(this.props.token, res.data, localStorage.getItem('remebermestate') === 'false' ? false : true)
            this.togglefour()
            this.props.showSnack('myUniqueId', {
                label: this.props.appLanguage === 'en' ? 'Successful Updated' : 'تم التعديل بنجاح',
                timeout: 7000,
                // button: { label: this.props.appLanguage === 'en' ? 'LogIn' : ' تسجيل الدخول' }
            })
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


    render() {
        
        strings.setLanguage(this.props.appLanguage)
        return (
            <div>
                <Modal className="profileModal profileModal-styleprofcardfour" style={{ direction: this.props.appLanguage === "ar" ? "rtl" : "ltr" }} isOpen={this.state.modalfour} toggle={this.togglefour}>
                    <ModalHeader className={this.props.appLanguage === "ar" ? "pb-0 modalheaderar mb-4" : "pb-0 modalheaderen mb-4"} toggle={this.togglefour}>
                        {strings.profcardfour}
                        <img src={close} alt="close" className="closeModal" onClick={this.togglefour} />
                    </ModalHeader>
                    <ModalBody>
                        <div className="profcardfour">
                            <h5>{strings.arabicaboutus}</h5>
                            <textarea value={this.state.specialarabic}
                                onKeyPress={(e) => this.handleChangeSpecialArabic(e)}
                                onChange={(e) => this.handleChangeSpecialArabic(e)}
                            ></textarea>
                        </div>
                        <div className="profcardfour-line"></div>
                        <div className="profcardfour">
                            <h5>{strings.englishaboutus}</h5>
                            <textarea value={this.state.specialenglish} onKeyPress={(e) => this.handleChangeSpecialEnglish(e)} onChange={(e) => this.handleChangeSpecialEnglish(e)} defaultValue={this.props.user.aboutUs.en}></textarea>
                        </div>
                        <div>
                            <Button onClick={this.editAboutUs} className="btn-block styleBTN">{strings.saveBTN}</Button>
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
        hideLoading,
    }
    , dispatch
)
export default connect(mapStateToProps, mapDispatchToProps)(Summary);