import React from 'react';
import { Container, Col, Row, Input, Button } from "reactstrap";
import String from '../../assets/Locals/locals'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from "axios";
import { API_ENDPOINT } from '../../AppConfig';

class Conversations extends React.Component {
    state = {
        contacts: [],
        history: [],
        selected: ''
    }
    componentWillMount() {
        this.GetAllContacts()
    }
    GetAllContacts() {
        let uri = `${API_ENDPOINT}/chat/lastContacts`
        let token = `Bearer ${this.props.token}`
        axios.get(uri, {
            headers: {
                'Accept-Language': this.props.lang,
                Authorization: token
            }
        }).then(response => this.setState({ contacts: response.data.data }, () => console.log("CONTACTS", this.state.contacts)))
    }
    GetHistory(Id) {
        let uri = `${API_ENDPOINT}/chat?user=${Id}`
        let token = `Bearer ${this.props.token}`
        axios.get(uri, {
            headers: {
                'Accept-Language': this.props.lang,
                Authorization: token
            }
        }).then(response => this.setState({ history: response.data.data }, () => console.log("HISTORY", this.state.contacts)))
    }

    render() {
        String.setLanguage(this.props.lang)
        let selected = this.state.selected
        return (
            <Container fluid style={{
                minHeight: '70vh', marginTop: '30px',
                direction: this.props.lang === 'ar' ? 'rtl' : 'ltr',
                textAlign: this.props.lang === 'ar' ? 'right' : 'left',
            }}>
                <Row>
                    <Col md="3">
                        <h5 className="convHeader"> {String.conversations} </h5>
                    </Col>
                    <Col md="9">
                        <h5 className="convHeader"> {selected && selected.from.name} </h5>
                    </Col>
                </Row>

                <Row>
                    <Col md="3">
                        {this.state.contacts.map((contact, index) => (
                            <div className={contact.id === this.state.selected.id ? "convContacts conActive" : "convContacts "} key={index}
                                onClick={() => {
                                    this.setState({ selected: contact })
                                    this.GetHistory(contact.from.id)
                                }}>
                                <div className="greenCircle"></div> <h5> {contact.from.name} </h5> </div>
                        ))}
                    </Col>
                    {this.state.selected !== "" ?
                        <Col md="9" >
                            <div style={{ border: '1px solid #9e9e9e', borderRadius: '30px 30px 0px 0px', minHeight: '50vh', padding: '1%' }}>
                                {this.state.history.map((message, index) => (
                                    message.from.id === this.props.user.id ?
                                        <Col lg="12" md="12" style={{ direction: "rtl", margin: "5px 0" }} >
                                            <Row className="message-sent">
                                                <div className="convOtherIcon"> <i class="fa fa-user"></i> </div>
                                                <div className="MSGdesign" style={{ color: '#ff9a56' }}>
                                                    {message.message}
                                                </div>
                                            </Row>
                                        </Col> :
                                        <Col lg="12" md="12" style={{ direction: "ltr", margin: "5px 0" }} >
                                            <Row className="message-sent">
                                                <div className="convMeIcon"> <i class="fa fa-user"></i> </div>
                                                <div className="MSGdesign" style={{ textAlign: 'left' }}>
                                                    {message.message}
                                                </div>
                                            </Row>
                                        </Col>

                                ))}
                            </div>
                            {selected !== "" &&
                                <Row className="p-0 m-0" style={{ direction: this.props.lang === "ar" ? "rtl" : "ltr", }}>
                                    <Col lg="11" md="10" className="p-0 m-0">
                                        <Input type="text" placeholder={String.typeMessage}
                                            style={{ height: '53px', borderRadius: this.props.lang === 'ar' ? '0 0 10px 0' : '0 0 0 10px' }}
                                        />
                                    </Col>
                                    <Col className="p-0 m-0" id={this.props.lang === 'ar' ? "sendmsg-Btn" : "sendmsg-BtnEN"}
                                        style={{
                                            height: '53px', borderRadius: this.props.lang === 'en' ? '0 0 10px 0' : '0 0 0 10px',
                                            border: '1px solid #9e9e9e', backgroundColor: '#f5f5f5'
                                        }}>
                                        <div className="convSend">  <h6> {String.ContactUsBtn} </h6> </div>
                                    </Col>
                                </Row>
                            }
                        </Col> : <div className="nochatConv"> <i class="fas fa-comment-dots"></i> </div>}
                </Row>
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return {
        lang: state.HeaderReducer.appLanguage,
        user: state.UserReducer.user,
        token: state.UserReducer.token,
    }
}
const mapDispatchToProps = dispatch => bindActionCreators(
    {

    }
    , dispatch
)

export default connect(mapStateToProps, mapDispatchToProps)(Conversations);
// export default (Conversations);