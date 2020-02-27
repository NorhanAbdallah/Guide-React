import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, Input, InputGroup, InputGroupAddon, InputGroupText, Button } from 'reactstrap'
import axios from 'axios'
import { API_ENDPOINT } from '../../../AppConfig'
import strings from '../../../assets/Locals/locals'
import { saveUser } from "../../../Redux/Action/UserAction";
import { ReIntializeUser } from '../../../Redux/Action/UserAction'
import { bindActionCreators } from 'redux';
import close from '../../../assets/Images/close.png'
import { showSnack } from 'react-redux-snackbar';
import { showLoading, hideLoading } from 'react-redux-loading-bar'

class WorkingHours extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modaleight: true,
            workHoursarray: this.props.user.workHours,
            workTime: [{ title: `` }],
        }
        this.toggleeight = this.toggleeight.bind(this)
    }

    toggleeight() {
        this.setState(prevState => ({
            modaleight: !prevState.modaleight
        }));
        this.props.openModalEight()
    }

    updateWorkTime = () => {
        this.props.showLoading()
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
            this.props.hideLoading()
            this.props.ReIntializeUser(this.props.token, res.data)
            this.props.saveUser(this.props.token, res.data, localStorage.getItem('remebermestate') === 'false' ? false : true)
            this.toggleeight()
            this.setState({ workTime: [{ title: `` }] })
            this.props.showSnack('myUniqueId', {
                label: this.props.appLanguage === 'en' ? 'Successful Updated' : 'تم التعديل بنجاح',
                timeout: 7000,
                // button: { label: this.props.appLanguage === 'en' ? 'LogIn' : ' تسجيل الدخول' }
            })
        })
    }

    handleChangeworkTime = (e, index) => {
        let variable = this.state.workTime
        variable[index] = { title: e.target.value }
        this.setState({ workTime: variable });
    }

    handleMulti = e => {
        let working = this.state.workTime
        working.push({ title: `` })
        this.setState({ workTime: working })
    }

    UNSAFE_componentWillMount() {
        console.log("this.props.user.workHours", this.props.user.workHours.length)
    }

    render() {

        strings.setLanguage(this.props.appLanguage)
        return (
            <div>
                <Modal className="profileModal profileModal-styleprofcardeight" style={{ direction: this.props.appLanguage === "ar" ? "rtl" : "ltr" }} isOpen={this.state.modaleight} toggle={this.toggleeight}>
                    <ModalHeader className={this.props.appLanguage === "ar" ? "pb-0 modalheaderar mb-5" : "pb-0 modalheaderen mb-5"} toggle={this.toggleeight}>
                        {strings.profcardeight}
                        <img src={close} alt="close" className="closeModal" onClick={this.toggleeight} />
                    </ModalHeader>
                    <ModalBody>
                        <div className="profcardeight-dates">
                            {(this.state.workHoursarray.length !== 1) ?
                                <InputGroup>
                                    <label className="form-control">
                                        {this.state.workHoursarray.map((ele, index) => {
                                            return (
                                                <span style={{ textAlign: this.props.appLanguage === "ar" ? "right" : "left" }} key={index}>{ele}</span>
                                            )
                                        })}
                                    </label>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText><i onClick={() => this.setState({ workHoursarray: [] })} className="fas fa-trash"></i></InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                                :
                                <p className="text-center mb-0">{strings.noworkstime}</p>
                            }
                        </div>
                        <div className="profcardeight-workdate">
                            {this.state.workTime.map((element, index) => {
                                return (
                                    <Input type="text" placeholder={strings.worktime} value={this.state.workTime[index].title} onChange={(e) => this.handleChangeworkTime(e, index)} />
                                )
                            })
                            }
                        </div>
                        <div className="stylefileinput-uploadPDF">
                            <label className="custom-file-upload" onClick={this.handleMulti}><i className="fa fa-plus"></i> {strings.addworktime}</label>
                        </div>
                        <div>
                            <Button onClick={this.updateWorkTime} className="btn-block styleBTN">{strings.saveBTN}</Button>
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
export default connect(mapStateToProps, mapDispatchToProps)(WorkingHours);