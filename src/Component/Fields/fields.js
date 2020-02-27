import React, { Component } from "react";
import { Col, InputGroup, Input, FormGroup, Label } from "reactstrap";
import "./fields.css";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { showLoading, hideLoading } from "react-redux-loading-bar";

class CustomInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  InputhandleChange(e, input, type) {
    //const re = /^[0-9\b]+$/;
    const re = /^[0-9]+$/
    const ch = String.fromCharCode(e.which);

    console.log("typeeeeeeeeeeeeeeeeeee : ", type, !(re.test(ch)));
    if (type === "number") {
      if (e.target.value == ' ' || !(re.test(ch))) {
        e.preventDefault();
        input.onChange(e)
        this.setState({ object: e.target.value })
      }
    } else {
      input.onChange(e)
      this.setState({ object: e.target.value })
    }
  }
  render() {
    const {
      lang,
      label,
      placeholder,
      input,
      type,
      size,
      inputType,
      meta: { touched, error }
    } = this.props;
    return (
      <Col lg={size ? size.lg : "12"} md={size ? size.md : "12"} id="fields">
        <Label
          className="d-flex"
          style={{ fontSize: "18px", fontWeight: "600" }}
        >
          {" "}
          {label}{" "}
        </Label>
        {type && (
          <FormGroup>
            <div>
              <InputGroup>
                {/* Text Input */}
                {type !== "file" && type !== "range" && type !== "select" && (
                  <Input
                    {...input}
                    placeholder={placeholder}
                    type={type}
                    name={input.name}
                    className={"bg-light"}
                    onChange={event => this.InputhandleChange(event, input, inputType)}
                    onKeyPress={event => this.InputhandleChange(event, input, inputType)}
                  />
                )}

               
              </InputGroup>
              <div className="d-flex" style={{ marginTop: "8px" }}>
                {touched &&
                  error && (
                    <span
                      className="erroMSG"
                      style={{ color: "red", fontSize: "14px" }}
                    >
                      {" "}
                      {lang === "en" ? error.en : error.ar}
                    </span>
                  )}
              </div>
            </div>
          </FormGroup>
        )}
      </Col>
    );
  }
}
const mapStateToProps = state => {
  return {};
};
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      showLoading,
      hideLoading
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(CustomInput);
