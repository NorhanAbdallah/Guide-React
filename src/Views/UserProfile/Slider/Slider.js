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

class Slider extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalone: true,
            specialarabic: '',
            specialenglish: '',
            arrayslider: this.props.user.slider,
        }
        this.toggleone = this.toggleone.bind(this)
    }

    toggleone() {
        this.setState(prevState => ({
            modalone: !prevState.modalone
        }));
        this.props.openModalOne()
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

    cardOneRequest = () => {
        this.props.showLoading()
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
            this.props.showSnack('myUniqueId', {
                label: this.props.appLanguage === 'en' ? 'Successful Updated' : 'تم التعديل بنجاح',
                timeout: 7000,
                // button: { label: this.props.appLanguage === 'en' ? 'LogIn' : ' تسجيل الدخول' }
            })
            this.props.hideLoading()
        })
    }

    render() {
       
        strings.setLanguage(this.props.appLanguage)
        return (
            <div>
                <Modal className="profileModal profileModal-styleprofcardone" style={{ direction: this.props.appLanguage === "ar" ? "rtl" : "ltr" }} isOpen={this.state.modalone} toggle={this.toggleone}>
                    <ModalHeader className={this.props.appLanguage === "ar" ?
                        "pb-0 modalheaderar mb-4" : "pb-0 modalheaderen mb-4"} toggle={this.toggleone}>
                        {strings.profcardone}
                        <img src={close} alt="close" className="closeModal" onClick={this.toggleone} />
                    </ModalHeader>
                    <ModalBody>
                        <div className="profcardone">
                            <div className="profcardone-images mb-3 d-flex">

                                {this.state.arrayslider.map((slider, index) => {
                                    return (
                                        <div key={index}>
                                            <img src={typeof slider === 'object' ? URL.createObjectURL(slider) : API_ENDPOINT + slider} alt="imgagelist" /> <i onClick={() => this.deleteImage(index)} className="fa fa-times" style={{ right: this.props.appLanguage === "en" ? "5px" : "", left: this.props.appLanguage === "ar" ? "5px" : "" }}></i>
                                        </div>
                                    )
                                })
                                }

                            </div>
                            <div className="stylefileinput-uploadPDF">
                                <label className="custom-file-upload mb-2">
                                    <i className="fa fa-plus"></i>  {strings.addphoto}
                                </label>
                                <input type="file" onChange={(e) => this.addImage(e)} />
                            </div>
                        </div>
                        <div>
                            <Button onClick={this.cardOneRequest} className="btn-block styleBTN">{strings.saveBTN}</Button>
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
export default connect(mapStateToProps, mapDispatchToProps)(Slider);