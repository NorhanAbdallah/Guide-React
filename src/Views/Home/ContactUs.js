import React from "react";
import { Col, Row, Form , Button} from "reactstrap";
import axios from "axios";
import { API_ENDPOINT } from "../../AppConfig.js";
import Inputs from "./Inputs";
import validate from "./validation";
import RenderField from "../../Component/Fields/fields";
import { Field, reduxForm } from "redux-form";
import { connect } from 'react-redux';
import Strings from "../../assets/Locals/locals";
import { showSnack } from 'react-redux-snackbar';
import { logOut } from "../../Redux/Action/UserAction";
import { bindActionCreators } from 'redux';
import { changeLanguage } from "../../Redux/Action/HeaderAction";
class ContactUs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ContactUS: null
    };
  }
  DisplayContactUs = contact => {
    return (
      <Row>
        <Col xs ='0' lg ="2"></Col> 
        <Col xs="12" lg="9" className =" my-3 ">
          <h2 className="text-gold MainPhotoTitle">
              {Strings.ContactUsTitle}
          </h2>
          <p className="line-height-mine text-muted font-weight-bold ">
            {this.props.lang === "ar" ? contact.contactUs.ar : contact.contactUs.en}
          </p>
        </Col>
      </Row>
    );
  };
  componentWillMount = () => {
    axios.get(`${API_ENDPOINT}/companies`).then(res => {
      this.setState({ ContactUs: res.data.data[0] });
    });
  };
  onSubmit = (values) => {
    this.Send(values)
  }
  Send(data) {
    let uri = `${API_ENDPOINT}/contact-us`
    axios.post(uri, data, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.props.token}`,
            'Accept-Language': this.props.lang
        }
    })
        .then(response => {
          this.props.reset()
            this.props.showSnack('myUniqueId', {
                label: this.props.lang === "en" ? " Send Successfully" : "تم ارسال  ",
                timeout: 7000,
                button: { label: this.props.lang === 'en' ? 'Message Sent' : ' تم الارسال' }
            })
        }).catch(error => {
            if (error.response.status === 422) {
                for (let i = 0; i < error.response.data.errors.length; i++) {
                    this.props.showSnack('myUniqueId', {
                        label: error.response.data.errors[i].msg,
                        timeout: 7000,
                        button: { label: this.props.lang === 'en' ? 'Add Complain' : ' أضافة شكوي ' }
                    })
                }
            }
        })
}
  DisplayForm = () => {
    const { handleSubmit} = this.props
      return (
        <Form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
        <Row className ="px-0 m-0 ">
            {
                Inputs.map((element, index) => {
                    return (
                        <Col
                        xs={element.size.xs}
                        lg={element.size.lg} 
                        md={element.size.md}
                        key = {index}
                        >
                          <Field key={index}
                            type={element.type}
                            name={element.name}
                            lang={this.props.lang}
                            component={RenderField}
                            inputType={element.inputType}
                            className = "text-muted"    
                            placeholder={this.props.lang === "ar" ? element.placeholder.ar : element.placeholder.en}
                        />
                        </Col>
                    )
                })
            }
                  <Col lg="12"xs ="12">
                    <Button className ={" btn-gold d-block w-100  mx-auto border-radius my-3"}>
                        {Strings.ContactUsBtn}
                    </Button>
            </Col>
        </Row>
    </Form>
    );
  };
  render() {
    return (
      <Row className={this.props.lang === "ar" ? "text-right align-items-center" : "text-left align-items-center"}>
        <Col lg="5" md = "12" sm="12" lg ="4" data-aos="zoom-in"
         className="bg-home-contactUs align-items-center d-flex justify-content-center ">
          {this.state.ContactUs && this.DisplayContactUs(this.state.ContactUs)}
        </Col>
        <Col xs = "0" sm ="0" md ="1"></Col>
        <Col className="bg-dark" xs="12"  md ="12" lg ="7" data-aos="zoom-in"
         className="position-relative layer border-radius pt-4">
            <Col lg="12" sm="1" md ="12" className= {this.props.lang === 'ar'? "form bg-white border-radius left_30 py-3" : " form bg-white border-radius py-3  right_30"}>
               {this.DisplayForm()}  
            </Col>
        </Col>
      </Row>
    );
  }
}
const mapStateToProps = state => {
  return {
      lang: state.HeaderReducer.appLanguage,
      token: state.UserReducer.token,
  }
}
const mapDispatchToProps = dispatch => bindActionCreators(
  {
      changeLanguage,
      logOut,
      showSnack,
  }
  , dispatch
)
export default reduxForm({
  form: 'ContactUs',
  validate
})(connect(mapStateToProps, mapDispatchToProps)(ContactUs));
